import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ interview }) {
    const { data, setData, post, processing, errors } = useForm({
        interview_id: interview.id,
        score: '',
        comments: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ats.evaluations.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.interviews.show', interview.id)} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Nueva Evaluación</h2>
                        <p className="text-sm text-gray-500">{interview.application?.candidate?.name}</p>
                    </div>
                </div>
            }
        >
            <Head title="Nueva Evaluación - ATS" />

            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Puntaje (1-10) *</label>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setData('score', num)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                                        data.score === num
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        {errors.score && <p className="mt-1 text-xs text-red-600">{errors.score}</p>}
                        <p className="mt-2 text-xs text-gray-400">
                            {data.score <= 3 && 'Deficiente'}
                            {data.score >= 4 && data.score <= 5 && 'Promedio'}
                            {data.score >= 6 && data.score <= 7 && 'Bueno'}
                            {data.score >= 8 && data.score <= 10 && 'Excelente'}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Comentarios</label>
                        <textarea
                            value={data.comments}
                            onChange={(e) => setData('comments', e.target.value)}
                            rows={6}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Observaciones sobre la entrevista, fortalezas, áreas de mejora..."
                        />
                        {errors.comments && <p className="mt-1 text-xs text-red-600">{errors.comments}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href={route('ats.interviews.show', interview.id)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || !data.score}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Guardar Evaluación'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
