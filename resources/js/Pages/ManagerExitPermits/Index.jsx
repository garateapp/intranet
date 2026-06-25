import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';

const statusBadgeClasses = {
    pendiente: 'bg-amber-100 text-amber-800',
    visada: 'bg-blue-100 text-blue-800',
};

const periods = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'mes', label: 'Mes actual' },
    { value: 'año', label: 'Año actual' },
];

function today() { return new Date().toISOString().split('T')[0]; }

function monthStart() {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function monthEnd() {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()}`;
}

function yearStart() { return `${new Date().getFullYear()}-01-01`; }

function yearEnd() { return `${new Date().getFullYear()}-12-31`; }

export default function Index({ permits, stats, filters, isNotificationUser }) {
    const [search, setSearch] = useState(filters.search || '');
    const [periodo, setPeriodo] = useState(filters.periodo || 'hoy');
    const [fechaDesde, setFechaDesde] = useState(filters.fecha_desde || today());
    const [fechaHasta, setFechaHasta] = useState(filters.fecha_hasta || today());

    function applyPeriod(p) {
        let desde = '', hasta = '';
        if (p === 'hoy') { desde = today(); hasta = today(); }
        else if (p === 'mes') { desde = monthStart(); hasta = monthEnd(); }
        else if (p === 'año') { desde = yearStart(); hasta = yearEnd(); }

        setPeriodo(p);
        setFechaDesde(desde);
        setFechaHasta(hasta);

        router.get(route('manager.exit-permits.index'), {
            search: search || undefined,
            periodo: p,
            fecha_desde: desde,
            fecha_hasta: hasta,
        });
    }

    const doFilter = useCallback(() => {
        setPeriodo('');
        router.get(route('manager.exit-permits.index'), {
            search: search || undefined,
            periodo: '',
            fecha_desde: fechaDesde || undefined,
            fecha_hasta: fechaHasta || undefined,
        });
    }, [search, fechaDesde, fechaHasta]);

    function handleFilter(e) {
        e.preventDefault();
        doFilter();
    }

    function handlePageChange(url) {
        if (url) {
            const params = new URL(url);
            router.get(url, {
                search: search || undefined,
                periodo: periodo || undefined,
                fecha_desde: fechaDesde || undefined,
                fecha_hasta: fechaHasta || undefined,
            });
        }
    }

    function buildCsvUrl() {
        const params = new URLSearchParams();
        if (periodo) params.set('periodo', periodo);
        if (!periodo && fechaDesde) params.set('fecha_desde', fechaDesde);
        if (!periodo && fechaHasta) params.set('fecha_hasta', fechaHasta);
        const qs = params.toString();
        return route('manager.exit-permits.download-csv') + (qs ? '?' + qs : '');
    }

    const hasAnyPermits = permits.total > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {isNotificationUser ? 'Todas las Solicitudes' : 'Solicitudes de Permisos'}
                    </h2>
                    {isNotificationUser && (
                        <a
                            href={buildCsvUrl()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                        >
                            Descargar CSV
                        </a>
                    )}
                </div>
            }
        >
            <Head title="Permisos de Salida" />

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
                        {stats.visada > 0 && (
                            <div className="rounded-full bg-blue-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-blue-700">{stats.visada}</span>
                                <span className="ml-1 text-blue-600">Visadas</span>
                            </div>
                        )}
                        {stats.con_goce > 0 && (
                            <div className="rounded-full bg-blue-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-blue-700">{stats.con_goce}</span>
                                <span className="ml-1 text-blue-600">Con goce</span>
                            </div>
                        )}
                        {stats.sin_goce > 0 && (
                            <div className="rounded-full bg-orange-100 px-4 py-2 text-sm">
                                <span className="font-semibold text-orange-700">{stats.sin_goce}</span>
                                <span className="ml-1 text-orange-600">Sin goce</span>
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
                        <div className="p-6 space-y-4">
                            {/* Period quick buttons */}
                            <div className="flex flex-wrap gap-2">
                                {periods.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => applyPeriod(p.value)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                            periodo === p.value
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
                                <div className="flex-1 min-w-[160px]">
                                    <label className="block text-sm font-medium text-gray-700">Desde</label>
                                    <input
                                        type="date"
                                        value={fechaDesde}
                                        onChange={(e) => { setPeriodo(''); setFechaDesde(e.target.value); }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-[160px]">
                                    <label className="block text-sm font-medium text-gray-700">Hasta</label>
                                    <input
                                        type="date"
                                        value={fechaHasta}
                                        onChange={(e) => { setPeriodo(''); setFechaHasta(e.target.value); }}
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
                    <div className="overflow-x-auto bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {!hasAnyPermits ? (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                                        No hay solicitudes
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
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${permit.con_goce_sueldo ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                                    {permit.con_goce_sueldo_label}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${permit.status==='pendiente' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                                                    {permit.status}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                                <Link
                                                                    href={route('manager.exit-permits.show', permit.id)}
                                                                    className="text-amber-600 hover:text-amber-900 font-medium"
                                                                >
                                                                    {permit.status === 'pendiente' ? 'Visar' : 'Ver detalle'}
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
