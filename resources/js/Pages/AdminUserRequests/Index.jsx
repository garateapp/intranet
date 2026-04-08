import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ requests, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('user-requests.index'), {
            status: statusFilter || undefined,
            type: typeFilter || undefined,
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Solicitudes de Usuarios
                </h2>
            }
        >
            <Head title="Solicitudes de Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
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
                                        {filters?.types?.map((type) => (
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

                    {/* Requests Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Código Ref.
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Título
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.data.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600">
                                                    {req.reference_code}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                    {req.user ? req.user.name : '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {req.request_type ? req.request_type.name : '—'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                    {req.title}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            req.status_badge_color
                                                                ? `bg-${req.status_badge_color}-100 text-${req.status_badge_color}-800`
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                        style={{
                                                            backgroundColor: req.status === 'pendiente' ? '#f3f4f6' :
                                                                req.status === 'en_revision' ? '#fef9c3' :
                                                                req.status === 'aprobada' ? '#dcfce7' :
                                                                req.status === 'rechazada' ? '#fee2e2' :
                                                                req.status === 'completada' ? '#dbeafe' : '#f3f4f6',
                                                            color: req.status === 'pendiente' ? '#1f2937' :
                                                                req.status === 'en_revision' ? '#854d0e' :
                                                                req.status === 'aprobada' ? '#166534' :
                                                                req.status === 'rechazada' ? '#991b1b' :
                                                                req.status === 'completada' ? '#1e40af' : '#1f2937',
                                                        }}
                                                    >
                                                        {req.status_label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {req.created_at}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <Link
                                                        href={route('user-requests.show', req.id)}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        Ver Detalle
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {requests.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No se encontraron solicitudes
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Intenta cambiar los filtros para ver más resultados.
                                    </p>
                                </div>
                            )}

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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
