<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Interview;

/**
 * Policy para controlar acceso a entrevistas.
 *
 * Lógica:
 * - SuperAdmin/Reclutador: acceso total
 * - Gerente de Contratación: solo entrevistas en postulaciones de sus vacantes
 */
class InterviewPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager']);
    }

    public function view(User $user, Interview $interview): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter'])) {
            return true;
        }

        $vacancy = $interview->application?->vacancy;

        return $vacancy && ($user->id === $vacancy->hiring_manager_id || $user->id === $vacancy->created_by);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager']);
    }

    public function update(User $user, Interview $interview): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter'])) {
            return true;
        }

        return $this->view($user, $interview);
    }

    public function delete(User $user, Interview $interview): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter']);
    }
}
