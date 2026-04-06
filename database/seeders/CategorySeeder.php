<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Noticias',
                'description' => 'Noticias y actualizaciones de la empresa',
                'color' => '#038c34',
                'icon' => '📰',
                'sort_order' => 1,
            ],
            [
                'name' => 'Eventos',
                'description' => 'Eventos y actividades especiales',
                'color' => '#f78e2c',
                'icon' => '📅',
                'sort_order' => 2,
            ],
            [
                'name' => 'Recursos Humanos',
                'description' => 'Información de RRHH y beneficios',
                'color' => '#80b61f',
                'icon' => '👥',
                'sort_order' => 3,
            ],
            [
                'name' => 'Tecnología',
                'description' => 'Actualizaciones y recursos tecnológicos',
                'color' => '#3f8b42',
                'icon' => '💻',
                'sort_order' => 4,
            ],
            [
                'name' => 'Enlaces Útiles',
                'description' => 'Links y herramientas de interés',
                'color' => '#fe790f',
                'icon' => '🔗',
                'sort_order' => 5,
            ],
        ];

        foreach ($categories as $category) {
            Category::create(array_merge($category, [
                'slug' => Str::slug($category['name']),
            ]));
        }
    }
}
