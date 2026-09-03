<?php

namespace App\Http\Controllers;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Http\Requests\AssignPurchaseInvoicePurchaseOrderRequest;
use App\Http\Requests\AssignPurchaseInvoiceResponsibleRequest;
use App\Http\Requests\AssignPurchaseInvoiceSubstituteRequest;
use App\Http\Requests\ReconcilePurchaseInvoiceAssociationRequest;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalLine;
use App\Models\User;
use App\Services\ManualPurchaseInvoiceAssignmentService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseInvoiceUnassignedController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('manageUnassigned', PurchaseInvoiceApproval::class);
        $query = PurchaseInvoiceApproval::query()
            ->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::PendingAssignment->value)
            ->with('lines');

        $query->when($request->filled('proveedor'), fn (Builder $builder) => $builder->where('card_name', 'like', '%'.$request->input('proveedor').'%'));
        $query->when($request->filled('cuenta'), fn (Builder $builder) => $builder->whereHas('lines', fn (Builder $lines) => $lines
            ->where(function (Builder $account) use ($request): void {
                $value = '%'.$request->input('cuenta').'%';
                $account->where('acct_code', 'like', $value)
                    ->orWhere('format_code', 'like', $value)
                    ->orWhere('acct_name', 'like', $value);
            })));
        $query->when($request->filled('area'), fn (Builder $builder) => $builder->whereHas('lines', fn (Builder $lines) => $lines->where('area', $request->input('area'))));
        $query->when($request->filled('especie'), fn (Builder $builder) => $builder->whereHas('lines', fn (Builder $lines) => $lines->where('especie', $request->input('especie'))));

        $invoices = $query->oldest('fecha_primera_sincronizacion')->paginate(20)->withQueryString()
            ->through(fn (PurchaseInvoiceApproval $invoice): array => [
                'id' => $invoice->id,
                'folio' => trim(($invoice->factura_folio_pref ? $invoice->factura_folio_pref.'-' : '').$invoice->factura_folio_num),
                'provider' => $invoice->card_name,
                'invoice_date' => $invoice->factura_fecha?->format('Y-m-d'),
                'due_date' => $invoice->factura_vencimiento?->format('Y-m-d'),
                'currency' => $invoice->factura_moneda,
                'total' => (float) $invoice->factura_total,
                'description' => $invoice->lines->pluck('description')->filter()->unique()->implode(' · '),
                'accounts' => $invoice->lines->map(fn ($line): string => trim(($line->format_code ?: $line->acct_code).' '.$line->acct_name))->filter()->unique()->values(),
                'areas' => $invoice->lines->pluck('nombre_area')->filter()->unique()->values(),
                'species' => $invoice->lines->pluck('nombre_especie')->filter()->unique()->values(),
                'age_hours' => (int) $invoice->fecha_primera_sincronizacion->diffInHours(now()),
                'manual_oc_doc_num' => $invoice->manual_oc_doc_num,
                'status' => $invoice->estado_aprobacion->value,
            ]);

        return Inertia::render('PurchaseInvoiceApprovals/Unassigned', [
            'invoices' => $invoices,
            'users' => User::query()->orderBy('name')->get(['id', 'name', 'email']),
            'filters' => $request->only(['proveedor', 'cuenta', 'area', 'especie']),
            'options' => [
                'areas' => PurchaseInvoiceApprovalLine::whereNotNull('area')->select('area', 'nombre_area')->distinct()->orderBy('nombre_area')->get(),
                'species' => PurchaseInvoiceApprovalLine::whereNotNull('especie')->select('especie', 'nombre_especie')->distinct()->orderBy('nombre_especie')->get(),
            ],
        ]);
    }

    public function assignResponsible(
        AssignPurchaseInvoiceResponsibleRequest $request,
        PurchaseInvoiceApproval $purchaseInvoiceApproval,
        ManualPurchaseInvoiceAssignmentService $service,
    ): RedirectResponse {
        $service->assignResponsible(
            $purchaseInvoiceApproval,
            User::findOrFail($request->integer('user_id')),
            $request->user(),
            $request->string('comment')->toString() ?: null,
        );

        return back()->with('success', 'Responsable asignado y notificación encolada.');
    }

    public function assignPurchaseOrder(
        AssignPurchaseInvoicePurchaseOrderRequest $request,
        PurchaseInvoiceApproval $purchaseInvoiceApproval,
        ManualPurchaseInvoiceAssignmentService $service,
    ): RedirectResponse {
        $service->assignPurchaseOrder(
            $purchaseInvoiceApproval,
            $request->integer('manual_oc_doc_num'),
            $request->filled('manual_oc_doc_entry') ? $request->integer('manual_oc_doc_entry') : null,
            $request->user(),
            $request->string('comment')->toString() ?: null,
        );

        return back()->with('success', 'Orden de compra manual registrada.');
    }

    public function assignSubstitute(
        AssignPurchaseInvoiceSubstituteRequest $request,
        PurchaseInvoiceApproval $purchaseInvoiceApproval,
        ManualPurchaseInvoiceAssignmentService $service,
    ): RedirectResponse {
        $service->assignSubstitute(
            $purchaseInvoiceApproval,
            User::findOrFail($request->integer('user_id')),
            $request->user(),
            $request->string('comment')->toString() ?: null,
        );

        return back()->with('success', 'Suplente asignado y notificación encolada.');
    }

    public function reconcile(
        ReconcilePurchaseInvoiceAssociationRequest $request,
        PurchaseInvoiceApproval $purchaseInvoiceApproval,
        ManualPurchaseInvoiceAssignmentService $service,
    ): RedirectResponse {
        $service->reconcile(
            $purchaseInvoiceApproval,
            $request->string('preferred_oc_source')->toString(),
            $request->user(),
            $request->string('comment')->toString() ?: null,
        );

        return back()->with('success', 'Asociación de OC reconciliada.');
    }
}
