<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sincroniza el campo legacy `role` del usuario con los roles de Spatie.
 * Esto garantiza que hasAnyRole() funcione correctamente para todos los usuarios,
 * incluso aquellos que fueron creados antes de instalar Spatie Permission.
 */
class SyncLegacyRoleToSpatie
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role && !$user->hasRole($user->role)) {
            $spatieRole = Role::where('name', $user->role)->first();

            if ($spatieRole) {
                $user->syncRoles([$spatieRole]);
            }
        }

        return $next($request);
    }
}
