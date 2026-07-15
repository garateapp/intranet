<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Stage;

/**
 * Policy para controlar acceso a etapas globales del pipeline.
 *
 * Lógica:
 * - SuperAdmin/Reclutador: acceso total
 * - Gerente de Contratación: solo lectura
 */
class StagePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager']);
    }

    public function view(User $user, Stage $stage): bool
    {
        return true; // Todos los roles pueden ver etapas
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter']);
    }

    public function update(User $user, Stage $stage): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter']);
    }

    public function delete(User $user, Stage $stage): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter']);
    }
}
