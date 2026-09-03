<?php

namespace App\Services;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceHistoryEvent;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use App\Jobs\SendPurchaseInvoiceWorkflowEmail;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalAttachment;
use App\Models\PurchaseInvoiceApprovalHistory;
use App\Models\PurchaseInvoiceApprovalResponsible;
use App\Models\PurchaseInvoiceObjectionReason;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class PurchaseInvoiceDecisionService
{
    public function __construct(private readonly PurchaseInvoiceApprovalStateService $stateService) {}

    /** @param array<int, UploadedFile> $attachments */
    public function approve(PurchaseInvoiceApproval $approval, User $user, array $attachments = []): void
    {
        $storedPaths = [];

        try {
            DB::transaction(function () use ($approval, $user, $attachments, &$storedPaths): void {
                $lockedApproval = PurchaseInvoiceApproval::query()->lockForUpdate()->findOrFail($approval->id);
                $responsible = $this->pendingResponsible($lockedApproval, $user);
                $previous = $lockedApproval->estado_aprobacion;

                $responsible->update([
                    'estado' => PurchaseInvoiceResponsibleStatus::Approved,
                    'aprobado_at' => now(),
                    'objetado_at' => null,
                    'motivo_objecion_id' => null,
                    'comentario_objecion' => null,
                ]);

                $attachmentIds = collect($attachments)->map(function (UploadedFile $file) use ($lockedApproval, $responsible, $user, &$storedPaths): int {
                    $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'bin');
                    $directory = 'purchase-invoice-approvals/'.$lockedApproval->id;
                    $filename = Str::uuid().'.'.$extension;
                    $path = $file->storeAs($directory, $filename, 'local');
                    if ($path === false) {
                        throw new RuntimeException('No fue posible almacenar el respaldo de aprobación.');
                    }
                    $storedPaths[] = $path;

                    return PurchaseInvoiceApprovalAttachment::create([
                        'purchase_invoice_approval_id' => $lockedApproval->id,
                        'purchase_invoice_approval_responsible_id' => $responsible->id,
                        'uploaded_by' => $user->id,
                        'disk' => 'local',
                        'path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                    ])->id;
                })->all();

                $next = $this->stateService->recalculate($lockedApproval);
                PurchaseInvoiceApprovalHistory::create([
                    'purchase_invoice_approval_id' => $lockedApproval->id,
                    'evento' => PurchaseInvoiceHistoryEvent::Approved->value,
                    'estado_anterior' => $previous->value,
                    'estado_nuevo' => $next->value,
                    'user_id' => $user->id,
                    'metadata' => [
                        'owner_code' => $responsible->owner_code,
                        'responsible_source' => $responsible->source->value,
                        'attachment_ids' => $attachmentIds,
                    ],
                ]);

                if ($attachmentIds !== []) {
                    PurchaseInvoiceApprovalHistory::create([
                        'purchase_invoice_approval_id' => $lockedApproval->id,
                        'evento' => PurchaseInvoiceHistoryEvent::ApprovalAttachmentAdded->value,
                        'estado_anterior' => $next->value,
                        'estado_nuevo' => $next->value,
                        'user_id' => $user->id,
                        'metadata' => ['attachment_ids' => $attachmentIds, 'count' => count($attachmentIds)],
                    ]);
                }
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($storedPaths);

            throw $exception;
        }
    }

    public function object(
        PurchaseInvoiceApproval $approval,
        User $user,
        PurchaseInvoiceObjectionReason $reason,
        string $comment,
    ): void {
        DB::transaction(function () use ($approval, $user, $reason, $comment): void {
            $lockedApproval = PurchaseInvoiceApproval::query()->lockForUpdate()->findOrFail($approval->id);
            $responsible = $this->pendingResponsible($lockedApproval, $user);
            $previous = $lockedApproval->estado_aprobacion;

            $responsible->update([
                'estado' => PurchaseInvoiceResponsibleStatus::Objected,
                'objetado_at' => now(),
                'aprobado_at' => null,
                'motivo_objecion_id' => $reason->id,
                'comentario_objecion' => $comment,
            ]);

            $next = $this->stateService->recalculate($lockedApproval);
            PurchaseInvoiceApprovalHistory::create([
                'purchase_invoice_approval_id' => $lockedApproval->id,
                'evento' => PurchaseInvoiceHistoryEvent::Objected->value,
                'estado_anterior' => $previous->value,
                'estado_nuevo' => $next->value,
                'user_id' => $user->id,
                'comentario' => $comment,
                'metadata' => [
                    'owner_code' => $responsible->owner_code,
                    'reason_id' => $reason->id,
                    'reason' => $reason->name,
                ],
            ]);

            $this->queueAccountingNotifications($lockedApproval);
        });
    }

    private function pendingResponsible(PurchaseInvoiceApproval $approval, User $user): PurchaseInvoiceApprovalResponsible
    {
        if ($approval->factura_canceled === 'Y'
            || $approval->estado_aprobacion === PurchaseInvoiceApprovalStatus::CancelledSap) {
            throw ValidationException::withMessages(['invoice' => 'La factura está cancelada en SAP.']);
        }

        $responsible = $approval->activeResponsibles()->where('user_id', $user->id)->lockForUpdate()->first();
        if (! $responsible) {
            abort(403, 'No eres responsable de esta factura.');
        }
        if ($responsible->estado !== PurchaseInvoiceResponsibleStatus::Pending) {
            throw ValidationException::withMessages(['invoice' => 'Ya registraste una decisión para esta factura.']);
        }

        return $responsible;
    }

    private function queueAccountingNotifications(PurchaseInvoiceApproval $approval): void
    {
        User::query()
            ->where(function ($query): void {
                $query->whereHas('permissions', fn ($permissions) => $permissions->where('name', 'purchase-invoice-approvals.accounting')
                )->orWhereHas('roles.permissions', fn ($permissions) => $permissions->where('name', 'purchase-invoice-approvals.accounting')
                );
            })
            ->pluck('id')
            ->each(fn (int $userId) => SendPurchaseInvoiceWorkflowEmail::dispatch(
                $approval->id,
                $userId,
                SendPurchaseInvoiceWorkflowEmail::TYPE_OBJECTED,
            )->afterCommit());
    }
}
