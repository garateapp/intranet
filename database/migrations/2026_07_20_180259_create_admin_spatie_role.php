<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear rol admin con los mismos permisos que super_admin
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $superAdmin = Role::where('name', 'super_admin')->first();

        if ($superAdmin) {
            $admin->syncPermissions($superAdmin->getAllPermissions());
        }

        // Asignar rol Spatie 'admin' a todos los usuarios con role legacy 'admin'
        User::where('role', 'admin')->each(function ($user) use ($admin) {
            if (!$user->hasRole('admin')) {
                $user->assignRole($admin);
            }
        });
    }

    public function down(): void
    {
        Role::where('name', 'admin')->delete();
    }
};
