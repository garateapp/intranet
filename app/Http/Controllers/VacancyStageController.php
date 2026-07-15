<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\Stage;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller para configurar el pipeline personalizado de cada vacante.
 * Permite seleccionar y ordenar las etapas que conformarán el Kanban.
 */
class VacancyStageController extends Controller
{
    /**
     * Mostrar las etapas configuradas para una vacante específica.
     */
    public function index(Vacancy $vacancy)
    {
        $this->authorize('update', $vacancy);

        $vacancy->load(['stages' => function ($q) {
            $q->withPivot('sort_order');
        }]);

        // Etapas globales disponibles que no están asignadas a esta vacante
        $assignedStageIds = $vacancy->stages->pluck('id');
        $availableStages = Stage::whereNotIn('id', $assignedStageIds)->ordered()->get();

        return Inertia::render('ATS/Vacancies/Pipeline', [
            'vacancy' => $vacancy,
            'availableStages' => $availableStages,
        ]);
    }

    /**
     * Agregar una etapa al pipeline de una vacante.
     */
    public function store(Request $request, Vacancy $vacancy)
    {
        $this->authorize('update', $vacancy);

        $validated = $request->validate([
            'stage_id' => ['required', 'exists:stages,id'],
        ]);

        // Verificar que la etapa no esté ya asignada
        if ($vacancy->vacancyStages()->where('stage_id', $validated['stage_id'])->exists()) {
            return back()->withErrors(['stage_id' => 'Esta etapa ya está asignada a la vacante.']);
        }

        $maxOrder = $vacancy->vacancyStages()->max('sort_order') ?? 0;

        $vacancy->vacancyStages()->create([
            'stage_id' => $validated['stage_id'],
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Etapa agregada al pipeline exitosamente.');
    }

    /**
     * Reordenar las etapas del pipeline (drag & drop).
     */
    public function reorder(Request $request, Vacancy $vacancy)
    {
        $this->authorize('update', $vacancy);

        $validated = $request->validate([
            'stages' => ['required', 'array'],
            'stages.*.id' => ['required', 'exists:vacancy_stages,id'],
            'stages.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['stages'] as $item) {
            $vacancy->vacancyStages()
                ->where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Eliminar una etapa del pipeline de una vacante.
     */
    public function destroy(Vacancy $vacancy, int $stageId)
    {
        $this->authorize('update', $vacancy);

        // Verificar que no haya candidatos en esta etapa
        $hasApplicants = $vacancy->applications()
            ->where('stage_id', $stageId)
            ->exists();

        if ($hasApplicants) {
            return back()->withErrors([
                'stage' => 'No se puede eliminar esta etapa porque hay candidatos asignados a ella.',
            ]);
        }

        $vacancy->vacancyStages()->where('stage_id', $stageId)->delete();

        return back()->with('success', 'Etapa removida del pipeline exitosamente.');
    }
}
