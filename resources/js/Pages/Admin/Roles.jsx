import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/PurchaseInvoices/Pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Roles({ users, availableRoles, filters }) {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState(filters.buscar || '');
    const [passwordUser, setPasswordUser] = useState(null);
    const form = useForm({ roles: [] });
    const passwordForm = useForm({ password: '', password_confirmation: '' });

    const openEditor = (user) => {
        setSelected(user);
        form.setData('roles', user.roles);
    };

    const submit = (event) => {
        event.preventDefault();
        form.put(route('admin.roles.update', selected.id), {
            preserveScroll: true,
            onSuccess: () => setSelected(null),
        });
    };

    const openPassword = (user) => {
        setPasswordUser(user);
        passwordForm.reset('password', 'password_confirmation');
        passwordForm.clearErrors();
    };

    const submitPassword = (event) => {
        event.preventDefault();
        passwordForm.put(route('admin.roles.update-password', passwordUser.id), {
            preserveScroll: true,
            onSuccess: () => setPasswordUser(null),
        });
    };

    const toggleRole = (role) => {
        const current = form.data.roles;
        form.setData('roles', current.includes(role)
            ? current.filter((r) => r !== role)
            : [...current, role]);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Asignación de roles</h2>}>
            <Head title="Asignación de roles" />
            <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Administración</p>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900">Roles de usuario</h1>
                        <p className="mt-1 text-sm text-gray-500">Un usuario puede tener uno o más roles. Los permisos se derivan de la suma de sus roles.</p>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); router.get(route('admin.roles.index'), { buscar: search }, { preserveState: true, replace: true }); }} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex gap-2">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o correo" className="w-full rounded-lg border-gray-300 text-sm" />
                        <button className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white">Buscar</button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Usuario</th>
                                    <th className="px-4 py-3">Roles</th>
                                    <th className="px-4 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {user.roles.length === 0
                                                ? <span className="text-gray-400">Sin roles</span>
                                                : <div className="flex flex-wrap gap-1">{user.roles.map((role) => <span key={role} className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">{role}</span>)}</div>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditor(user)} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Editar roles</button>
                                                <button onClick={() => openPassword(user)} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cambiar contraseña</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-gray-100 p-4">
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>

            <Modal show={selected !== null} onClose={() => setSelected(null)} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold">Roles de {selected?.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">{selected?.email}</p>
                    <div className="mt-5 space-y-2">
                        {availableRoles.map((role) => (
                            <label key={role} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                                <input type="checkbox" checked={form.data.roles.includes(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                <span className="text-sm font-medium text-gray-700">{role}</span>
                            </label>
                        ))}
                        {form.errors.roles && <p className="text-sm text-red-600">{form.errors.roles}</p>}
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Cancelar</button>
                        <button disabled={form.processing} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Guardar</button>
                    </div>
                </form>
            </Modal>

            <Modal show={passwordUser !== null} onClose={() => setPasswordUser(null)} maxWidth="sm">
                <form onSubmit={submitPassword} className="p-6">
                    <h2 className="text-xl font-bold">Cambiar contraseña</h2>
                    <p className="mt-1 text-sm text-gray-500">{passwordUser?.name} – {passwordUser?.email}</p>
                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                            <input type="password" value={passwordForm.data.password} onChange={(e) => passwordForm.setData('password', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300" />
                            {passwordForm.errors.password && <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                            <input type="password" value={passwordForm.data.password_confirmation} onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300" />
                            {passwordForm.errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password_confirmation}</p>}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" onClick={() => setPasswordUser(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Cancelar</button>
                        <button disabled={passwordForm.processing} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Guardar contraseña</button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
