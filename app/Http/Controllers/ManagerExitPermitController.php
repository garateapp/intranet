<?php

namespace App\Http\Controllers;

use App\Models\ExitPermit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $search = $request->input('search', '');
        $fecha = $request->input('fecha', now()->format('Y-m-d'));

        $permitsQuery = ExitPermit::with(['user', 'manager'])
            ->where('manager_id', $user->id)
            ->latest();

        if (! empty($search)) {
            $permitsQuery->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if (! empty($fecha)) {
            $permitsQuery->whereDate('fecha_salida', $fecha);
        }

        $permits = $permitsQuery->paginate(15);

        $baseQuery = ExitPermit::where('manager_id', $user->id);
        $stats = [
            'total' => (clone $baseQuery)->count(),
            'pendiente' => (clone $baseQuery)->where('status', 'pendiente')->count(),
            'visada' => (clone $baseQuery)->where('status', 'visada')->count(),
            'con_goce' => (clone $baseQuery)->where('con_goce_sueldo', true)->count(),
            'sin_goce' => (clone $baseQuery)->where('con_goce_sueldo', false)->count(),
        ];

        return Inertia::render('ManagerExitPermits/Index', [
            'permits' => $permits,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'fecha' => $fecha,
            ],
            'isNotificationUser' => $this->isNotificationUser(),
        ]);
    }

    public function show(ExitPermit $exitPermit)
    {
        $user = Auth::user();

        if ($exitPermit->manager_id !== $user->id) {
            abort(403, 'No tienes permiso para ver esta solicitud.');
        }

        $exitPermit->load(['user', 'manager']);

        return Inertia::render('ManagerExitPermits/Show', [
            'permit' => $exitPermit,
        ]);
    }

    public function visar(Request $request, ExitPermit $exitPermit)
    {
        $user = Auth::user();

        if ($exitPermit->manager_id !== $user->id) {
            abort(403, 'No tienes permiso para visar esta solicitud.');
        }

        $validated = $request->validate([
            'con_goce_sueldo' => ['required', 'boolean'],
        ]);

        $exitPermit->update([
            'status' => 'visada',
            'con_goce_sueldo' => $validated['con_goce_sueldo'],
            'updated_by' => $user->id,
        ]);

        $label = $validated['con_goce_sueldo'] ? 'con goce' : 'sin goce';

        return redirect()->route('manager.exit-permits.index')
            ->with('success', "Permiso visado como {$label} de sueldo.");
    }

    public function downloadCsv(Request $request)
    {
        if (! $this->isNotificationUser()) {
            abort(403, 'No tienes permiso para descargar este reporte.');
        }

        $fecha = $request->input('fecha', now()->format('Y-m-d'));

        $permits = ExitPermit::with(['user', 'manager'])
            ->where('manager_id', Auth::id())
            ->where('status', 'visada')
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
}
