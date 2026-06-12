import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusBadgeClasses = {
    pendiente: 'bg-gray-100 text-gray-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800',
};

export default function Index({ permits, stats, filters, isNotificationUser }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [search, setSearch] = useState(filters.search || '');
    const [fecha, setFecha] = useState(filters.fecha || new Date().toISOString().split('T')[0]);

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('manager.exit-permits.index'), {
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
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {isNotificationUser ? 'Todas las Aprobaciones' : 'Aprobaciones de Permisos de Salida'}
                    </h2>
                    {isNotificationUser && (
                        <a
                            href={route('manager.exit-permits.download-csv', { fecha })}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                        >
                            Descargar CSV
                        </a>
                    )}
                </div>
            }
        >
            <Head title="Aprobaciones Pendientes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="flex flex-wrap gap-3">
                        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                            <span className="font-semibold text-gray-900">{stats.total}</span>
                            <span className="ml-1 text-gray-600">Total</span>
                        </div>
                        {stats.pendiente > 0 && (
                            <div className="rounded-full bg-amber-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-amber-700">{stats.pendiente}</span>
                                <span className="ml-1 text-amber-600">Pendientes</span>
                            </div>
                        )}
                        {stats.aprobada > 0 && (
                            <div className="rounded-full bg-green-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-green-700">{stats.aprobada}</span>
                                <span className="ml-1 text-green-600">Aprobadas</span>
                            </div>
                        )}
                        {stats.rechazada > 0 && (
                            <div className="rounded-full bg-red-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-red-700">{stats.rechazada}</span>
                                <span className="ml-1 text-red-600">Rechazadas</span>
                            </div>
                        )}
                        {isNotificationUser && (
                            <div className="rounded-full bg-purple-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-purple-700">Vista global</span>
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
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700">Buscar</label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nombre del solicitante..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
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
                                        className="inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700"
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        No hay solicitudes pendientes
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Cuando tus colaboradores soliciten un permiso de salida, aparecerán aquí.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {permits.data.length === 0 ? (
                                        <div className="py-8 text-center text-gray-500">
                                            No se encontraron solicitudes con los filtros seleccionados.
                                        </div>
                                    ) : (
                                        <>
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitante</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salida</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retorno</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goce</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {permits.data.map((permit) => (
                                                        <tr key={permit.id} className={permit.status === 'pendiente' ? 'bg-amber-50/50' : ''}>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-600">#{permit.id}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{permit.user?.name || '—'}</td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                                {permit.fecha_salida}
                                                                {permit.hora_salida && <span className="text-gray-500 ml-1">{permit.hora_salida}</span>}
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                                {permit.fecha_retorno ? (
                                                                    <>{permit.fecha_retorno}{permit.hora_retorno && <span className="text-gray-500 ml-1">{permit.hora_retorno}</span>}</>
                                                                ) : <span className="text-gray-400">—</span>}
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
                                                                    href={route('manager.exit-permits.show', permit.id)}
                                                                    className="text-amber-600 hover:text-amber-900 font-medium"
                                                                >
                                                            {permit.status === 'pendiente' ? 'Revisar' : 'Ver detalle'}
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {permits.links && permits.links.length > 3 && (
                                                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                                                    <p className="text-sm text-gray-600">
                                                        Mostrando {permits.from} a {permits.to} de {permits.total} solicitudes
                                                    </p>
                                                    <nav className="flex flex-wrap justify-center gap-1">
                                                        {permits.links.map((link, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handlePageChange(link.url)}
                                                                disabled={!link.url}
                                                                className={`min-w-[36px] px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                                    link.active
                                                                        ? 'bg-amber-600 text-white'
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
