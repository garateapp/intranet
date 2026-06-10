<?php

namespace App\Mail;

use App\Models\ExitPermit;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExitPermitStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ExitPermit $exitPermit,
        public string $oldStatus,
    ) {}

    public function envelope(): Envelope
    {
        $action = $this->exitPermit->status === 'aprobada' ? 'Aprobada' : 'Rechazada';
        return new Envelope(
            subject: "Permiso de Salida {$action} - {$this->exitPermit->user->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.exit-permit-status-changed',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
