<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Application;

/**
 * Policy para controlar acceso a aplicaciones/postulaciones.
 *
 * Lógica:
 * - SuperAdmin/Reclutador: acceso global
 * - Gerente de Contratación: solo postulaciones en sus vacantes
 */
class ApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager','admin']);
    }

    public function view(User $user, Application $application): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter','admin'])) {
            return true;
        }

        return $user->id === $application->vacancy->hiring_manager_id
            || $user->id === $application->vacancy->created_by;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter','admin']);
    }

    public function update(User $user, Application $application): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter','admin'])) {
            return true;
        }

        return $user->id === $application->vacancy->hiring_manager_id;
    }

    public function delete(User $user, Application $application): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter','admin']);
    }
}
