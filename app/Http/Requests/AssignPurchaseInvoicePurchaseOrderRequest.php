<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignPurchaseInvoicePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('assignPurchaseOrder', $this->route('purchase_invoice_approval')) === true;
    }

    public function rules(): array
    {
        return [
            'manual_oc_doc_num' => ['required', 'integer', 'min:1'],
            'manual_oc_doc_entry' => ['nullable', 'integer', 'min:1'],
            'comment' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
