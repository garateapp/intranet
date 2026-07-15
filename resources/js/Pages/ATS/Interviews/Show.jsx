import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ interview }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route('ats.interviews.delete', interview.id), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('ats.applications.kanban', interview.application?.vacancy?.id)} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Detalle de Entrevista</h2>
                            <p className="text-sm text-gray-500">{interview.application?.candidate?.name} · {interview.application?.vacancy?.title}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('ats.interviews.edit', interview.id)}
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
            <Head title="Detalle Entrevista - ATS" />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <dl className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <dt className="w-24 shrink-0 text-gray-500">Fecha</dt>
                            <dd className="font-medium text-gray-900">
                                {new Date(interview.scheduled_at).toLocaleString('es-CL', { dateStyle: 'full', timeStyle: 'short' })}
                            </dd>
                        </div>
                        {interview.location_link && (
                            <div className="flex items-start gap-3">
                                <dt className="w-24 shrink-0 text-gray-500">Enlace</dt>
                                <dd>
                                    <a href={interview.location_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline">
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        Abrir enlace
                                    </a>
                                </dd>
                            </div>
                        )}
                        {interview.notes && (
                            <div className="flex items-start gap-3">
                                <dt className="w-24 shrink-0 text-gray-500">Notas</dt>
                                <dd className="whitespace-pre-wrap text-gray-700">{interview.notes}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Evaluaciones */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <h3 className="text-sm font-semibold text-gray-900">Evaluaciones ({interview.evaluations?.length || 0})</h3>
                        <Link
                            href={route('ats.interview-evaluations.create', interview.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Nueva evaluación
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {interview.evaluations?.length === 0 ? (
                            <div className="px-5 py-8 text-center text-sm text-gray-500">
                                No hay evaluaciones registradas.
                            </div>
                        ) : (
                            interview.evaluations?.map((eval_) => (
                                <div key={eval_.id} className="px-5 py-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                                {eval_.score}/10
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{eval_.evaluator?.name}</p>
                                                <p className="text-xs text-gray-500">{new Date(eval_.created_at).toLocaleDateString('es-CL')}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('ats.evaluations.edit', eval_.id)}
                                            className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-yellow-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </Link>
                                    </div>
                                    {eval_.comments && (
                                        <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{eval_.comments}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900">Eliminar Entrevista</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ¿Estás seguro de que deseas eliminar esta entrevista? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                            <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
