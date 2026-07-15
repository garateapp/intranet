import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ interview, evaluations }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('ats.interviews.show', interview.id)} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Evaluaciones</h2>
                            <p className="text-sm text-gray-500">{interview.application?.candidate?.name} · {new Date(interview.scheduled_at).toLocaleDateString('es-CL')}</p>
                        </div>
                    </div>
                    <Link
                        href={route('ats.interview-evaluations.create', interview.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Nueva Evaluación
                    </Link>
                </div>
            }
        >
            <Head title={`Evaluaciones - ${interview.application?.candidate?.name}`} />

            <div className="space-y-4">
                {evaluations.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <svg className="mx-auto mb-3 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="text-sm text-gray-500">No hay evaluaciones registradas.</p>
                    </div>
                ) : (
                    evaluations.map((eval_) => (
                        <div key={eval_.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                                        {eval_.score}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{eval_.evaluator?.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(eval_.created_at).toLocaleString('es-CL')}</p>
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
                                <p className="mt-3 text-sm text-gray-600 whitespace-pre-wrap">{eval_.comments}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
