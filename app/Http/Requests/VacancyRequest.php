<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request para crear y editar vacantes.
 * Incluye validación en backend con mensajes en español.
 */
class VacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $vacancyId = $this->route('vacancy')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'responsibilities' => ['nullable', 'string', 'max:3000'],
            'qualifications' => ['nullable', 'string', 'max:3000'],
            'job_type' => ['required', Rule::in(['full_time', 'part_time', 'contract'])],
            'start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'salary_currency' => ['nullable', 'string', 'size:3'],
            'status' => ['required', Rule::in(['draft', 'active', 'closed'])],
            'hiring_manager_id' => ['required', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El título de la vacante es obligatorio.',
            'title.max' => 'El título no debe exceder los 255 caracteres.',
            'description.required' => 'La descripción de la vacante es obligatoria.',
            'description.max' => 'La descripción no debe exceder los 5000 caracteres.',
            'job_type.required' => 'Debe seleccionar un tipo de puesto.',
            'job_type.in' => 'El tipo de puesto seleccionado no es válido.',
            'start_date.date' => 'La fecha de inicio debe ser una fecha válida.',
            'start_date.after_or_equal' => 'La fecha de inicio debe ser hoy o en el futuro.',
            'salary.numeric' => 'El salario debe ser un valor numérico.',
            'salary.min' => 'El salario no puede ser negativo.',
            'status.required' => 'El estado de la vacante es obligatorio.',
            'status.in' => 'El estado seleccionado no es válido.',
            'hiring_manager_id.required' => 'Debe asignar un gerente de contratación.',
            'hiring_manager_id.exists' => 'El gerente de contratación seleccionado no existe.',
        ];
    }
}
