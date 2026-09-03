<?php

namespace App\Models;

use App\Enums\PurchaseInvoiceApprovalStatus;
use App\Enums\PurchaseInvoiceAssociationStatus;
use App\Enums\PurchaseInvoiceResponsibleSource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseInvoiceApproval extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'factura_fecha' => 'date:Y-m-d',
            'factura_vencimiento' => 'date:Y-m-d',
            'factura_total' => 'decimal:4',
            'estado_aprobacion' => PurchaseInvoiceApprovalStatus::class,
            'estado_asociacion' => PurchaseInvoiceAssociationStatus::class,
            'responsible_source' => PurchaseInvoiceResponsibleSource::class,
            'association_conflict' => 'boolean',
            'assigned_at' => 'datetime',
            'substitute_assigned_at' => 'datetime',
            'aprobado_at' => 'datetime',
            'objetado_at' => 'datetime',
            'cerrado_at' => 'datetime',
            'fecha_primera_sincronizacion' => 'datetime',
            'fecha_ultima_sincronizacion' => 'datetime',
        ];
    }

    public function lines(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceApprovalLine::class);
    }

    public function responsibles(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceApprovalResponsible::class);
    }

    public function activeResponsibles(): HasMany
    {
        return $this->responsibles()->where('active', true);
    }

    public function history(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceApprovalHistory::class)->latest('created_at');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceReminder::class);
    }

    public function responsibleUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible_user_id');
    }

    public function manualResponsibleUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manual_responsible_user_id');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function substituteUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'substitute_user_id');
    }

    public function substituteAssignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'substitute_assigned_by');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceApprovalAttachment::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'aprobado_por');
    }

    public function objectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'objetado_por');
    }

    public function objectionReason(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceObjectionReason::class, 'motivo_objecion_id');
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->hasAnyRole(['super_admin', 'cobrador'])) {
            return $query;
        }

        return $query->whereHas('activeResponsibles', fn (Builder $responsibles): Builder => $responsibles->where('user_id', $user->id)
        );
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('estado_aprobacion', PurchaseInvoiceApprovalStatus::Pending->value);
    }
}
