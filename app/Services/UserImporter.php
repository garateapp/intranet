<?php

namespace App\Services;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Reader\CSV\Reader as CSVReader;
use OpenSpout\Reader\XLSX\Reader as XLSXReader;
use OpenSpout\Writer\XLSX\Writer;

/**
 * Importación masiva de usuarios a partir de una plantilla .xlsx/.csv.
 * La contraseña de cada usuario se genera automáticamente con el patrón:
 * Primera letra del Nombre (Mayúscula) + 123654 + Primera letra del Apellido (Mayúscula).
 */
class UserImporter
{
    public const HEADERS = [
        'Nombre',
        'Apellido',
        'Email',
        'Rol',
        'Departamento',
        'Cargo',
        'Teléfono',
        'Ubicación',
        'Jefe Directo (Email)',
        'Unidad Organizacional',
        'Visible en Directorio',
    ];

    private const ROLES = ['user', 'admin', 'recruiter', 'hiring_manager'];

    private const SUFFIX = '123654';

    /**
     * Genera la contraseña automática: Primera letra del Nombre + 123654 + Primera letra del Apellido.
     */
    public static function generatePassword(string $nombre, string $apellido): string
    {
        $primera = Str::upper(Str::substr(trim($nombre), 0, 1));
        $segunda = Str::upper(Str::substr(trim($apellido), 0, 1));

        return $primera.self::SUFFIX.$segunda;
    }

    /**
     * Descarga una plantilla de ejemplo en .xlsx con encabezados y una fila de ejemplo.
     */
    public function generateTemplate(): string
    {
        $tempFile = tempnam(sys_get_temp_dir(), 'usuarios_template_').'.xlsx';

        $headerStyle = (new Style)->setFontBold();

        $writer = new Writer;
        $writer->openToFile($tempFile);

        $writer->addRow(Row::fromValues(self::HEADERS, $headerStyle));
        $writer->addRow(Row::fromValues([
            'Juan',
            'Pérez',
            'juan.perez@empresa.cl',
            'user',
            'Operaciones',
            'Analista',
            '+56912345678',
            'Santiago',
            'jefe.directo@empresa.cl',
            'Administración',
            'Sí',
        ]));

        $writer->close();

        return $tempFile;
    }

    /**
     * Procesa un archivo .xlsx/.csv y crea los usuarios.
     *
     * @return array{total_rows:int, created:int, credentials:array<int,array{name:string,email:string,password:string}>, errors:array<int,array{row:int,error:string}>}
     */
    public function import(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        $extension = strtolower($file->getClientOriginalExtension());

        $reader = match ($extension) {
            'xlsx' => new XLSXReader,
            'csv' => new CSVReader,
            default => throw new \InvalidArgumentException('El archivo debe ser .xlsx o .csv.'),
        };

        $managerIds = User::query()->get(['id', 'email'])
            ->mapWithKeys(fn (User $user) => [strtolower((string) $user->email) => $user->id])
            ->all();

        $unitIds = OrganizationalUnit::query()->get(['id', 'name'])
            ->mapWithKeys(fn (OrganizationalUnit $unit) => [mb_strtolower($unit->name) => $unit->id])
            ->all();

        $existingEmails = User::query()->pluck('email')
            ->map(fn ($email) => strtolower((string) $email))
            ->all();

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
        $credentials = [];
        $created = 0;

        foreach ($dataRows as $dataRow) {
            $rowNumber = $dataRow['rowIndex'];
            $rowData = $this->mapRow($dataRow['values'], $headerMap);

            $validated = $this->validateRow($rowData, $managerIds, $unitIds, $existingEmails);

            if (! empty($validated['errors'])) {
                $errors[] = [
                    'row' => $rowNumber,
                    'error' => implode('; ', $validated['errors']),
                ];

                continue;
            }

            $data = $validated['data'];
            $password = $data['password'];

            try {
                $user = User::create($data);

                $existingEmails[] = strtolower($user->email);
                $credentials[] = [
                    'name' => $user->name,
                    'email' => $user->email,
                    'password' => $password,
                ];
                $created++;
            } catch (\Throwable $e) {
                $errors[] = [
                    'row' => $rowNumber,
                    'error' => 'No se pudo crear el usuario: '.$e->getMessage(),
                ];
            }
        }

        return [
            'total_rows' => count($dataRows),
            'created' => $created,
            'credentials' => $credentials,
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
     * @return array{errors:array<int,string>, data:array}
     */
    private function validateRow(array $row, array $managerIds, array $unitIds, array $existingEmails): array
    {
        $errors = [];

        $nombre = $this->normalizeText($row['Nombre']);
        $apellido = $this->normalizeText($row['Apellido']);
        $email = Str::lower($this->normalizeText($row['Email']));
        $role = Str::lower($this->normalizeText($row['Rol']));
        $managerEmail = Str::lower($this->normalizeText($row['Jefe Directo (Email)']));
        $unitName = $this->normalizeText($row['Unidad Organizacional']);

        if ($nombre === '') {
            $errors[] = 'El nombre es obligatorio.';
        }
        if ($apellido === '') {
            $errors[] = 'El apellido es obligatorio.';
        }
        if ($email === '') {
            $errors[] = 'El email es obligatorio.';
        } elseif (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $errors[] = "El email \"{$email}\" no es válido.";
        } elseif (in_array($email, $existingEmails, true)) {
            $errors[] = "El email \"{$email}\" ya está registrado.";
        }

        if ($role === '') {
            $role = 'user';
        }
        if (! in_array($role, self::ROLES, true)) {
            $errors[] = "El rol \"{$role}\" no es válido. Valores permitidos: ".implode(', ', self::ROLES).'.';
        }

        $managerId = null;
        if ($managerEmail !== '') {
            if (! isset($managerIds[$managerEmail])) {
                $errors[] = "No existe un usuario con email \"{$managerEmail}\" para asignar como jefe directo.";
            } else {
                $managerId = $managerIds[$managerEmail];
            }
        }

        $unitId = null;
        if ($unitName !== '') {
            if (! isset($unitIds[mb_strtolower($unitName)])) {
                $errors[] = "No existe la unidad organizacional \"{$unitName}\".";
            } else {
                $unitId = $unitIds[mb_strtolower($unitName)];
            }
        }

        $visibleValue = Str::lower($this->normalizeText($row['Visible en Directorio']));
        $isVisible = true;

        if ($visibleValue !== '' && ! in_array($visibleValue, ['sí', 'si', 's', '1', 'true', 'yes', 'y'], true)) {
            if (! in_array($visibleValue, ['no', 'n', '0', 'false'], true)) {
                $errors[] = 'El campo "Visible en Directorio" solo acepta Sí o No.';
            } else {
                $isVisible = false;
            }
        }

        if (! empty($errors)) {
            return ['errors' => $errors, 'data' => []];
        }

        return ['errors' => [], 'data' => [
            'name' => trim($nombre.' '.$apellido),
            'email' => $email,
            'password' => self::generatePassword($nombre, $apellido),
            'role' => $role,
            'department' => $this->nullableText($row['Departamento']),
            'position' => $this->nullableText($row['Cargo']),
            'phone' => $this->nullableText($row['Teléfono']),
            'location' => $this->nullableText($row['Ubicación']),
            'manager_id' => $managerId,
            'organizational_unit_id' => $unitId,
            'is_directory_visible' => $isVisible,
            'is_directory_featured' => false,
        ]];
    }

    private function normalizeText(mixed $value): string
    {
        return trim((string) ($value ?? ''));
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
}
