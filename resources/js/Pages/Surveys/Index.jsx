import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ surveys }) {
    const handleDelete = (survey) => {
        if (confirm(`¿Eliminar la encuesta "${survey.title}"?`)) {
            router.delete(route('surveys.destroy', survey.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Encuestas
                    </h2>
                    <Link
                        href={route('surveys.create')}
                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-green-700"
                    >
                        Nueva encuesta
                    </Link>
                </div>
            }
        >
            <Head title="Encuestas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Encuesta</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modalidad</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cierre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Respuestas</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {surveys.map((survey) => (
                                            <tr key={survey.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{survey.title}</div>
                                                    <div className="text-xs text-gray-500">{survey.description || 'Sin descripción'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {survey.is_anonymous ? 'Anónima' : 'Con login'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${survey.status === 'activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {survey.status}
                                                    </span>
                                                    {!survey.is_published && (
                                                        <span className="ml-2 inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                                                            No publicada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{survey.ends_at}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{survey.responses_count}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex flex-wrap gap-3">
                                                        <Link href={route('surveys.show', survey.id)} className="text-blue-600 hover:text-blue-700">
                                                            Ver resultados
                                                        </Link>
                                                        <Link href={route('surveys.edit', survey.id)} className="text-green-600 hover:text-green-700">
                                                            Editar
                                                        </Link>
                                                        <button onClick={() => handleDelete(survey)} className="text-red-600 hover:text-red-700">
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {surveys.length === 0 && (
                                <div className="py-12 text-center text-sm text-gray-500">
                                    No hay encuestas creadas.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
