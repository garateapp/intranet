<?php

namespace App\Http\Controllers;

use App\Models\Vacancy;
use App\Models\Candidate;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use OpenSpout\Writer\Common\Options\WriterOptions;
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
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('REPORTE ATS - ' . now()->format('d/m/Y H:i')),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('Total Vacantes'),
            \OpenSpout\Common\Entity\Cell::fromValue($vacancies->count()),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('Activas'),
            \OpenSpout\Common\Entity\Cell::fromValue($vacancies->where('status', 'active')->count()),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('En Borrador'),
            \OpenSpout\Common\Entity\Cell::fromValue($vacancies->where('status', 'draft')->count()),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('Cerradas'),
            \OpenSpout\Common\Entity\Cell::fromValue($vacancies->where('status', 'closed')->count()),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('Total Postulaciones'),
            \OpenSpout\Common\Entity\Cell::fromValue($applications->count()),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([]));

        // Hoja 1: Detalle de Vacantes
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('VACANTES'),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('Título'),
            \OpenSpout\Common\Entity\Cell::fromValue('Estado'),
            \OpenSpout\Common\Entity\Cell::fromValue('Tipo'),
            \OpenSpout\Common\Entity\Cell::fromValue('Gerente'),
            \OpenSpout\Common\Entity\Cell::fromValue('Salario'),
            \OpenSpout\Common\Entity\Cell::fromValue('Etapas'),
            \OpenSpout\Common\Entity\Cell::fromValue('Postulaciones'),
            \OpenSpout\Common\Entity\Cell::fromValue('Fecha Creación'),
        ]));
        foreach ($vacancies as $v) {
            $writer->addRow(new \OpenSpout\Common\Entity\Row([
                \OpenSpout\Common\Entity\Cell::fromValue($v->title),
                \OpenSpout\Common\Entity\Cell::fromValue($v->status),
                \OpenSpout\Common\Entity\Cell::fromValue($v->job_type),
                \OpenSpout\Common\Entity\Cell::fromValue($v->hiringManager?->name ?? '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($v->salary ? $v->salary_currency . ' ' . number_format($v->salary, 0, ',', '.') : '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($v->stages->count()),
                \OpenSpout\Common\Entity\Cell::fromValue($applications->where('vacancy_id', $v->id)->count()),
                \OpenSpout\Common\Entity\Cell::fromValue($v->created_at->format('d/m/Y')),
            ]));
        }
        $writer->addRow(new \OpenSpout\Common\Entity\Row([]));

        // Hoja 2: Todas las Postulaciones
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('POSTULACIONES'),
        ]));
        $writer->addRow(new \OpenSpout\Common\Entity\Row([
            \OpenSpout\Common\Entity\Cell::fromValue('Candidato'),
            \OpenSpout\Common\Entity\Cell::fromValue('Email'),
            \OpenSpout\Common\Entity\Cell::fromValue('Teléfono'),
            \OpenSpout\Common\Entity\Cell::fromValue('Origen'),
            \OpenSpout\Common\Entity\Cell::fromValue('Vacante'),
            \OpenSpout\Common\Entity\Cell::fromValue('Etapa Actual'),
            \OpenSpout\Common\Entity\Cell::fromValue('Fecha Postulación'),
        ]));
        foreach ($applications as $app) {
            $writer->addRow(new \OpenSpout\Common\Entity\Row([
                \OpenSpout\Common\Entity\Cell::fromValue($app->candidate?->name ?? '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($app->candidate?->email ?? '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($app->candidate?->phone ?? '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($app->candidate?->origin ?? '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($app->vacancy?->title ?? '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($app->stage?->name ?? '-'),
                \OpenSpout\Common\Entity\Cell::fromValue($app->applied_at?->format('d/m/Y') ?? '-'),
            ]));
        }

        $writer->close();

        return response()->download($tempFile, 'reporte_ats_' . now()->format('Y-m-d_H-i') . '.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }
}
