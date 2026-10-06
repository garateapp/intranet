import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const ROLE_LABELS = {
    user: 'Usuario',
    admin: 'Admin',
    recruiter: 'Reclutador',
    hiring_manager: 'Contratación',
};

export default function Create({ managers, organizationalUnits, roles }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        role: 'user',
        department: '',
        position: '',
        phone: '',
        location: '',
        manager_id: '',
        organizational_unit_id: '',
        is_directory_visible: true,
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('users.index')} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Crear Usuario</h2>
                </div>
            }
        >
            <Head title="Crear Usuario" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {flash?.success && (
                                <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4">
                                    <p className="text-sm font-medium text-green-800">{flash.success}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div className="rounded-md bg-gray-50 p-4">
                                    <p className="text-xs text-gray-600">
                                        Si no se indica una contraseña, se generará automáticamente con el patrón:{' '}
                                        <span className="font-semibold text-gray-800">
                                            Primera letra del Nombre (Mayúscula) + 123654 + Primera letra del Apellido (Mayúscula)
                                        </span>
                                        . Ejemplo: Juan Pérez → <span className="font-semibold text-gray-800">J123654P</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        />
                                        {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                            Apellido
                                        </label>
                                        <input
                                            type="text"
                                            id="last_name"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        />
                                        {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                            Rol
                                        </label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {ROLE_LABELS[role] || role}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Contraseña (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            id="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Automática si se deja vacío"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="manager_id" className="block text-sm font-medium text-gray-700">
                                            Jefe Directo
                                        </label>
                                        <select
                                            id="manager_id"
                                            value={data.manager_id}
                                            onChange={(e) => setData('manager_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Sin jefe asignado</option>
                                            {managers.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name} — {m.email}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.manager_id && <p className="mt-1 text-sm text-red-600">{errors.manager_id}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="organizational_unit_id" className="block text-sm font-medium text-gray-700">
                                            Unidad Organizacional
                                        </label>
                                        <select
                                            id="organizational_unit_id"
                                            value={data.organizational_unit_id}
                                            onChange={(e) => setData('organizational_unit_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Sin unidad</option>
                                            {organizationalUnits.map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.organizational_unit_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.organizational_unit_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                            Departamento
                                        </label>
                                        <input
                                            type="text"
                                            id="department"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                            Cargo
                                        </label>
                                        <input
                                            type="text"
                                            id="position"
                                            value={data.position}
                                            onChange={(e) => setData('position', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Ubicación
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_directory_visible"
                                        checked={data.is_directory_visible}
                                        onChange={(e) => setData('is_directory_visible', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor="is_directory_visible" className="ml-2 block text-sm text-gray-700">
                                        Visible en directorio
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Link
                                        href={route('users.index')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Crear Usuario'}
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
