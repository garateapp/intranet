<?php

namespace App\Services;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceAssociationStatus;
use App\Enums\PurchaseInvoiceHistoryEvent;
use App\Enums\PurchaseInvoiceResponsibleSource;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalHistory;
use App\Models\PurchaseInvoiceApprovalResponsible;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ManualPurchaseInvoiceAssignmentService
{
    public function __construct(private readonly PurchaseInvoiceApprovalStateService $stateService) {}

    public function assignResponsible(PurchaseInvoiceApproval $approval, User $responsibleUser, User $actor, ?string $comment): void
    {
        DB::transaction(function () use ($approval, $responsibleUser, $actor, $comment): void {
            $locked = PurchaseInvoiceApproval::query()->lockForUpdate()->findOrFail($approval->id);
            $this->ensureAssignable($locked);
            $previousUserId = $locked->manual_responsible_user_id;
            $previousState = $locked->estado_aprobacion;

            $locked->responsibles()
                ->whereIn('source', [
                    PurchaseInvoiceResponsibleSource::SapOwner->value,
                    PurchaseInvoiceResponsibleSource::Substitute->value,
                ])
                ->update(['active' => false]);

            $manual = $locked->responsibles()
                ->where('source', PurchaseInvoiceResponsibleSource::Manual->value)
                ->first() ?? new PurchaseInvoiceApprovalResponsible([
                    'purchase_invoice_approval_id' => $locked->id,
                    'owner_code' => null,
                    'source' => PurchaseInvoiceResponsibleSource::Manual,
                ]);
            $manual->fill([
                'user_id' => $responsibleUser->id,
                'estado' => PurchaseInvoiceResponsibleStatus::Pending,
                'active' => true,
                'aprobado_at' => null,
                'objetado_at' => null,
                'motivo_objecion_id' => null,
                'comentario_objecion' => null,
            ])->save();

            $locked->fill([
                'manual_responsible_user_id' => $responsibleUser->id,
                'substitute_user_id' => null,
                'substitute_assigned_by' => null,
                'substitute_assigned_at' => null,
                'substitute_comment' => null,
                'responsible_user_id' => $responsibleUser->id,
                'responsible_source' => PurchaseInvoiceResponsibleSource::Manual,
                'assigned_by' => $actor->id,
                'assigned_at' => now(),
                'assignment_comment' => $comment,
                'aprobado_por' => null,
                'aprobado_at' => null,
                'objetado_por' => null,
                'objetado_at' => null,
                'motivo_objecion_id' => null,
                'comentario_objecion' => null,
            ])->save();

            $next = $this->stateService->recalculate($locked);
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $locked->id,
                'evento' => ($previousUserId === null
                    ? PurchaseInvoiceHistoryEvent::ResponsibleManuallyAssigned
                    : PurchaseInvoiceHistoryEvent::ManualResponsibleChanged)->value,
                'estado_anterior' => $previousState->value,
                'estado_nuevo' => $next->value,
                'user_id' => $actor->id,
                'comentario' => $comment,
                'metadata' => [
                    'previous_user_id' => $previousUserId,
                    'new_user_id' => $responsibleUser->id,
                ],
            ]);
        });
    }

    public function assignSubstitute(PurchaseInvoiceApproval $approval, User $substitute, User $actor, ?string $comment): void
    {
        DB::transaction(function () use ($approval, $substitute, $actor, $comment): void {
            $locked = PurchaseInvoiceApproval::query()->lockForUpdate()->findOrFail($approval->id);
            $this->ensureAssignable($locked);
            $previousUserId = $locked->substitute_user_id;
            $previousState = $locked->estado_aprobacion;

            if ($locked->activeResponsibles()->where('user_id', $substitute->id)->exists()) {
                throw ValidationException::withMessages(['user_id' => 'El usuario seleccionado ya es responsable activo de esta factura.']);
            }

            $locked->responsibles()->update(['active' => false]);
            $responsible = $locked->responsibles()
                ->where('source', PurchaseInvoiceResponsibleSource::Substitute->value)
                ->first() ?? new PurchaseInvoiceApprovalResponsible([
                    'purchase_invoice_approval_id' => $locked->id,
                    'owner_code' => null,
                    'source' => PurchaseInvoiceResponsibleSource::Substitute,
                ]);
            $responsible->fill([
                'user_id' => $substitute->id,
                'estado' => PurchaseInvoiceResponsibleStatus::Pending,
                'active' => true,
                'aprobado_at' => null,
                'objetado_at' => null,
                'motivo_objecion_id' => null,
                'comentario_objecion' => null,
            ])->save();

            $locked->fill([
                'substitute_user_id' => $substitute->id,
                'substitute_assigned_by' => $actor->id,
                'substitute_assigned_at' => now(),
                'substitute_comment' => $comment,
                'responsible_user_id' => $substitute->id,
                'responsible_source' => PurchaseInvoiceResponsibleSource::Substitute,
                'aprobado_por' => null,
                'aprobado_at' => null,
                'objetado_por' => null,
                'objetado_at' => null,
                'motivo_objecion_id' => null,
                'comentario_objecion' => null,
            ])->save();

            $next = $this->stateService->recalculate($locked);
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $locked->id,
                'evento' => ($previousUserId === null
                    ? PurchaseInvoiceHistoryEvent::SubstituteAssigned
                    : PurchaseInvoiceHistoryEvent::SubstituteChanged)->value,
                'estado_anterior' => $previousState->value,
                'estado_nuevo' => $next->value,
                'user_id' => $actor->id,
                'comentario' => $comment,
                'metadata' => [
                    'previous_user_id' => $previousUserId,
                    'new_user_id' => $substitute->id,
                ],
            ]);
        });
    }

    public function assignPurchaseOrder(
        PurchaseInvoiceApproval $approval,
        int $documentNumber,
        ?int $documentEntry,
        User $actor,
        ?string $comment,
    ): void {
        DB::transaction(function () use ($approval, $documentNumber, $documentEntry, $actor, $comment): void {
            $locked = PurchaseInvoiceApproval::query()->lockForUpdate()->findOrFail($approval->id);
            $this->ensureAssignable($locked);
            $previous = [
                'doc_entry' => $locked->manual_oc_doc_entry,
                'doc_num' => $locked->manual_oc_doc_num,
            ];
            $hasSapPurchaseOrder = $locked->lines()->whereNotNull('oc_doc_entry')->exists();

            $locked->fill([
                'manual_oc_doc_entry' => $documentEntry,
                'manual_oc_doc_num' => $documentNumber,
                'estado_asociacion' => $hasSapPurchaseOrder
                    ? PurchaseInvoiceAssociationStatus::SapPurchaseOrder
                    : PurchaseInvoiceAssociationStatus::ManuallyAssignedPurchaseOrder,
                'association_conflict' => $hasSapPurchaseOrder,
                'preferred_oc_source' => $hasSapPurchaseOrder ? null : 'MANUAL',
                'assigned_by' => $actor->id,
                'assigned_at' => now(),
                'assignment_comment' => $comment,
            ])->save();

            $this->stateService->recalculate($locked, preserveFinalState: true);
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $locked->id,
                'evento' => ($previous['doc_num'] === null
                    ? PurchaseInvoiceHistoryEvent::PurchaseOrderManuallyAssigned
                    : PurchaseInvoiceHistoryEvent::ManualPurchaseOrderChanged)->value,
                'estado_anterior' => $approval->estado_aprobacion->value,
                'estado_nuevo' => $locked->estado_aprobacion->value,
                'user_id' => $actor->id,
                'comentario' => $comment,
                'metadata' => [
                    'previous' => $previous,
                    'new' => ['doc_entry' => $documentEntry, 'doc_num' => $documentNumber],
                ],
            ]);
        });
    }

    public function reconcile(PurchaseInvoiceApproval $approval, string $preference, User $actor, ?string $comment): void
    {
        DB::transaction(function () use ($approval, $preference, $actor, $comment): void {
            $locked = PurchaseInvoiceApproval::query()->lockForUpdate()->findOrFail($approval->id);
            if (! $locked->association_conflict || $locked->manual_oc_doc_num === null
                || ! $locked->lines()->whereNotNull('oc_doc_entry')->exists()) {
                throw ValidationException::withMessages(['association' => 'La factura no tiene una asociación pendiente de reconciliar.']);
            }

            $previous = $locked->preferred_oc_source;
            $locked->update([
                'preferred_oc_source' => $preference,
                'association_conflict' => false,
            ]);
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $locked->id,
                'evento' => PurchaseInvoiceHistoryEvent::AssociationReconciled->value,
                'estado_anterior' => $locked->estado_aprobacion->value,
                'estado_nuevo' => $locked->estado_aprobacion->value,
                'user_id' => $actor->id,
                'comentario' => $comment,
                'metadata' => ['previous_preference' => $previous, 'new_preference' => $preference],
            ]);
        });
    }

    private function ensureAssignable(PurchaseInvoiceApproval $approval): void
    {
        if ($approval->factura_canceled === 'Y'
            || $approval->estado_aprobacion === PurchaseInvoiceApprovalStatus::CancelledSap) {
            throw ValidationException::withMessages(['invoice' => 'No se puede asignar una factura cancelada en SAP.']);
        }
    }
}
