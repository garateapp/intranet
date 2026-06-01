<?php

namespace App\Services;

use App\Models\OrganizationalUnit;
use Illuminate\Support\Str;

class OrganizationalUnitCsvImporter
{
    protected array $results = [
        'created' => 0,
        'updated' => 0,
        'skipped' => 0,
        'errors' => [],
    ];

    protected array $createdUnits = [];

    public function import(string $csvContents): array
    {
        $lines = explode("\n", str_replace(["\r\n", "\r"], "\n", $csvContents));
        $lines = array_filter($lines, fn($line) => trim($line) !== '');
        $lines = array_values($lines);

        if (empty($lines)) {
            throw new \InvalidArgumentException('El archivo CSV está vacío.');
        }

        // Detect delimiter: count semicolons vs commas in the header row
        $delimiter = ',';
        $semicolonCount = substr_count($lines[0], ';');
        $commaCount = substr_count($lines[0], ',');
        if ($semicolonCount > $commaCount) {
            $delimiter = ';';
        }

        $headers = str_getcsv($lines[0], $delimiter);
        $headers = array_map('trim', $headers);
        $headers = array_map('strtolower', $headers);

        $rows = [];

        $requiredFields = ['name'];
        $missing = array_diff($requiredFields, $headers);
        if (!empty($missing)) {
            throw new \InvalidArgumentException(
                'Faltan campos requeridos: ' . implode(', ', $missing) . '. Los campos deben incluir al menos: name'
            );
        }

        $rows = [];
        for ($i = 1; $i < count($lines); $i++) {
            $data = str_getcsv($lines[$i], $delimiter);
            $row = [];
            foreach ($headers as $index => $header) {
                $row[$header] = trim($data[$index] ?? '');
            }
            $rows[] = $row;
        }

        // First pass: create all units without parent relationships
        foreach ($rows as $index => $row) {
            $name = $row['name'];
            if (empty($name)) {
                $this->results['errors'][] = "Fila " . ($index + 2) . ": nombre vacío, se omitió.";
                $this->results['skipped']++;
                continue;
            }

            $existingUnit = OrganizationalUnit::where('slug', Str::slug($name))->first();

            if ($existingUnit) {
                $this->updateUnit($existingUnit, $row, $index);
            } else {
                $this->createUnit($row, $index);
            }
        }

        // Second pass: assign parent relationships
        foreach ($rows as $index => $row) {
            $name = $row['name'];
            if (empty($name)) continue;

            $unit = $this->findUnit($name);
            if (!$unit) continue;

            if (!empty($row['parent'])) {
                $parent = $this->findUnit($row['parent']);
                if ($parent) {
                    if ($parent->id === $unit->id) {
                        $this->results['errors'][] = "Fila " . ($index + 2) . ": '{$name}' no puede ser padre de sí mismo.";
                        continue;
                    }
                    $unit->parent_id = $parent->id;
                    $unit->save();
                } else {
                    $this->results['errors'][] = "Fila " . ($index + 2) . ": padre '{$row['parent']}' no encontrado para '{$name}'.";
                }
            }
        }

        return $this->results;
    }

    protected function createUnit(array $row, int $index): void
    {
        $name = $row['name'];

        $data = [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $row['description'] ?? null,
            'sort_order' => (!empty($row['sort_order']) && is_numeric($row['sort_order'])) ? (int) $row['sort_order'] : 0,
            'is_active' => $this->parseBool($row['is_active'] ?? 'true'),
        ];

        // Ensure unique slug
        $slug = $data['slug'];
        $counter = 1;
        while (OrganizationalUnit::where('slug', $slug)->exists()) {
            $slug = $data['slug'] . '-' . $counter++;
        }
        $data['slug'] = $slug;

        try {
            $unit = OrganizationalUnit::create($data);
            $this->createdUnits[Str::slug($name)] = $unit;
            $this->results['created']++;
        } catch (\Exception $e) {
            $this->results['errors'][] = "Fila " . ($index + 2) . ": error al crear '{$name}': " . $e->getMessage();
            $this->results['skipped']++;
        }
    }

    protected function updateUnit(OrganizationalUnit $unit, array $row, int $index): void
    {
        $data = [];

        if (isset($row['description']) && $row['description'] !== '') {
            $data['description'] = $row['description'];
        }
        if (!empty($row['sort_order']) && is_numeric($row['sort_order'])) {
            $data['sort_order'] = (int) $row['sort_order'];
        }
        if (isset($row['is_active']) && $row['is_active'] !== '') {
            $data['is_active'] = $this->parseBool($row['is_active']);
        }

        if (!empty($data)) {
            $unit->update($data);
            $this->results['updated']++;
        } else {
            $this->results['skipped']++;
        }

        $this->createdUnits[Str::slug($unit->name)] = $unit;
    }

    protected function findUnit(string $name): ?OrganizationalUnit
    {
        $slug = Str::slug($name);

        if (isset($this->createdUnits[$slug])) {
            return $this->createdUnits[$slug];
        }

        $unit = OrganizationalUnit::where('slug', $slug)->first();
        if ($unit) {
            $this->createdUnits[$slug] = $unit;
            return $unit;
        }

        return null;
    }

    protected function parseBool(string $value): bool
    {
        return in_array(strtolower($value), ['1', 'true', 'yes', 'sí', 'si', 'activo']);
    }
}
