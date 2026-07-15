<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request para crear y editar candidatos.
 */
class CandidateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'origin' => ['nullable', 'string', 'max:100'],
            'cv_url' => ['nullable', 'url', 'max:500'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del candidato es obligatorio.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'email.required' => 'El email del candidato es obligatorio.',
            'email.email' => 'Debe ingresar un email válido.',
            'email.max' => 'El email no debe exceder los 255 caracteres.',
            'phone.max' => 'El teléfono no debe exceder los 50 caracteres.',
            'origin.max' => 'El origen no debe exceder los 100 caracteres.',
            'cv_url.url' => 'La URL del CV debe ser una dirección válida.',
            'cv_url.max' => 'La URL del CV no debe exceder los 500 caracteres.',
            'notes.max' => 'Las notas no deben exceder los 2000 caracteres.',
        ];
    }
}
