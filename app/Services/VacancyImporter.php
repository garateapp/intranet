<?php

namespace App\Services;

use App\Models\Stage;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Reader\CSV\Reader as CSVReader;
use OpenSpout\Reader\XLSX\Reader as XLSXReader;
use OpenSpout\Writer\XLSX\Writer;

/**
 * Importación masiva de vacantes a partir de una plantilla .xlsx/.csv.
 * La fila puede indicar una "cantidad" mayor a 1 para replicar la vacante.
 */
class VacancyImporter
{
    public const HEADERS = [
        'Título',
        'Descripción',
        'Responsabilidades',
        'Cualificaciones',
        'Tipo de Puesto',
        'Fecha de Inicio',
        'Salario',
        'Renta Líquida',
        'Estado',
        'Email Gerente de Contratación',
        'Cantidad',
        'Semana de Ingreso',
        'Año de Ingreso',
        'Semana de Salida',
        'Año de Salida',
    ];

    private const JOB_TYPES = ['full_time', 'part_time', 'contract', 'obra'];
    private const STATUSES = ['draft', 'active', 'closed'];
    private const MAX_CANTIDAD = 100;

    /**
     * Descarga una plantilla de ejemplo en .xlsx con encabezados y una fila de ejemplo.
     */
    public function generateTemplate(): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'vacantes_template_') . '.xlsx';

        $headerStyle = (new Style())->setFontBold();

        $writer = new Writer();
        $writer->openToFile($tempFile);

        $writer->addRow(Row::fromValues(self::HEADERS, $headerStyle));
        $writer->addRow(Row::fromValues([
            'Operario de Obra',
            'Ejecuta labores de construcción en obra.',
            'Cumplir metas diarias de producción.',
            'Experiencia mínima de 1 año.',
            'obra',
            '2026-09-14',
            '800000',
            '651000',
            'active',
            'jefe.obra@empresa.cl',
            '3',
            '37',
            '2026',
            '45',
            '2026',
        ]));

        $writer->close();

        return $tempFile;
    }

    /**
     * Procesa un archivo .xlsx/.csv y crea las vacantes en lotes.
     *
     * @return array{total_rows:int, created:int, errors:array<int,array{row:int,error:string}>}
     */
    public function import(UploadedFile $file, int $createdById, bool $allowRenta = true): array
    {
        $path = $file->getRealPath();
        $extension = strtolower($file->getClientOriginalExtension());

        $reader = match ($extension) {
            'xlsx' => new XLSXReader(),
            'csv' => new CSVReader(),
            default => throw new \InvalidArgumentException('El archivo debe ser .xlsx o .csv.'),
        };

        $managerIds = User::role('hiring_manager')->get()->pluck('id', 'email')
            ->mapWithKeys(fn ($id, $email) => [strtolower((string) $email) => $id])
            ->all();

        $defaultStages = Stage::default()->ordered()->get();

        $reader->open($path);

        $headerMap = [];
        $dataRows = [];
        $isFirstSheet = true;

        foreach ($reader->getSheetIterator() as $sheet) {
            if (! $isFirstSheet) {
                break;
            }
            $isFirstSheet = false;

            foreach ($sheet->getRowIterator() as $rowIndex => $row) {
                $values = $row->toArray();

                if ($rowIndex === 1) {
                    $headerMap = $this->buildHeaderMap($values);
                    continue;
                }

                if ($this->isEmptyRow($values)) {
                    continue;
                }

                $dataRows[] = ['rowIndex' => $rowIndex + 1, 'values' => $values];
            }
        }

        $reader->close();

        $errors = [];
        $created = 0;

        foreach ($dataRows as $dataRow) {
            $rowNumber = $dataRow['rowIndex'];
            $rowData = $this->mapRow($dataRow['values'], $headerMap);

            $validated = $this->validateRow($rowData, $managerIds, $rowNumber);

            if (! empty($validated['errors'])) {
                $errors[] = [
                    'row' => $rowNumber,
                    'error' => implode('; ', $validated['errors']),
                ];
                continue;
            }

            try {
                DB::transaction(function () use ($validated, $defaultStages, $createdById, $allowRenta, &$created) {
                    for ($i = 0; $i < $validated['cantidad']; $i++) {
                        $data = $validated['data'];

                        if (! $allowRenta) {
                            unset($data['renta_liquida']);
                        }

                        $vacancy = Vacancy::create([...$data, 'created_by' => $createdById]);

                        foreach ($defaultStages as $index => $stage) {
                            $vacancy->vacancyStages()->create([
                                'stage_id' => $stage->id,
                                'sort_order' => $index + 1,
                            ]);
                        }

                        $created++;
                    }
                });
            } catch (\Throwable $e) {
                $errors[] = [
                    'row' => $rowNumber,
                    'error' => 'No se pudo crear la vacante: ' . $e->getMessage(),
                ];
            }
        }

        return [
            'total_rows' => count($dataRows),
            'created' => $created,
            'errors' => $errors,
        ];
    }

    /**
     * Construye un mapa de nombre de columna (encabezado) a índice.
     */
    private function buildHeaderMap(array $values): array
    {
        $map = [];

        foreach ($values as $index => $value) {
            $header = $this->normalizeText((string) $value);

            if ($header === '') {
                continue;
            }

            $map[$header] = $index;
        }

        return $map;
    }

    /**
     * Convierte los valores crudos de la fila a un arreglo asociativo por columna.
     */
    private function mapRow(array $values, array $headerMap): array
    {
        $row = [];

        foreach (self::HEADERS as $header) {
            $row[$header] = isset($headerMap[$header]) ? ($values[$headerMap[$header]] ?? null) : null;
        }

        return $row;
    }

    /**
     * Valida una fila y devuelve los datos normalizados listos para persistir.
     *
     * @return array{errors:array<int,string>, data:array, cantidad:int}
     */
    private function validateRow(array $row, array $managerIds, int $rowNumber): array
    {
        $errors = [];
        $data = [];
        $cantidad = 1;

        $title = $this->normalizeText($row['Título']);
        $description = $this->normalizeText($row['Descripción']);
        $jobType = $this->normalizeText($row['Tipo de Puesto']);
        $status = $this->normalizeText($row['Estado']);
        $email = strtolower($this->normalizeText($row['Email Gerente de Contratación']));

        if ($title === '') {
            $errors[] = 'El título es obligatorio.';
        }
        if ($description === '') {
            $errors[] = 'La descripción es obligatoria.';
        }
        if (! in_array($jobType, self::JOB_TYPES, true)) {
            $errors[] = "El tipo de puesto \"{$jobType}\" no es válido. Valores permitidos: " . implode(', ', self::JOB_TYPES) . '.';
        }
        if ($status === '') {
            $status = 'draft';
        }
        if (! in_array($status, self::STATUSES, true)) {
            $errors[] = "El estado \"{$status}\" no es válido. Valores permitidos: " . implode(', ', self::STATUSES) . '.';
        }
        if ($email === '') {
            $errors[] = 'El email del gerente de contratación es obligatorio.';
        } elseif (! isset($managerIds[$email])) {
            $errors[] = "No existe un gerente de contratación con email \"{$email}\".";
        }

        $cantidadValue = $this->normalizeText($row['Cantidad']);
        if ($cantidadValue !== '') {
            if (! ctype_digit($cantidadValue) || (int) $cantidadValue < 1 || (int) $cantidadValue > self::MAX_CANTIDAD) {
                $errors[] = "La cantidad debe ser un entero entre 1 y " . self::MAX_CANTIDAD . '.';
            } else {
                $cantidad = (int) $cantidadValue;
            }
        }

        $salary = $this->parseNumber($row['Salario']);
        if ($this->hasValue($row['Salario']) && $salary === null) {
            $errors[] = 'El salario no es numérico.';
        }
        if ($salary !== null && $salary < 0) {
            $errors[] = 'El salario no puede ser negativo.';
        }

        $rentaLiquida = $this->parseNumber($row['Renta Líquida']);
        if ($this->hasValue($row['Renta Líquida']) && $rentaLiquida === null) {
            $errors[] = 'La renta líquida no es numérica.';
        }
        if ($rentaLiquida !== null && $rentaLiquida < 0) {
            $errors[] = 'La renta líquida no puede ser negativa.';
        }

        $startDate = $this->parseDate($row['Fecha de Inicio']);
        if ($this->hasValue($row['Fecha de Inicio']) && $startDate === null) {
            $errors[] = 'La fecha de inicio no es válida (use formato YYYY-MM-DD).';
        }

        $entryWeek = $this->normalizeText($row['Semana de Ingreso']);
        $entryYear = $this->normalizeText($row['Año de Ingreso']);
        $exitWeek = $this->normalizeText($row['Semana de Salida']);
        $exitYear = $this->normalizeText($row['Año de Salida']);

        if ($jobType === 'obra') {
            if ($entryWeek !== '' && ! $this->isValidWeek($entryWeek)) {
                $errors[] = 'La semana de ingreso debe ser un número entre 1 y 53.';
            }
            if ($entryYear !== '' && ! $this->isValidYear($entryYear)) {
                $errors[] = 'El año de ingreso debe tener 4 dígitos.';
            }
            if ($exitWeek !== '' && ! $this->isValidWeek($exitWeek)) {
                $errors[] = 'La semana de salida debe ser un número entre 1 y 53.';
            }
            if ($exitYear !== '' && ! $this->isValidYear($exitYear)) {
                $errors[] = 'El año de salida debe tener 4 dígitos.';
            }

            if ($this->isValidWeek($entryWeek) && $this->isValidWeek($exitWeek) && $this->isValidYear($entryYear) && $this->isValidYear($exitYear)) {
                $entry = (int) $entryYear * 100 + (int) $entryWeek;
                $exit = (int) $exitYear * 100 + (int) $exitWeek;

                if ($exit < $entry) {
                    $errors[] = 'La semana de salida debe ser posterior o igual a la semana de ingreso.';
                }
            }
        }

        if (! empty($errors)) {
            return ['errors' => $errors, 'data' => [], 'cantidad' => $cantidad];
        }

        $data = [
            'title' => $title,
            'description' => $description,
            'responsibilities' => $this->nullableText($row['Responsabilidades']),
            'qualifications' => $this->nullableText($row['Cualificaciones']),
            'job_type' => $jobType,
            'start_date' => $startDate,
            'salary' => $salary,
            'renta_liquida' => $rentaLiquida,
            'salary_currency' => 'CLP',
            'status' => $status,
            'hiring_manager_id' => $managerIds[$email],
            'created_by' => null,
        ];

        if ($jobType === 'obra') {
            if ($entryWeek !== '') {
                $data['entry_week'] = (int) $entryWeek;
                $data['entry_week_year'] = (int) $entryYear;
            }
            if ($exitWeek !== '') {
                $data['exit_week'] = (int) $exitWeek;
                $data['exit_week_year'] = (int) $exitYear;
            }
        }

        return ['errors' => [], 'data' => $data, 'cantidad' => $cantidad];
    }

    private function normalizeText(mixed $value): string
    {
        return trim((string) ($value ?? ''));
    }

    private function hasValue(mixed $value): bool
    {
        return $value !== null && $value !== '';
    }

    private function nullableText(mixed $value): ?string
    {
        $text = $this->normalizeText($value);

        return $text === '' ? null : $text;
    }

    private function isEmptyRow(array $values): bool
    {
        return count(array_filter($values, fn ($value) => $value !== null && $value !== '')) === 0;
    }

    /**
     * Parsea valores numéricos tolerando separadores chilenos (1.500.000 | 1500,50).
     */
    private function parseNumber(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_int($value) || is_float($value)) {
            return (float) $value;
        }

        $normalized = trim((string) $value);
        $normalized = str_replace(' ', '', $normalized);

        if (is_numeric($normalized)) {
            return (float) $normalized;
        }

        if (preg_match('/^-?\d{1,3}(\.\d{3})+(,\d{1,2})?$/', $normalized) === 1) {
            return (float) str_replace([',', '.'], ['.', ''], $normalized);
        }

        if (preg_match('/^-?\d+,\d{1,2}$/', $normalized) === 1) {
            return (float) str_replace(',', '.', $normalized);
        }

        return null;
    }

    private function parseDate(mixed $value): ?string
    {
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        $normalized = $this->normalizeText($value);

        if ($normalized === '') {
            return null;
        }

        $parsed = \DateTime::createFromFormat('Y-m-d', $normalized);

        if ($parsed === false || $parsed->format('Y-m-d') !== $normalized) {
            return null;
        }

        return $parsed->format('Y-m-d');
    }

    private function isValidWeek(string $value): bool
    {
        return ctype_digit($value) && (int) $value >= 1 && (int) $value <= 53;
    }

    private function isValidYear(string $value): bool
    {
        return preg_match('/^\d{4}$/', $value) === 1;
    }
}