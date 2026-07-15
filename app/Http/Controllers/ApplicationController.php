<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Vacancy;
use App\Models\Candidate;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Controller para gestionar las postulaciones (applications).
 * Controla el movimiento de candidatos entre etapas del pipeline (Kanban).
 */
class ApplicationController extends Controller
{
    /**
     * Mostrar el tablero Kanban para una vacante.
     * Cada columna representa una etapa del pipeline.
     */
    public function kanban(Vacancy $vacancy)
    {
        $this->authorize('view', $vacancy);

        $vacancy->load(['stages' => function ($q) {
            $q->withPivot('sort_order');
        }]);

        // Obtener todas las postulaciones agrupadas por etapa
        $applications = Application::with(['candidate', 'stage'])
            ->where('vacancy_id', $vacancy->id)
            ->get()
            ->groupBy('stage_id');

        // Construir columnas del Kanban
        $columns = $vacancy->stages->map(function ($stage) use ($applications, $vacancy) {
            return [
                'stage_id' => $stage->id,
                'stage_name' => $stage->name,
                'stage_color' => $stage->color,
                'applications' => ($applications[$stage->id] ?? collect())->values(),
            ];
        });

        return Inertia::render('ATS/Applications/Kanban', [
            'vacancy' => $vacancy,
            'columns' => $columns,
            'candidates' => Candidate::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    /**
     * Agregar un candidato a una vacante en una etapa específica.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'candidate_id' => ['required', 'exists:candidates,id'],
            'vacancy_id' => ['required', 'exists:vacancies,id'],
            'stage_id' => ['required', 'exists:stages,id'],
        ]);

        // Verificar que el candidato no esté ya postulado a esta vacante
        if (Application::where('candidate_id', $validated['candidate_id'])
            ->where('vacancy_id', $validated['vacancy_id'])
            ->exists()) {
            return back()->withErrors([
                'candidate_id' => 'Este candidato ya está postulado a esta vacante.',
            ]);
        }

        $application = Application::create([
            ...$validated,
            'applied_at' => now(),
        ]);

        return back()->with('success', 'Candidato agregado al pipeline exitosamente.');
    }

    /**
     * Mover un candidato entre etapas (Drag & Drop).
     * Actualiza el stage_id de la postulación en tiempo real.
     */
    public function move(Request $request, Application $application)
    {
        $this->authorize('update', $application);

        $validated = $request->validate([
            'stage_id' => ['required', 'exists:stages,id'],
        ]);

        $oldStage = $application->stage;

        $application->update(['stage_id' => $validated['stage_id']]);

        return back()->with('success', 'Candidato movido exitosamente.');
    }

    /**
     * Eliminar una postulación del pipeline.
     */
    public function destroy(Application $application)
    {
        $this->authorize('delete', $application);

        $application->delete();

        return back()->with('success', 'Postulación eliminada del pipeline.');
    }

    /**
     * Seleccionar un candidato para cubrir la vacante.
     * Marca al candidato como contratado y cierra la vacante automáticamente.
     */
    public function hire(Application $application)
    {
        $this->authorize('update', $application);

        if ($application->hired_at) {
            return back()->withErrors(['application' => 'Este candidato ya fue seleccionado.']);
        }

        $vacancy = $application->vacancy;

        if ($vacancy->status === 'closed') {
            return back()->withErrors(['vacancy' => 'La vacante ya está cerrada.']);
        }

        DB::transaction(function () use ($application, $vacancy) {
            // Marcar al candidato como contratado
            $application->update(['hired_at' => now()]);

            // Cerrar la vacante
            $vacancy->update(['status' => 'closed']);
        });

        return back()->with('success', "Candidato {$application->candidate->name} seleccionado. La vacante se ha cerrado automáticamente.");
    }
}
