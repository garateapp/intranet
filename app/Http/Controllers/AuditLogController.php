<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->input('user_id', '');
        $action = $request->input('action', '');
        $module = $request->input('module', '');
        $dateFrom = $request->input('date_from', '');
        $dateTo = $request->input('date_to', '');

        $query = AuditLog::with(['user', 'auditable']);

        if (! empty($userId)) {
            $query->byUser($userId);
        }

        if (! empty($action)) {
            $query->byAction($action);
        }

        if (! empty($module)) {
            $query->forModule($module);
        }

        if (! empty($dateFrom)) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if (! empty($dateTo)) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $logs = $query->latest()->paginate(25);

        $users = User::orderBy('name')->get(['id', 'name']);

        $modules = [
            'OrganizationalUnit' => 'Organigrama',
            'OnboardingStage' => 'Onboarding (Etapas)',
            'OnboardingTask' => 'Onboarding (Tareas)',
            'Document' => 'Documentos',
            'Service' => 'Servicios',
            'RequestType' => 'Tipos de Solicitud',
            'UserRequest' => 'Solicitudes',
            'FaqCategory' => 'Categorías FAQ',
            'Faq' => 'FAQs',
            'CorporateEvent' => 'Eventos',
            'Post' => 'Posts',
            'Category' => 'Categorías',
            'Link' => 'Enlaces',
            'User' => 'Usuarios',
        ];

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
            'users' => $users,
            'modules' => $modules,
            'filters' => [
                'user_id' => $userId,
                'action' => $action,
                'module' => $module,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
}
