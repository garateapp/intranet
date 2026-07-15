<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\User;
use App\Models\Stage;
use App\Models\Application;
use App\Http\Requests\VacancyRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controller principal para la gestión de vacantes.
 * Incluye CRUD completo y dashboard con métricas.
 */
class VacancyController extends Controller
{
    /**
     * Listar vacantes con filtros y paginación.
     * SuperAdmin/Reclutador: todas. Gerente: solo asignadas.
     */
    public function index(Request $request)
    {
        $query = Vacancy::with(['hiringManager', 'creator'])
            ->withCount(['applications', 'stages']);

        // Filtrar por estado
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Búsqueda por título
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        // Gerente de contratación: solo sus vacantes
        if (Auth::user()->hasRole('hiring_manager')) {
            $query->where(function ($q) {
                $q->where('hiring_manager_id', Auth::id())
                  ->orWhere('created_by', Auth::id());
            });
        }

        $vacancies = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('ATS/Vacancies/Index', [
            'vacancies' => $vacancies,
            'filters' => $request->only(['status', 'search']),
            'stats' => $this->getDashboardStats(),
        ]);
    }

    /**
     * Formulario para crear una nueva vacante.
     */
    public function create()
    {
        $this->authorize('create', Vacancy::class);

        $hiringManagers = User::whereIn('id', function ($query) {
            $query->select('model_id')
                ->from('model_has_roles')
                ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->where('roles.name', 'hiring_manager')
                ->where('model_has_roles.model_type', 'App\\Models\\User');
        })->get(['id', 'name', 'email']);

        $defaultStages = Stage::default()->ordered()->get();

        return Inertia::render('ATS/Vacancies/Create', [
            'hiringManagers' => $hiringManagers,
            'defaultStages' => $defaultStages,
        ]);
    }

    /**
     * Almacenar una nueva vacante.
     */
    public function store(VacancyRequest $request)
    {
        $vacancy = Vacancy::create([
            ...$request->validated(),
            'created_by' => Auth::id(),
        ]);

        // Asignar etapas por defecto a la vacante
        $defaultStages = Stage::default()->ordered()->get();
        foreach ($defaultStages as $index => $stage) {
            $vacancy->vacancyStages()->create([
                'stage_id' => $stage->id,
                'sort_order' => $index + 1,
            ]);
        }

        return redirect()->route('ats.vacancies.index')
            ->with('success', 'Vacante creada exitosamente.');
    }

    /**
     * Mostrar detalle de una vacante con sus postulaciones.
     */
    public function show(Vacancy $vacancy)
    {
        $this->authorize('view', $vacancy);

        $vacancy->load([
            'hiringManager',
            'creator',
            'stages' => fn ($q) => $q->withPivot('sort_order'),
            'applications' => fn ($q) => $q->with(['candidate', 'stage']),
        ]);

        return Inertia::render('ATS/Vacancies/Show', [
            'vacancy' => $vacancy,
        ]);
    }

    /**
     * Formulario para editar una vacante.
     */
    public function edit(Vacancy $vacancy)
    {
        $this->authorize('update', $vacancy);

        $vacancy->load('stages');

        $hiringManagers = User::whereIn('id', function ($query) {
            $query->select('model_id')
                ->from('model_has_roles')
                ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
                ->where('roles.name', 'hiring_manager')
                ->where('model_has_roles.model_type', 'App\\Models\\User');
        })->get(['id', 'name', 'email']);

        return Inertia::render('ATS/Vacancies/Edit', [
            'vacancy' => $vacancy,
            'hiringManagers' => $hiringManagers,
        ]);
    }

    /**
     * Actualizar una vacante.
     */
    public function update(VacancyRequest $request, Vacancy $vacancy)
    {
        $this->authorize('update', $vacancy);

        $vacancy->update($request->validated());

        return redirect()->route('ats.vacancies.index')
            ->with('success', 'Vacante actualizada exitosamente.');
    }

    /**
     * Eliminar una vacante (soft delete).
     */
    public function destroy(Vacancy $vacancy)
    {
        $this->authorize('delete', $vacancy);

        $vacancy->delete();

        return redirect()->route('ats.vacancies.index')
            ->with('success', 'Vacante eliminada exitosamente.');
    }

    /**
     * Restaurar una vacante eliminada.
     */
    public function restore(Vacancy $vacancy)
    {
        $this->authorize('delete', $vacancy);

        $vacancy->restore();

        return redirect()->route('ats.vacancies.index')
            ->with('success', 'Vacante restaurada exitosamente.');
    }

    /**
     * Métricas globales para el dashboard ATS.
     */
    private function getDashboardStats(): array
    {
        $user = Auth::user();

        $query = Vacancy::query();
        if ($user->hasRole('hiring_manager')) {
            $query->where('hiring_manager_id', Auth::id())
                  ->orWhere('created_by', Auth::id());
        }

        return [
            'total' => (clone $query)->count(),
            'draft' => (clone $query)->where('status', 'draft')->count(),
            'active' => (clone $query)->where('status', 'active')->count(),
            'closed' => (clone $query)->where('status', 'closed')->count(),
            'total_applications' => Application::whereIn('vacancy_id', (clone $query)->select('id'))->count(),
        ];
    }
}
