import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SurveyForm from '@/Pages/Surveys/Form';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        is_anonymous: true,
        is_published: true,
        ends_at: '',
        questions: [
            {
                prompt: '',
                options: [{ label: '' }, { label: '' }],
            },
        ],
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('surveys.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Nueva Encuesta
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
            <Head title="Nueva Encuesta" />

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
                                        Crear encuesta
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
