<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vacancy extends Model
{
    use HasFactory, SoftDeletes, Auditable;

    protected $fillable = [
        'title',
        'description',
        'responsibilities',
        'qualifications',
        'job_type',
        'start_date',
        'salary',
        'salary_currency',
        'status',
        'hiring_manager_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'salary' => 'decimal:2',
        ];
    }

    /**
     * Gerente de contratación asignado a la vacante.
     */
    public function hiringManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'hiring_manager_id');
    }

    /**
     * Usuario que creó la vacante (reclutador/RRHH).
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Etapas personalizadas configuradas para esta vacante (pivote con orden).
     */
    public function vacancyStages(): HasMany
    {
        return $this->hasMany(VacancyStage::class);
    }

    /**
     * Etapas accesories: retorna solo los modelos Stage ordenados.
     */
    public function stages(): BelongsToMany
    {
        return $this->belongsToMany(Stage::class, 'vacancy_stages')
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    /**
     * Aplicaciones/postulaciones de candidatos a esta vacante.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Candidatos que se han postulado a esta vacante.
     */
    public function candidates(): BelongsToMany
    {
        return $this->belongsToMany(Candidate::class, 'applications')
            ->withPivot('stage_id', 'applied_at')
            ->withTimestamps();
    }

    /**
     * Scope: solo vacantes activas.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: solo vacantes en borrador.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope: vacantes cerradas.
     */
    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    /**
     * Cantidad de candidatos en cada etapa para el Kanban.
     */
    public function getStageCountsAttribute(): array
    {
        return $this->applications()
            ->selectRaw('stage_id, count(*) as count')
            ->groupBy('stage_id')
            ->pluck('count', 'stage_id')
            ->toArray();
    }
}
