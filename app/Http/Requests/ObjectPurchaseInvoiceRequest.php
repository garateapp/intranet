<?php

namespace App\Http\Requests;

use App\Models\PurchaseInvoiceObjectionReason;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ObjectPurchaseInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('object', $this->route('purchase_invoice_approval')) === true;
    }

    public function rules(): array
    {
        return [
            'motivo_objecion_id' => [
                'required',
                Rule::exists(PurchaseInvoiceObjectionReason::class, 'id')->where('active', true),
            ],
            'comentario_objecion' => ['required', 'string', 'max:3000'],
        ];
    }
}
