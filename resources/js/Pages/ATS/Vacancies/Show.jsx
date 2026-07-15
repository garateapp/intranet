import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ vacancy }) {
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
                    <div className="flex items-center gap-3">
                        <Link href={route('ats.vacancies.index')} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-gray-800">{vacancy.title}</h2>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusLabels[vacancy.status]?.color}`}>
                                    {statusLabels[vacancy.status]?.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{vacancy.hiring_manager?.name} · Creado por {vacancy.creator?.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('ats.applications.kanban', vacancy.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" /></svg>
                            Ver Kanban
                        </Link>
                        <Link
                            href={route('ats.vacancies.edit', vacancy.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Editar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${vacancy.title} - ATS`} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Detalles de la vacante */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Descripción</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{vacancy.description || 'Sin descripción.'}</p>
                    </div>

                    {vacancy.responsibilities && (
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-gray-900">Responsabilidades</h3>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{vacancy.responsibilities}</p>
                        </div>
                    )}

                    {vacancy.qualifications && (
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-gray-900">Calificaciones</h3>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{vacancy.qualifications}</p>
                        </div>
                    )}

                    {/* Etapas del pipeline */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Pipeline ({vacancy.stages?.length || 0} etapas)</h3>
                            <Link
                                href={route('ats.vacancies.pipeline', vacancy.id)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                                Configurar
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {vacancy.stages?.map((stage, i) => (
                                <div key={stage.id} className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                    <span className="text-xs text-gray-700">{stage.name}</span>
                                    {i < vacancy.stages.length - 1 && (
                                        <svg className="h-3 w-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    )}
                                </div>
                            ))}
                            {(!vacancy.stages || vacancy.stages.length === 0) && (
                                <p className="text-xs text-gray-500">No hay etapas configuradas.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar con métricas */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-gray-900">Detalles</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Tipo</dt>
                                <dd className="font-medium text-gray-900">{jobTypeLabels[vacancy.job_type]}</dd>
                            </div>
                            {vacancy.salary && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Salario</dt>
                                    <dd className="font-medium text-gray-900">{vacancy.salary_currency} {Number(vacancy.salary).toLocaleString('es-CL')}</dd>
                                </div>
                            )}
                            {vacancy.start_date && (
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Fecha inicio</dt>
                                    <dd className="font-medium text-gray-900">{new Date(vacancy.start_date).toLocaleDateString('es-CL')}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Postulaciones recientes */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Postulaciones ({vacancy.applications?.length || 0})</h3>
                        <div className="space-y-2">
                            {vacancy.applications?.length === 0 ? (
                                <p className="text-xs text-gray-500">No hay postulaciones aún.</p>
                            ) : (
                                vacancy.applications?.slice(0, 10).map((app) => (
                                    <Link
                                        key={app.id}
                                        href={route('ats.candidates.show', app.candidate?.id)}
                                        className={`flex items-center gap-2 rounded-lg p-2 transition ${
                                            app.hired_at ? 'bg-green-50 hover:bg-green-100' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                                            app.hired_at ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {app.hired_at ? '✓' : app.candidate?.name?.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium text-gray-900">{app.candidate?.name}</p>
                                        </div>
                                        {app.hired_at ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 text-[10px] font-medium text-green-700">
                                                Contratado
                                            </span>
                                        ) : (
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: app.stage?.color || '#6B7280' }}
                                            />
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
