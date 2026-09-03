<?php

namespace App\Http\Controllers;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Http\Requests\ObjectPurchaseInvoiceRequest;
use App\Http\Requests\ApprovePurchaseInvoiceRequest;
use App\Http\Resources\PurchaseInvoiceApprovalResource;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalAttachment;
use App\Models\PurchaseInvoiceObjectionReason;
use App\Models\User;
use App\Services\PurchaseInvoiceDecisionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseInvoiceApprovalController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', PurchaseInvoiceApproval::class);
        $user = $request->user();
        $query = PurchaseInvoiceApproval::query()->visibleTo($user);

        $state = $request->string('estado')->toString();
        $search = trim($request->string('buscar')->toString());
        $query->when($state, fn (Builder $q) => $q->where('estado_aprobacion', $state))
            ->when($search, fn (Builder $q) => $q->where(function (Builder $nested) use ($search): void {
                $nested->where('card_name', 'like', "%{$search}%")
                    ->orWhere('factura_folio_num', 'like', "%{$search}%")
                    ->orWhereHas('lines', fn (Builder $lines) => $lines->where('oc_doc_num', 'like', "%{$search}%"));
            }));

        $base = PurchaseInvoiceApproval::query()->visibleTo($user);
        $stats = [
            'pending' => (clone $base)->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Pending->value)->count(),
            'approved_week' => (clone $base)->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Approved->value)
                ->where('aprobado_at', '>=', now()->startOfWeek())->count(),
            'objected' => (clone $base)->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Objected->value)->count(),
            'due_soon' => (clone $base)->whereIn('estado_aprobacion', [
                PurchaseInvoiceApprovalStatus::Pending->value,
                PurchaseInvoiceApprovalStatus::WithoutResponsible->value,
                PurchaseInvoiceApprovalStatus::PendingAssignment->value,
            ])->whereBetween('factura_vencimiento', [today(), today()->addDays(5)])->count(),
        ];

        $invoices = $query->with(['lines', 'activeResponsibles.user'])
            ->orderByRaw("CASE WHEN estado_aprobacion = 'PENDIENTE' THEN 0 ELSE 1 END")
            ->orderBy('factura_vencimiento')
            ->paginate(15)->withQueryString()->through(fn (PurchaseInvoiceApproval $invoice) => $this->summary($invoice));

        return Inertia::render('PurchaseInvoiceApprovals/Index', [
            'invoices' => $invoices,
            'stats' => $stats,
            'filters' => ['estado' => $state, 'buscar' => $search],
        ]);
    }

    public function show(Request $request, PurchaseInvoiceApproval $purchaseInvoiceApproval): Response
    {
        $this->authorize('view', $purchaseInvoiceApproval);
        $purchaseInvoiceApproval->load([
            'lines', 'activeResponsibles.user', 'activeResponsibles.objectionReason',
            'history.user', 'approvedBy', 'objectedBy', 'objectionReason',
            'manualResponsibleUser', 'assignedBy', 'substituteUser', 'substituteAssignedBy',
            'attachments.uploader',
        ]);
        $myResponsible = $purchaseInvoiceApproval->activeResponsibles->firstWhere('user_id', $request->user()->id);

        return Inertia::render('PurchaseInvoiceApprovals/Show', [
            'invoice' => (new PurchaseInvoiceApprovalResource($purchaseInvoiceApproval))->resolve($request),
            'objectionReasons' => PurchaseInvoiceObjectionReason::query()->where('active', true)
                ->orderBy('sort_order')->orderBy('name')->get(['id', 'name']),
            'canDecide' => $myResponsible?->estado === PurchaseInvoiceResponsibleStatus::Pending
                && $purchaseInvoiceApproval->factura_canceled !== 'Y',
            'assignmentAccess' => [
                'responsible' => $request->user()->can('assignResponsible', $purchaseInvoiceApproval),
                'purchaseOrder' => $request->user()->can('assignPurchaseOrder', $purchaseInvoiceApproval),
                'reconcile' => $request->user()->can('manageUnassigned', PurchaseInvoiceApproval::class),
                'substitute' => $request->user()->can('assignSubstitute', $purchaseInvoiceApproval),
            ],
            'users' => $request->user()->can('assignResponsible', $purchaseInvoiceApproval)
                ? User::query()->orderBy('name')->get(['id', 'name', 'email'])
                : [],
        ]);
    }

    public function approve(
        ApprovePurchaseInvoiceRequest $request,
        PurchaseInvoiceApproval $purchaseInvoiceApproval,
        PurchaseInvoiceDecisionService $service,
    ): RedirectResponse {
        $this->authorize('approve', $purchaseInvoiceApproval);
        $service->approve($purchaseInvoiceApproval, $request->user(), $request->file('attachments', []));

        return back()->with('success', 'Factura aprobada correctamente.');
    }

    public function downloadAttachment(
        Request $request,
        PurchaseInvoiceApproval $purchaseInvoiceApproval,
        PurchaseInvoiceApprovalAttachment $attachment,
    ): StreamedResponse {
        abort_unless($attachment->purchase_invoice_approval_id === $purchaseInvoiceApproval->id, 404);
        $this->authorize('view', $purchaseInvoiceApproval);
        abort_unless(Storage::disk($attachment->disk)->exists($attachment->path), 404);

        return Storage::disk($attachment->disk)->download($attachment->path, $attachment->original_name);
    }

    public function object(
        ObjectPurchaseInvoiceRequest $request,
        PurchaseInvoiceApproval $purchaseInvoiceApproval,
        PurchaseInvoiceDecisionService $service,
    ): RedirectResponse {
        $reason = PurchaseInvoiceObjectionReason::findOrFail($request->integer('motivo_objecion_id'));
        $service->object(
            $purchaseInvoiceApproval,
            $request->user(),
            $reason,
            $request->string('comentario_objecion')->toString(),
        );

        return back()->with('success', 'La objeción fue registrada y Contabilidad será notificada.');
    }

    private function summary(PurchaseInvoiceApproval $invoice): array
    {
        $daysToDue = $invoice->factura_vencimiento
            ? $invoice->factura_vencimiento->startOfDay()->diffInDays(today(), false) * -1
            : null;

        return [
            'id' => $invoice->id,
            'folio' => trim(($invoice->factura_folio_pref ? $invoice->factura_folio_pref.'-' : '').$invoice->factura_folio_num),
            'factura_doc_num' => $invoice->factura_doc_num,
            'provider' => $invoice->card_name,
            'invoice_date' => $invoice->factura_fecha?->format('Y-m-d'),
            'due_date' => $invoice->factura_vencimiento?->format('Y-m-d'),
            'currency' => $invoice->factura_moneda,
            'total' => (float) $invoice->factura_total,
            'purchase_orders' => $invoice->lines->pluck('oc_doc_num')->filter()->unique()->values(),
            'areas' => $invoice->lines->pluck('nombre_area')->filter()->unique()->values(),
            'species' => $invoice->lines->pluck('nombre_especie')->filter()->unique()->values(),
            'responsibles' => $invoice->activeResponsibles->map(fn ($responsible) => [
                'owner_code' => $responsible->owner_code,
                'name' => $responsible->user?->name,
                'status' => $responsible->estado->value,
            ])->values(),
            'status' => $invoice->estado_aprobacion->value,
            'received_at' => $invoice->fecha_primera_sincronizacion?->toIso8601String(),
            'age_hours' => (int) $invoice->fecha_primera_sincronizacion?->diffInHours(now()),
            'days_to_due' => $daysToDue,
            'cancelled' => $invoice->factura_canceled === 'Y',
        ];
    }
}
