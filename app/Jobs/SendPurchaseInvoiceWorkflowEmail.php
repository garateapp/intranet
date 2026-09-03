<?php

namespace App\Jobs;

use App\Enums\PurchaseInvoiceHistoryEvent;
use App\Mail\PurchaseInvoiceWorkflowMail;
use App\Models\PurchaseInvoiceApproval;
use App\Models\PurchaseInvoiceApprovalHistory;
use App\Models\PurchaseInvoiceReminder;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPurchaseInvoiceWorkflowEmail implements ShouldQueue
{
    use Queueable;

    public const TYPE_ASSIGNED = 'assigned';

    public const TYPE_OBJECTED = 'objected';

    public const TYPE_REMINDER = 'reminder';

    public int $tries = 3;

    public function __construct(
        public readonly int $approvalId,
        public readonly int $recipientUserId,
        public readonly string $type,
        public readonly ?int $reminderId = null,
    ) {}

    public function handle(): void
    {
        $approval = PurchaseInvoiceApproval::with([
            'lines', 'activeResponsibles.user', 'objectedBy', 'objectionReason',
        ])->findOrFail($this->approvalId);
        $recipient = User::findOrFail($this->recipientUserId);

        Mail::to($recipient)->send(new PurchaseInvoiceWorkflowMail($approval, $recipient, $this->type));

        if ($this->reminderId) {
            PurchaseInvoiceReminder::whereKey($this->reminderId)->update(['sent_at' => now()]);
        }

        PurchaseInvoiceApprovalHistory::create([
            'purchase_invoice_approval_id' => $approval->id,
            'evento' => ($this->type === self::TYPE_REMINDER
                ? PurchaseInvoiceHistoryEvent::ReminderSent
                : PurchaseInvoiceHistoryEvent::NotificationSent)->value,
            'metadata' => [
                'type' => $this->type,
                'recipient_user_id' => $recipient->id,
                'recipient_email' => $recipient->email,
            ],
        ]);

        Log::info('Correo de aprobación de factura enviado.', [
            'invoice_id' => $approval->id,
            'type' => $this->type,
            'recipient_user_id' => $recipient->id,
        ]);
    }
}
