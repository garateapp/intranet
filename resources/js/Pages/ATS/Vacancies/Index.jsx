import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Lista de vacantes con filtros por estado, búsqueda y paginación.
 * Muestra métricas resumen en la parte superior.
 */
export default function Index({ vacancies, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('ats.vacancies.index'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status === statusFilter ? '' : status);
        router.get(route('ats.vacancies.index'), { search, status: status === statusFilter ? '' : status }, { preserveState: true });
    };

    const statusLabels = {
        draft: { label: 'Borrador', color: 'bg-yellow-100 text-yellow-700' },
        active: { label: 'Activa', color: 'bg-green-100 text-green-700' },
        closed: { label: 'Cerrada', color: 'bg-gray-100 text-gray-700' },
    };

    const jobTypeLabels = {
        full_time: 'Tiempo Completo',
        part_time: 'Medio Tiempo',
        contract: 'Contrato',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Vacantes</h2>
                    <Link
                        href={route('ats.vacancies.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Nueva Vacante
                    </Link>
                </div>
            }
        >
            <Head title="Vacantes - ATS" />

            {/* Filtros rápidos */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                {Object.entries(statusLabels).map(([key, { label, color }]) => (
                    <button
                        key={key}
                        onClick={() => handleStatusFilter(key)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition ${
                            statusFilter === key ? `${color} ring-2 ring-offset-1 ring-current` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {label}
                        <span className="ml-1 text-xs opacity-75">
                            {key === 'draft' ? stats.draft : key === 'active' ? stats.active : stats.closed}
                        </span>
                    </button>
                ))}
            </div>

            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar vacante por título..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </form>

            {/* Lista de vacantes */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vacancies.data.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                        <p className="text-sm text-gray-500">No se encontraron vacantes.</p>
                    </div>
                ) : (
                    vacancies.data.map((vacancy) => (
                        <Link
                            key={vacancy.id}
                            href={route('ats.applications.kanban', vacancy.id)}
                            className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="mb-3 flex items-start justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                                    {vacancy.title}
                                </h3>
                                <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusLabels[vacancy.status]?.color}`}>
                                    {statusLabels[vacancy.status]?.label}
                                </span>
                            </div>
                            <p className="mb-3 line-clamp-2 text-xs text-gray-500">
                                {vacancy.description?.substring(0, 120)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    {jobTypeLabels[vacancy.job_type]}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {vacancy.applications_count} postulaciones
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    {vacancy.hiring_manager?.name}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Paginación */}
            {vacancies.last_page > 1 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex gap-1">
                        {vacancies.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
