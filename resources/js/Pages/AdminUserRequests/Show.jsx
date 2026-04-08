import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ request: req }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: req.status,
        admin_notes: req.admin_notes || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        patch(route('user-requests.update-status', req.id));
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Solicitud: {req.reference_code}
                    </h2>
                    <Link
                        href={route('user-requests.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300"
                    >
                        Volver al Listado
                    </Link>
                </div>
            }
        >
            <Head title={`Solicitud ${req.reference_code}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Request Details */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{req.title}</h3>
                                    <p className="mt-1 text-sm font-mono text-gray-500">{req.reference_code}</p>
                                </div>
                                <span
                                    className="px-3 py-1 text-sm font-semibold rounded-full"
                                    style={{
                                        backgroundColor:
                                            req.status === 'pendiente' ? '#f3f4f6' :
                                            req.status === 'en_revision' ? '#fef9c3' :
                                            req.status === 'aprobada' ? '#dcfce7' :
                                            req.status === 'rechazada' ? '#fee2e2' :
                                            req.status === 'completada' ? '#dbeafe' : '#f3f4f6',
                                        color:
                                            req.status === 'pendiente' ? '#1f2937' :
                                            req.status === 'en_revision' ? '#854d0e' :
                                            req.status === 'aprobada' ? '#166534' :
                                            req.status === 'rechazada' ? '#991b1b' :
                                            req.status === 'completada' ? '#1e40af' : '#1f2937',
                                    }}
                                >
                                    {req.status_label}
                                </span>
                            </div>

                            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Usuario</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {req.user ? req.user.name : '—'}
                                    </dd>
                                    {req.user?.email && (
                                        <dd className="text-sm text-gray-500">{req.user.email}</dd>
                                    )}
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Tipo de Solicitud</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {req.request_type ? req.request_type.name : '—'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Creada el</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(req.created_at)}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(req.updated_at)}</dd>
                                </div>
                            </dl>

                            <div className="mt-6">
                                <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                                <dd className="mt-2 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                                    {req.description || 'Sin descripción.'}
                                </dd>
                            </div>

                            {req.admin_notes && (
                                <div className="mt-6">
                                    <dt className="text-sm font-medium text-gray-500">Notas del Administrador</dt>
                                    <dd className="mt-2 whitespace-pre-wrap rounded-md bg-yellow-50 p-4 text-sm text-gray-700 border border-yellow-200">
                                        {req.admin_notes}
                                    </dd>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">Actualizar Estado</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Nuevo Estado
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_revision">En revisión</option>
                                        <option value="aprobada">Aprobada</option>
                                        <option value="rechazada">Rechazada</option>
                                        <option value="completada">Completada</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                </div>

                                <div>
                                    <label htmlFor="admin_notes" className="block text-sm font-medium text-gray-700">
                                        Notas del Administrador
                                    </label>
                                    <textarea
                                        id="admin_notes"
                                        rows="4"
                                        value={data.admin_notes}
                                        onChange={(e) => setData('admin_notes', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder="Agrega notas o comentarios sobre esta solicitud..."
                                    />
                                    {errors.admin_notes && <p className="mt-1 text-sm text-red-600">{errors.admin_notes}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Actualizar Estado
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Status History */}
                    {req.status_history && req.status_history.length > 0 && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="mb-4 text-lg font-medium text-gray-900">Historial de Estados</h3>
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {req.status_history.map((entry, index) => (
                                            <li key={index}>
                                                <div className="relative pb-8">
                                                    {index !== req.status_history.length - 1 && (
                                                        <span
                                                            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 ring-8 ring-white">
                                                                <svg
                                                                    className="h-5 w-5 text-green-600"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={1.5}
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                            <div>
                                                                <p className="text-sm text-gray-600">
                                                                    Estado cambiado a{' '}
                                                                    <span className="font-medium text-gray-900">
                                                                        {entry.status_label}
                                                                    </span>
                                                                </p>
                                                                {entry.notes && (
                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {entry.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                                {formatDate(entry.created_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
