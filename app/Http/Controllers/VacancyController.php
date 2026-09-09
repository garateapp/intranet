<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\User;
use App\Models\Stage;
use App\Models\Application;
use App\Http\Requests\VacancyRequest;
use App\Services\VacancyImporter;
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

        // Filtrar por estado (si está vacío, muestra todas)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Búsqueda por título
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        $canViewAll = Auth::user()->canViewAllVacancies();

        // Filtro por usuario reclutante (solo para admin/superadmin)
        if ($canViewAll && $request->filled('recruiter_id')) {
            $query->where('hiring_manager_id', $request->integer('recruiter_id'));
        }

        // El resto (no admin/superadmin) ve solo sus propias vacantes
        if (! $canViewAll) {
            $query->where(function ($q) {
                $q->where('hiring_manager_id', Auth::id())
                  ->orWhere('created_by', Auth::id());
            });
        }
        $query->orderBy('title', 'asc');
        $vacancies = $query->latest()->paginate(12)->withQueryString();

        $vacancies->getCollection()->transform(function (Vacancy $vacancy) {
            $vacancy->setAttribute('can_delete', Auth::user()->can('delete', $vacancy));

            return $vacancy;
        });

        $recruiters = $canViewAll
            ? User::role(['hiring_manager', 'recruiter'])->orderBy('name')->get(['id', 'name'])
            : collect();

        return Inertia::render('ATS/Vacancies/Index', [
            'vacancies' => $vacancies,
            'filters' => $request->only(['status', 'search', 'recruiter_id']),
            'recruiters' => $recruiters,
            'canFilterRecruiter' => $canViewAll,
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
            'canManageRentaLiquida' => $this->canManageRentaLiquida(),
        ]);
    }

    /**
     * Descarga la plantilla de ejemplo para la carga masiva de vacantes.
     */
    public function template()
    {
        $this->authorize('create', Vacancy::class);

        $importer = app(VacancyImporter::class);
        $tempFile = $importer->generateTemplate();

        return response()->download($tempFile, 'plantilla_vacantes.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Página de carga masiva de vacantes.
     */
    public function import()
    {
        $this->authorize('create', Vacancy::class);

        return Inertia::render('ATS/Vacancies/Import', [
            'canDownloadTemplate' => true,
        ]);
    }

    /**
     * Calendario de vacantes de obra por semana de ingreso.
     */
    public function calendar(Request $request)
    {
        $this->authorize('viewAny', Vacancy::class);

        $year = $request->integer('year', now()->year);

        $own = function ($query) {
            if (! Auth::user()->canViewAllVacancies()) {
                $query->where(fn ($q) => $q->where('hiring_manager_id', Auth::id())
                    ->orWhere('created_by', Auth::id()));
            }
        };

        $entries = Vacancy::with('hiringManager')
            ->where('job_type', 'obra')
            ->whereNotNull('entry_week')
            ->where('entry_week_year', $year)
            ->where($own)
            ->get()
            ->map(fn (Vacancy $v) => $v->setAttribute('event_type', 'entry')
                ->setAttribute('sort_week', $v->entry_week));

        $exits = Vacancy::with('hiringManager')
            ->where('job_type', 'obra')
            ->whereNotNull('exit_week')
            ->where('exit_week_year', $year)
            ->where($own)
            ->get()
            ->map(fn (Vacancy $v) => $v->setAttribute('event_type', 'exit')
                ->setAttribute('sort_week', $v->exit_week));

        $vacancies = $entries->concat($exits)->sortBy('sort_week')->values();

        $incomplete = Vacancy::with('hiringManager')
            ->where('job_type', 'obra')
            ->where(fn ($q) => $q->whereNull('entry_week')->orWhereNull('exit_week'))
            ->where($own)
            ->get();

        return Inertia::render('ATS/Vacancies/Calendar', [
            'year' => $year,
            'vacancies' => $vacancies,
            'incomplete' => $incomplete,
        ]);
    }

    /**
     * Procesa el archivo de carga masiva y crea las vacantes.
     */
    public function processImport(Request $request)
    {
        $this->authorize('create', Vacancy::class);

        $request->validate([
            'file' => ['required', 'file', 'max:10240'],
        ], [
            'file.required' => 'Debe seleccionar un archivo.',
            'file.max' => 'El archivo no debe superar los 10 MB.',
        ]);

        $importer = app(VacancyImporter::class);

        try {
            $result = $importer->import($request->file('file'), Auth::id(), $this->canManageRentaLiquida());
        } catch (\Throwable $e) {
            return Inertia::render('ATS/Vacancies/Import', [
                'result' => [
                    'total_rows' => 0,
                    'created' => 0,
                    'errors' => [['row' => 0, 'error' => $e->getMessage()]],
                ],
            ]);
        }

        return Inertia::render('ATS/Vacancies/Import', [
            'result' => $result,
        ]);
    }

    /**
     * Almacenar una nueva vacante.
     */
    public function store(VacancyRequest $request)
    {
        $data = $request->validated();

        if (! $this->canManageRentaLiquida()) {
            unset($data['renta_liquida']);
        }

        $vacancy = Vacancy::create([
            ...$data,
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
            'canViewRentaLiquida' => $vacancy->canViewRentaLiquida(),
            'canDelete' => Auth::user()->can('delete', $vacancy),
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
            'canViewRentaLiquida' => $vacancy->canViewRentaLiquida(),
            'canEditRentaLiquida' => $this->canManageRentaLiquida(),
        ]);
    }

    /**
     * Actualizar una vacante.
     */
    public function update(VacancyRequest $request, Vacancy $vacancy)
    {
        $this->authorize('update', $vacancy);

        $data = $request->validated();

        if (! $this->canManageRentaLiquida()) {
            unset($data['renta_liquida']);
        }

        $vacancy->update($data);

        // Conservar los filtros del listado si la edición se inició desde él
        $backUrl = $request->header('Referer');
        $query = $backUrl ? parse_url($backUrl, PHP_URL_QUERY) : null;
        $redirect = $query ? route('ats.vacancies.index') . '?' . $query : route('ats.vacancies.index');

        return redirect($redirect)
            ->with('success', 'Vacante actualizada exitosamente.');
    }

    /**
     * Solo roles con acceso global a vacantes pueden gestionar la renta líquida.
     * El hiring manager puede ver su propia renta pero no editarla.
     */
    private function canManageRentaLiquida(): bool
    {
        return Auth::user()->hasAnyRole(['super_admin', 'admin', 'recruiter']);
    }

    /**
     * Eliminar una vacante (soft delete).
     */
    public function destroy(Request $request, Vacancy $vacancy)
    {
        $this->authorize('delete', $vacancy);

        $vacancy->delete();

        // Regresar al listado con los filtros activos
        $backUrl = $request->header('Referer') ?: route('ats.vacancies.index');

        return redirect($backUrl)
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
        if (! $user->canViewAllVacancies()) {
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
