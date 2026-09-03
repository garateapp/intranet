<?php

namespace App\Models;

use App\Enums\PurchaseInvoiceResponsibleSource;
use App\Enums\PurchaseInvoiceResponsibleStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseInvoiceApprovalResponsible extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'estado' => PurchaseInvoiceResponsibleStatus::class,
            'source' => PurchaseInvoiceResponsibleSource::class,
            'active' => 'boolean',
            'aprobado_at' => 'datetime',
            'objetado_at' => 'datetime',
        ];
    }

    public function approval(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceApproval::class, 'purchase_invoice_approval_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function objectionReason(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceObjectionReason::class, 'motivo_objecion_id');
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceReminder::class, 'purchase_invoice_approval_responsible_id');
    }
}
