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
        'renta_liquida',
        'salary_currency',
        'status',
        'entry_week',
        'entry_week_year',
        'exit_week',
        'exit_week_year',
        'hiring_manager_id',
        'created_by',
    ];

    protected $appends = [
        'entry_week_label',
        'exit_week_label',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'salary' => 'decimal:2',
            'renta_liquida' => 'decimal:2',
            'entry_week' => 'integer',
            'entry_week_year' => 'integer',
            'exit_week' => 'integer',
            'exit_week_year' => 'integer',
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

    /**
     * Renta líquida protegida: solo Gerente de Contratación en sus propias
     * vacantes y roles con acceso global (super_admin/admin/recruiter).
     */
    public function getRentaLiquidaAttribute($value): ?string
    {
        if (!$this->canViewRentaLiquida()) {
            return null;
        }

        if ($value === null || $value === '') {
            return null;
        }

        return number_format((float) $value, 2, '.', '');
    }

    /**
     * Indica si el usuario autenticado puede ver la renta líquida de esta vacante.
     */
    public function canViewRentaLiquida(): bool
    {
        $user = auth()->user();

        if (!$user) {
            return false;
        }

        if ($user->hasAnyRole(['super_admin', 'admin', 'recruiter'])) {
            return true;
        }

        if ($user->hasRole('hiring_manager')) {
            return $this->hiring_manager_id === $user->id || $this->created_by === $user->id;
        }

        return false;
    }

    /**
     * Indica si la vacante es de tipo Obra.
     */
    public function isObra(): bool
    {
        return $this->job_type === 'obra';
    }

    /**
     * Etiqueta legible de la semana de ingreso (ej: "Semana 12 - 2026").
     */
    public function getEntryWeekLabelAttribute(): ?string
    {
        if ($this->entry_week === null || $this->entry_week === '') {
            return null;
        }

        return "Semana {$this->entry_week} - {$this->entry_week_year}";
    }

    /**
     * Etiqueta legible de la semana de salida (ej: "Semana 30 - 2026").
     */
    public function getExitWeekLabelAttribute(): ?string
    {
        if ($this->exit_week === null || $this->exit_week === '') {
            return null;
        }

        return "Semana {$this->exit_week} - {$this->exit_week_year}";
    }
}
