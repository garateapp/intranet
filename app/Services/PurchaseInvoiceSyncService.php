<?php

namespace App\Services;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceAssociationStatus;
use App\Enums\PurchaseInvoiceHistoryEvent;
use App\Enums\PurchaseInvoiceResponsibleSource;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalHistory;
use App\Models\PurchaseInvoiceApprovalLine;
use App\Models\PurchaseInvoiceSyncBatch;
use App\Models\SapOwnerUser;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PurchaseInvoiceSyncService
{
    private const HEADER_MAP = [
        'facturaDocEntry' => 'factura_doc_entry',
        'facturaDocNum' => 'factura_doc_num',
        'facturaTransId' => 'factura_trans_id',
        'facturaFolioPref' => 'factura_folio_pref',
        'facturaFolioNum' => 'factura_folio_num',
        'facturaFecha' => 'factura_fecha',
        'facturaVencimiento' => 'factura_vencimiento',
        'facturaCanceled' => 'factura_canceled',
        'facturaMoneda' => 'factura_moneda',
        'facturaTotal' => 'factura_total',
        'cardCode' => 'card_code',
        'cardName' => 'card_name',
        'bplId' => 'bpl_id',
    ];

    private const LINE_MAP = [
        'claveOrigen' => 'clave_origen',
        'rutaRelacion' => 'ruta_relacion',
        'ownerCode' => 'owner_code',
        'ocDocEntry' => 'oc_doc_entry',
        'ocDocNum' => 'oc_doc_num',
        'ocLineNum' => 'oc_line_num',
        'ocCanceled' => 'oc_canceled',
        'ocStatus' => 'oc_status',
        'ocFecha' => 'oc_fecha',
        'ocComments' => 'oc_comments',
        'itemCode' => 'item_code',
        'acctCode' => 'acct_code',
        'formatCode' => 'format_code',
        'acctName' => 'acct_name',
        'dscription' => 'description',
        'cantidadOC' => 'cantidad_oc',
        'totalLineaOC' => 'total_linea_oc',
        'area' => 'area',
        'nombreArea' => 'nombre_area',
        'especie' => 'especie',
        'nombreEspecie' => 'nombre_especie',
        'entradaDocEntry' => 'entrada_doc_entry',
        'entradaDocNum' => 'entrada_doc_num',
        'entradaLineNum' => 'entrada_line_num',
        'entradaFecha' => 'entrada_fecha',
        'facturaLineNum' => 'factura_line_num',
        'cantidadFactura' => 'cantidad_factura',
        'totalLineaFactura' => 'total_linea_factura',
    ];

    public function __construct(private readonly PurchaseInvoiceApprovalStateService $stateService) {}

    /** @param array{batchId:string,fechaDesde:string,fechaHasta:string,registros:array<int,array<string,mixed>>} $payload */
    public function sync(array $payload): array
    {
        $records = collect($payload['registros']);
        $existingKeys = PurchaseInvoiceApprovalLine::query()
            ->whereIn('clave_origen', $records->pluck('claveOrigen'))
            ->pluck('purchase_invoice_approval_id', 'clave_origen');

        $batch = PurchaseInvoiceSyncBatch::create([
            'batch_id' => $payload['batchId'],
            'fecha_desde' => $payload['fechaDesde'],
            'fecha_hasta' => $payload['fechaHasta'],
            'received' => $records->count(),
        ]);

        Log::info('Batch SAP de aprobación de facturas recibido.', [
            'batch_id' => $payload['batchId'],
            'records' => $records->count(),
            'invoices' => $records->pluck('facturaDocEntry')->unique()->count(),
        ]);

        try {
            DB::transaction(function () use ($records, $payload, $existingKeys): void {
                foreach ($records->groupBy('facturaDocEntry') as $docEntry => $invoiceRecords) {
                    $this->syncInvoice((int) $docEntry, $invoiceRecords, $payload['batchId'], $existingKeys);
                }
            });

            $inserted = $records->pluck('claveOrigen')->reject(fn (string $key): bool => $existingKeys->has($key))->count();
            $updated = $records->count() - $inserted;

            $batch->update([
                'inserted' => $inserted,
                'updated' => $updated,
                'completed_at' => now(),
            ]);

            Log::info('Batch SAP de aprobación de facturas completado.', [
                'batch_id' => $payload['batchId'],
                'received' => $records->count(),
                'invoices' => $records->pluck('facturaDocEntry')->unique()->count(),
                'inserted' => $inserted,
                'updated' => $updated,
                'errors' => 0,
            ]);

            return [
                'success' => true,
                'batchId' => $payload['batchId'],
                'received' => $records->count(),
                'inserted' => $inserted,
                'updated' => $updated,
                'errors' => 0,
            ];
        } catch (\Throwable $exception) {
            $batch->update([
                'errors' => $records->count(),
                'error_details' => [['message' => $exception->getMessage()]],
                'completed_at' => now(),
            ]);

            Log::error('Falló batch SAP de aprobación de facturas.', [
                'batch_id' => $payload['batchId'],
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    /** @param Collection<int,array<string,mixed>> $records */
    private function syncInvoice(int $docEntry, Collection $records, string $batchId, Collection $existingKeys): void
    {
        $first = $records->first();
        $approval = PurchaseInvoiceApproval::query()->where('factura_doc_entry', $docEntry)->first();
        $isNew = $approval === null;
        $previousAssociation = $approval?->estado_asociacion;
        $header = $this->map($first, self::HEADER_MAP) + [
            'last_batch_id' => $batchId,
            'fecha_ultima_sincronizacion' => now(),
        ];

        if ($isNew) {
            $approval = PurchaseInvoiceApproval::create($header + [
                'estado_aprobacion' => PurchaseInvoiceApprovalStatus::Pending,
                'fecha_primera_sincronizacion' => now(),
            ]);
            $changed = array_keys($header);
        } else {
            $approval->fill($header);
            $changed = array_keys($approval->getDirty());
            $approval->save();
        }

        $this->guardLineOwnership($approval, $records, $existingKeys);

        $now = now();
        $lineRows = $records->map(fn (array $record): array => $this->map($record, self::LINE_MAP) + [
            'purchase_invoice_approval_id' => $approval->id,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        PurchaseInvoiceApprovalLine::upsert(
            $lineRows,
            ['clave_origen'],
            array_merge(['purchase_invoice_approval_id'], array_values(self::LINE_MAP), ['updated_at'])
        );

        $hasSapPurchaseOrder = $records->contains(fn (array $record): bool => $record['rutaRelacion'] !== 'SIN_OC' || ($record['ocDocEntry'] ?? null) !== null
        );
        $association = match (true) {
            $hasSapPurchaseOrder => PurchaseInvoiceAssociationStatus::SapPurchaseOrder,
            $approval->manual_oc_doc_num !== null => PurchaseInvoiceAssociationStatus::ManuallyAssignedPurchaseOrder,
            default => PurchaseInvoiceAssociationStatus::WithoutPurchaseOrder,
        };
        $sapPurchaseOrderDetectedLater = ! $isNew
            && $hasSapPurchaseOrder
            && $previousAssociation !== PurchaseInvoiceAssociationStatus::SapPurchaseOrder;

        $approval->estado_asociacion = $association;
        if ($sapPurchaseOrderDetectedLater && $approval->manual_oc_doc_num !== null) {
            $approval->association_conflict = true;
            $approval->preferred_oc_source = null;
        }
        $approval->save();

        $ownerCodes = $records->pluck('ownerCode')->filter(fn ($value): bool => $value !== null)->unique()->values();
        $this->syncResponsibles($approval, $ownerCodes);

        $singleOwner = $ownerCodes->count() === 1 ? (int) $ownerCodes->first() : null;
        $mapping = $singleOwner === null ? null : SapOwnerUser::query()
            ->where('owner_code', $singleOwner)->where('active', true)->first();
        $approval->owner_code = $singleOwner;
        if ($approval->manual_responsible_user_id === null && $approval->substitute_user_id === null) {
            $approval->responsible_user_id = $mapping?->user_id;
            $approval->responsible_source = $mapping?->user_id
                ? PurchaseInvoiceResponsibleSource::SapOwner
                : null;
        }
        $approval->save();

        $previousState = $approval->estado_aprobacion;
        $nextState = $this->stateService->recalculate($approval, preserveFinalState: true);

        PurchaseInvoiceApprovalHistory::create([
            'purchase_invoice_approval_id' => $approval->id,
            'evento' => ($isNew
                ? PurchaseInvoiceHistoryEvent::CreatedFromSap
                : PurchaseInvoiceHistoryEvent::UpdatedFromSap)->value,
            'estado_anterior' => $isNew ? null : $previousState->value,
            'estado_nuevo' => $nextState->value,
            'metadata' => [
                'batch_id' => $batchId,
                'changed_fields' => $changed,
                'line_count' => $records->count(),
            ],
        ]);

        if ($isNew && ! $hasSapPurchaseOrder) {
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $approval->id,
                'evento' => PurchaseInvoiceHistoryEvent::ReceivedWithoutPurchaseOrder->value,
                'estado_nuevo' => $nextState->value,
                'metadata' => ['batch_id' => $batchId],
            ]);
        }

        if ($sapPurchaseOrderDetectedLater) {
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $approval->id,
                'evento' => PurchaseInvoiceHistoryEvent::SapPurchaseOrderDetectedLater->value,
                'estado_anterior' => $previousState->value,
                'estado_nuevo' => $nextState->value,
                'metadata' => [
                    'batch_id' => $batchId,
                    'sap_purchase_orders' => $records->pluck('ocDocNum')->filter()->unique()->values()->all(),
                    'manual_oc_doc_entry' => $approval->manual_oc_doc_entry,
                    'manual_oc_doc_num' => $approval->manual_oc_doc_num,
                ],
            ]);
        }

        if ($approval->factura_canceled === 'Y' && $previousState !== PurchaseInvoiceApprovalStatus::CancelledSap) {
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $approval->id,
                'evento' => PurchaseInvoiceHistoryEvent::DocumentCancelledSap->value,
                'estado_anterior' => $previousState->value,
                'estado_nuevo' => PurchaseInvoiceApprovalStatus::CancelledSap->value,
                'metadata' => ['batch_id' => $batchId],
            ]);
        }
    }

    private function syncResponsibles(PurchaseInvoiceApproval $approval, Collection $ownerCodes): void
    {
        $mappings = SapOwnerUser::query()->whereIn('owner_code', $ownerCodes)->where('active', true)->get()->keyBy('owner_code');

        $sapResponsibles = $approval->responsibles()
            ->where('source', PurchaseInvoiceResponsibleSource::SapOwner->value);
        (clone $sapResponsibles)->whereNotIn('owner_code', $ownerCodes)->update(['active' => false]);

        foreach ($ownerCodes as $ownerCode) {
            $mapping = $mappings->get($ownerCode);
            $responsible = $approval->responsibles()->firstOrNew([
                'owner_code' => $ownerCode,
                'source' => PurchaseInvoiceResponsibleSource::SapOwner,
            ]);
            $wasNew = ! $responsible->exists;
            $oldUserId = $responsible->user_id;

            if ($wasNew) {
                $responsible->estado = PurchaseInvoiceResponsibleStatus::Pending;
            } elseif ($oldUserId !== $mapping?->user_id) {
                $responsible->estado = PurchaseInvoiceResponsibleStatus::Pending;
                $responsible->aprobado_at = null;
                $responsible->objetado_at = null;
                $responsible->motivo_objecion_id = null;
                $responsible->comentario_objecion = null;
            }

            $responsible->user_id = $mapping?->user_id;
            $responsible->active = $approval->manual_responsible_user_id === null
                && $approval->substitute_user_id === null;
            $responsible->save();

            if ($wasNew || $oldUserId !== $responsible->user_id) {
                PurchaseInvoiceApprovalHistory::create([
                    'purchase_invoice_approval_id' => $approval->id,
                    'evento' => ($wasNew
                        ? PurchaseInvoiceHistoryEvent::ResponsibleAssigned
                        : PurchaseInvoiceHistoryEvent::ResponsibleChanged)->value,
                    'metadata' => [
                        'owner_code' => $ownerCode,
                        'previous_user_id' => $oldUserId,
                        'user_id' => $responsible->user_id,
                    ],
                ]);
            }
        }
    }

    private function guardLineOwnership(PurchaseInvoiceApproval $approval, Collection $records, Collection $existingKeys): void
    {
        foreach ($records as $record) {
            $existingApprovalId = $existingKeys->get($record['claveOrigen']);
            if ($existingApprovalId !== null && (int) $existingApprovalId !== $approval->id) {
                throw ValidationException::withMessages([
                    'registros' => ["La clave {$record['claveOrigen']} ya pertenece a otra factura."],
                ]);
            }
        }
    }

    /** @param array<string,mixed> $source @param array<string,string> $map */
    private function map(array $source, array $map): array
    {
        return collect($map)->mapWithKeys(fn (string $target, string $origin): array => [
            $target => Arr::get($source, $origin),
        ])->all();
    }
}
