import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const statusBadgeClasses = {
    pendiente: 'bg-gray-100 text-gray-800',
    aprobada: 'bg-green-100 text-green-800',
    rechazada: 'bg-red-100 text-red-800',
};

export default function Show({ permit }) {
    const form = useForm({
        status: permit.status,
        admin_notes: permit.admin_notes || '',
        rejection_reason: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        form.patch(route('admin.exit-permits.update-status', permit.id), {
            preserveScroll: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Permiso de Salida #{permit.id}
                    </h2>
                    <Link
                        href={route('admin.exit-permits.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                    >
                        Volver
                    </Link>
                </div>
            }
        >
            <Head title={`Permiso de Salida #${permit.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Details */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Solicitud</h3>
                            <dl className="divide-y divide-gray-200">
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Solicitante</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{permit.user?.name || '—'}</dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{permit.user?.email || '—'}</dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Jefe Directo</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{permit.manager?.name || 'No asignado'}</dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Salida</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {permit.fecha_salida}
                                        {permit.hora_salida && <span className="ml-2 text-gray-500">a las {permit.hora_salida}</span>}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Retorno</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                        {permit.fecha_retorno ? (
                                            <>{permit.fecha_retorno}{permit.hora_retorno && <span className="ml-2 text-gray-500">a las {permit.hora_retorno}</span>}</>
                                        ) : (
                                            <span className="text-gray-400">No especificada</span>
                                        )}
                                    </dd>
                                </div>
                                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                                    <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeClasses[permit.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {permit.status_label}
                                        </span>
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Motivo</h4>
                                <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">{permit.motivo}</p>
                            </div>

                            {permit.observaciones && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Observaciones</h4>
                                    <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">{permit.observaciones}</p>
                                </div>
                            )}

                            {permit.rejection_reason && (
                                <div className="mt-4 rounded-lg bg-red-50 p-4">
                                    <h4 className="text-sm font-medium text-red-800 uppercase tracking-wider">Motivo de Rechazo</h4>
                                    <p className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{permit.rejection_reason}</p>
                                </div>
                            )}

                            {permit.admin_notes && (
                                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                                    <h4 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Notas Administrativas</h4>
                                    <p className="mt-2 text-sm text-blue-700 whitespace-pre-wrap">{permit.admin_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Update status */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actualizar Estado</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select
                                        value={form.data.status}
                                        onChange={(e) => form.setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="aprobada">Aprobar</option>
                                        <option value="rechazada">Rechazar</option>
                                    </select>
                                    {form.errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.status}</p>
                                    )}
                                </div>

                                {form.data.status === 'rechazada' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Motivo de Rechazo <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={form.data.rejection_reason}
                                            onChange={(e) => form.setData('rejection_reason', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Indica el motivo del rechazo..."
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notas Administrativas</label>
                                    <textarea
                                        value={form.data.admin_notes}
                                        onChange={(e) => form.setData('admin_notes', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        placeholder="Notas internas (opcional)"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        {form.processing ? 'Guardando...' : 'Actualizar Estado'}
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
