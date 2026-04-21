<?php

namespace Tests\Unit;

use App\Services\OrganigramCsvImporter;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrganigramCsvImporterTest extends TestCase
{
    #[Test]
    public function it_builds_a_hierarchical_snapshot_grouped_by_company_and_person_roots(): void
    {
        $importer = new OrganigramCsvImporter();

        $snapshot = $importer->importFromString(implode("\n", [
            'Nombre Empresa;Rut;Nombre Completo;Cargo;Centro de Costo;Nombre Supervisor;Sexo',
            'Greenex SpA;10-1;Mario Jefe;Gerente;Gerencia General;Mario Jefe;M',
            'Greenex SpA;11-2;Ana Perez;Analista;Contabilidad;Mario Jefe;F',
            'Greenex SpA;12-3;Juan Soto;Asistente;Contabilidad;Ana Perez;M',
            'Comercializadora Garate Hermanos Ltda.;20-4;Paula Lider;Gerenta;Bodega;Paula Lider;F',
        ]));

        $this->assertSame(4, $snapshot['source']['row_count']);
        $this->assertCount(2, $snapshot['companies']);
        $this->assertSame('Greenex SpA', $snapshot['companies'][0]['name']);
        $this->assertCount(1, $snapshot['companies'][0]['roots']);
        $this->assertSame('Mario Jefe', $snapshot['companies'][0]['roots'][0]['person']['name']);
        $this->assertSame('Gerencia General', $snapshot['companies'][0]['roots'][0]['person']['cost_center']);
        $this->assertCount(1, $snapshot['companies'][0]['roots'][0]['children']);
        $this->assertSame('Ana Perez', $snapshot['companies'][0]['roots'][0]['children'][0]['person']['name']);
        $this->assertCount(1, $snapshot['companies'][0]['roots'][0]['children'][0]['children']);
        $this->assertSame(
            'Juan Soto',
            $snapshot['companies'][0]['roots'][0]['children'][0]['children'][0]['person']['name']
        );
    }

    #[Test]
    public function it_promotes_people_to_roots_when_their_supervisor_is_missing(): void
    {
        $importer = new OrganigramCsvImporter();

        $snapshot = $importer->importFromString(implode("\n", [
            'Nombre Empresa;Rut;Nombre Completo;Cargo;Centro de Costo;Nombre Supervisor;Sexo',
            'Greenex SpA;1-9;Ana Perez;Analista;Contabilidad;Supervisor Externo;F',
        ]));

        $this->assertSame(
            'Ana Perez',
            $snapshot['companies'][0]['roots'][0]['person']['name']
        );
    }

    #[Test]
    public function it_rejects_a_csv_with_an_invalid_header(): void
    {
        $importer = new OrganigramCsvImporter();

        $this->expectException(InvalidArgumentException::class);

        $importer->importFromString(implode("\n", [
            'Empresa;Rut;Nombre Completo;Cargo;Centro de Costo;Nombre Supervisor;Sexo',
            'Greenex SpA;1-9;Ana Perez;Analista;Contabilidad;Mario Jefe;F',
        ]));
    }

    #[Test]
    public function it_accepts_a_buk_csv_with_utf8_bom_in_the_header(): void
    {
        $importer = new OrganigramCsvImporter();

        $snapshot = $importer->importFromString("\xEF\xBB\xBF".implode("\n", [
            'Nombre Empresa;Rut;Nombre Completo;Cargo;Centro de Costo;Nombre Supervisor;Sexo',
            'Greenex SpA;1-9;Ana Perez;Analista;Contabilidad;Ana Perez;F',
        ]));

        $this->assertSame(1, $snapshot['source']['row_count']);
        $this->assertSame('Greenex SpA', $snapshot['companies'][0]['name']);
        $this->assertSame('Ana Perez', $snapshot['companies'][0]['roots'][0]['person']['name']);
    }
}
