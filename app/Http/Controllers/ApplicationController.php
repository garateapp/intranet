<?php

namespace App\Http\Controllers;

use App\Mail\AtsStageClosureMail;
use App\Mail\CandidateReferralMail;
use App\Models\Application;
use App\Models\Vacancy;
use App\Models\Candidate;
use App\Models\CandidateReferral;
use App\Models\Stage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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

        $candidates = Candidate::orderBy('name')->get(['id', 'name', 'email']);

        // Candidatos que ya están en un proceso activo (para deshabilitarlos en el modal)
        $inProcessIds = Application::query()
            ->whereHas('vacancy', fn ($q) => $q->where('status', 'active'))
            ->whereHas('stage', fn ($q) => $q->whereNotIn('name', ['Rechazado', 'Contratado']))
            ->pluck('candidate_id')
            ->unique();

        $candidates->each(function (Candidate $candidate) use ($inProcessIds) {
            $candidate->setAttribute('is_in_process', $inProcessIds->contains($candidate->id));
        });

        // Usuarios con procesos de reclutamiento activos (para referir candidatos)
        $referralUsers = User::query()
            ->where('id', '!=', Auth::id())
            ->where($this->activeRecruitmentUsersWhere())
            ->withCount([
                'managedVacancies' => fn ($q) => $q->where('status', 'active'),
                'createdVacancies' => fn ($q) => $q->where('status', 'active'),
            ])
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('ATS/Applications/Kanban', [
            'vacancy' => $vacancy,
            'columns' => $columns,
            'candidates' => $candidates,
            'referralUsers' => $referralUsers,
        ]);
    }

    /**
     * Query para usuarios involucrados con procesos de reclutamiento activos.
     */
    private function activeRecruitmentUsersWhere(): \Closure
    {
        return function ($q) {
            $q->whereHas('managedVacancies', fn ($v) => $v->where('status', 'active'))
              ->orWhereHas('createdVacancies', fn ($v) => $v->where('status', 'active'));
        };
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

        // Bloquear candidatos que ya participan en otro proceso de reclutamiento activo
        if (Candidate::find($validated['candidate_id'])->isInActiveProcess()) {
            return back()->withErrors([
                'candidate_id' => 'Este candidato ya participa en un proceso de reclutamiento activo en otra vacante.',
            ]);
        }

        $application = Application::create([
            ...$validated,
            'applied_at' => now(),
        ]);

        if (Stage::find($validated['stage_id'])?->is_closure) {
            $this->notifyClosureStage($application);
        }

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

        if (Stage::find($validated['stage_id'])?->is_closure) {
            $this->notifyClosureStage($application);
        }

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

    /**
     * Rechazar a un candidato y opcionalmente referirlo a uno o más usuarios
     * con procesos de reclutamiento activos.
     */
    public function refer(Request $request, Application $application)
    {
        $this->authorize('update', $application);

        $validated = $request->validate([
            'stage_id' => ['required', 'exists:stages,id'],
            'user_ids' => ['sometimes', 'array'],
            'user_ids.*' => ['integer', 'exists:users,id'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $oldStage = $application->stage;

        DB::transaction(function () use ($application, $validated) {
            $application->update(['stage_id' => $validated['stage_id']]);

            $userIds = collect($validated['user_ids'] ?? [])
                ->map(fn ($id) => (int) $id)
                ->unique()
                ->filter(fn ($id) => $id !== (int) Auth::id())
                ->values()
                ->all();

            if (! empty($userIds)) {
                $referral = CandidateReferral::create([
                    'candidate_id' => $application->candidate_id,
                    'application_id' => $application->id,
                    'from_user_id' => Auth::id(),
                    'note' => $validated['note'] ?? null,
                ]);

                $referral->referredUsers()->sync($userIds);

                $this->notifyReferral($application, $userIds);
            }
        });

        if (Stage::find($validated['stage_id'])?->is_closure) {
            $this->notifyClosureStage($application);
        }

        $count = count($validated['user_ids'] ?? []);

        $message = $count > 0
            ? "Candidato rechazado y referido a {$count} usuario(s)."
            : 'Candidato rechazado del proceso.';

        return back()->with('success', $message);
    }

    /**
     * Notifica por correo a los usuarios a los que se refirió al candidato.
     */
    private function notifyReferral(Application $application, array $userIds): void
    {
        $mailable = new CandidateReferralMail($application, Auth::user());

        User::whereIn('id', $userIds)->get(['id', 'email'])
            ->each(function (User $user) use ($mailable) {
                if ($user->email) {
                    Mail::to($user->email)->send($mailable);
                }
            });
    }

    /**
     * Notifica al destinatario de RRHH (EMAIL_ATS_HR) cuando una postulación
     * llega a una etapa marcada como etapa de cierre.
     */
    private function notifyClosureStage(Application $application): void
    {
        $recipient = config('mail.ats_hr_recipient');

        if (! $recipient) {
            return;
        }

        Mail::to($recipient)->send(new AtsStageClosureMail($application));
    }
}
