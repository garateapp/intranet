<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vacancy;

/**
 * Policy para controlar acceso a vacantes.
 *
 * Lógica:
 * - SuperAdmin: acceso total
 * - Reclutador: acceso global a todas las vacantes
 * - Gerente de Contratación: solo ve vacantes donde es hiring_manager o creador
 */
class VacancyPolicy
{
    /**
     * Verificar si el usuario puede ver la lista de vacantes.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager','admin']);
    }

    /**
     * Verificar si el usuario puede ver una vacante específica.
     */
    public function view(User $user, Vacancy $vacancy): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter', 'admin'])) {
            return true;
        }

        // Gerente de contratación solo ve sus vacantes asignadas o creadas
        return $user->id === $vacancy->hiring_manager_id
            || $user->id === $vacancy->created_by;
    }

    /**
     * Verificar si el usuario puede crear vacantes.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter','admin']);
    }

    /**
     * Verificar si el usuario puede editar una vacante.
     */
    public function update(User $user, Vacancy $vacancy): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter','admin'])) {
            return true;
        }

        return $user->id === $vacancy->hiring_manager_id;
    }

    /**
     * Verificar si el usuario puede eliminar una vacante.
     */
    public function delete(User $user, Vacancy $vacancy): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter','admin']);
    }
}
