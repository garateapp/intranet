import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ permit }) {
    const form = useForm({
        con_goce_sueldo: permit.con_goce_sueldo,
    });

    function handleSubmit(e) {
        e.preventDefault();
        form.patch(route('manager.exit-permits.update-goce-sueldo', permit.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Permiso de Salida #{permit.id}
                    </h2>
                    <Link
                        href={route('manager.exit-permits.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                    >
                        Volver
                    </Link>
                </div>
            }
        >
            <Head title={`Permiso #${permit.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Details */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles de la Solicitud</h3>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Solicitante</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{permit.user?.name ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{permit.user?.email ?? '—'}</dd>
                                </div>
                                {permit.notification_email && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email de Notificación</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{permit.notification_email}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Jefe Directo</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{permit.manager?.name ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Salida</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{permit.fecha_salida}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Hora de Salida</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{permit.hora_salida ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Fecha de Retorno</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{permit.fecha_retorno ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Hora de Retorno</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{permit.hora_retorno ?? '—'}</dd>
                                </div>
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Motivo</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{permit.motivo}</dd>
                                </div>
                                {permit.observaciones && (
                                    <div className="md:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Observaciones</dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{permit.observaciones}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                                    <dd className="mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Aprobada
                                        </span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Goce de Sueldo</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${permit.con_goce_sueldo ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {permit.con_goce_sueldo_label}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Goce de sueldo toggle */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Actualizar Goce de Sueldo</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="text-sm font-medium text-blue-700">Con goce de sueldo</span>
                                            <p className="text-xs text-blue-500 mt-0.5">
                                                La solicitud se crea sin goce por defecto. Marca si corresponde con goce.
                                            </p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={form.data.con_goce_sueldo}
                                            onChange={(e) => form.setData('con_goce_sueldo', e.target.checked)}
                                            className={`toggle ${form.data.con_goce_sueldo ? 'toggle-success' : ''}`}
                                        />
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Link
                                        href={route('manager.exit-permits.index')}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex items-center px-4 py-2 bg-amber-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-700 disabled:opacity-50"
                                    >
                                        {form.processing ? 'Guardando...' : 'Guardar'}
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
