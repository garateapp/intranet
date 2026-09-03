<?php

namespace App\Services;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceAssociationStatus;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalResponsible;

class PurchaseInvoiceApprovalStateService
{
    public function __construct(private readonly EffectivePurchaseInvoiceResponsibleService $effectiveResponsible) {}

    public function recalculate(PurchaseInvoiceApproval $approval, bool $preserveFinalState = false): PurchaseInvoiceApprovalStatus
    {
        $previous = $approval->estado_aprobacion;

        if ($approval->factura_canceled !== 'Y'
            && $preserveFinalState
            && in_array($previous, [
                PurchaseInvoiceApprovalStatus::Approved,
                PurchaseInvoiceApprovalStatus::Objected,
            ], true)) {
            $approval->save();

            return $previous;
        }

        if ($approval->factura_canceled === 'Y') {
            $next = PurchaseInvoiceApprovalStatus::CancelledSap;
        } else {
            $responsibles = $approval->activeResponsibles()->get();
            $mapped = $responsibles->whereNotNull('user_id');
            $hasEffectiveResponsible = $this->effectiveResponsible->users($approval)->isNotEmpty();

            $next = match (true) {
                ! $hasEffectiveResponsible && in_array($approval->estado_asociacion, [
                    PurchaseInvoiceAssociationStatus::WithoutPurchaseOrder,
                    PurchaseInvoiceAssociationStatus::ManuallyAssignedPurchaseOrder,
                ], true) => PurchaseInvoiceApprovalStatus::PendingAssignment,
                ! $hasEffectiveResponsible => PurchaseInvoiceApprovalStatus::WithoutResponsible,
                $responsibles->contains(fn (PurchaseInvoiceApprovalResponsible $responsible): bool => $responsible->estado === PurchaseInvoiceResponsibleStatus::Objected
                ) => PurchaseInvoiceApprovalStatus::Objected,
                $responsibles->count() === $mapped->count()
                    && $responsibles->every(fn (PurchaseInvoiceApprovalResponsible $responsible): bool => $responsible->estado === PurchaseInvoiceResponsibleStatus::Approved
                    ) => PurchaseInvoiceApprovalStatus::Approved,
                default => PurchaseInvoiceApprovalStatus::Pending,
            };
        }

        $approval->estado_aprobacion = $next;

        if ($next === PurchaseInvoiceApprovalStatus::Approved) {
            $latest = $approval->activeResponsibles()->latest('aprobado_at')->first();
            $approval->aprobado_por = $latest?->user_id;
            $approval->aprobado_at = $latest?->aprobado_at ?? now();
        }

        if ($next === PurchaseInvoiceApprovalStatus::Objected) {
            $objected = $approval->activeResponsibles()
                ->where('estado', PurchaseInvoiceResponsibleStatus::Objected->value)
                ->latest('objetado_at')
                ->first();
            $approval->objetado_por = $objected?->user_id;
            $approval->objetado_at = $objected?->objetado_at ?? now();
            $approval->motivo_objecion_id = $objected?->motivo_objecion_id;
            $approval->comentario_objecion = $objected?->comentario_objecion;
        }

        $approval->save();

        return $next;
    }
}
