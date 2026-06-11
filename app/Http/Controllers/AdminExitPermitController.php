<?php

namespace App\Http\Controllers;

use App\Models\ExitPermit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminExitPermitController extends Controller
{
    protected function isNotificationUser(): bool
    {
        $emails = config('exit-permit.notification_emails', '');
        if (empty($emails)) return false;
        $list = array_map('trim', explode(',', $emails));
        return in_array(Auth::user()->email, $list);
    }

    protected function authorizeAccess(): void
    {
        if (! Auth::user()->isAdmin() && ! $this->isNotificationUser()) {
            abort(403, 'No tienes permiso para acceder a esta sección.');
        }
    }

    public function index(Request $request)
    {
        $this->authorizeAccess();

        $status = $request->input('status', '');
        $search = $request->input('search', '');
        $fecha = $request->input('fecha', now()->format('Y-m-d'));

        $permitsQuery = ExitPermit::with(['user', 'manager'])->latest();

        if (! empty($status)) {
            $permitsQuery->byStatus($status);
        }

        if (! empty($search)) {
            $permitsQuery->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if (! empty($fecha)) {
            $permitsQuery->whereDate('fecha_salida', $fecha);
        }

        $permits = $permitsQuery->paginate(15);

        $stats = [
            'total' => ExitPermit::count(),
            'pendiente' => ExitPermit::byStatus('pendiente')->count(),
            'aprobada' => ExitPermit::byStatus('aprobada')->count(),
            'rechazada' => ExitPermit::byStatus('rechazada')->count(),
        ];

        return Inertia::render('AdminExitPermits/Index', [
            'permits' => $permits,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'fecha' => $fecha,
            ],
        ]);
    }

    public function show(ExitPermit $exitPermit)
    {
        $this->authorizeAccess();

        $exitPermit->load(['user', 'manager']);

        return Inertia::render('AdminExitPermits/Show', [
            'permit' => $exitPermit,
        ]);
    }

    public function updateStatus(Request $request, ExitPermit $exitPermit)
    {
        $this->authorizeAccess();

        $validated = $request->validate([
            'status' => ['required', 'in:pendiente,aprobada,rechazada'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
            'rejection_reason' => ['nullable', 'string', 'max:5000'],
        ]);

        $exitPermit->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $exitPermit->admin_notes,
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'updated_by' => Auth::id(),
        ]);

        return redirect()->route('admin.exit-permits.show', $exitPermit)
            ->with('success', 'Estado actualizado exitosamente.');
    }
}
