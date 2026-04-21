<?php

namespace App\Services;

use Illuminate\Support\Str;

class OrganigramService
{
    public function parseCsvAndBuildSnapshot(string $path, string $originalFilename): array
    {
        $rows = [];
        if (($handle = fopen($path, "r")) !== FALSE) {
            $headers = fgetcsv($handle, 1000, ";");
            // Normalizar headers
            while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
                $rows[] = array_combine($headers, $data);
            }
            fclose($handle);
        }

        $companiesData = [];
        foreach ($rows as $row) {
            $companyName = $row['Nombre Empresa'];
            $companySlug = Str::slug($companyName);

            if (!isset($companiesData[$companySlug])) {
                $companiesData[$companySlug] = [
                    'name' => $companyName,
                    'slug' => $companySlug,
                    'people' => [],
                    'lookup' => [] // Para encontrar supervisor por nombre
                ];
            }

            $person = [
                'key' => $companySlug . '::' . $row['Rut'],
                'name' => $row['Nombre Completo'],
                'rut' => $row['Rut'],
                'position' => $row['Cargo'],
                'sex' => $row['Sexo'],
                'cost_center' => $row['Centro de Costo'],
                'company' => $companyName,
                'supervisor_name' => $row['Nombre Supervisor'],
            ];

            $companiesData[$companySlug]['people'][] = $person;
            $companiesData[$companySlug]['lookup'][$person['name']] = $person['key'];
        }

        $finalCompanies = [];
        foreach ($companiesData as $cData) {
            $nodes = [];
            foreach ($cData['people'] as $p) {
                $nodes[$p['key']] = ['person' => $p, 'children' => []];
            }

            $roots = [];
            foreach ($nodes as $key => &$node) {
                $supervisorName = $node['person']['supervisor_name'];
                $supervisorKey = $cData['lookup'][$supervisorName] ?? null;

                // Si se reporta a sí mismo o no existe el supervisor en la misma empresa -> es Root
                if (!$supervisorKey || $supervisorKey === $key) {
                    $roots[] = &$node;
                } else {
                    $nodes[$supervisorKey]['children'][] = &$node;
                }
            }

            $finalCompanies[] = [
                'name' => $cData['name'],
                'slug' => $cData['slug'],
                'roots' => $roots
            ];
        }

        return [
            'generated_at' => now()->toIso8601String(),
            'source' => [
                'filename' => $originalFilename,
                'row_count' => count($rows)
            ],
            'companies' => $finalCompanies
        ];
    }
}
