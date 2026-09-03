<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApprovePurchaseInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $approval = $this->route('purchase_invoice_approval');

        return $approval !== null && $this->user()?->can('approve', $approval) === true;
    }

    public function rules(): array
    {
        return [
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'mimes:pdf,jpg,jpeg,png,webp,gif', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'attachments.max' => 'Puedes adjuntar un máximo de 5 respaldos.',
            'attachments.*.mimes' => 'Los respaldos deben ser PDF o imágenes JPG, PNG, WEBP o GIF.',
            'attachments.*.max' => 'Cada respaldo puede pesar como máximo 10 MB.',
        ];
    }
}
