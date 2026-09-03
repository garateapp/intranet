<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseInvoiceApprovalLine extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'oc_fecha' => 'date:Y-m-d',
            'entrada_fecha' => 'date:Y-m-d',
            'cantidad_oc' => 'decimal:6',
            'total_linea_oc' => 'decimal:4',
            'cantidad_factura' => 'decimal:6',
            'total_linea_factura' => 'decimal:4',
        ];
    }

    public function approval(): BelongsTo
    {
        return $this->belongsTo(PurchaseInvoiceApproval::class, 'purchase_invoice_approval_id');
    }
}
