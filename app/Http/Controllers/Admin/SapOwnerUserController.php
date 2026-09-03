<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalLine;
use App\Models\SapOwnerUser;
use App\Models\User;
use App\Services\SapOwnerMappingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SapOwnerUserController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('administer', PurchaseInvoiceApproval::class);
        $search = trim($request->string('buscar')->toString());
        $encountered = PurchaseInvoiceApprovalLine::query()->whereNotNull('owner_code')
            ->when($search, fn ($q) => $q->where('owner_code', 'like', "%{$search}%"))
            ->distinct()->pluck('owner_code');
        $mapped = SapOwnerUser::with('user')->get()->keyBy('owner_code');

        $owners = $encountered->merge($mapped->keys())->unique()->sort()->map(function ($ownerCode) use ($mapped): array {
            $mapping = $mapped->get($ownerCode);

            return [
                'owner_code' => (int) $ownerCode,
                'mapping_id' => $mapping?->id,
                'user_id' => $mapping?->user_id,
                'user_name' => $mapping?->user?->name,
                'active' => $mapping?->active ?? true,
                'unmapped' => ! $mapping || ! $mapping->active || ! $mapping->user_id,
                'invoice_count' => PurchaseInvoiceApprovalLine::where('owner_code', $ownerCode)
                    ->distinct('purchase_invoice_approval_id')->count('purchase_invoice_approval_id'),
            ];
        })->values();

        return Inertia::render('PurchaseInvoiceApprovals/Admin/Owners', [
            'owners' => $owners,
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'filters' => ['buscar' => $search],
        ]);
    }

    public function store(Request $request, SapOwnerMappingService $service): RedirectResponse
    {
        $this->authorize('administer', PurchaseInvoiceApproval::class);
        $validated = $request->validate([
            'owner_code' => ['required', 'integer'],
            'user_id' => ['nullable', Rule::exists(User::class, 'id')],
            'active' => ['required', 'boolean'],
        ]);

        $service->save($validated['owner_code'], $validated['user_id'] ?? null, $validated['active']);

        return back()->with('success', 'Homologación de responsable actualizada.');
    }
}
