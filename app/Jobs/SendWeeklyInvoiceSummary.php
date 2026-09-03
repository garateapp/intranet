<?php

namespace App\Jobs;

use App\Mail\PurchaseInvoiceWeeklySummaryMail;
use App\Models\PurchaseInvoiceApproval;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendWeeklyInvoiceSummary implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly int $recipientUserId,
        public readonly array $invoiceIds,
        public readonly bool $isReminder = false,
    ) {}

    public function handle(): void
    {
        $recipient = User::findOrFail($this->recipientUserId);

        // Reconstruir colección serializable de facturas con los datos del email
        $invoices = PurchaseInvoiceApproval::with(['lines', 'activeResponsibles.user'])
            ->whereIn('id', $this->invoiceIds)
            ->get()
            ->map(fn ($approval): array => [
                'id' => $approval->id,
                'folio' => trim(($approval->factura_folio_pref ? $approval->factura_folio_pref.'-' : '').$approval->factura_folio_num),
                'provider' => $approval->card_name,
                'moneda' => $approval->factura_moneda,
                'total' => (float) $approval->factura_total,
                'vencimiento' => $approval->factura_vencimiento?->format('Y-m-d'),
                'dias_restantes' => $approval->factura_vencimiento
                    ? $approval->factura_vencimiento->startOfDay()->diffInDays(today(), false) * -1
                    : null,
                'oc' => $approval->lines->pluck('oc_doc_num')->filter()->unique()->implode(', ')
                    ?: ($approval->manual_oc_doc_num ? $approval->manual_oc_doc_num.' (manual)' : 'SIN OC'),
                'responsables' => $approval->activeResponsibles->pluck('user.name')->filter()->implode(', '),
            ])
            ->values()
            ->toArray();

        Mail::to($recipient)->send(new PurchaseInvoiceWeeklySummaryMail($recipient, $invoices, $this->isReminder));

        Log::info('Resumen de facturas pendientes enviado.', [
            'recipient_user_id' => $recipient->id,
            'recipient_email' => $recipient->email,
            'invoice_count' => count($this->invoiceIds),
            'is_reminder' => $this->isReminder,
        ]);
    }
}
