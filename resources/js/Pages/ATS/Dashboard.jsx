import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

/**
 * Dashboard principal del módulo ATS.
 * Muestra métricas globales: vacantes por estado, total de postulaciones,
 * y actividad reciente del pipeline.
 */
export default function Dashboard({ stats, recentVacancies, recentApplications }) {
    const statCards = [
        { label: 'Total Vacantes', value: stats.total_vacancies, color: 'bg-blue-500', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { label: 'Activas', value: stats.active_vacancies, color: 'bg-green-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'En Borrador', value: stats.draft_vacancies, color: 'bg-yellow-500', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { label: 'Cerradas', value: stats.closed_vacancies, color: 'bg-gray-500', icon: 'M5 13l4 4L19 7' },
        { label: 'Total Postulaciones', value: stats.total_applications, color: 'bg-purple-500', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard ATS</h2>
                    <div className="flex gap-2">
                        <a
                            href={route('ats.export')}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Descargar Reporte
                        </a>
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
            <Head title="Dashboard ATS" />

            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {statCards.map((card) => (
                    <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color} text-white`}>
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} /></svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                <p className="text-xs text-gray-500">{card.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Vacantes recientes */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Vacantes Activas Recientes</h3>
                        <Link href={route('ats.vacancies.index')} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                            Ver todas
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentVacancies.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-500">No hay vacantes activas.</p>
                        ) : (
                            recentVacancies.map((vacancy) => (
                                <Link
                                    key={vacancy.id}
                                    href={route('ats.applications.kanban', vacancy.id)}
                                    className="block rounded-lg border border-gray-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{vacancy.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {vacancy.hiring_manager?.name} · {vacancy.applications_count} postulaciones
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                            Activa
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Últimas postulaciones */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Últimas Postulaciones</h3>
                    </div>
                    <div className="space-y-3">
                        {recentApplications.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-500">No hay postulaciones recientes.</p>
                        ) : (
                            recentApplications.map((app) => (
                                <div key={app.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                        {app.candidate?.name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900">{app.candidate?.name}</p>
                                        <p className="truncate text-xs text-gray-500">{app.vacancy?.title}</p>
                                    </div>
                                    <span
                                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                        style={{ backgroundColor: app.stage?.color + '20', color: app.stage?.color }}
                                    >
                                        {app.stage?.name}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
