import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ task, stages, documents }) {
    const { data, setData, put, processing, errors } = useForm({
        onboarding_stage_id: task.onboarding_stage_id,
        title: task.title,
        description: task.description || '',
        task_type: task.task_type,
        resource_url: task.resource_url || '',
        document_id: task.document_id || '',
        sort_order: task.sort_order,
        is_required: task.is_required,
        is_active: task.is_active,
    });

    function submit(e) {
        e.preventDefault();
        put(route('onboarding-tasks.update', task.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Editar Tarea de Onboarding
                    </h2>
                    <Link
                        href={route('onboarding-tasks.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300"
                    >
                        Volver al Listado
                    </Link>
                </div>
            }
        >
            <Head title="Editar Tarea de Onboarding" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Etapa */}
                                <div>
                                    <label
                                        htmlFor="onboarding_stage_id"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Etapa
                                    </label>
                                    <select
                                        id="onboarding_stage_id"
                                        value={data.onboarding_stage_id}
                                        onChange={(e) => setData('onboarding_stage_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                        autoFocus
                                    >
                                        {stages.map((stage) => (
                                            <option key={stage.id} value={stage.id}>
                                                {stage.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.onboarding_stage_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.onboarding_stage_id}</p>
                                    )}
                                </div>

                                {/* Título */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder="Ej: Configurar correo corporativo"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Descripción
                                    </label>
                                    <textarea
                                        id="description"
                                        rows="4"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder="Describe los pasos o detalles de esta tarea..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Tipo de tarea y URL de recurso */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="task_type"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Tipo de tarea
                                        </label>
                                        <select
                                            id="task_type"
                                            value={data.task_type}
                                            onChange={(e) => setData('task_type', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        >
                                            <option value="checklist">Checklist</option>
                                            <option value="resource">Recurso</option>
                                            <option value="link">Enlace</option>
                                            <option value="faq">Pregunta frecuente</option>
                                            <option value="document">Documento</option>
                                        </select>
                                        {errors.task_type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.task_type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="resource_url"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            URL del recurso (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            id="resource_url"
                                            value={data.resource_url}
                                            onChange={(e) => setData('resource_url', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="https://..."
                                        />
                                        {errors.resource_url && (
                                            <p className="mt-1 text-sm text-red-600">{errors.resource_url}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Documento asociado */}
                                <div>
                                    <label htmlFor="document_id" className="block text-sm font-medium text-gray-700">
                                        Documento asociado (opcional)
                                    </label>
                                    <select
                                        id="document_id"
                                        value={data.document_id}
                                        onChange={(e) => setData('document_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="">Sin documento</option>
                                        {documents.map((doc) => (
                                            <option key={doc.id} value={doc.id}>📄 {doc.title}</option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Selecciona un documento existente. Para subir uno nuevo, ve a{' '}
                                        <a href={route('admin.documents.create')} className="text-green-600 hover:underline">
                                            Documentos → Nuevo
                                        </a>
                                    </p>
                                    {errors.document_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.document_id}</p>
                                    )}
                                </div>

                                {/* Orden */}
                                <div>
                                    <label
                                        htmlFor="sort_order"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Orden
                                    </label>
                                    <input
                                        type="number"
                                        id="sort_order"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    {errors.sort_order && (
                                        <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>
                                    )}
                                </div>

                                {/* Requerida y Activa */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_required"
                                            checked={data.is_required}
                                            onChange={(e) => setData('is_required', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <label htmlFor="is_required" className="ml-2 block text-sm text-gray-700">
                                            Tarea requerida
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                            Tarea activa
                                        </label>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={route('onboarding-tasks.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Actualizar Tarea
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
