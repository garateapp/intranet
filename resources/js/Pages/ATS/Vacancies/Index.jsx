import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

/**
 * Lista de vacantes con filtros por estado y búsqueda, y paginación.
 */
export default function Index({ vacancies, filters, recruiters = [], canFilterRecruiter = false }) {
    const statusLabels = {
        draft: { label: 'Borrador', color: 'bg-yellow-100 text-yellow-700' },
        active: { label: 'Activa', color: 'bg-green-100 text-green-700' },
        closed: { label: 'Cerrada', color: 'bg-gray-100 text-gray-700' },
    };

    const jobTypeLabels = {
        full_time: 'Tiempo Completo',
        part_time: 'Medio Tiempo',
        contract: 'Contrato',
        obra: 'Obra',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Vacantes</h2>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('ats.vacancies.calendar')}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Calendario
                        </Link>
                        <Link
                            href={route('ats.vacancies.import')}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Carga Masiva
                        </Link>
                        <Link
                            href={route('ats.vacancies.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Nueva Vacante
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Vacantes - ATS" />

            {/* Filtros: búsqueda y estado */}
            <form action={route('ats.vacancies.index')} method="get" className="mb-6 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] max-w-md flex-1">
                    <input
                        type="text"
                        name="search"
                        defaultValue={filters.search || ''}
                        placeholder="Buscar vacante por título..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <select
                    name="status"
                    defaultValue={filters.status || ''}
                    onChange={(e) => e.target.form.submit()}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Todos los estados</option>
                    <option value="draft">Borrador</option>
                    <option value="active">Activa</option>
                    <option value="closed">Cerrada</option>
                </select>
                {canFilterRecruiter && (
                    <select
                        name="recruiter_id"
                        defaultValue={filters.recruiter_id || ''}
                        onChange={(e) => e.target.form.submit()}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Todos los reclutantes</option>
                        {recruiters.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                )}
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Buscar
                </button>
            </form>

            {/* Lista de vacantes */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vacancies.data.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                        <p className="text-sm text-gray-500">No se encontraron vacantes.</p>
                    </div>
                ) : (
                    vacancies.data.map((vacancy) => (
                        <div
                            key={vacancy.id}
                            onClick={() => router.visit(route('ats.applications.kanban', vacancy.id))}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') router.visit(route('ats.applications.kanban', vacancy.id));
                            }}
                            className="group block cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
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
                            {(vacancy.entry_week_label || vacancy.exit_week_label) && (
                                <div className="mb-3 flex flex-wrap gap-1.5">
                                    {vacancy.entry_week_label && (
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                            Ingreso: {vacancy.entry_week_label}
                                        </span>
                                    )}
                                    {vacancy.exit_week_label && (
                                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                                            Salida: {vacancy.exit_week_label}
                                        </span>
                                    )}
                                </div>
                            )}
                            {vacancy.job_type === 'obra' && (!vacancy.entry_week || !vacancy.exit_week) && (
                                <div className="mb-3 flex flex-wrap gap-1">
                                    {!vacancy.entry_week && (
                                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                                            Falta semana de inicio
                                        </span>
                                    )}
                                    {!vacancy.exit_week && (
                                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                                            Falta semana de fin
                                        </span>
                                    )}
                                </div>
                            )}
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
                                <span className="ml-auto flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            router.visit(route('ats.vacancies.edit', vacancy.id) + window.location.search);
                                        }}
                                        title="Editar vacante"
                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 font-medium text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Editar
                                    </button>
                                    {vacancy.can_delete && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (!confirm(`¿Eliminar la vacante "${vacancy.title}"?`)) return;
                                                router.delete(route('ats.vacancies.destroy', vacancy.id), { preserveScroll: true });
                                            }}
                                            title="Eliminar vacante"
                                            className="inline-flex items-center rounded-lg border border-gray-200 px-2 py-1 text-gray-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                </span>
                            </div>
                        </div>
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
