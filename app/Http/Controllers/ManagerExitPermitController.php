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
    protected function isNotificationUser(): bool
    {
        $emails = config('exit-permit.notification_emails', '');
        if (empty($emails)) return false;
        $list = array_map('trim', explode(',', $emails));
        return in_array(Auth::user()->email, $list);
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->input('status', '');
        $search = $request->input('search', '');
        $fecha = $request->input('fecha', now()->format('Y-m-d'));

        $permitsQuery = ExitPermit::with(['user', 'manager'])->latest();

        // Notification users see all; managers see only their subordinates
        if (! $this->isNotificationUser()) {
            $permitsQuery->where('manager_id', $user->id);
        }

        if (! empty($status)) {
            $permitsQuery->where('status', $status);
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
                'fecha' => $fecha,
            ],
            'isNotificationUser' => $this->isNotificationUser(),
        ]);
    }

    public function show(ExitPermit $exitPermit)
    {
        $user = Auth::user();

        // Notification users can see any permit; managers only their own
        if (! $this->isNotificationUser() && $exitPermit->manager_id !== $user->id) {
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

        // Ensure the manager owns this permit (notification users can't approve)
        if ($exitPermit->manager_id !== $user->id) {
            abort(403, 'No tienes permiso para modificar esta solicitud.');
        }

        $validated = $request->validate([
            'status' => ['required', 'in:aprobada,rechazada'],
            'rejection_reason' => ['required_if:status,rechazada', 'nullable', 'string', 'max:5000'],
            'con_goce_sueldo' => ['nullable', 'boolean'],
        ]);

        $oldStatus = $exitPermit->status;
        $exitPermit->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'con_goce_sueldo' => $validated['con_goce_sueldo'] ?? $exitPermit->con_goce_sueldo,
            'updated_by' => $user->id,
        ]);

        $this->sendStatusChangeNotification($exitPermit, $oldStatus);

        $message = $validated['status'] === 'aprobada'
            ? 'Solicitud aprobada exitosamente.'
            : 'Solicitud rechazada.';

        return redirect()->route('manager.exit-permits.index')
            ->with('success', $message);
    }

    public function downloadCsv(Request $request)
    {
        if (! $this->isNotificationUser()) {
            abort(403, 'No tienes permiso para descargar este reporte.');
        }

        $fecha = $request->input('fecha', now()->format('Y-m-d'));

        $permits = ExitPermit::with(['user', 'manager'])
            ->whereIn('status', ['aprobada', 'rechazada'])
            ->when($fecha, fn ($q) => $q->whereDate('fecha_salida', $fecha))
            ->orderBy('fecha_salida')
            ->get();

        $filename = "aprobaciones_{$fecha}.csv";
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $columns = [
            'ID', 'Solicitante', 'Email', 'Jefe Directo',
            'Fecha Salida', 'Hora Salida', 'Fecha Retorno', 'Hora Retorno',
            'Motivo', 'Con Goce de Sueldo', 'Estado', 'Observaciones',
        ];

        $callback = function () use ($permits, $columns) {
            $file = fopen('php://output', 'w');
            fwrite($file, "\xEF\xBB\xBF"); // BOM for Excel UTF-8
            fputcsv($file, $columns, ';');

            foreach ($permits as $permit) {
                fputcsv($file, [
                    $permit->id,
                    $permit->user?->name ?? '—',
                    $permit->user?->email ?? '—',
                    $permit->manager?->name ?? '—',
                    $permit->fecha_salida?->format('Y-m-d') ?? '',
                    $permit->hora_salida ?? '',
                    $permit->fecha_retorno?->format('Y-m-d') ?? '',
                    $permit->hora_retorno ?? '',
                    $permit->motivo,
                    $permit->con_goce_sueldo_label,
                    $permit->status_label,
                    $permit->observaciones ?? '',
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
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
