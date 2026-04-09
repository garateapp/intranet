<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserActivityController extends Controller
{
    /**
     * Get current user's activity log.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $activities = UserActivity::forUser($user->id)
            ->when($request->input('action'), fn ($q) => $q->byAction($request->input('action')))
            ->when($request->input('date'), fn ($q) => $q->byDate($request->input('date')))
            ->when($request->input('device'), function ($q) use ($request) {
                $device = $request->input('device');
                if (in_array($device, ['desktop', 'mobile', 'tablet'])) {
                    $q->where('device', $device);
                }
            })
            ->latest()
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Get activity stats for current user.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $days = (int) $request->input('days', 30);

        $stats = [
            'total_activities' => UserActivity::forUser($user->id)->recent($days)->count(),
            'by_action' => UserActivity::forUser($user->id)
                ->recent($days)
                ->selectRaw('action, count(*) as count')
                ->groupBy('action')
                ->pluck('count', 'action'),
            'by_device' => UserActivity::forUser($user->id)
                ->recent($days)
                ->selectRaw('device, count(*) as count')
                ->groupBy('device')
                ->pluck('count', 'device'),
            'by_browser' => UserActivity::forUser($user->id)
                ->recent($days)
                ->selectRaw('browser, count(*) as count')
                ->groupBy('browser')
                ->pluck('count', 'browser'),
            'by_os' => UserActivity::forUser($user->id)
                ->recent($days)
                ->selectRaw('os, count(*) as count')
                ->groupBy('os')
                ->pluck('count', 'os'),
            'unique_ips' => UserActivity::forUser($user->id)
                ->recent($days)
                ->distinct('ip_address')
                ->count('ip_address'),
            'last_login' => UserActivity::forUser($user->id)
                ->byAction('login')
                ->latest()
                ->first(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Export current user's activity as CSV.
     */
    public function export(Request $request)
    {
        $user = $request->user();

        $activities = UserActivity::forUser($user->id)
            ->recent(90)
            ->latest()
            ->get();

        $csv = "Fecha,Acción,URL,Método,IP,Navegador,Sistema Operativo,Dispositivo\n";

        foreach ($activities as $activity) {
            $csv .= sprintf(
                "%s,%s,%s,%s,%s,%s,%s,%s\n",
                $activity->created_at->format('Y-m-d H:i:s'),
                $activity->action,
                $activity->url,
                $activity->method,
                $activity->ip_address,
                $activity->browser,
                $activity->os,
                $activity->device,
            );
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="actividad_usuario.csv"',
        ]);
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Admin: Get all user activities.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $activities = UserActivity::with('user:id,name,email,role,department')
            ->when($request->input('user_id'), fn ($q) => $q->forUser($request->input('user_id')))
            ->when($request->input('action'), fn ($q) => $q->byAction($request->input('action')))
            ->when($request->input('date_from'), fn ($q) => $q->whereDate('created_at', '>=', $request->input('date_from')))
            ->when($request->input('date_to'), fn ($q) => $q->whereDate('created_at', '<=', $request->input('date_to')))
            ->when($request->input('device'), function ($q) use ($request) {
                $device = $request->input('device');
                if (in_array($device, ['desktop', 'mobile', 'tablet'])) {
                    $q->where('device', $device);
                }
            })
            ->latest()
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * Admin: Get platform-wide activity stats.
     */
    public function adminStats(Request $request): JsonResponse
    {
        $days = (int) $request->input('days', 30);

        $stats = [
            'total_activities' => UserActivity::recent($days)->count(),
            'unique_users' => UserActivity::recent($days)->distinct('user_id')->count('user_id'),
            'by_action' => UserActivity::recent($days)
                ->selectRaw('action, count(*) as count')
                ->groupBy('action')
                ->pluck('count', 'action'),
            'by_device' => UserActivity::recent($days)
                ->selectRaw('device, count(*) as count')
                ->groupBy('device')
                ->pluck('count', 'device'),
            'by_browser' => UserActivity::recent($days)
                ->selectRaw('browser, count(*) as count')
                ->groupBy('browser')
                ->pluck('count', 'browser'),
            'by_os' => UserActivity::recent($days)
                ->selectRaw('os, count(*) as count')
                ->groupBy('os')
                ->pluck('count', 'os'),
            'most_active_users' => UserActivity::recent($days)
                ->selectRaw('user_id, count(*) as count')
                ->groupBy('user_id')
                ->orderByDesc('count')
                ->limit(10)
                ->with('user:id,name,email,department')
                ->get(),
            'last_logins' => UserActivity::byAction('login')
                ->with('user:id,name,email,department')
                ->latest()
                ->limit(10)
                ->get(),
            'recent_errors' => UserActivity::byAction('api_request')
                ->where('method', '!=', 'GET')
                ->recent(7)
                ->with('user:id,name,email')
                ->latest()
                ->limit(10)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Admin: Export all activity as CSV.
     */
    public function adminExport(Request $request)
    {
        $activities = UserActivity::with('user:id,name,email,department')
            ->recent(90)
            ->latest()
            ->get();

        $csv = "Fecha,Usuario,Rol,Acción,URL,Método,IP,Navegador,Sistema Operativo,Dispositivo\n";

        foreach ($activities as $activity) {
            $csv .= sprintf(
                "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                $activity->created_at->format('Y-m-d H:i:s'),
                $activity->user?->name ?? 'N/A',
                $activity->user?->role ?? 'N/A',
                $activity->action,
                $activity->url,
                $activity->method,
                $activity->ip_address,
                $activity->browser,
                $activity->os,
                $activity->device,
            );
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="actividad_plataforma.csv"',
        ]);
    }

    /**
     * Admin: Get detailed activity for a specific user.
     */
    public function adminUserDetail(Request $request, User $user): JsonResponse
    {
        $days = (int) $request->input('days', 30);

        $stats = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $user->department,
            ],
            'total_activities' => UserActivity::forUser($user->id)->recent($days)->count(),
            'last_login' => UserActivity::forUser($user->id)->byAction('login')->latest()->first(),
            'by_action' => UserActivity::forUser($user->id)
                ->recent($days)
                ->selectRaw('action, count(*) as count')
                ->groupBy('action')
                ->pluck('count', 'action'),
            'by_device' => UserActivity::forUser($user->id)
                ->recent($days)
                ->selectRaw('device, count(*) as count')
                ->groupBy('device')
                ->pluck('count', 'device'),
            'unique_ips' => UserActivity::forUser($user->id)
                ->recent($days)
                ->distinct('ip_address')
                ->count('ip_address'),
            'activities' => UserActivity::forUser($user->id)
                ->recent($days)
                ->latest()
                ->paginate(20),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
