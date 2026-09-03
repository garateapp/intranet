<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceObjectionReason;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseInvoiceObjectionReasonController extends Controller
{
    public function index(): Response
    {
        $this->authorize('administer', PurchaseInvoiceApproval::class);

        return Inertia::render('PurchaseInvoiceApprovals/Admin/ObjectionReasons', [
            'reasons' => PurchaseInvoiceObjectionReason::orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('administer', PurchaseInvoiceApproval::class);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:purchase_invoice_objection_reasons,name'],
            'active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);
        PurchaseInvoiceObjectionReason::create($validated);

        return back()->with('success', 'Motivo creado.');
    }

    public function update(Request $request, PurchaseInvoiceObjectionReason $reason): RedirectResponse
    {
        $this->authorize('administer', PurchaseInvoiceApproval::class);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('purchase_invoice_objection_reasons', 'name')->ignore($reason)],
            'active' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);
        $reason->update($validated);

        return back()->with('success', 'Motivo actualizado.');
    }
}
