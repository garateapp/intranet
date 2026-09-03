<?php

namespace App\Http\Requests;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Laravel\Sanctum\PersonalAccessToken;
use Throwable;

class SyncPurchaseInvoiceApprovalsRequest extends FormRequest
{
    private const DATE_FIELDS = [
        'ocFecha',
        'entradaFecha',
        'facturaFecha',
        'facturaVencimiento',
    ];

    public function authorize(): bool
    {
        $token = $this->user()?->currentAccessToken();

        return $this->bearerToken() !== null
            && $token instanceof PersonalAccessToken
            && $token->can('sap:oc-approvals:sync');
    }

    public function rules(): array
    {
        return [
            'batchId' => ['required', 'string', 'max:100'],
            'fechaDesde' => ['required', 'date_format:Y-m-d'],
            'fechaHasta' => ['required', 'date_format:Y-m-d', 'after_or_equal:fechaDesde'],
            'registros' => ['required', 'array', 'min:1', 'max:500'],
            'registros.*.claveOrigen' => ['required', 'string', 'max:150', 'distinct'],
            'registros.*.rutaRelacion' => ['required', Rule::in(['DIRECTA_OC_FACTURA', 'OC_ENTRADA_FACTURA', 'SIN_OC'])],
            'registros.*.ocDocEntry' => ['nullable', 'integer'],
            'registros.*.ocDocNum' => ['nullable', 'integer'],
            'registros.*.ocCanceled' => ['nullable', Rule::in(['Y', 'N'])],
            'registros.*.ocStatus' => ['nullable', 'string', 'max:10'],
            'registros.*.ocFecha' => ['nullable', 'date_format:Y-m-d'],
            'registros.*.ownerCode' => ['nullable', 'integer'],
            'registros.*.ocComments' => ['nullable', 'string'],
            'registros.*.ocLineNum' => ['nullable', 'integer', 'min:0'],
            'registros.*.itemCode' => ['nullable', 'string', 'max:100'],
            'registros.*.acctCode' => ['nullable', 'string', 'max:100'],
            'registros.*.formatCode' => ['nullable', 'string', 'max:100'],
            'registros.*.acctName' => ['nullable', 'string', 'max:255'],
            'registros.*.dscription' => ['nullable', 'string'],
            'registros.*.cantidadOC' => ['nullable', 'numeric'],
            'registros.*.totalLineaOC' => ['nullable', 'numeric'],
            'registros.*.area' => ['nullable', 'string', 'max:50'],
            'registros.*.nombreArea' => ['nullable', 'string', 'max:255'],
            'registros.*.especie' => ['nullable', 'string', 'max:50'],
            'registros.*.nombreEspecie' => ['nullable', 'string', 'max:255'],
            'registros.*.entradaDocEntry' => ['nullable', 'integer'],
            'registros.*.entradaDocNum' => ['nullable', 'integer'],
            'registros.*.entradaLineNum' => ['nullable', 'integer', 'min:0'],
            'registros.*.entradaFecha' => ['nullable', 'date_format:Y-m-d'],
            'registros.*.facturaDocEntry' => ['required', 'integer'],
            'registros.*.facturaDocNum' => ['required', 'integer'],
            'registros.*.facturaTransId' => ['nullable', 'integer'],
            'registros.*.facturaFolioPref' => ['nullable', 'string', 'max:30'],
            'registros.*.facturaFolioNum' => ['nullable', 'integer'],
            'registros.*.facturaFecha' => ['required', 'date_format:Y-m-d'],
            'registros.*.facturaVencimiento' => ['nullable', 'date_format:Y-m-d'],
            'registros.*.facturaCanceled' => ['required', Rule::in(['Y', 'N'])],
            'registros.*.facturaMoneda' => ['required', 'string', 'max:10'],
            'registros.*.facturaTotal' => ['required', 'numeric'],
            'registros.*.cardCode' => ['required', 'string', 'max:50'],
            'registros.*.cardName' => ['required', 'string', 'max:255'],
            'registros.*.bplId' => ['nullable', 'integer'],
            'registros.*.facturaLineNum' => ['required', 'integer', 'min:0'],
            'registros.*.cantidadFactura' => ['nullable', 'numeric'],
            'registros.*.totalLineaFactura' => ['nullable', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'fechaDesde.date_format' => 'fechaDesde debe ser una fecha válida en formato ISO o yyyy-MM-dd.',
            'fechaHasta.date_format' => 'fechaHasta debe ser una fecha válida en formato ISO o yyyy-MM-dd.',
            'registros.*.ocFecha.date_format' => 'ocFecha debe ser una fecha válida en formato ISO o yyyy-MM-dd.',
            'registros.*.entradaFecha.date_format' => 'entradaFecha debe ser una fecha válida en formato ISO o yyyy-MM-dd.',
            'registros.*.facturaFecha.date_format' => 'facturaFecha debe ser una fecha válida en formato ISO o yyyy-MM-dd.',
            'registros.*.facturaVencimiento.date_format' => 'facturaVencimiento debe ser una fecha válida en formato ISO o yyyy-MM-dd.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $payload = $this->all();
        $payload['fechaDesde'] = $this->normalizeDate($payload['fechaDesde'] ?? null);
        $payload['fechaHasta'] = $this->normalizeDate($payload['fechaHasta'] ?? null);

        if (is_array($payload['registros'] ?? null)) {
            $payload['registros'] = array_map(function (mixed $record): mixed {
                if (! is_array($record)) {
                    return $record;
                }

                foreach (self::DATE_FIELDS as $field) {
                    if (array_key_exists($field, $record)) {
                        $record[$field] = $this->normalizeDate($record[$field]);
                    }
                }

                return $record;
            }, $payload['registros']);
        }

        $this->replace($payload);
    }

    private function normalizeDate(mixed $value): mixed
    {
        if (! is_string($value) || trim($value) === '') {
            return $value;
        }

        try {
            return CarbonImmutable::parse($value)->format('Y-m-d');
        } catch (Throwable) {
            return $value;
        }
    }
}
