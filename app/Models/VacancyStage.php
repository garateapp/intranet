<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Pivote que conecta vacantes con etapas, definiendo el orden personalizado
 * del pipeline para cada vacante.
 */
class VacancyStage extends Model
{
    protected $fillable = [
        'vacancy_id',
        'stage_id',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * Vacante a la que pertenece esta etapa.
     */
    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    /**
     * Etapa asociada.
     */
    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class);
    }
}
