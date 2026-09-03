<?php

namespace App\Http\Controllers;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceAssociationStatus;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalLine;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseInvoiceAccountingController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('accounting', PurchaseInvoiceApproval::class);
        $query = PurchaseInvoiceApproval::query()->with(['lines', 'activeResponsibles.user']);

        foreach (['estado_aprobacion' => 'estado', 'bpl_id' => 'sucursal'] as $column => $filter) {
            $query->when($request->filled($filter), fn (Builder $q) => $q->where($column, $request->input($filter)));
        }
        $query->when($request->filled('responsable'), fn (Builder $q) => $q->whereHas('activeResponsibles',
            fn (Builder $responsibles) => $responsibles->where('user_id', $request->integer('responsable'))
        ));
        $query->when($request->filled('proveedor'), fn (Builder $q) => $q->where('card_name', 'like', '%'.$request->input('proveedor').'%'));
        $query->when($request->filled('area'), fn (Builder $q) => $q->whereHas('lines', fn (Builder $lines) => $lines->where('area', $request->input('area'))));
        $query->when($request->filled('especie'), fn (Builder $q) => $q->whereHas('lines', fn (Builder $lines) => $lines->where('especie', $request->input('especie'))));
        $query->when($request->filled('oc'), fn (Builder $q) => $q->whereHas('lines', fn (Builder $lines) => $lines->where('oc_doc_num', $request->input('oc'))));
        $query->when($request->filled('folio'), fn (Builder $q) => $q->where('factura_folio_num', 'like', '%'.$request->input('folio').'%'));
        $query->when($request->input('asociacion') === 'sin_oc', fn (Builder $q) => $q->where('estado_asociacion', PurchaseInvoiceAssociationStatus::WithoutPurchaseOrder->value));
        $query->when($request->input('asociacion') === 'con_oc', fn (Builder $q) => $q->whereIn('estado_asociacion', [
            PurchaseInvoiceAssociationStatus::SapPurchaseOrder->value,
            PurchaseInvoiceAssociationStatus::ManuallyAssignedPurchaseOrder->value,
        ]));
        $query->when($request->input('asignacion') === 'asignada', fn (Builder $q) => $q->whereHas('activeResponsibles', fn (Builder $responsibles) => $responsibles->whereNotNull('user_id')));
        $query->when($request->input('asignacion') === 'sin_asignar', fn (Builder $q) => $q->whereDoesntHave('activeResponsibles', fn (Builder $responsibles) => $responsibles->whereNotNull('user_id')));
        $query->when($request->filled('origen_responsable'), fn (Builder $q) => $q->where('responsible_source', $request->input('origen_responsable')));
        $query->when($request->filled('cuenta'), fn (Builder $q) => $q->whereHas('lines', fn (Builder $lines) => $lines->where(function (Builder $account) use ($request): void {
            $value = '%'.$request->input('cuenta').'%';
            $account->where('acct_code', 'like', $value)->orWhere('format_code', 'like', $value)->orWhere('acct_name', 'like', $value);
        })));
        $query->when($request->filled('fecha_desde'), fn (Builder $q) => $q->whereDate('factura_fecha', '>=', $request->input('fecha_desde')));
        $query->when($request->filled('fecha_hasta'), fn (Builder $q) => $q->whereDate('factura_fecha', '<=', $request->input('fecha_hasta')));

        $pending = fn () => PurchaseInvoiceApproval::query()->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Pending->value);
        $stats = [
            'pending' => $pending()->count(),
            'approved' => PurchaseInvoiceApproval::where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Approved->value)->count(),
            'objected' => PurchaseInvoiceApproval::where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Objected->value)->count(),
            'unmapped' => PurchaseInvoiceApproval::whereIn('estado_aprobacion', [PurchaseInvoiceApprovalStatus::WithoutResponsible->value, PurchaseInvoiceApprovalStatus::PendingAssignment->value])->count(),
            'without_po' => PurchaseInvoiceApproval::where('estado_asociacion', PurchaseInvoiceAssociationStatus::WithoutPurchaseOrder->value)->count(),
            'over_24h' => $pending()->where('fecha_primera_sincronizacion', '<=', now()->subHours(24))->count(),
            'over_48h' => $pending()->where('fecha_primera_sincronizacion', '<=', now()->subHours(48))->count(),
            'over_72h' => $pending()->where('fecha_primera_sincronizacion', '<=', now()->subHours(72))->count(),
        ];

        $invoices = $query->orderBy('fecha_primera_sincronizacion')->paginate(20)->withQueryString()
            ->through(fn ($invoice) => [
                'id' => $invoice->id,
                'folio' => trim(($invoice->factura_folio_pref ? $invoice->factura_folio_pref.'-' : '').$invoice->factura_folio_num),
                'provider' => $invoice->card_name,
                'invoice_date' => $invoice->factura_fecha?->format('Y-m-d'),
                'due_date' => $invoice->factura_vencimiento?->format('Y-m-d'),
                'currency' => $invoice->factura_moneda,
                'total' => (float) $invoice->factura_total,
                'status' => $invoice->estado_aprobacion->value,
                'purchase_orders' => $invoice->lines->pluck('oc_doc_num')->filter()->unique()->values(),
                'manual_purchase_order' => $invoice->manual_oc_doc_num,
                'association_status' => $invoice->estado_asociacion?->value,
                'responsible_source' => $invoice->responsible_source?->value,
                'responsibles' => $invoice->activeResponsibles->map(fn ($r) => ['name' => $r->user?->name, 'owner_code' => $r->owner_code, 'status' => $r->estado->value, 'source' => $r->source?->value])->values(),
                'age_hours' => (int) $invoice->fecha_primera_sincronizacion->diffInHours(now()),
            ]);

        return Inertia::render('PurchaseInvoiceApprovals/Accounting', [
            'invoices' => $invoices,
            'stats' => $stats,
            'filters' => $request->only(['estado', 'responsable', 'proveedor', 'sucursal', 'area', 'especie', 'fecha_desde', 'fecha_hasta', 'oc', 'folio', 'asociacion', 'asignacion', 'origen_responsable', 'cuenta']),
            'options' => [
                'responsibles' => User::whereHas('purchaseInvoiceResponsibilities')->orderBy('name')->get(['id', 'name']),
                'branches' => PurchaseInvoiceApproval::whereNotNull('bpl_id')->distinct()->orderBy('bpl_id')->pluck('bpl_id'),
                'areas' => PurchaseInvoiceApprovalLine::whereNotNull('area')->select('area', 'nombre_area')->distinct()->orderBy('nombre_area')->get(),
                'species' => PurchaseInvoiceApprovalLine::whereNotNull('especie')->select('especie', 'nombre_especie')->distinct()->orderBy('nombre_especie')->get(),
            ],
        ]);
    }
}
