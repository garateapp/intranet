<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseInvoiceSyncBatch extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'fecha_desde' => 'date:Y-m-d',
            'fecha_hasta' => 'date:Y-m-d',
            'error_details' => 'array',
            'completed_at' => 'datetime',
        ];
    }
}
