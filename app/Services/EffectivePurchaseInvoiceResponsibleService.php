<?php

namespace App\Services;

use App\Enums\PurchaseInvoiceResponsibleSource;
use App\Models\PurchaseInvoiceApproval;
use App\Models\User;
use Illuminate\Support\Collection;

class EffectivePurchaseInvoiceResponsibleService
{
    /** @return Collection<int, User> */
    public function users(PurchaseInvoiceApproval $approval): Collection
    {
        if ($approval->substitute_user_id !== null) {
            $user = $approval->relationLoaded('substituteUser')
                ? $approval->substituteUser
                : $approval->substituteUser()->first();

            return $user ? collect([$user]) : collect();
        }

        if ($approval->manual_responsible_user_id !== null) {
            $user = $approval->relationLoaded('manualResponsibleUser')
                ? $approval->manualResponsibleUser
                : $approval->manualResponsibleUser()->first();

            return $user ? collect([$user]) : collect();
        }

        return $approval->activeResponsibles()
            ->where('source', PurchaseInvoiceResponsibleSource::SapOwner->value)
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter()
            ->unique('id')
            ->values();
    }

    public function primary(PurchaseInvoiceApproval $approval): ?User
    {
        return $this->users($approval)->first();
    }

    public function source(PurchaseInvoiceApproval $approval): ?PurchaseInvoiceResponsibleSource
    {
        if ($approval->substitute_user_id !== null) {
            return PurchaseInvoiceResponsibleSource::Substitute;
        }

        if ($approval->manual_responsible_user_id !== null) {
            return PurchaseInvoiceResponsibleSource::Manual;
        }

        return $this->users($approval)->isNotEmpty()
            ? PurchaseInvoiceResponsibleSource::SapOwner
            : null;
    }
}
