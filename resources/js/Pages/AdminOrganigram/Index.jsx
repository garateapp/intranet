import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ currentImport }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        file: null,
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        post(route('admin.organigram.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Importar organigrama BUK
                </h2>
            }
        >
            <Head title="Importar organigrama BUK" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">Organigrama visible actual</h3>
                            {currentImport ? (
                                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Archivo</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentImport.original_filename}</dd>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Personas importadas</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentImport.row_count}</dd>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cargado por</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{currentImport.uploader?.name ?? '—'}</dd>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Fecha</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(currentImport.created_at).toLocaleString('es-CL')}
                                        </dd>
                                    </div>
                                </dl>
                            ) : (
                                <p className="mt-4 text-sm text-gray-600">
                                    Aún no hay un organigrama cargado. Al subir un CSV de BUK se reemplazará por completo el organigrama visible.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">Subir nuevo CSV</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                El archivo debe venir desde BUK y reemplazará completamente el organigrama actual.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div>
                                    <InputLabel htmlFor="file" value="Archivo CSV" />
                                    <input
                                        id="file"
                                        type="file"
                                        accept=".csv,text/csv,.txt"
                                        onChange={(event) => setData('file', event.target.files[0])}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                                    />
                                    <InputError message={errors.file} className="mt-2" />
                                </div>

                                {progress && (
                                    <div className="text-sm text-gray-600">
                                        Subiendo archivo: {progress.percentage}%
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <PrimaryButton disabled={processing || !data.file}>
                                        {processing ? 'Importando...' : 'Reemplazar organigrama'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
