<?php

namespace Tests\Feature\Portal;

use App\Models\OrganigramImport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OrganigramPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_organigram_page_renders_from_the_current_snapshot(): void
    {
        $user = User::factory()->create();

        OrganigramImport::create([
            'original_filename' => 'organigrama.csv',
            'stored_filename' => 'organigrams/organigrama.csv',
            'uploaded_by' => $user->id,
            'row_count' => 2,
            'snapshot_json' => [
                'source' => ['row_count' => 2],
                'companies' => [
                    [
                        'name' => 'Greenex SpA',
                        'slug' => 'greenex-spa',
                        'roots' => [
                            [
                                'person' => [
                                    'key' => 'greenex-spa::10-1',
                                    'name' => 'Mario Alonso Yañez Arenas',
                                    'position' => 'Gerente de Administración y Finanzas',
                                    'rut' => '10-1',
                                    'sex' => 'M',
                                    'cost_center' => 'Gerencia Administración y Finanzas',
                                    'company' => 'Greenex SpA',
                                    'supervisor_name' => 'Mario Alonso Yañez Arenas',
                                ],
                                'children' => [
                                    [
                                        'person' => [
                                            'key' => 'greenex-spa::12.517.586-4',
                                            'name' => 'Marcela Karina Alvarez Garcia',
                                            'position' => 'Jefa de Administración',
                                            'rut' => '12.517.586-4',
                                            'sex' => 'F',
                                            'cost_center' => 'Contabilidad, Tesorería y Gestión',
                                            'company' => 'Greenex SpA',
                                            'supervisor_name' => 'Mario Alonso Yañez Arenas',
                                        ],
                                        'children' => [],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            'is_current' => true,
        ]);

        $response = $this->actingAs($user)
            ->get(route('organigram.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Organigram/Index')
            ->where('snapshot.companies.0.name', 'Greenex SpA')
            ->where('snapshot.companies.0.roots.0.person.name', 'Mario Alonso Yañez Arenas')
            ->where('snapshot.companies.0.roots.0.children.0.person.name', 'Marcela Karina Alvarez Garcia')
            ->where('currentImport.original_filename', 'organigrama.csv')
        );
    }

    public function test_organigram_page_shows_empty_state_when_there_is_no_current_import(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('organigram.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Organigram/Index')
            ->where('snapshot', null)
            ->where('currentImport', null)
        );
    }

    public function test_organigram_page_normalizes_legacy_snapshot_shape(): void
    {
        $user = User::factory()->create();

        OrganigramImport::create([
            'original_filename' => 'organigrama-legacy.csv',
            'stored_filename' => 'organigrams/organigrama-legacy.csv',
            'uploaded_by' => $user->id,
            'row_count' => 1,
            'snapshot_json' => [
                'source' => ['row_count' => 1],
                'companies' => [
                    [
                        'name' => 'Greenex SpA',
                        'slug' => 'greenex-spa',
                        'cost_centers' => [
                            ['name' => 'Contabilidad'],
                        ],
                    ],
                ],
            ],
            'is_current' => true,
        ]);

        $response = $this->actingAs($user)->get(route('organigram.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Organigram/Index')
            ->where('snapshot.companies.0.name', 'Greenex SpA')
            ->where('snapshot.companies.0.roots', [])
            ->where('legacySnapshot', true)
        );
    }
}
