<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Postulación de un candidato a una vacante específica.
 * Representa la posición actual del candidato dentro del pipeline.
 */
class Application extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    protected $fillable = [
        'candidate_id',
        'vacancy_id',
        'stage_id',
        'applied_at',
        'hired_at',
    ];

    protected function casts(): array
    {
        return [
            'applied_at' => 'datetime',
            'hired_at' => 'datetime',
        ];
    }

    /**
     * Scope: solo postulaciones donde el candidato fue contratado.
     */
    public function scopeHired($query)
    {
        return $query->whereNotNull('hired_at');
    }

    /**
     * Scope: solo postulaciones pendientes (no contratadas).
     */
    public function scopePending($query)
    {
        return $query->whereNull('hired_at');
    }

    /**
     * Candidato que se postuló.
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Vacante a la que se postuló.
     */
    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    /**
     * Etapa actual del candidato en el pipeline.
     */
    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class);
    }

    /**
     * Entrevistas programadas para esta postulación.
     */
    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    /**
     * Evaluaciones de las entrevistas de esta postulación.
     */
    public function evaluations(): HasMany
    {
        return $this->hasManyThrough(Evaluation::class, Interview::class);
    }
}
