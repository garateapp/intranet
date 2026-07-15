<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Http\Requests\CandidateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controller para la gestión de candidatos.
 * CRUD completo con búsqueda y filtros.
 */
class CandidateController extends Controller
{
    /**
     * Listar candidatos con búsqueda y paginación.
     */
    public function index(Request $request)
    {
        $query = Candidate::withCount('applications');

        // Búsqueda por nombre o email
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtrar por origen
        if ($request->has('origin') && $request->origin !== '') {
            $query->where('origin', $request->origin);
        }

        // Gerente de contratación: solo candidatos en sus vacantes
        if (Auth::user()->hasRole('hiring_manager')) {
            $query->whereHas('applications', function ($q) {
                $q->whereHas('vacancy', function ($vq) {
                    $vq->where('hiring_manager_id', Auth::id())
                       ->orWhere('created_by', Auth::id());
                });
            });
        }

        $candidates = $query->latest()->paginate(15)->withQueryString();

        // Orígenes únicos para el filtro
        $origins = Candidate::whereNotNull('origin')
            ->distinct()
            ->pluck('origin');

        return Inertia::render('ATS/Candidates/Index', [
            'candidates' => $candidates,
            'filters' => $request->only(['search', 'origin']),
            'origins' => $origins,
        ]);
    }

    /**
     * Formulario para crear un candidato.
     */
    public function create()
    {
        $this->authorize('create', Candidate::class);

        return Inertia::render('ATS/Candidates/Create');
    }

    /**
     * Almacenar un nuevo candidato.
     */
    public function store(CandidateRequest $request)
    {
        $candidate = Candidate::create($request->validated());

        return redirect()->route('ats.candidates.index')
            ->with('success', 'Candidato registrado exitosamente.');
    }

    /**
     * Mostrar detalle de un candidato con historial completo.
     */
    public function show(Candidate $candidate)
    {
        $this->authorize('view', $candidate);

        $candidate->load([
            'applications' => function ($q) {
                $q->with(['vacancy', 'stage', 'interviews' => function ($iq) {
                    $iq->with(['evaluations' => function ($eq) {
                        $eq->with('evaluator');
                    }]);
                }])->orderByDesc('created_at');
            },
        ]);

        return Inertia::render('ATS/Candidates/Show', [
            'candidate' => $candidate,
        ]);
    }

    /**
     * Formulario para editar un candidato.
     */
    public function edit(Candidate $candidate)
    {
        $this->authorize('update', $candidate);

        return Inertia::render('ATS/Candidates/Edit', [
            'candidate' => $candidate,
        ]);
    }

    /**
     * Actualizar un candidato.
     */
    public function update(CandidateRequest $request, Candidate $candidate)
    {
        $this->authorize('update', $candidate);

        $candidate->update($request->validated());

        return redirect()->route('ats.candidates.show', $candidate)
            ->with('success', 'Candidato actualizado exitosamente.');
    }

    /**
     * Eliminar un candidato (soft delete).
     */
    public function destroy(Candidate $candidate)
    {
        $this->authorize('delete', $candidate);

        $candidate->delete();

        return redirect()->route('ats.candidates.index')
            ->with('success', 'Candidato eliminado exitosamente.');
    }
}
