<?php

namespace Database\Seeders;

use App\Models\Stage;
use Illuminate\Database\Seeder;

/**
 * Seeder que crea las etapas por defecto del pipeline de selección.
 * Estas etapas se marcan como is_default=true para que se incluyan
 * automáticamente al crear nuevas vacantes.
 */
class DefaultStageSeeder extends Seeder
{
    public function run(): void
    {
        $defaultStages = [
            ['name' => 'Revisión', 'color' => '#6366f1', 'sort_order' => 1, 'is_default' => true],
            ['name' => 'Entrevista Telefónica', 'color' => '#8b5cf6', 'sort_order' => 2, 'is_default' => true],
            ['name' => 'Entrevista Técnica', 'color' => '#3b82f6', 'sort_order' => 3, 'is_default' => true],
            ['name' => 'Entrevista Cultural', 'color' => '#06b6d4', 'sort_order' => 4, 'is_default' => false],
            ['name' => 'Entrevista Final', 'color' => '#14b8a6', 'sort_order' => 5, 'is_default' => false],
            ['name' => 'Oferta', 'color' => '#10b981', 'sort_order' => 6, 'is_default' => true],
            ['name' => 'Contratado', 'color' => '#059669', 'sort_order' => 7, 'is_default' => true],
            ['name' => 'Rechazado', 'color' => '#ef4444', 'sort_order' => 8, 'is_default' => true],
        ];

        foreach ($defaultStages as $stage) {
            Stage::create($stage);
        }
    }
}
