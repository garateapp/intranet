import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ application, interviews }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('ats.applications.kanban', application.vacancy?.id)} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Entrevistas</h2>
                            <p className="text-sm text-gray-500">{application.candidate?.name} · {application.vacancy?.title}</p>
                        </div>
                    </div>
                    <Link
                        href={route('ats.application-interviews.create', application.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Programar Entrevista
                    </Link>
                </div>
            }
        >
            <Head title={`Entrevistas - ${application.candidate?.name}`} />

            <div className="space-y-4">
                {interviews.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <svg className="mx-auto mb-3 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-sm text-gray-500">No hay entrevistas programadas.</p>
                    </div>
                ) : (
                    interviews.map((interview) => (
                        <div key={interview.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {new Date(interview.scheduled_at).toLocaleString('es-CL', { dateStyle: 'full', timeStyle: 'short' })}
                                    </div>
                                    {interview.location_link && (
                                        <a href={interview.location_link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline">
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                            Enlace de reunión
                                        </a>
                                    )}
                                    {interview.notes && (
                                        <p className="mt-2 text-sm text-gray-600">{interview.notes}</p>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Link href={route('ats.interviews.edit', interview.id)} className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-yellow-600" title="Editar">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Evaluaciones */}
                            {interview.evaluations?.length > 0 && (
                                <div className="mt-4 border-t border-gray-100 pt-3">
                                    <p className="mb-2 text-xs font-medium text-gray-500">Evaluaciones</p>
                                    <div className="space-y-2">
                                        {interview.evaluations.map((eval_) => (
                                            <div key={eval_.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                                                    {eval_.score}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-medium text-gray-900">{eval_.evaluator?.name}</p>
                                                    {eval_.comments && <p className="truncate text-[11px] text-gray-500">{eval_.comments}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="mt-3">
                                <Link
                                    href={route('ats.interview-evaluations.create', interview.id)}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    Agregar evaluación
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
