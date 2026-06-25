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
        $periodo = $request->input('periodo', 'hoy');
        $fecha_desde = $request->input('fecha_desde', now()->format('Y-m-d'));
        $fecha_hasta = $request->input('fecha_hasta', now()->format('Y-m-d'));

        // Calculate date range based on period
        $desde = $fecha_desde;
        $hasta = $fecha_hasta;

        if ($periodo === 'hoy') {
            $desde = now()->format('Y-m-d');
            $hasta = now()->format('Y-m-d');
        } elseif ($periodo === 'mes') {
            $desde = now()->startOfMonth()->format('Y-m-d');
            $hasta = now()->endOfMonth()->format('Y-m-d');
        } elseif ($periodo === 'año') {
            $desde = now()->startOfYear()->format('Y-m-d');
            $hasta = now()->endOfYear()->format('Y-m-d');
        }

        $permitsQuery = ExitPermit::with(['user', 'manager'])->latest();

        if (! $this->isNotificationUser()) {
            $permitsQuery->where('manager_id', $user->id);
        }

        if (! empty($search)) {
            $permitsQuery->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if (! empty($desde)) {
            $permitsQuery->whereDate('fecha_salida', '>=', $desde);
        }

        if (! empty($hasta)) {
            $permitsQuery->whereDate('fecha_salida', '<=', $hasta);
        }

        $permits = $permitsQuery->paginate(15);

        // Stats use same date range
        $statsQuery = $this->isNotificationUser() ? ExitPermit::query() : ExitPermit::where('manager_id', $user->id);

        if (! empty($desde)) {
            $statsQuery->whereDate('fecha_salida', '>=', $desde);
        }
        if (! empty($hasta)) {
            $statsQuery->whereDate('fecha_salida', '<=', $hasta);
        }

        $stats = [
            'total' => (clone $statsQuery)->count(),
            'pendiente' => (clone $statsQuery)->where('status', 'pendiente')->count(),
            'visada' => (clone $statsQuery)->where('status', 'visada')->count(),
            'con_goce' => (clone $statsQuery)->where('con_goce_sueldo', true)->count(),
            'sin_goce' => (clone $statsQuery)->where('con_goce_sueldo', false)->count(),
        ];

        return Inertia::render('ManagerExitPermits/Index', [
            'permits' => $permits,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'periodo' => $periodo,
                'fecha_desde' => $desde,
                'fecha_hasta' => $hasta,
            ],
            'isNotificationUser' => $this->isNotificationUser(),
        ]);
    }

    public function show(ExitPermit $exitPermit)
    {
        $user = Auth::user();

        if (! $this->isNotificationUser() && $exitPermit->manager_id !== $user->id) {
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

        $periodo = $request->input('periodo', 'hoy');
        $fecha_desde = $request->input('fecha_desde', now()->format('Y-m-d'));
        $fecha_hasta = $request->input('fecha_hasta', now()->format('Y-m-d'));

        $desde = $fecha_desde;
        $hasta = $fecha_hasta;

        if ($periodo === 'hoy') {
            $desde = now()->format('Y-m-d');
            $hasta = now()->format('Y-m-d');
        } elseif ($periodo === 'mes') {
            $desde = now()->startOfMonth()->format('Y-m-d');
            $hasta = now()->endOfMonth()->format('Y-m-d');
        } elseif ($periodo === 'año') {
            $desde = now()->startOfYear()->format('Y-m-d');
            $hasta = now()->endOfYear()->format('Y-m-d');
        }

        $permits = ExitPermit::with(['user', 'manager'])
            ->where('status', 'visada')
            ->when(! $this->isNotificationUser(), fn ($q) => $q->where('manager_id', Auth::id()))
            ->when($desde, fn ($q) => $q->whereDate('fecha_salida', '>=', $desde))
            ->when($hasta, fn ($q) => $q->whereDate('fecha_salida', '<=', $hasta))
            ->orderBy('fecha_salida')
            ->get();

        $filename = "solicitudes_{$desde}_al_{$hasta}.csv";
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
