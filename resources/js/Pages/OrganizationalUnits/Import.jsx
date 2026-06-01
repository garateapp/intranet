import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Import() {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    function submit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', data.file);
        post(route('organizational-units.import-csv'), {
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Importar Unidades Organizacionales
                </h2>
            }
        >
            <Head title="Importar Unidades" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Subir archivo CSV
                            </h3>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Archivo CSV
                                    </label>
                                    <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={(e) => setData('file', e.target.files[0])}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        CSV con delimitador por comas. Máximo 2MB.
                                    </p>
                                    {errors.file && (
                                        <p className="mt-2 text-sm text-red-600">{errors.file}</p>
                                    )}
                                </div>

                                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                                    <p className="font-medium mb-1">Formato esperado del CSV:</p>
                                    <code className="block whitespace-pre text-xs">
{`name,parent,description,sort_order,is_active
Gerencia General,,Máxima autoridad,1,1
RRHH,Gerencia General,Recursos Humanos,2,1
Informática,Gerencia General,Tecnología,3,1
Remuneraciones,RRHH,Gestión de sueldos,4,1`}
                                    </code>
                                    <ul className="mt-2 space-y-1 list-disc list-inside">
                                        <li><strong>name</strong> (requerido) — Nombre de la unidad</li>
                                        <li><strong>parent</strong> — Nombre de la unidad padre (debe existir o estar en el mismo CSV)</li>
                                        <li><strong>description</strong> — Descripción opcional</li>
                                        <li><strong>sort_order</strong> — Orden numérico (opcional, default 0)</li>
                                        <li><strong>is_active</strong> — 1/0 o true/false (opcional, default true)</li>
                                    </ul>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <a
                                        href={route('organizational-units.index')}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50"
                                    >
                                        Volver
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.file}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Importando...' : 'Importar'}
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
