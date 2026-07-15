<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\Candidate;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use OpenSpout\Common\Entity\Cell;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;

/**
 * Controller para el dashboard principal del módulo ATS.
 * Muestra métricas globales y resumen del pipeline.
 */
class AtsDashboardController extends Controller
{
    /**
     * Dashboard principal con métricas del ATS.
     */
    public function index()
    {
        $user = Auth::user();
        $query = Vacancy::query();

        // Filtro por rol
        if ($user->hasRole('hiring_manager')) {
            $query->where(function ($q) use ($user) {
                $q->where('hiring_manager_id', $user->id)
                  ->orWhere('created_by', $user->id);
            });
        }

        // Estadísticas de vacantes
        $stats = [
            'total_vacancies' => (clone $query)->count(),
            'active_vacancies' => (clone $query)->where('status', 'active')->count(),
            'draft_vacancies' => (clone $query)->where('status', 'draft')->count(),
            'closed_vacancies' => (clone $query)->where('status', 'closed')->count(),
        ];

        // Total de aplicaciones en vacantes del usuario
        $vacancyIds = $query->pluck('id');
        $stats['total_applications'] = Application::whereIn('vacancy_id', $vacancyIds)->count();

        // Últimas vacantes activas con postulaciones recientes
        $recentVacancies = Vacancy::with(['hiringManager', 'applications' => function ($q) {
            $q->with('candidate')->latest()->limit(3);
        }])
            ->active()
            ->latest()
            ->limit(5)
            ->get();

        // Últimas postulaciones recibidas
        $recentApplications = Application::with(['candidate', 'vacancy', 'stage'])
            ->whereIn('vacancy_id', $vacancyIds)
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('ATS/Dashboard', [
            'stats' => $stats,
            'recentVacancies' => $recentVacancies,
            'recentApplications' => $recentApplications,
        ]);
    }

    /**
     * Exportar reporte completo del ATS en Excel.
     * Incluye vacantes, candidatos y postulaciones.
     */
    public function export()
    {
        $user = Auth::user();
        $query = Vacancy::query();

        if ($user->hasRole('hiring_manager')) {
            $query->where(function ($q) use ($user) {
                $q->where('hiring_manager_id', $user->id)
                  ->orWhere('created_by', $user->id);
            });
        }

        $vacancies = $query->with(['hiringManager', 'stages'])->latest()->get();
        $applications = Application::with(['candidate', 'vacancy', 'stage'])
            ->whereIn('vacancy_id', $vacancies->pluck('id'))
            ->latest()
            ->get();

        $tempFile = tempnam(sys_get_temp_dir(), 'ats_report_') . '.xlsx';

        $writer = new Writer();
        $writer->openToFile($tempFile);

        // Hoja 1: Resumen
        $writer->addRow(new Row([Cell::fromValue('REPORTE ATS - ' . now()->format('d/m/Y H:i'))]));
        $writer->addRow(new Row([]));
        $writer->addRow(new Row([
            Cell::fromValue('Total Vacantes'),
            Cell::fromValue($vacancies->count()),
        ]));
        $writer->addRow(new Row([
            Cell::fromValue('Activas'),
            Cell::fromValue($vacancies->where('status', 'active')->count()),
        ]));
        $writer->addRow(new Row([
            Cell::fromValue('En Borrador'),
            Cell::fromValue($vacancies->where('status', 'draft')->count()),
        ]));
        $writer->addRow(new Row([
            Cell::fromValue('Cerradas'),
            Cell::fromValue($vacancies->where('status', 'closed')->count()),
        ]));
        $writer->addRow(new Row([
            Cell::fromValue('Total Postulaciones'),
            Cell::fromValue($applications->count()),
        ]));
        $writer->addRow(new Row([]));

        // Detalle de Vacantes
        $writer->addRow(new Row([Cell::fromValue('VACANTES')]));
        $writer->addRow(new Row([
            Cell::fromValue('Título'),
            Cell::fromValue('Estado'),
            Cell::fromValue('Tipo'),
            Cell::fromValue('Gerente'),
            Cell::fromValue('Salario'),
            Cell::fromValue('Etapas'),
            Cell::fromValue('Postulaciones'),
            Cell::fromValue('Fecha Creación'),
        ]));
        foreach ($vacancies as $v) {
            $writer->addRow(new Row([
                Cell::fromValue($v->title),
                Cell::fromValue($v->status),
                Cell::fromValue($v->job_type),
                Cell::fromValue($v->hiringManager?->name ?? '-'),
                Cell::fromValue($v->salary ? $v->salary_currency . ' ' . number_format($v->salary, 0, ',', '.') : '-'),
                Cell::fromValue($v->stages->count()),
                Cell::fromValue($applications->where('vacancy_id', $v->id)->count()),
                Cell::fromValue($v->created_at->format('d/m/Y')),
            ]));
        }
        $writer->addRow(new Row([]));

        // Postulaciones
        $writer->addRow(new Row([Cell::fromValue('POSTULACIONES')]));
        $writer->addRow(new Row([
            Cell::fromValue('Candidato'),
            Cell::fromValue('Email'),
            Cell::fromValue('Teléfono'),
            Cell::fromValue('Origen'),
            Cell::fromValue('Vacante'),
            Cell::fromValue('Etapa Actual'),
            Cell::fromValue('Fecha Postulación'),
        ]));
        foreach ($applications as $app) {
            $writer->addRow(new Row([
                Cell::fromValue($app->candidate?->name ?? '-'),
                Cell::fromValue($app->candidate?->email ?? '-'),
                Cell::fromValue($app->candidate?->phone ?? '-'),
                Cell::fromValue($app->candidate?->origin ?? '-'),
                Cell::fromValue($app->vacancy?->title ?? '-'),
                Cell::fromValue($app->stage?->name ?? '-'),
                Cell::fromValue($app->applied_at?->format('d/m/Y') ?? '-'),
            ]));
        }

        $writer->close();

        return response()->download($tempFile, 'reporte_ats_' . now()->format('Y-m-d_H-i') . '.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }
}
