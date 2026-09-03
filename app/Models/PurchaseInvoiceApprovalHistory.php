<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseInvoiceApprovalHistory extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'purchase_invoice_approval_history';

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['metadata' => 'array', 'created_at' => 'datetime'];
    }

    public function approval(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceApproval::class, 'purchase_invoice_approval_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
