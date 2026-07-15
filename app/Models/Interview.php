<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Entrevista programada para una postulación específica.
 */
class Interview extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    protected $fillable = [
        'application_id',
        'scheduled_at',
        'location_link',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
        ];
    }

    /**
     * Postulación a la que pertenece esta entrevista.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Evaluaciones recibidas después de esta entrevista.
     */
    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    /**
     * Candidato asociado (a través de la postulación).
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class, null, null, ['candidate_id' => 'id']);
    }

    /**
     * Acceso directo al candidato a través de la relación application.
     */
    public function getCandidateDirectAttribute(): ?Candidate
    {
        return $this->application?->candidate;
    }
}
