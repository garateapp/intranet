import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ candidate }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route('ats.candidates.delete', candidate.id), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('ats.candidates.index')} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{candidate.name}</h2>
                            <p className="text-sm text-gray-500">{candidate.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('ats.candidates.edit', candidate.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Editar
                        </Link>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Eliminar
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${candidate.name} - ATS`} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Información del candidato */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                                {candidate.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                                <p className="text-sm text-gray-500">{candidate.email}</p>
                            </div>
                        </div>
                        <dl className="space-y-3 text-sm">
                            {candidate.phone && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    {candidate.phone}
                                </div>
                            )}
                            {candidate.origin && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    {candidate.origin}
                                </div>
                            )}
                            {candidate.cv_url && (
                                <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <a href={candidate.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">
                                        Ver CV
                                    </a>
                                </div>
                            )}
                        </dl>
                        {candidate.notes && (
                            <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                                <p className="text-xs font-medium text-gray-500">Notas</p>
                                <p className="mt-1 text-sm text-gray-700">{candidate.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Historial de postulaciones */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h3 className="text-sm font-semibold text-gray-900">Historial de Postulaciones</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {candidate.applications?.length === 0 ? (
                                <div className="px-5 py-8 text-center text-sm text-gray-500">
                                    Este candidato no tiene postulaciones registradas.
                                </div>
                            ) : (
                                candidate.applications?.map((app) => (
                                    <div key={app.id} className="px-5 py-4 transition hover:bg-gray-50/50">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link
                                                    href={route('ats.vacancies.show', app.vacancy?.id)}
                                                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                                >
                                                    {app.vacancy?.title}
                                                </Link>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    Postuló el {app.applied_at ? new Date(app.applied_at).toLocaleDateString('es-CL') : '-'}
                                                </p>
                                            </div>
                                            <span
                                                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                                style={{ backgroundColor: (app.stage?.color || '#6B7280') + '20', color: app.stage?.color || '#6B7280' }}
                                            >
                                                {app.stage?.name || 'Sin etapa'}
                                            </span>
                                        </div>
                                        {app.interviews?.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {app.interviews.map((interview) => (
                                                    <div key={interview.id} className="flex items-center gap-2 text-xs text-gray-500">
                                                        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <span>Entrevista: {new Date(interview.scheduled_at).toLocaleString('es-CL')}</span>
                                                        {interview.evaluations?.length > 0 && (
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-1.5 text-[10px] font-medium text-green-700">
                                                                Evaluada ({interview.evaluations[0].score}/10)
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900">Eliminar Candidato</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ¿Estás seguro de que deseas eliminar a <strong>{candidate.name}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
