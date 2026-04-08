import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users, filters }) {
    const [search, setSearch] = useState(filters.q || '');
    const [role, setRole] = useState(filters.role || '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('users.index'), { q: search, role });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Usuarios
                </h2>
            }
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <form onSubmit={handleFilter} className="mb-6 flex gap-4">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por nombre o email"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Todos los roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">Usuario</option>
                                </select>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                >
                                    Filtrar
                                </button>
                            </form>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visible</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destacado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.position || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_directory_visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {user.is_directory_visible ? 'Sí' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_directory_featured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {user.is_directory_featured ? 'Sí' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                    <Link href={route('users.edit', user.id)} className="hover:text-green-700">
                                                        Editar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4">
                                <nav className="inline-flex rounded-md shadow-sm">
                                    {users.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-2 text-sm ${
                                                link.active
                                                    ? 'z-10 border border-green-600 bg-green-600 text-white'
                                                    : link.url
                                                    ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                    : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${index === users.links.length - 1 ? 'rounded-r-md' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
