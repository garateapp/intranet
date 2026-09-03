<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PurchaseInvoiceWeeklySummaryMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $recipient,
        public array $invoices,
        public bool $isReminder = false,
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->isReminder
            ? 'Recordatorio: facturas pendientes por aprobar'
            : 'Resumen semanal de facturas pendientes por aprobar';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(html: 'emails.purchase-invoice-weekly-summary');
    }

    public function attachments(): array
    {
        return [];
    }
}
