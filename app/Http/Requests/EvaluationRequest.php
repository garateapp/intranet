<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request para crear y editar evaluaciones post-entrevista.
 */
class EvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'interview_id' => ['required', 'exists:interviews,id'],
            'score' => ['required', 'integer', 'min:1', 'max:10'],
            'comments' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'interview_id.required' => 'Debe seleccionar una entrevista.',
            'interview_id.exists' => 'La entrevista seleccionada no existe.',
            'score.required' => 'El puntaje es obligatorio.',
            'score.integer' => 'El puntaje debe ser un número entero.',
            'score.min' => 'El puntaje mínimo es 1.',
            'score.max' => 'El puntaje máximo es 10.',
            'comments.max' => 'Los comentarios no deben exceder los 5000 caracteres.',
        ];
    }
}
