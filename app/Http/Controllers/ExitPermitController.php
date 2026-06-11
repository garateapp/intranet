<?php

namespace App\Http\Controllers;

use App\Mail\ExitPermitCreated;
use App\Models\ExitPermit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ExitPermitController extends Controller
{
    public function create()
    {
        $user = Auth::user();
        $manager = null;
        if ($user->manager_id) {
            $manager = User::find($user->manager_id);
        }

        $supervisedUsers = User::where('manager_id', $user->id)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'login_method']);

        return Inertia::render('ExitPermits/Create', [
            'manager' => $manager,
            'supervisedUsers' => $supervisedUsers,
            'userLoginMethod' => $user->login_method,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'fecha_salida' => ['required', 'date'],
            'hora_salida' => ['nullable', 'string'],
            'fecha_retorno' => ['nullable', 'date', 'after_or_equal:fecha_salida'],
            'hora_retorno' => ['nullable', 'string'],
            'motivo' => ['required', 'string', 'max:5000'],
            'observaciones' => ['nullable', 'string', 'max:5000'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'notification_email' => ['nullable', 'email', 'max:255'],
        ]);

        $targetUserId = ! empty($validated['user_id']) ? (int) $validated['user_id'] : $user->id;

        // If creating for another user, validate supervisor relationship
        if ((int) $targetUserId !== (int) $user->id) {
            $targetUser = User::findOrFail($targetUserId);
            if ((int) $targetUser->manager_id !== (int) $user->id) {
                abort(403, 'No puedes crear permisos para este usuario.');
            }
        }

        $targetUser = User::findOrFail($targetUserId);

        // Require notification_email for users who didn't log in with Google
        if ($targetUser->login_method !== 'google' && empty($validated['notification_email'])) {
            return back()->withErrors([
                'notification_email' => 'Debes ingresar un correo para recibir las notificaciones de tu solicitud.',
            ])->withInput();
        }

        $exitPermit = ExitPermit::create([
            'user_id' => $targetUser->id,
            'manager_id' => $targetUser->manager_id,
            'fecha_salida' => $validated['fecha_salida'],
            'hora_salida' => $validated['hora_salida'],
            'fecha_retorno' => $validated['fecha_retorno'],
            'hora_retorno' => $validated['hora_retorno'],
            'motivo' => $validated['motivo'],
            'observaciones' => $validated['observaciones'],
            'notification_email' => $validated['notification_email'] ?? null,
            'status' => 'pendiente',
            'created_by' => $user->id,
        ]);

        $this->sendNotifications($exitPermit);

        return redirect()->route('exit-permits.index')
            ->with('success', 'Permiso de salida solicitado exitosamente.');
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->input('status', '');

        $permitsQuery = ExitPermit::with(['user', 'manager'])
            ->forUser($user->id)
            ->latest();

        if (! empty($status)) {
            $permitsQuery->byStatus($status);
        }

        $permits = $permitsQuery->paginate(15);

        $stats = [
            'total' => ExitPermit::forUser($user->id)->count(),
            'pendiente' => ExitPermit::forUser($user->id)->byStatus('pendiente')->count(),
            'aprobada' => ExitPermit::forUser($user->id)->byStatus('aprobada')->count(),
            'rechazada' => ExitPermit::forUser($user->id)->byStatus('rechazada')->count(),
        ];

        return Inertia::render('ExitPermits/Index', [
            'permits' => $permits,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    protected function sendNotifications(ExitPermit $exitPermit)
    {
        $recipients = [];

        // Notify the employee when someone else (supervisor) creates a permit for them
        if ((int) $exitPermit->created_by !== (int) $exitPermit->user_id) {
            $employeeEmail = $exitPermit->notification_email ?? $exitPermit->user->email;
            $recipients[] = $employeeEmail;
        }

        // Notify the manager, unless the manager is the one who created it
        if ($exitPermit->manager && $exitPermit->manager->email) {
            if ((int) $exitPermit->created_by !== (int) $exitPermit->manager_id) {
                $recipients[] = $exitPermit->manager->email;
            }
        }

        // Always include admin notification emails
        $notified = config('exit-permit.notification_emails', '');
        if (! empty($notified)) {
            $extra = array_map('trim', explode(',', $notified));
            $recipients = array_merge($recipients, $extra);
        }

        $recipients = array_unique(array_filter($recipients));

        if (! empty($recipients)) {
            $first = true;
            foreach ($recipients as $email) {
                Mail::to($email)->send(new ExitPermitCreated($exitPermit));
                if ($first) {
                    Log::info('Exit permit email sent', [
                        'exit_permit_id' => $exitPermit->id,
                        'recipients' => $recipients,
                    ]);
                    $first = false;
                }
            }
        } else {
            Log::warning('Exit permit created but no recipients configured', [
                'exit_permit_id' => $exitPermit->id,
                'user_id' => $exitPermit->user_id,
            ]);
        }
    }
}
