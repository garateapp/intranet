<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Seeder que crea los roles y permisos del módulo ATS.
 *
 * Roles:
 * - super_admin: Control total del sistema
 * - recruiter: Acceso global a vacantes y candidatos (RRHH)
 * - hiring_manager: Solo ve vacantes asignadas y sus candidatos
 *
 * Permisos organizados por módulo:
 * - vacancies: CRUD de vacantes
 * - candidates: CRUD de candidatos
 * - stages: CRUD de etapas globales
 * - applications: Gestionar postulaciones en el pipeline
 * - interviews: CRUD de entrevistas
 * - evaluations: CRUD de evaluaciones
 */
class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Resetear cache de permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ========== PERMISOS ==========
        // Vacantes
        Permission::create(['name' => 'view vacancies', 'guard_name' => 'web']);
        Permission::create(['name' => 'create vacancies', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit vacancies', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete vacancies', 'guard_name' => 'web']);

        // Candidatos
        Permission::create(['name' => 'view candidates', 'guard_name' => 'web']);
        Permission::create(['name' => 'create candidates', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit candidates', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete candidates', 'guard_name' => 'web']);

        // Etapas globales
        Permission::create(['name' => 'view stages', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage stages', 'guard_name' => 'web']);

        // Pipeline / Aplicaciones
        Permission::create(['name' => 'view applications', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage applications', 'guard_name' => 'web']);

        // Entrevistas
        Permission::create(['name' => 'view interviews', 'guard_name' => 'web']);
        Permission::create(['name' => 'create interviews', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit interviews', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete interviews', 'guard_name' => 'web']);

        // Evaluaciones
        Permission::create(['name' => 'view evaluations', 'guard_name' => 'web']);
        Permission::create(['name' => 'create evaluations', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit evaluations', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete evaluations', 'guard_name' => 'web']);

        // ========== ROLES ==========

        // SuperAdmin: acceso total al sistema
        $superAdmin = Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::all());

        // Admin: acceso total al sistema (equivalente a super_admin, compatibilidad con role legacy)
        $admin = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $admin->givePermissionTo(Permission::all());

        // Reclutador/RRHH: acceso global a todas las vacantes y candidatos
        $recruiter = Role::create(['name' => 'recruiter', 'guard_name' => 'web']);
        $recruiter->givePermissionTo([
            'view vacancies', 'create vacancies', 'edit vacancies', 'delete vacancies',
            'view candidates', 'create candidates', 'edit candidates', 'delete candidates',
            'view stages', 'manage stages',
            'view applications', 'manage applications',
            'view interviews', 'create interviews', 'edit interviews', 'delete interviews',
            'view evaluations', 'create evaluations', 'edit evaluations', 'delete evaluations',
        ]);

        // Gerente de Contratación: solo ve vacantes asignadas y sus candidatos
        $hiringManager = Role::create(['name' => 'hiring_manager', 'guard_name' => 'web']);
        $hiringManager->givePermissionTo([
            'view vacancies',
            'view candidates',
            'view applications',
            'view interviews', 'create interviews', 'edit interviews',
            'view evaluations', 'create evaluations', 'edit evaluations',
        ]);

        // ========== ASIGNAR ROLES A USUARIOS EXISTENTES ==========
        // Usuarios con role legacy 'admin' reciben el rol Spatie 'admin'
        $adminUsers = User::where('role', 'admin')->get();
        foreach ($adminUsers as $user) {
            $user->assignRole('admin');
        }

        // Asignar recruiter a algunos usuarios para testing
        $recruiterUsers = User::where('role', '!=', 'admin')
            ->take(3)
            ->get();
        foreach ($recruiterUsers as $user) {
            $user->assignRole('recruiter');
        }

        // Asignar hiring_manager al resto
        $remainingUsers = User::where('role', '!=', 'admin')
            ->whereNotIn('id', $recruiterUsers->pluck('id'))
            ->get();
        foreach ($remainingUsers as $user) {
            $user->assignRole('hiring_manager');
        }
    }
}
