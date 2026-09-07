import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

/**
 * Carga masiva de vacantes: descarga la plantilla, sube el archivo .xlsx/.csv
 * y muestra el resumen de vacantes creadas y errores por fila.
 */
export default function Import({ result }) {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ats.vacancies.import.process'), { forceFormData: true });
    };

    const handleFile = (e) => {
        setData('file', e.target.files[0] || null);
    };

    const hasResult = result && (result.created > 0 || result.errors.length > 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.vacancies.index')} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800">Carga Masiva de Vacantes</h2>
                </div>
            }
        >
            <Head title="Carga Masiva - ATS" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Instrucciones + plantilla */}
                <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <h3 className="mb-1 text-sm font-semibold text-gray-900">1. Descarga la plantilla</h3>
                        <p className="text-sm text-gray-500">
                            La plantilla incluye todas las columnas necesarias y una fila de ejemplo. El campo{' '}
                            <span className="font-medium text-gray-700">Cantidad</span> permite replicar la misma vacante N veces. Para el tipo{' '}
                            <span className="font-medium text-gray-700">Obra</span> puede indicar opcionalmente las semanas de ingreso y salida.
                        </p>
                    </div>
                    <a
                        href={route('ats.vacancies.template')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Descargar Plantilla (.xlsx)
                    </a>
                </div>

                {/* Subir archivo */}
                <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div>
                        <h3 className="mb-1 text-sm font-semibold text-gray-900">2. Sube el archivo</h3>
                        <p className="mb-4 text-sm text-gray-500">Formatos compatibles: .xlsx y .csv. Máximo 10 MB.</p>
                        <input
                            type="file"
                            accept=".xlsx,.csv"
                            onChange={handleFile}
                            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {errors.file && <p className="mt-1 text-xs text-red-500">{errors.file}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={() => router.get(route('ats.vacancies.index'))}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.file}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Importando...' : 'Importar Vacantes'}
                        </button>
                    </div>
                </form>

                {/* Resultado */}
                {hasResult && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                            <p className="text-sm font-medium text-green-800">
                                Se crearon <span className="font-bold">{result.created}</span> vacantes de{' '}
                                <span className="font-bold">{result.total_rows}</span> filas procesadas.
                            </p>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-3 text-sm font-semibold text-red-800">
                                    Errores en {result.errors.length} fila(s)
                                </h3>
                                <ul className="max-h-80 space-y-2 overflow-y-auto">
                                    {result.errors.map((error, i) => (
                                        <li key={i} className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                                            <span className="font-semibold">Fila {error.row}:</span> {error.error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <Link
                    href={route('ats.vacancies.index')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Volver a Vacantes
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}