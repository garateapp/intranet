<?php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AtsStageClosureMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Application $application
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Postulante en etapa de cierre: ' . ($this->application->vacancy?->title ?? 'Sin vacante'),
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.ats-stage-closure',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}