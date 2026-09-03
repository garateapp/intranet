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

        if ($user && $user->role && $user->roles()->doesntExist()) {
            $legacyRole = $user->role === 'user' ? 'usuario' : $user->role;
            $spatieRole = Role::where('name', $legacyRole)->first();

            if ($spatieRole) {
                $user->assignRole($spatieRole);
            }
        }

        return $next($request);
    }
}
