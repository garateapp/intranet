<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Interview;
use App\Http\Requests\EvaluationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controller para gestionar evaluaciones post-entrevista.
 * Permite crear, editar y ver evaluaciones con score y comentarios.
 */
class EvaluationController extends Controller
{
    /**
     * Listar evaluaciones de una entrevista.
     */
    public function index(Interview $interview)
    {
        $this->authorize('viewAny', Evaluation::class);

        $evaluations = Evaluation::with(['evaluator'])
            ->where('interview_id', $interview->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('ATS/Evaluations/Index', [
            'interview' => $interview->load(['application.candidate', 'application.vacancy']),
            'evaluations' => $evaluations,
        ]);
    }

    /**
     * Formulario para crear una evaluación.
     */
    public function create(Interview $interview)
    {
        $this->authorize('create', Evaluation::class);

        return Inertia::render('ATS/Evaluations/Create', [
            'interview' => $interview->load([
                'application.candidate',
                'application.vacancy',
            ]),
        ]);
    }

    /**
     * Almacenar una nueva evaluación.
     */
    public function store(EvaluationRequest $request)
    {
        $evaluation = Evaluation::create([
            ...$request->validated(),
            'evaluator_id' => Auth::id(),
        ]);

        return redirect()->route('ats.interviews.show', $evaluation->interview_id)
            ->with('success', 'Evaluación registrada exitosamente.');
    }

    /**
     * Mostrar detalle de una evaluación.
     */
    public function show(Evaluation $evaluation)
    {
        $this->authorize('view', $evaluation);

        $evaluation->load(['evaluator', 'interview.application.candidate', 'interview.application.vacancy']);

        return Inertia::render('ATS/Evaluations/Show', [
            'evaluation' => $evaluation,
        ]);
    }

    /**
     * Formulario para editar una evaluación.
     */
    public function edit(Evaluation $evaluation)
    {
        $this->authorize('update', $evaluation);

        return Inertia::render('ATS/Evaluations/Edit', [
            'evaluation' => $evaluation->load(['interview.application.candidate']),
        ]);
    }

    /**
     * Actualizar una evaluación.
     */
    public function update(EvaluationRequest $request, Evaluation $evaluation)
    {
        $this->authorize('update', $evaluation);

        $evaluation->update($request->validated());

        return redirect()->route('ats.interviews.show', $evaluation->interview_id)
            ->with('success', 'Evaluación actualizada exitosamente.');
    }

    /**
     * Eliminar una evaluación.
     */
    public function destroy(Evaluation $evaluation)
    {
        $this->authorize('delete', $evaluation);

        $interviewId = $evaluation->interview_id;
        $evaluation->delete();

        return redirect()->route('ats.interviews.show', $interviewId)
            ->with('success', 'Evaluación eliminada exitosamente.');
    }
}
