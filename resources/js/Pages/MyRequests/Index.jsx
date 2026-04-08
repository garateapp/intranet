import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const statusBadgeClasses = {
    pendiente: 'bg-gray-100 text-gray-800',
    en_revision: 'bg-yellow-100 text-yellow-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800',
    completada: 'bg-blue-100 text-blue-800',
};

export default function Index({ requests, requestTypes, stats, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [showForm, setShowForm] = useState(false);

    const form = useForm({
        request_type_id: '',
        title: '',
        description: '',
    });

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('my-requests.index'), {
            status: statusFilter || undefined,
            type: typeFilter || undefined,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        form.post(route('my-requests.store'), {
            onSuccess: () => {
                form.reset();
                setShowForm(false);
            },
        });
    }

    function handlePageChange(url) {
        if (url) {
            router.get(url, {
                status: statusFilter || undefined,
                type: typeFilter || undefined,
            });
        }
    }

    const hasAnyRequests = requests.total > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Mis Solicitudes
                    </h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        {showForm ? 'Cancelar' : 'Nueva Solicitud'}
                    </button>
                </div>
            }
        >
            <Head title="Mis Solicitudes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Stats row */}
                    <div className="flex flex-wrap gap-3">
                        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                            <span className="font-semibold text-gray-900">{stats.total}</span>
                            <span className="ml-1 text-gray-600">Total</span>
                        </div>
                        {stats.pendiente > 0 && (
                            <div className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-gray-700">{stats.pendiente}</span>
                                <span className="ml-1 text-gray-600">Pendiente</span>
                            </div>
                        )}
                        {stats.en_revision > 0 && (
                            <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-yellow-700">{stats.en_revision}</span>
                                <span className="ml-1 text-yellow-600">En revisión</span>
                            </div>
                        )}
                        {stats.aprobada > 0 && (
                            <div className="rounded-full bg-green-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-green-700">{stats.aprobada}</span>
                                <span className="ml-1 text-green-600">Aprobada</span>
                            </div>
                        )}
                        {stats.rechazada > 0 && (
                            <div className="rounded-full bg-red-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-red-700">{stats.rechazada}</span>
                                <span className="ml-1 text-red-600">Rechazada</span>
                            </div>
                        )}
                        {stats.completada > 0 && (
                            <div className="rounded-full bg-blue-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-blue-700">{stats.completada}</span>
                                <span className="ml-1 text-blue-600">Completada</span>
                            </div>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Estado
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="">Todos</option>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_revision">En revisión</option>
                                        <option value="aprobada">Aprobada</option>
                                        <option value="rechazada">Rechazada</option>
                                        <option value="completada">Completada</option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tipo
                                    </label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="">Todos</option>
                                        {requestTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                    >
                                        Filtrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Create form */}
                    {showForm && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-medium text-gray-900">
                                    Nueva Solicitud
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {requestTypes.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Tipo de solicitud
                                            </label>
                                            <select
                                                value={form.data.request_type_id}
                                                onChange={(e) => form.setData('request_type_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            >
                                                <option value="">Seleccionar tipo</option>
                                                {requestTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {form.errors.request_type_id && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.request_type_id}</p>
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Título <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.title}
                                            onChange={(e) => form.setData('title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Ej: Solicitud de licencia"
                                        />
                                        {form.errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{form.errors.title}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Descripción <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={form.data.description}
                                            onChange={(e) => form.setData('description', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            placeholder="Describe tu solicitud en detalle..."
                                        />
                                        {form.errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {form.processing ? 'Enviando...' : 'Enviar Solicitud'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Requests table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {!hasAnyRequests && !statusFilter && !typeFilter ? (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        No tienes solicitudes
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Comienza creando tu primera solicitud para hacer seguimiento.
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                        >
                                            Crear primera solicitud
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {requests.data.length === 0 ? (
                                        <div className="py-8 text-center text-gray-500">
                                            No se encontraron solicitudes con los filtros seleccionados.
                                        </div>
                                    ) : (
                                        <>
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Código
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Título
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Tipo
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Estado
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Fecha
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {requests.data.map((req) => (
                                                        <tr key={req.id}>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600">
                                                                {req.reference_code}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {req.title}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                                {req.request_type ? req.request_type.name : '—'}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeClasses[req.status_badge_color] || 'bg-gray-100 text-gray-800'}`}>
                                                                    {req.status_label}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                                {req.created_at}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Pagination */}
                                            {requests.links && requests.links.length > 3 && (
                                                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                                                    <p className="text-sm text-gray-600">
                                                        Mostrando {requests.from} a {requests.to} de {requests.total} solicitudes
                                                    </p>
                                                    <nav className="flex flex-wrap justify-center gap-1">
                                                        {requests.links.map((link, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handlePageChange(link.url)}
                                                                disabled={!link.url}
                                                                className={`min-w-[36px] px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                                    link.active
                                                                        ? 'bg-green-600 text-white'
                                                                        : link.url
                                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label || '' }}
                                                            />
                                                        ))}
                                                    </nav>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
