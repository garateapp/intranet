<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReconcilePurchaseInvoiceAssociationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('assignPurchaseOrder', $this->route('purchase_invoice_approval')) === true;
    }

    public function rules(): array
    {
        return [
            'preferred_oc_source' => ['required', Rule::in(['SAP', 'MANUAL'])],
            'comment' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
