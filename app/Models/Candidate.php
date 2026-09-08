<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Candidate extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'origin',
        'cv_url',
        'notes',
    ];

    /**
     * Aplicaciones/postulaciones de este candidato.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Vacantes a las que se ha postulado.
     */
    public function vacancies(): BelongsToMany
    {
        return $this->belongsToMany(Vacancy::class, 'applications')
            ->withPivot('stage_id', 'applied_at')
            ->withTimestamps();
    }

    /**
     * Entrevistas asociadas a este candidato (a través de applications).
     */
    public function interviews(): HasMany
    {
        return $this->hasManyThrough(Interview::class, Application::class);
    }

    /**
     * Evaluaciones recibidas (a través de interviews -> applications).
     */
    public function evaluations(): HasMany
    {
        return $this->hasManyThrough(Evaluation::class, Interview::class, 'application_id');
    }

    /**
     * Referencias enviadas de este candidato a otros reclutadores.
     */
    public function referrals(): HasMany
    {
        return $this->hasMany(CandidateReferral::class);
    }

    /**
     * Indica si el candidato participa actualmente en otro proceso de
     * reclutamiento activo (vacante activa y en una etapa no terminal).
     * Etapas terminales: "Rechazado" y "Contratado".
     */
    public function isInActiveProcess(): bool
    {
        return $this->applications()
            ->whereHas('vacancy', fn ($q) => $q->where('status', 'active'))
            ->whereHas('stage', fn ($q) => $q->whereNotIn('name', ['Rechazado', 'Contratado']))
            ->exists();
    }
}
