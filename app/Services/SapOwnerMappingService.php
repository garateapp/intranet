<?php

namespace App\Services;

use App\Enums\PurchaseInvoiceHistoryEvent;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Models\PurchaseInvoiceApprovalHistory;
use App\Models\PurchaseInvoiceApprovalResponsible;
use App\Models\SapOwnerUser;
use Illuminate\Support\Facades\DB;

class SapOwnerMappingService
{
    public function __construct(private readonly PurchaseInvoiceApprovalStateService $stateService) {}

    public function save(int $ownerCode, ?int $userId, bool $active): SapOwnerUser
    {
        return DB::transaction(function () use ($ownerCode, $userId, $active): SapOwnerUser {
            $mapping = SapOwnerUser::query()->firstOrNew(['owner_code' => $ownerCode]);
            $previousUserId = $mapping->user_id;
            $previousActive = $mapping->exists ? $mapping->active : null;
            $mapping->fill(['user_id' => $userId, 'active' => $active])->save();

            if ($previousUserId !== $userId || $previousActive !== $active) {
                PurchaseInvoiceApprovalResponsible::query()
                    ->where('owner_code', $ownerCode)
                    ->where('active', true)
                    ->with('approval')
                    ->each(function (PurchaseInvoiceApprovalResponsible $responsible) use ($userId, $active, $ownerCode): void {
                        $oldUserId = $responsible->user_id;
                        $responsible->update([
                            'user_id' => $active ? $userId : null,
                            'estado' => PurchaseInvoiceResponsibleStatus::Pending,
                            'aprobado_at' => null,
                            'objetado_at' => null,
                            'motivo_objecion_id' => null,
                            'comentario_objecion' => null,
                        ]);

                        if ($responsible->approval->owner_code === $ownerCode) {
                            $responsible->approval->responsible_user_id = $active ? $userId : null;
                        }

                        $previous = $responsible->approval->estado_aprobacion;
                        $next = $this->stateService->recalculate($responsible->approval);
                        PurchaseInvoiceApprovalHistory::create([
                            'purchase_invoice_approval_id' => $responsible->approval->id,
                            'evento' => ($oldUserId === null
                                ? PurchaseInvoiceHistoryEvent::ResponsibleAssigned
                                : PurchaseInvoiceHistoryEvent::ResponsibleChanged)->value,
                            'estado_anterior' => $previous->value,
                            'estado_nuevo' => $next->value,
                            'metadata' => [
                                'owner_code' => $ownerCode,
                                'previous_user_id' => $oldUserId,
                                'user_id' => $active ? $userId : null,
                                'source' => 'admin_mapping',
                            ],
                        ]);
                    });
            }

            return $mapping;
        });
    }
}
