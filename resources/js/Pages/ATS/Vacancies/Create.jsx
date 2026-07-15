import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

/**
 * Formulario para crear una nueva vacante.
 * Incluye selección de tipo de puesto, estado, gerente asignado y campos descriptivos.
 */
export default function Create({ hiringManagers, defaultStages }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        responsibilities: '',
        qualifications: '',
        job_type: 'full_time',
        start_date: '',
        salary: '',
        salary_currency: 'CLP',
        status: 'draft',
        hiring_manager_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ats.vacancies.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.vacancies.index')} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800">Crear Vacante</h2>
                </div>
            }
        >
            <Head title="Crear Vacante - ATS" />

            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    {/* Título */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Título de la Vacante *</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Ej: Desarrollador Full-Stack Senior"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Descripción *</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Describe el puesto, sus funciones y responsabilidades..."
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>

                    {/* Responsabilidades */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Responsabilidades</label>
                        <textarea
                            value={data.responsibilities}
                            onChange={(e) => setData('responsibilities', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Lista las principales responsabilidades del puesto..."
                        />
                    </div>

                    {/* Cualificaciones */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Cualificaciones</label>
                        <textarea
                            value={data.qualifications}
                            onChange={(e) => setData('qualifications', e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Requisitos, experiencia necesaria, habilidades..."
                        />
                    </div>

                    {/* Fila: Tipo + Estado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Puesto *</label>
                            <select
                                value={data.job_type}
                                onChange={(e) => setData('job_type', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="full_time">Tiempo Completo</option>
                                <option value="part_time">Medio Tiempo</option>
                                <option value="contract">Contrato</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Estado *</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="draft">Borrador</option>
                                <option value="active">Activa</option>
                                <option value="closed">Cerrada</option>
                            </select>
                        </div>
                    </div>

                    {/* Fila: Fecha + Salario */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Salario (CLP)</label>
                            <input
                                type="number"
                                value={data.salary}
                                onChange={(e) => setData('salary', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Ej: 1500000"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Gerente de contratación */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Gerente de Contratación *</label>
                        <select
                            value={data.hiring_manager_id}
                            onChange={(e) => setData('hiring_manager_id', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Seleccionar gerente...</option>
                            {hiringManagers.map((manager) => (
                                <option key={manager.id} value={manager.id}>
                                    {manager.name} ({manager.email})
                                </option>
                            ))}
                        </select>
                        {errors.hiring_manager_id && <p className="mt-1 text-xs text-red-500">{errors.hiring_manager_id}</p>}
                    </div>

                    {/* Etapas por defecto */}
                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">Etapas que se asignarán automáticamente:</p>
                        <div className="flex flex-wrap gap-2">
                            {defaultStages.map((stage) => (
                                <span
                                    key={stage.id}
                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                                    style={{ backgroundColor: stage.color + '20', color: stage.color }}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                    {stage.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <Link
                            href={route('ats.vacancies.index')}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Creando...' : 'Crear Vacante'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
