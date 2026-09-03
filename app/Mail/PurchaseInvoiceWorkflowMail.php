<?php

namespace App\Mail;

use App\Jobs\SendPurchaseInvoiceWorkflowEmail;
use App\Models\PurchaseInvoiceApproval;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PurchaseInvoiceWorkflowMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PurchaseInvoiceApproval $approval,
        public User $recipient,
        public string $type,
    ) {}

    public function envelope(): Envelope
    {
        $subject = match ($this->type) {
            SendPurchaseInvoiceWorkflowEmail::TYPE_OBJECTED => 'Factura objetada: '.$this->folio(),
            SendPurchaseInvoiceWorkflowEmail::TYPE_REMINDER => 'Recordatorio de factura pendiente: '.$this->folio(),
            default => 'Factura pendiente de aprobación: '.$this->folio(),
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(html: 'emails.purchase-invoice-workflow');
    }

    public function attachments(): array
    {
        return [];
    }

    private function folio(): string
    {
        return trim(($this->approval->factura_folio_pref ? $this->approval->factura_folio_pref.'-' : '')
            .$this->approval->factura_folio_num);
    }
}
