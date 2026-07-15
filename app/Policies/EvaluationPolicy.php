<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Evaluation;

/**
 * Policy para controlar acceso a evaluaciones.
 *
 * Lógica:
 * - SuperAdmin/Reclutador: acceso total
 * - Gerente de Contratación: puede crear/ver evaluaciones en sus vacantes
 * - Un usuario solo puede editar/eliminar sus propias evaluaciones
 */
class EvaluationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager','admin']);
    }

    public function view(User $user, Evaluation $evaluation): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter','admin'])) {
            return true;
        }

        // Puede ver si es el evaluador o si la vacante le pertenece
        if ($evaluation->evaluator_id === $user->id) {
            return true;
        }

        $vacancy = $evaluation->interview?->application?->vacancy;

        return $vacancy && ($user->id === $vacancy->hiring_manager_id || $user->id === $vacancy->created_by);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager','admin']);
    }

    public function update(User $user, Evaluation $evaluation): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter','admin'])) {
            return true;
        }

        // Solo puede editar sus propias evaluaciones
        return $evaluation->evaluator_id === $user->id;
    }

    public function delete(User $user, Evaluation $evaluation): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter','admin'])) {
            return true;
        }

        return $evaluation->evaluator_id === $user->id;
    }
}
