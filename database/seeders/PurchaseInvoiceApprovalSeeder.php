<?php

namespace Database\Seeders;

use App\Models\PurchaseInvoiceObjectionReason;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PurchaseInvoiceApprovalSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $permissions = collect([
            'purchase-invoice-approvals.view',
            'purchase-invoice-approvals.approve',
            'purchase-invoice-approvals.object',
            'purchase-invoice-approvals.accounting',
            'purchase-invoice-approvals.admin',
            'purchase-invoice-approvals.assign-responsible',
            'purchase-invoice-approvals.assign-po',
            'purchase-invoice-approvals.manage-unassigned',
        ])->map(fn (string $name) => Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']));

        Role::whereIn('name', ['admin', 'super_admin'])->get()->each(fn (Role $role) => $role->givePermissionTo($permissions));

        // Migrar usuarios del rol legacy "accounting" al nuevo "cobrador" si existe
        $oldAccounting = Role::where('name', 'accounting')->first();
        if ($oldAccounting) {
            $cobrador = Role::firstOrCreate(['name' => 'cobrador', 'guard_name' => 'web']);
            foreach ($oldAccounting->users as $user) {
                $user->removeRole('accounting');
                $user->assignRole('cobrador');
            }
            $oldAccounting->delete();
        } else {
            $cobrador = Role::firstOrCreate(['name' => 'cobrador', 'guard_name' => 'web']);
        }

        $cobrador->givePermissionTo($permissions->whereIn('name', [
            'purchase-invoice-approvals.view',
            'purchase-invoice-approvals.accounting',
            'purchase-invoice-approvals.assign-responsible',
            'purchase-invoice-approvals.assign-po',
            'purchase-invoice-approvals.manage-unassigned',
        ]));

        foreach ([
            'Monto no corresponde',
            'Servicio no realizado',
            'Producto no recibido',
            'Cantidad incorrecta',
            'OC incorrecta',
            'Factura incorrecta',
            'Otro',
        ] as $order => $name) {
            PurchaseInvoiceObjectionReason::firstOrCreate(['name' => $name], [
                'active' => true,
                'sort_order' => $order + 1,
            ]);
        }
    }
}
