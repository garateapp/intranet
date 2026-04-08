<?php

namespace Database\Seeders;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrganizationalUnitSeeder extends Seeder
{
    public function run(): void
    {
        // Create organizational hierarchy
        $gerenciaGeneral = OrganizationalUnit::create([
            'name' => 'Gerencia General',
            'slug' => 'gerencia-general',
            'description' => 'Dirección estratégica y toma de decisiones de la empresa',
            'parent_id' => null,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $administracion = OrganizationalUnit::create([
            'name' => 'Administración y Finanzas',
            'slug' => 'administracion-finanzas',
            'description' => 'Gestión financiera, contabilidad y presupuestos',
            'parent_id' => $gerenciaGeneral->id,
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $rrhh = OrganizationalUnit::create([
            'name' => 'Recursos Humanos',
            'slug' => 'recursos-humanos',
            'description' => 'Gestión del talento humano, bienestar y capacitación',
            'parent_id' => $gerenciaGeneral->id,
            'sort_order' => 3,
            'is_active' => true,
        ]);

        $tecnologia = OrganizationalUnit::create([
            'name' => 'Tecnología',
            'slug' => 'tecnologia',
            'description' => 'Desarrollo, infraestructura y soporte tecnológico',
            'parent_id' => $gerenciaGeneral->id,
            'sort_order' => 4,
            'is_active' => true,
        ]);

        $marketing = OrganizationalUnit::create([
            'name' => 'Marketing y Comunicaciones',
            'slug' => 'marketing-comunicaciones',
            'description' => 'Estrategia de marca, marketing digital y comunicación interna',
            'parent_id' => $gerenciaGeneral->id,
            'sort_order' => 5,
            'is_active' => true,
        ]);

        $operaciones = OrganizationalUnit::create([
            'name' => 'Operaciones',
            'slug' => 'operaciones',
            'description' => 'Gestión operativa y optimización de procesos',
            'parent_id' => $gerenciaGeneral->id,
            'sort_order' => 6,
            'is_active' => true,
        ]);

        // Assign users to organizational units
        $users = User::all();
        foreach ($users as $user) {
            $unit = null;
            if (str_contains(strtolower($user->department ?? ''), 'tecnología') || str_contains(strtolower($user->department ?? ''), 'tecnologia')) {
                $unit = $tecnologia;
            } elseif (str_contains(strtolower($user->department ?? ''), 'recursos humanos') || str_contains(strtolower($user->department ?? ''), 'rrhh')) {
                $unit = $rrhh;
            } elseif (str_contains(strtolower($user->department ?? ''), 'marketing')) {
                $unit = $marketing;
            } elseif (str_contains(strtolower($user->department ?? ''), 'finanzas') || str_contains(strtolower($user->department ?? ''), 'administración')) {
                $unit = $administracion;
            } elseif (str_contains(strtolower($user->department ?? ''), 'operaciones')) {
                $unit = $operaciones;
            }

            if ($unit) {
                $user->update(['organizational_unit_id' => $unit->id]);
            }
        }

        // Set manager relationships
        $adminUser = User::where('email', 'admin@intranet.test')->first();
        if ($adminUser) {
            $adminUser->update(['manager_id' => null]); // Gerente General
        }

        $juan = User::where('email', 'juan@intranet.test')->first();
        $maria = User::where('email', 'maria@intranet.test')->first();
        $carlos = User::where('email', 'carlos@intranet.test')->first();

        if ($juan) $juan->update(['manager_id' => $adminUser?->id]);
        if ($maria) $maria->update(['manager_id' => $adminUser?->id]);
        if ($carlos) $carlos->update(['manager_id' => $adminUser?->id]);
    }
}
