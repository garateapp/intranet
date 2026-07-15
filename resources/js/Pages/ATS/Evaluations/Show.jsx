import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ evaluation }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route('ats.evaluations.delete', evaluation.id), {
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const scoreColor = (score) => {
        if (score <= 3) return 'bg-red-100 text-red-700';
        if (score <= 5) return 'bg-yellow-100 text-yellow-700';
        if (score <= 7) return 'bg-blue-100 text-blue-700';
        return 'bg-green-100 text-green-700';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('ats.interviews.show', evaluation.interview_id)} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Detalle de Evaluación</h2>
                            <p className="text-sm text-gray-500">{evaluation.interview?.application?.candidate?.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('ats.evaluations.edit', evaluation.id)}
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
            <Head title="Detalle Evaluación - ATS" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Puntaje */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
                    <p className="mb-2 text-sm font-medium text-gray-500">Puntaje</p>
                    <span className={`inline-flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold ${scoreColor(evaluation.score)}`}>
                        {evaluation.score}
                    </span>
                    <p className="mt-2 text-sm text-gray-600">
                        {evaluation.score <= 3 && 'Deficiente'}
                        {evaluation.score >= 4 && evaluation.score <= 5 && 'Promedio'}
                        {evaluation.score >= 6 && evaluation.score <= 7 && 'Bueno'}
                        {evaluation.score >= 8 && evaluation.score <= 10 && 'Excelente'}
                    </p>
                </div>

                {/* Detalles */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <dl className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <dt className="w-24 shrink-0 text-gray-500">Evaluador</dt>
                            <dd className="font-medium text-gray-900">{evaluation.evaluator?.name}</dd>
                        </div>
                        <div className="flex items-start gap-3">
                            <dt className="w-24 shrink-0 text-gray-500">Fecha</dt>
                            <dd className="text-gray-700">{new Date(evaluation.created_at).toLocaleString('es-CL')}</dd>
                        </div>
                        <div className="flex items-start gap-3">
                            <dt className="w-24 shrink-0 text-gray-500">Entrevista</dt>
                            <dd className="text-gray-700">{new Date(evaluation.interview?.scheduled_at).toLocaleString('es-CL')}</dd>
                        </div>
                    </dl>
                </div>

                {/* Comentarios */}
                {evaluation.comments && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Comentarios</h3>
                        <p className="whitespace-pre-wrap text-sm text-gray-700">{evaluation.comments}</p>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900">Eliminar Evaluación</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ¿Estás seguro de que deseas eliminar esta evaluación? Esta acción no se puede deshacer.
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
