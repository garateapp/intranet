<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\Application;
use App\Http\Requests\InterviewRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller para gestionar entrevistas asociadas a postulaciones.
 */
class InterviewController extends Controller
{
    /**
     * Listar entrevistas de una postulación específica.
     */
    public function index(Application $application)
    {
        $this->authorize('viewAny', Interview::class);

        $interviews = Interview::with(['evaluations.evaluator'])
            ->where('application_id', $application->id)
            ->orderBy('scheduled_at', 'desc')
            ->get();

        return Inertia::render('ATS/Interviews/Index', [
            'application' => $application->load(['candidate', 'vacancy', 'stage']),
            'interviews' => $interviews,
        ]);
    }

    /**
     * Formulario para programar una entrevista.
     */
    public function create(Application $application)
    {
        $this->authorize('create', Interview::class);

        return Inertia::render('ATS/Interviews/Create', [
            'application' => $application->load(['candidate', 'vacancy']),
        ]);
    }

    /**
     * Almacenar una nueva entrevista.
     */
    public function store(InterviewRequest $request)
    {
        $interview = Interview::create($request->validated());

        return redirect()->route('ats.applications.kanban', $interview->application->vacancy_id)
            ->with('success', 'Entrevista programada exitosamente.');
    }

    /**
     * Mostrar detalle de una entrevista.
     */
    public function show(Interview $interview)
    {
        $this->authorize('view', $interview);

        $interview->load([
            'application.candidate',
            'application.vacancy',
            'evaluations.evaluator',
        ]);

        return Inertia::render('ATS/Interviews/Show', [
            'interview' => $interview,
        ]);
    }

    /**
     * Formulario para editar una entrevista.
     */
    public function edit(Interview $interview)
    {
        $this->authorize('update', $interview);

        return Inertia::render('ATS/Interviews/Edit', [
            'interview' => $interview->load(['application.candidate', 'application.vacancy']),
        ]);
    }

    /**
     * Actualizar una entrevista.
     */
    public function update(InterviewRequest $request, Interview $interview)
    {
        $this->authorize('update', $interview);

        $interview->update($request->validated());

        return redirect()->route('ats.applications.kanban', $interview->application->vacancy_id)
            ->with('success', 'Entrevista actualizada exitosamente.');
    }

    /**
     * Eliminar una entrevista.
     */
    public function destroy(Interview $interview)
    {
        $this->authorize('delete', $interview);

        $vacancyId = $interview->application->vacancy_id;
        $interview->delete();

        return redirect()->route('ats.applications.kanban', $vacancyId)
            ->with('success', 'Entrevista eliminada exitosamente.');
    }
}
