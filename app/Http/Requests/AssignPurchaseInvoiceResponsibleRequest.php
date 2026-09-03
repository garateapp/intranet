<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignPurchaseInvoiceResponsibleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('assignResponsible', $this->route('purchase_invoice_approval')) === true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', Rule::exists(User::class, 'id')],
            'comment' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
