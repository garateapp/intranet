<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseInvoiceObjectionReason extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'active', 'sort_order'];

    protected function casts(): array
    {
        return ['active' => 'boolean'];
    }

    public function responsibles(): HasMany
    {
        return $this->hasMany(PurchaseInvoiceApprovalResponsible::class, 'motivo_objecion_id');
    }
}
