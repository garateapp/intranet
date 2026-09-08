<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Garantiza que el usuario tenga un rol con acceso al módulo ATS.
 * Roles permitidos: super_admin, admin, recruiter, hiring_manager.
 */
class EnsureAtsAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->hasAnyRole(['super_admin', 'admin', 'recruiter', 'hiring_manager'])) {
            return redirect()->route('dashboard')
                ->with('error', 'No tienes permiso para acceder a esta área.');
        }

        return $next($request);
    }
}