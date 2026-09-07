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
            'job_type' => ['required', Rule::in(['full_time', 'part_time', 'contract', 'obra'])],
            'start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'renta_liquida' => ['nullable', 'numeric', 'min:0'],
            'salary_currency' => ['nullable', 'string', 'size:3'],
            'status' => ['required', Rule::in(['draft', 'active', 'closed'])],
            'hiring_manager_id' => ['required', 'exists:users,id'],
            'entry_week' => ['nullable', 'integer', 'between:1,53', 'required_if:job_type,obra'],
            'entry_week_year' => ['nullable', 'digits:4', 'integer', 'required_if:job_type,obra'],
            'exit_week' => ['nullable', 'integer', 'between:1,53', 'required_if:job_type,obra'],
            'exit_week_year' => ['nullable', 'digits:4', 'integer', 'required_if:job_type,obra'],
        ];
    }

    /**
     * Validación adicional: la semana de salida debe ser posterior a la de ingreso.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $data = $this->all();

            if (($data['job_type'] ?? null) !== 'obra') {
                return;
            }

            $entry = ($data['entry_week_year'] ?? 0) * 100 + ($data['entry_week'] ?? 0);
            $exit = ($data['exit_week_year'] ?? 0) * 100 + ($data['exit_week'] ?? 0);

            if ($entry > 0 && $exit > 0 && $exit < $entry) {
                $validator->errors()->add('exit_week', 'La semana de salida debe ser posterior o igual a la semana de ingreso.');
            }
        });
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
            'renta_liquida.numeric' => 'La renta líquida debe ser un valor numérico.',
            'renta_liquida.min' => 'La renta líquida no puede ser negativa.',
            'entry_week.required_if' => 'Para tipo de puesto Obra, la semana de ingreso es obligatoria.',
            'entry_week.between' => 'La semana de ingreso debe estar entre 1 y 53.',
            'entry_week_year.required_if' => 'Para tipo de puesto Obra, el año de ingreso es obligatorio.',
            'entry_week_year.digits' => 'El año de ingreso debe tener 4 dígitos.',
            'exit_week.required_if' => 'Para tipo de puesto Obra, la semana de salida es obligatoria.',
            'exit_week.between' => 'La semana de salida debe estar entre 1 y 53.',
            'exit_week_year.required_if' => 'Para tipo de puesto Obra, el año de salida es obligatorio.',
            'exit_week_year.digits' => 'El año de salida debe tener 4 dígitos.',
            'exit_week.after' => 'La semana de salida debe ser posterior o igual a la semana de ingreso.',
            'status.required' => 'El estado de la vacante es obligatorio.',
            'status.in' => 'El estado seleccionado no es válido.',
            'hiring_manager_id.required' => 'Debe asignar un gerente de contratación.',
            'hiring_manager_id.exists' => 'El gerente de contratación seleccionado no existe.',
        ];
    }
}
