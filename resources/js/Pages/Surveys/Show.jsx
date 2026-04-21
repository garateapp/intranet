import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ survey }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Resultados de Encuesta
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">{survey.title}</p>
                    </div>
                    <Link
                        href={route('surveys.index')}
                        className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 hover:bg-gray-300"
                    >
                        Volver al listado
                    </Link>
                </div>
            }
        >
            <Head title={`Resultados: ${survey.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="grid gap-6 p-6 md:grid-cols-4">
                            <div>
                                <div className="text-sm text-gray-500">Estado</div>
                                <div className="mt-1 text-lg font-semibold text-gray-900">{survey.status}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Modalidad</div>
                                <div className="mt-1 text-lg font-semibold text-gray-900">
                                    {survey.is_anonymous ? 'Anónima' : 'Con login'}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Cierre</div>
                                <div className="mt-1 text-lg font-semibold text-gray-900">{survey.ends_at}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Respuestas</div>
                                <div className="mt-1 text-lg font-semibold text-gray-900">{survey.responses_count}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-6">
                            {survey.questions.map((question) => (
                                <div key={question.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    <div className="border-b border-gray-100 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{question.prompt}</h3>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        {question.options.map((option) => (
                                            <div key={option.id}>
                                                <div className="mb-1 flex items-center justify-between text-sm text-gray-700">
                                                    <span>{option.label}</span>
                                                    <span>{option.answers_count} voto(s) · {option.percentage}%</span>
                                                </div>
                                                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-green-600"
                                                        style={{ width: `${option.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-900">Respuestas registradas</h3>
                            </div>
                            <div className="max-h-[720px] space-y-4 overflow-y-auto p-6">
                                {survey.responses.map((response) => (
                                    <div key={response.id} className="rounded-2xl border border-gray-200 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{response.respondent}</div>
                                                {response.email && <div className="text-xs text-gray-500">{response.email}</div>}
                                            </div>
                                            <div className="text-xs text-gray-500">{response.submitted_at}</div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {response.answers.map((answer, index) => (
                                                <div key={`${response.id}-${index}`} className="rounded-xl bg-gray-50 px-3 py-2 text-sm">
                                                    <div className="font-medium text-gray-700">{answer.question}</div>
                                                    <div className="text-gray-900">{answer.option}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {survey.responses.length === 0 && (
                                    <div className="text-sm text-gray-500">
                                        Aún no hay respuestas registradas.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
