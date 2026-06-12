import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Create({ manager, supervisedUsers, userLoginMethod, isNotificationUser }) {
    const user = usePage().props.auth.user;
    const isSupervisor = isNotificationUser || supervisedUsers?.length > 0;

    const form = useForm({
        user_id: '',
        fecha_salida: '',
        hora_salida: '',
        fecha_retorno: '',
        hora_retorno: '',
        motivo: '',
        observaciones: '',
        notification_email: '',
    });

    const selectedUserId = form.data.user_id || user.id;
    const selectedUser = selectedUserId === user.id
        ? user
        : supervisedUsers?.find(u => u.id === Number(selectedUserId));

    const needsNotificationEmail = selectedUser?.login_method !== 'google';

    useEffect(() => {
        if (needsNotificationEmail && selectedUser?.email && !form.data.notification_email) {
            form.setData('notification_email', selectedUser.email);
        }
    }, [selectedUserId]);

    function handleSubmit(e) {
        e.preventDefault();
        const data = { ...form.data };
        if (data.user_id) {
            data.user_id = Number(data.user_id);
        }
        form.post(route('exit-permits.store'));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Solicitar Permiso de Salida
                    </h2>
                    <Link
                        href={route('exit-permits.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                    >
                        Mis Permisos
                    </Link>
                </div>
            }
        >
            <Head title="Solicitar Permiso de Salida" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Employee selector for supervisors / notification users */}
                                {isSupervisor && (
                                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-700">Solicitante</label>
                                            <select
                                                value={form.data.user_id}
                                                onChange={(e) => form.setData('user_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">Yo ({user.name})</option>
                                                {supervisedUsers.map((su) => (
                                                    <option key={su.id} value={su.id}>
                                                        {su.name}
                                                        {isNotificationUser ? ` — ${su.email}` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {isNotificationUser && (
                                            <p className="text-xs text-blue-600">Puedes crear permisos para cualquier usuario del sistema.</p>
                                        )}
                                    </div>
                                )}

                                {/* User info */}
                                <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Solicitante</label>
                                        <p className="mt-1 text-gray-900 font-medium">
                                            {selectedUser?.name ?? user.name}
                                        </p>
                                    </div>
                                    {manager && selectedUserId === user.id && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Jefe Directo</label>
                                            <p className="mt-1 text-gray-900 font-medium">{manager.name} — {manager.email}</p>
                                        </div>
                                    )}
                                    {selectedUserId !== user.id && (
                                        <div>
                                            <label className="block text-sm font-medium text-amber-700">Creado por supervisor</label>
                                            <p className="mt-1 text-amber-600 text-sm">
                                                Estás creando este permiso en nombre de <strong>{selectedUser?.name}</strong>.
                                                El jefe directo recibirá la notificación para aprobación.
                                            </p>
                                        </div>
                                    )}
                                    {!manager && selectedUserId === user.id && (
                                        <div>
                                            <label className="block text-sm font-medium text-amber-700">Jefe Directo</label>
                                            <p className="mt-1 text-amber-600 text-sm">No tienes un jefe directo asignado en el organigrama. La solicitud se enviará solo a las casillas de notificación.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Notification email for non-Google users */}
                                {needsNotificationEmail && (
                                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-700">
                                                Correo para Notificaciones <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={form.data.notification_email}
                                                onChange={(e) => form.setData('notification_email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-amber-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                                placeholder="correo@ejemplo.com"
                                            />
                                            <p className="mt-1 text-sm text-amber-600">
                                                No iniciaste sesión con Google. Ingresa un correo donde quieras recibir la respuesta de tu solicitud.
                                            </p>
                                            {form.errors.notification_email && (
                                                <p className="mt-1 text-sm text-red-600">{form.errors.notification_email}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Date/time fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fecha de Salida <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={form.data.fecha_salida}
                                            onChange={(e) => form.setData('fecha_salida', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        {form.errors.fecha_salida && (
                                            <p className="mt-1 text-sm text-red-600">{form.errors.fecha_salida}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Hora de Salida</label>
                                        <input
                                            type="time"
                                            value={form.data.hora_salida}
                                            onChange={(e) => form.setData('hora_salida', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Fecha de Retorno</label>
                                        <input
                                            type="date"
                                            value={form.data.fecha_retorno}
                                            onChange={(e) => form.setData('fecha_retorno', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        {form.errors.fecha_retorno && (
                                            <p className="mt-1 text-sm text-red-600">{form.errors.fecha_retorno}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Hora de Retorno</label>
                                        <input
                                            type="time"
                                            value={form.data.hora_retorno}
                                            onChange={(e) => form.setData('hora_retorno', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                {/* Motivo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Motivo <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={form.data.motivo}
                                        onChange={(e) => form.setData('motivo', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder="Describe el motivo de tu salida..."
                                    />
                                    {form.errors.motivo && (
                                        <p className="mt-1 text-sm text-red-600">{form.errors.motivo}</p>
                                    )}
                                </div>

                                {/* Observaciones */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        value={form.data.observaciones}
                                        onChange={(e) => form.setData('observaciones', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        placeholder="Información adicional (opcional)"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3">
                                    <Link
                                        href={route('exit-permits.index')}
                                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {form.processing ? 'Enviando...' : 'Solicitar Permiso'}
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
