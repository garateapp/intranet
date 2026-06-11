import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusBadgeClasses = {
    pendiente: 'bg-gray-100 text-gray-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800',
};

export default function Index({ permits, stats, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [search, setSearch] = useState(filters.search || '');
    const [fecha, setFecha] = useState(filters.fecha || new Date().toISOString().split('T')[0]);

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('admin.exit-permits.index'), {
            status: statusFilter || undefined,
            search: search || undefined,
            fecha: fecha || undefined,
        });
    }

    function handlePageChange(url) {
        if (url) {
            router.get(url, {
                status: statusFilter || undefined,
                search: search || undefined,
                fecha: fecha || undefined,
            });
        }
    }

    const hasAnyPermits = permits.total > 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Administrar Permisos de Salida
                </h2>
            }
        >
            <Head title="Admin - Permisos de Salida" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-3">
                        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                            <span className="font-semibold text-gray-900">{stats.total}</span>
                            <span className="ml-1 text-gray-600">Total</span>
                        </div>
                        {stats.pendiente > 0 && (
                            <div className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-gray-700">{stats.pendiente}</span>
                                <span className="ml-1 text-orange-600">Pendiente</span>
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
                    </div>

                    {/* Filters */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                                    <input
                                        type="date"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700">Buscar</label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nombre del solicitante..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    >
                                        <option value="">Todos</option>
                                        <option value="pendiente">Pendiente</option>
                                        <option value="aprobada">Aprobada</option>
                                        <option value="rechazada">Rechazada</option>
                                    </select>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700"
                                    >
                                        Filtrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {!hasAnyPermits ? (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        No hay permisos de salida
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Aún no se han registrado solicitudes de permiso de salida.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {permits.data.length === 0 ? (
                                        <div className="py-8 text-center text-gray-500">
                                            No se encontraron permisos con los filtros seleccionados.
                                        </div>
                                    ) : (
                                        <>
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitante</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jefe Directo</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salida</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goce</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {permits.data.map((permit) => (
                                                        <tr key={permit.id}>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600">#{permit.id}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{permit.user?.name || '—'}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{permit.manager?.name || '—'}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                                {permit.fecha_salida}
                                                                {permit.hora_salida && <span className="text-gray-500 ml-1">{permit.hora_salida}</span>}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{permit.motivo}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${permit.con_goce_sueldo ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                                    {permit.con_goce_sueldo_label}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeClasses[permit.status] || 'bg-gray-100 text-gray-800'}`}>
                                                                    {permit.status_label}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <Link
                                                                    href={route('admin.exit-permits.show', permit.id)}
                                                                    className="text-orange-600 hover:text-orange-900 font-medium"
                                                                >
                                                                    Ver detalle
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Pagination */}
                                            {permits.links && permits.links.length > 3 && (
                                                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                                                    <p className="text-sm text-gray-600">
                                                        Mostrando {permits.from} a {permits.to} de {permits.total} permisos
                                                    </p>
                                                    <nav className="flex flex-wrap justify-center gap-1">
                                                        {permits.links.map((link, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handlePageChange(link.url)}
                                                                disabled={!link.url}
                                                                className={`min-w-[36px] px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                                    link.active
                                                                        ? 'bg-orange-600 text-white'
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
