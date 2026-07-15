<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Candidate;

/**
 * Policy para controlar acceso a candidatos.
 *
 * Lógica:
 * - SuperAdmin: acceso total
 * - Reclutador: acceso global a todos los candidatos
 * - Gerente de Contratación: solo ve candidatos en sus vacantes asignadas
 */
class CandidatePolicy
{
    /**
     * Verificar si el usuario puede ver la lista de candidatos.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter', 'hiring_manager']);
    }

    /**
     * Verificar si el usuario puede ver un candidato específico.
     * Solo si tiene al menos una postulación en una vacante que le pertenece.
     */
    public function view(User $user, Candidate $candidate): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter'])) {
            return true;
        }

        // Gerente de contratación: solo si el candidato está en una de sus vacantes
        return $candidate->applications()
            ->whereHas('vacancy', function ($query) use ($user) {
                $query->where('hiring_manager_id', $user->id)
                    ->orWhere('created_by', $user->id);
            })
            ->exists();
    }

    /**
     * Verificar si el usuario puede crear candidatos.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter']);
    }

    /**
     * Verificar si el usuario puede editar un candidato.
     */
    public function update(User $user, Candidate $candidate): bool
    {
        if ($user->hasAnyRole(['super_admin', 'recruiter'])) {
            return true;
        }

        // Gerente puede editar notas de candidatos en sus vacantes
        return $this->view($user, $candidate);
    }

    /**
     * Verificar si el usuario puede eliminar un candidato.
     */
    public function delete(User $user, Candidate $candidate): bool
    {
        return $user->hasAnyRole(['super_admin', 'recruiter']);
    }
}
