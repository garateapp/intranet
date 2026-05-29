<?php

namespace App\Mail;

use App\Models\ExitPermit;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExitPermitCreated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ExitPermit $exitPermit
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva Solicitud de Permiso de Salida - ' . $this->exitPermit->user->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.exit-permit-created',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
