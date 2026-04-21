import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SurveyForm from '@/Pages/Surveys/Form';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ survey }) {
    const { data, setData, put, processing, errors } = useForm({
        title: survey.title,
        description: survey.description || '',
        is_anonymous: survey.is_anonymous,
        is_published: survey.is_published,
        ends_at: survey.ends_at,
        questions: survey.questions,
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('surveys.update', survey.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Editar Encuesta
                    </h2>
                    <Link
                        href={route('surveys.index')}
                        className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 hover:bg-gray-300"
                    >
                        Volver al listado
                    </Link>
                </div>
            }
        >
            <Head title={`Editar: ${survey.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <SurveyForm data={data} setData={setData} errors={errors} />

                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={route('surveys.index')}
                                        className="inline-flex items-center rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 hover:bg-gray-300"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
