import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ tasks, stages }) {
    const [stageFilter, setStageFilter] = useState('');

    function handleFilter(e) {
        e.preventDefault();
        const params = {};
        if (stageFilter) params.stage_id = stageFilter;
        router.get(route('onboarding-tasks.index'), params);
    }

    const handleDelete = (id, title) => {
        if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${title}"?`)) {
            router.delete(route('onboarding-tasks.destroy', id));
        }
    };

    const taskTypeLabel = (type) => {
        switch (type) {
            case 'checklist': return 'Checklist';
            case 'resource': return 'Recurso';
            case 'link': return 'Enlace';
            case 'faq': return 'FAQ';
            default: return type;
        }
    };

    const filteredTasks = stageFilter
        ? tasks.data.filter((task) => task.onboarding_stage_id == stageFilter)
        : tasks.data;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Tareas de Onboarding
                    </h2>
                    <Link
                        href={route('onboarding-tasks.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Nueva Tarea
                    </Link>
                </div>
            }
        >
            <Head title="Tareas de Onboarding" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filter */}
                            <form onSubmit={handleFilter} className="mb-6 flex gap-4">
                                <select
                                    value={stageFilter}
                                    onChange={(e) => setStageFilter(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Todas las etapas</option>
                                    {stages.map((stage) => (
                                        <option key={stage.id} value={stage.id}>
                                            {stage.title}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                >
                                    Filtrar
                                </button>
                                {stageFilter && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStageFilter('');
                                            router.get(route('onboarding-tasks.index'));
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </form>

                            {/* Tasks Table */}
                            {filteredTasks.length === 0 ? (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas</h3>
                                    <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva tarea de onboarding.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('onboarding-tasks.create')}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                        >
                                            Nueva Tarea
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Etapa</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requerida</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredTasks.map((task) => (
                                                    <tr key={task.id}>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                                                            {task.title}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {task.stage?.title || '—'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {taskTypeLabel(task.task_type)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span
                                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    task.is_required
                                                                        ? 'bg-amber-100 text-amber-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {task.is_required ? 'Sí' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {task.sort_order}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span
                                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    task.is_active
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {task.is_active ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 space-x-3">
                                                            <Link
                                                                href={route('onboarding-tasks.edit', task.id)}
                                                                className="hover:text-green-700 font-medium"
                                                            >
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(task.id, task.title)}
                                                                className="text-red-600 hover:text-red-700 font-medium"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-4">
                                        <nav className="inline-flex rounded-md shadow-sm">
                                            {tasks.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-2 text-sm ${
                                                        link.active
                                                            ? 'z-10 border border-green-600 bg-green-600 text-white'
                                                            : link.url
                                                            ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                            : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                        index === tasks.links.length - 1 ? 'rounded-r-md' : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
