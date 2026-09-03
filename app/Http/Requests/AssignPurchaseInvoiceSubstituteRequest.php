<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignPurchaseInvoiceSubstituteRequest extends FormRequest
{
    public function authorize(): bool
    {
        $approval = $this->route('purchase_invoice_approval');

        return $approval !== null && $this->user()?->can('assignSubstitute', $approval) === true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
