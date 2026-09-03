<?php

namespace App\Policies;

use App\Models\PurchaseInvoiceApproval;
use App\Models\User;

class PurchaseInvoiceApprovalPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->hasAnyRole(['super_admin', 'admin']) ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, PurchaseInvoiceApproval $approval): bool
    {
        return $user->hasRole('cobrador')
            || $approval->activeResponsibles()->where('user_id', $user->id)->exists();
    }

    public function approve(User $user, PurchaseInvoiceApproval $approval): bool
    {
        return $approval->activeResponsibles()->where('user_id', $user->id)->exists();
    }

    public function object(User $user, PurchaseInvoiceApproval $approval): bool
    {
        return $approval->activeResponsibles()->where('user_id', $user->id)->exists();
    }

    public function accounting(User $user): bool
    {
        return $user->hasRole('cobrador');
    }

    public function administer(User $user): bool
    {
        return false;
    }

    public function manageUnassigned(User $user): bool
    {
        return $user->hasRole('cobrador');
    }

    public function assignResponsible(User $user): bool
    {
        return $user->hasRole('cobrador');
    }

    public function assignPurchaseOrder(User $user): bool
    {
        return $user->hasRole('cobrador');
    }

    public function assignSubstitute(User $user): bool
    {
        return $user->hasRole('cobrador');
    }

    public function sendReminder(User $user): bool
    {
        return $user->hasRole('cobrador');
    }
}
