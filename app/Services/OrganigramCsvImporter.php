<?php

namespace App\Services;

use Illuminate\Support\Str;
use InvalidArgumentException;

class OrganigramCsvImporter
{
    private const EXPECTED_HEADERS = [
        'Nombre Empresa',
        'Rut',
        'Nombre Completo',
        'Cargo',
        'Centro de Costo',
        'Nombre Supervisor',
        'Sexo',
    ];

    public function importFromString(string $csvContents): array
    {
        $handle = fopen('php://temp', 'r+');
        fwrite($handle, $csvContents);
        rewind($handle);

        $rows = [];

        try {
            $headers = fgetcsv($handle, separator: ';');
            $headers = $this->normalizeHeaders($headers);

            if ($headers !== self::EXPECTED_HEADERS) {
                throw new InvalidArgumentException('El archivo no contiene el encabezado BUK esperado.');
            }

            while (($data = fgetcsv($handle, separator: ';')) !== false) {
                if ($data === [null] || count(array_filter($data, fn ($value) => $value !== null && $value !== '')) === 0) {
                    continue;
                }

                $rows[] = array_combine(self::EXPECTED_HEADERS, array_pad($data, count(self::EXPECTED_HEADERS), null));
            }
        } finally {
            fclose($handle);
        }

        return $this->buildSnapshot($rows);
    }

    public function importFromFile(string $path): array
    {
        $contents = file_get_contents($path);

        if ($contents === false) {
            throw new InvalidArgumentException('No se pudo leer el archivo CSV.');
        }

        return $this->importFromString($contents);
    }

    private function buildSnapshot(array $rows): array
    {
        $companies = [];
        $importErrors = [];
        $duplicatedEntries = [];

        foreach ($rows as $index => $row) {
            $companyName = $this->normalizeText($row['Nombre Empresa']);
            $companyKey = Str::slug($companyName ?: 'sin-empresa');
            $rut = $this->normalizeText($row['Rut']);
            $name = $this->normalizeText($row['Nombre Completo']);

            // Validación de datos vacíos o inconsistentes
            if ($name === '') {
                $importErrors[] = [
                    'row' => $index + 2, // +2 porque cuenta desde 1 y hay header
                    'error' => 'Nombre completo vacío',
                    'data' => $row,
                ];
                continue;
            }

            if (! isset($companies[$companyKey])) {
                $companies[$companyKey] = [
                    'name' => $companyName,
                    'slug' => $companyKey,
                    'nodes' => [],
                    'roots' => [],
                ];
            }

            // Generar clave única para la persona
            $personKey = $companyKey.'::'.($rut !== '' ? $rut : Str::slug($name));

            // Detectar duplicados
            if (isset($companies[$companyKey]['nodes'][$personKey])) {
                $duplicatedEntries[] = [
                    'row' => $index + 2,
                    'name' => $name,
                    'rut' => $rut,
                ];
                continue; // Saltar duplicados
            }

            $person = $this->buildPerson($row, $companyName, $companyKey);
            $companies[$companyKey]['nodes'][$personKey] = [
                'person' => $person,
                'children' => [],
            ];
        }

        $companies = array_values(array_map(function (array $company) use (&$importErrors, &$duplicatedEntries) {
            $keysByName = [];

            foreach ($company['nodes'] as $nodeKey => $node) {
                $keysByName[$node['person']['name']] = $nodeKey;
            }

            // Validación de ciclos en la jerarquía
            $visited = [];
            $detectCycle = function (string $nodeKey) use (&$detectCycle, &$visited, $company, &$importErrors): bool {
                if (isset($visited[$nodeKey])) {
                    return true; // Ciclo detectado
                }
                
                $visited[$nodeKey] = true;
                $node = $company['nodes'][$nodeKey];
                $supervisorName = $node['person']['supervisor_name'];
                
                if ($supervisorName === '' || $supervisorName === $node['person']['name']) {
                    unset($visited[$nodeKey]);
                    return false;
                }
                
                $supervisorKey = $keysByName[$supervisorName] ?? null;
                if ($supervisorKey === null) {
                    unset($visited[$nodeKey]);
                    return false;
                }
                
                if ($detectCycle($supervisorKey)) {
                    $importErrors[] = [
                        'row' => 'N/A',
                        'error' => "Ciclo detectado en jerarquía: {$node['person']['name']}",
                        'data' => $node['person'],
                    ];
                    return true;
                }
                
                unset($visited[$nodeKey]);
                return false;
            };

            foreach ($company['nodes'] as $nodeKey => $node) {
                $visited = [];
                $detectCycle($nodeKey);
            }

            foreach ($company['nodes'] as $nodeKey => $node) {
                $supervisorName = $node['person']['supervisor_name'];
                $supervisorKey = $keysByName[$supervisorName] ?? null;

                if (
                    $supervisorName === '' ||
                    $supervisorName === $node['person']['name'] ||
                    $supervisorKey === null ||
                    $supervisorKey === $nodeKey
                ) {
                    $company['roots'][] = $nodeKey;
                    continue;
                }

                $company['nodes'][$supervisorKey]['children'][] = $nodeKey;
            }

            $roots = array_map(
                fn (string $rootKey) => $this->materializeNodeTree($rootKey, $company['nodes']),
                $company['roots']
            );

            usort($roots, fn (array $left, array $right) => strcmp($left['person']['name'], $right['person']['name']));

            unset($company['nodes'], $company['roots']);
            $company['roots'] = $roots;
            return $company;
        }, $companies));

        return [
            'generated_at' => now()->toIso8601String(),
            'source' => [
                'row_count' => count($rows),
                'errors' => $importErrors,
                'duplicates' => $duplicatedEntries,
            ],
            'companies' => $companies,
        ];
    }

    private function normalizeText(?string $value): string
    {
        return trim((string) $value);
    }

    private function buildPerson(array $row, string $companyName, string $companyKey): array
    {
        $rut = $this->normalizeText($row['Rut']);
        $name = $this->normalizeText($row['Nombre Completo']);

        return [
            'key' => $companyKey.'::'.($rut !== '' ? $rut : Str::slug($name)),
            'name' => $name,
            'rut' => $rut,
            'position' => $this->normalizeText($row['Cargo']),
            'sex' => $this->normalizeText($row['Sexo']),
            'cost_center' => $this->normalizeText($row['Centro de Costo']),
            'company' => $companyName,
            'supervisor_name' => $this->normalizeText($row['Nombre Supervisor']),
        ];
    }

    private function materializeNodeTree(string $nodeKey, array $nodes): array
    {
        $node = $nodes[$nodeKey];
        $children = array_map(
            fn (string $childKey) => $this->materializeNodeTree($childKey, $nodes),
            $node['children']
        );

        usort($children, fn (array $left, array $right) => strcmp($left['person']['name'], $right['person']['name']));

        return [
            'person' => $node['person'],
            'children' => $children,
        ];
    }

    private function normalizeHeaders(false|array $headers): array
    {
        if (! is_array($headers)) {
            return [];
        }

        return array_map(function (?string $header, int $index) {
            $normalized = (string) $header;

            if ($index === 0) {
                $normalized = preg_replace('/^\xEF\xBB\xBF/', '', $normalized) ?? $normalized;
            }

            return trim($normalized);
        }, $headers, array_keys($headers));
    }
}
