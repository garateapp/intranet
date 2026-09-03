<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // Compartir roles y permisos del usuario para control de acceso en frontend
            'permissions' => fn () => [
                'roles' => $request->user()?->getRoleNames()->toArray() ?? [],
                'permissions' => $request->user()?->getAllPermissions()->pluck('name')->toArray() ?? [],
            ],
            'purchaseInvoiceAccess' => fn () => [
                'accounting' => $request->user()?->hasAnyRole(['super_admin', 'cobrador']) || false,
                'admin' => $request->user()?->hasRole('super_admin') || false,
                'manageUnassigned' => $request->user()?->hasAnyRole(['super_admin', 'cobrador']) || false,
                'sendReminder' => $request->user()?->hasAnyRole(['super_admin', 'cobrador']) || false,
                'manageRoles' => $request->user()?->hasRole('super_admin') || false,
            ],
        ];
    }
}
