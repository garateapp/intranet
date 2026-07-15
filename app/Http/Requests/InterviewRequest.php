<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request para crear y editar entrevistas.
 */
class InterviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'application_id' => ['required', 'exists:applications,id'],
            'scheduled_at' => ['required', 'date', 'after_or_equal:now'],
            'location_link' => ['nullable', 'url', 'max:500'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'application_id.required' => 'Debe seleccionar una postulación.',
            'application_id.exists' => 'La postulación seleccionada no existe.',
            'scheduled_at.required' => 'La fecha y hora de la entrevista es obligatoria.',
            'scheduled_at.date' => 'Debe ingresar una fecha y hora válidas.',
            'scheduled_at.after_or_equal' => 'La entrevista debe programarse para el futuro.',
            'location_link.url' => 'El enlace de la reunión debe ser una URL válida.',
            'location_link.max' => 'El enlace no debe exceder los 500 caracteres.',
            'notes.max' => 'Las notas no deben exceder los 2000 caracteres.',
        ];
    }
}
