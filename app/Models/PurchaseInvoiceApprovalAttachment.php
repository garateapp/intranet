<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseInvoiceApprovalAttachment extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function approval(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceApproval::class, 'purchase_invoice_approval_id');
    }

    public function responsible(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceApprovalResponsible::class, 'purchase_invoice_approval_responsible_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
