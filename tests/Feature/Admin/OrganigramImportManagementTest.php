<?php

namespace Tests\Feature\Admin;

use App\Models\OrganigramImport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OrganigramImportManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
    }

    public function test_admin_can_access_organigram_import_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.organigram.index'))
            ->assertOk();
    }

    public function test_regular_user_cannot_access_organigram_import_page(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)
            ->get(route('admin.organigram.index'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_admin_can_upload_csv_and_replace_current_snapshot(): void
    {
        Storage::fake('local');

        $admin = User::factory()->create(['role' => 'admin']);
        $previousImport = OrganigramImport::create([
            'original_filename' => 'anterior.csv',
            'stored_filename' => 'organigrams/anterior.csv',
            'uploaded_by' => $admin->id,
            'row_count' => 1,
            'snapshot_json' => ['companies' => []],
            'is_current' => true,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.organigram.store'), [
            'file' => UploadedFile::fake()->createWithContent('organigrama.csv', implode("\n", [
                'Nombre Empresa;Rut;Nombre Completo;Cargo;Centro de Costo;Nombre Supervisor;Sexo',
                'Greenex SpA;1-9;Ana Perez;Analista;Contabilidad;Mario Jefe;F',
                'Greenex SpA;2-7;Juan Soto;Asistente;Contabilidad;Mario Jefe;M',
                'Comercializadora Garate Hermanos Ltda.;3-5;Maria Lopez;Encargada;Bodega;Paula Lider;F',
            ])),
        ]);

        $response->assertRedirect(route('admin.organigram.index'));

        $this->assertDatabaseHas('organigram_imports', [
            'original_filename' => 'organigrama.csv',
            'row_count' => 3,
            'is_current' => true,
        ]);

        $this->assertDatabaseHas('organigram_imports', [
            'id' => $previousImport->id,
            'is_current' => false,
        ]);
    }

    public function test_invalid_csv_header_does_not_replace_current_snapshot(): void
    {
        Storage::fake('local');

        $admin = User::factory()->create(['role' => 'admin']);
        $currentImport = OrganigramImport::create([
            'original_filename' => 'actual.csv',
            'stored_filename' => 'organigrams/actual.csv',
            'uploaded_by' => $admin->id,
            'row_count' => 1,
            'snapshot_json' => ['companies' => [['name' => 'Actual']]],
            'is_current' => true,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.organigram.store'), [
            'file' => UploadedFile::fake()->createWithContent('invalido.csv', implode("\n", [
                'Empresa;Rut;Nombre Completo;Cargo;Centro de Costo;Nombre Supervisor;Sexo',
                'Greenex SpA;1-9;Ana Perez;Analista;Contabilidad;Mario Jefe;F',
            ])),
        ]);

        $response->assertSessionHasErrors('file');

        $this->assertDatabaseHas('organigram_imports', [
            'id' => $currentImport->id,
            'is_current' => true,
        ]);
        $this->assertDatabaseMissing('organigram_imports', [
            'original_filename' => 'invalido.csv',
        ]);
    }
}
