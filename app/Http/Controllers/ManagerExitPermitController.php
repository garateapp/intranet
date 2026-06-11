<?php

namespace App\Http\Controllers;

use App\Mail\ExitPermitStatusChanged;
use App\Models\ExitPermit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ManagerExitPermitController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->input('status', '');
        $search = $request->input('search', '');

        $permitsQuery = ExitPermit::with(['user', 'manager'])
            ->where('manager_id', $user->id)
            ->latest();

        if (! empty($status)) {
            $permitsQuery->where('status', $status);
        }

        if (! empty($search)) {
            $permitsQuery->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $permits = $permitsQuery->paginate(15);

        $stats = [
            'total' => ExitPermit::where('manager_id', $user->id)->count(),
            'pendiente' => ExitPermit::where('manager_id', $user->id)->where('status', 'pendiente')->count(),
            'aprobada' => ExitPermit::where('manager_id', $user->id)->where('status', 'aprobada')->count(),
            'rechazada' => ExitPermit::where('manager_id', $user->id)->where('status', 'rechazada')->count(),
        ];

        return Inertia::render('ManagerExitPermits/Index', [
            'permits' => $permits,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function show(ExitPermit $exitPermit)
    {
        $user = Auth::user();

        // Ensure the manager owns this permit
        if ($exitPermit->manager_id !== $user->id) {
            abort(403, 'No tienes permiso para ver esta solicitud.');
        }

        $exitPermit->load(['user', 'manager']);

        return Inertia::render('ManagerExitPermits/Show', [
            'permit' => $exitPermit,
        ]);
    }

    public function updateStatus(Request $request, ExitPermit $exitPermit)
    {
        $user = Auth::user();

        // Ensure the manager owns this permit
        if ($exitPermit->manager_id !== $user->id) {
            abort(403, 'No tienes permiso para modificar esta solicitud.');
        }

        $validated = $request->validate([
            'status' => ['required', 'in:aprobada,rechazada'],
            'rejection_reason' => ['required_if:status,rechazada', 'nullable', 'string', 'max:5000'],
        ]);

        $oldStatus = $exitPermit->status;
        $exitPermit->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'updated_by' => $user->id,
        ]);

        $this->sendStatusChangeNotification($exitPermit, $oldStatus);

        $message = $validated['status'] === 'aprobada'
            ? 'Solicitud aprobada exitosamente.'
            : 'Solicitud rechazada.';

        return redirect()->route('manager.exit-permits.index')
            ->with('success', $message);
    }

    protected function sendStatusChangeNotification(ExitPermit $exitPermit, string $oldStatus): void
    {
        $recipients = [];

        // Always notify the solicitante (use notification_email if provided)
        $employeeEmail = $exitPermit->notification_email ?? $exitPermit->user?->email;
        if ($employeeEmail) {
            $recipients[] = $employeeEmail;
        }

        // Also notify admin emails from config
        $additionalEmails = config('exit-permit.notification_emails');
        if (! empty($additionalEmails)) {
            $extra = array_map('trim', explode(',', $additionalEmails));
            $recipients = array_merge($recipients, $extra);
        }

        $recipients = array_unique(array_filter($recipients));

        foreach ($recipients as $email) {
            Mail::to($email)->send(new ExitPermitStatusChanged($exitPermit, $oldStatus));
        }
    }
}
