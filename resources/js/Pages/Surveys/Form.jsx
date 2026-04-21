export default function SurveyForm({ data, setData, errors }) {
    const updateQuestion = (questionIndex, field, value) => {
        const nextQuestions = [...data.questions];
        nextQuestions[questionIndex] = {
            ...nextQuestions[questionIndex],
            [field]: value,
        };
        setData('questions', nextQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const nextQuestions = [...data.questions];
        const nextOptions = [...nextQuestions[questionIndex].options];
        nextOptions[optionIndex] = {
            ...nextOptions[optionIndex],
            label: value,
        };
        nextQuestions[questionIndex] = {
            ...nextQuestions[questionIndex],
            options: nextOptions,
        };
        setData('questions', nextQuestions);
    };

    const addQuestion = () => {
        setData('questions', [
            ...data.questions,
            {
                prompt: '',
                options: [{ label: '' }, { label: '' }],
            },
        ]);
    };

    const removeQuestion = (questionIndex) => {
        setData('questions', data.questions.filter((_, index) => index !== questionIndex));
    };

    const addOption = (questionIndex) => {
        const nextQuestions = [...data.questions];
        nextQuestions[questionIndex] = {
            ...nextQuestions[questionIndex],
            options: [...nextQuestions[questionIndex].options, { label: '' }],
        };
        setData('questions', nextQuestions);
    };

    const removeOption = (questionIndex, optionIndex) => {
        const nextQuestions = [...data.questions];
        nextQuestions[questionIndex] = {
            ...nextQuestions[questionIndex],
            options: nextQuestions[questionIndex].options.filter((_, index) => index !== optionIndex),
        };
        setData('questions', nextQuestions);
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Nombre de la encuesta
                </label>
                <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(event) => setData('title', event.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                </label>
                <textarea
                    id="description"
                    rows="3"
                    value={data.description}
                    onChange={(event) => setData('description', event.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_anonymous"
                        checked={data.is_anonymous}
                        onChange={(event) => setData('is_anonymous', event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-700">
                        Encuesta anónima
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_published"
                        checked={data.is_published}
                        onChange={(event) => setData('is_published', event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                        Publicada
                    </label>
                </div>

                <div>
                    <label htmlFor="ends_at" className="block text-sm font-medium text-gray-700">
                        Fecha de finalización
                    </label>
                    <input
                        type="datetime-local"
                        id="ends_at"
                        value={data.ends_at}
                        onChange={(event) => setData('ends_at', event.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                    />
                    {errors.ends_at && <p className="mt-1 text-sm text-red-600">{errors.ends_at}</p>}
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                {data.is_anonymous
                    ? 'Las respuestas se guardarán sin asociarlas al usuario, incluso si la persona ya inició sesión.'
                    : 'La encuesta exigirá login y guardará el usuario junto a sus respuestas.'}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Preguntas</h3>
                        <p className="text-sm text-gray-500">Cada pregunta requiere al menos dos opciones.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700"
                    >
                        Agregar pregunta
                    </button>
                </div>

                {errors.questions && <p className="text-sm text-red-600">{errors.questions}</p>}

                {data.questions.map((question, questionIndex) => (
                    <div key={`question-${questionIndex}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                                Pregunta {questionIndex + 1}
                            </h4>
                            {data.questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(questionIndex)}
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    Eliminar pregunta
                                </button>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Enunciado
                            </label>
                            <input
                                type="text"
                                value={question.prompt}
                                onChange={(event) => updateQuestion(questionIndex, 'prompt', event.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                            {errors[`questions.${questionIndex}.prompt`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`questions.${questionIndex}.prompt`]}</p>
                            )}
                        </div>

                        <div className="mt-4 space-y-3">
                            {question.options.map((option, optionIndex) => (
                                <div key={`option-${questionIndex}-${optionIndex}`} className="flex items-start gap-3">
                                    <input
                                        type="text"
                                        value={option.label}
                                        onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder={`Opción ${optionIndex + 1}`}
                                        required
                                    />
                                    {question.options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(questionIndex, optionIndex)}
                                            className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
                                        >
                                            Quitar
                                        </button>
                                    )}
                                </div>
                            ))}
                            {errors[`questions.${questionIndex}.options`] && (
                                <p className="text-sm text-red-600">{errors[`questions.${questionIndex}.options`]}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => addOption(questionIndex)}
                                className="text-sm font-medium text-green-600 hover:text-green-700"
                            >
                                + Agregar opción
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
