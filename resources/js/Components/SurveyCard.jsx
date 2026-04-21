import { Link, useForm, usePage } from '@inertiajs/react';

export default function SurveyCard({ survey, variant = 'light' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { data, setData, post, processing, errors } = useForm({
        answers: survey.questions.reduce((accumulator, question) => {
            accumulator[question.id] = '';

            return accumulator;
        }, {}),
    });

    const isDark = variant === 'dark';

    const cardClasses = isDark
        ? 'rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md'
        : 'rounded-3xl border border-gray-200 bg-white p-6 shadow-sm';
    const mutedText = isDark ? 'text-green-100/80' : 'text-gray-500';
    const titleText = isDark ? 'text-white' : 'text-gray-900';
    const fieldClasses = isDark
        ? 'w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-300'
        : 'w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500';

    const handleSubmit = (event) => {
        event.preventDefault();

        post(route('surveys.respond', survey.id), {
            preserveScroll: true,
            data: {
                answers: survey.questions.map((question) => ({
                    question_id: question.id,
                    option_id: Number(data.answers[question.id]),
                })),
            },
        });
    };

    return (
        <div className={cardClasses}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'bg-lime-400/15 text-lime-200' : 'bg-green-100 text-green-700'}`}>
                            Encuesta
                        </span>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${survey.is_anonymous ? (isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700') : (isDark ? 'bg-orange-400/20 text-orange-200' : 'bg-orange-100 text-orange-700')}`}>
                            {survey.is_anonymous ? 'Anónima' : 'Con identificación'}
                        </span>
                        {survey.is_closed && (
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-red-500/20 text-red-200' : 'bg-red-100 text-red-700'}`}>
                                Cerrada
                            </span>
                        )}
                        {survey.has_responded && (
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-emerald-400/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>
                                Respondida
                            </span>
                        )}
                    </div>
                    <h3 className={`text-2xl font-black ${titleText}`}>{survey.title}</h3>
                    {survey.description && (
                        <p className={`max-w-3xl text-sm ${mutedText}`}>{survey.description}</p>
                    )}
                </div>

                <div className={`rounded-2xl px-4 py-3 text-sm ${isDark ? 'bg-black/20 text-green-50' : 'bg-gray-50 text-gray-700'}`}>
                    <div className="font-semibold">Cierre</div>
                    <div>{survey.ends_at}</div>
                    <div className="mt-1 text-xs opacity-80">{survey.responses_count} respuesta(s)</div>
                </div>
            </div>

            {!survey.is_anonymous && !user ? (
                <div className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${isDark ? 'border-white/10 bg-black/20 text-green-50' : 'border-orange-200 bg-orange-50 text-orange-900'}`}>
                    Esta encuesta no es anónima. Debes iniciar sesión para responderla.
                    <div className="mt-3">
                        <Link
                            href={route('login')}
                            className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'bg-white text-green-900' : 'bg-orange-600 text-white'}`}
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            ) : survey.has_responded ? (
                <div className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${isDark ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
                    Tu respuesta ya quedó registrada.
                </div>
            ) : survey.is_closed ? (
                <div className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${isDark ? 'border-red-400/20 bg-red-500/10 text-red-100' : 'border-red-200 bg-red-50 text-red-800'}`}>
                    La fecha de finalización ya pasó. No se puede seguir votando.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {survey.questions.map((question, questionIndex) => (
                        <div key={question.id} className="space-y-3">
                            <div className={`text-sm font-semibold ${titleText}`}>
                                {questionIndex + 1}. {question.prompt}
                            </div>
                            <div className="grid gap-3">
                                {question.options.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${isDark ? 'border-white/10 bg-black/20 text-white hover:border-lime-300/50' : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-green-500/50'}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            value={option.id}
                                            checked={String(data.answers[question.id]) === String(option.id)}
                                            onChange={(event) => setData('answers', {
                                                ...data.answers,
                                                [question.id]: event.target.value,
                                            })}
                                            className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                                            required
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {errors.survey && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.survey}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className={fieldClasses + ' font-semibold uppercase tracking-[0.2em]'}
                    >
                        {processing ? 'Guardando...' : 'Enviar respuesta'}
                    </button>
                </form>
            )}
        </div>
    );
}
