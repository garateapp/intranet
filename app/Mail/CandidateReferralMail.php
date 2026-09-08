<?php

namespace App\Mail;

use App\Models\Application;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CandidateReferralMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Application $application,
        public User $fromUser,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Candidato referido: ' . ($this->application->candidate?->name ?? 'Sin candidato'),
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.candidate-referral',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}