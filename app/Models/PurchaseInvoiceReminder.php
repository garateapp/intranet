<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseInvoiceReminder extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['sent_at' => 'datetime'];
    }

    public function approval(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceApproval::class, 'purchase_invoice_approval_id');
    }

    public function responsible(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceApprovalResponsible::class, 'purchase_invoice_approval_responsible_id');
    }
}
