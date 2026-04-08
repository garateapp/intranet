import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ units }) {
    const [filter, setFilter] = useState('all');

    const filteredUnits = (units || []).filter((unit) => {
        if (filter === 'active') return unit.is_active;
        if (filter === 'inactive') return !unit.is_active;
        return true;
    });

    const handleDelete = (id, name) => {
        if (confirm(`¿Estás seguro de que deseas eliminar la unidad "${name}"?`)) {
            router.delete(route('organizational-units.destroy', id));
        }
    };

    const getParentName = (parentId, allUnits) => {
        if (!parentId) return null;
        const parent = allUnits.find((u) => u.id === parentId);
        return parent ? parent.name : null;
    };

    const activeCount = (units || []).filter((u) => u.is_active).length;
    const inactiveCount = (units || []).filter((u) => !u.is_active).length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Unidades Organizacionales
                    </h2>
                    <Link
                        href={route('organizational-units.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Nueva Unidad
                    </Link>
                </div>
            }
        >
            <Head title="Unidades Organizacionales" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filtros */}
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Filtrar:</span>
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                                        filter === 'all'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Todas ({units?.length || 0})
                                </button>
                                <button
                                    onClick={() => setFilter('active')}
                                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                                        filter === 'active'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                                >
                                    Activas ({activeCount})
                                </button>
                                <button
                                    onClick={() => setFilter('inactive')}
                                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                                        filter === 'inactive'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    Inactivas ({inactiveCount})
                                </button>
                            </div>

                            {/* Tabla */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unidad Padre
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Orden
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUnits.map((unit) => (
                                            <tr key={unit.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {unit.name}
                                                        </p>
                                                        {unit.description && (
                                                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                                                {unit.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {getParentName(unit.parent_id, units) || (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {unit.sort_order}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            unit.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {unit.is_active ? 'Activa' : 'Inactiva'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                    <Link
                                                        href={route('organizational-units.edit', unit.id)}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(unit.id, unit.name)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredUnits.length === 0 && (
                                <div className="py-12 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No se encontraron unidades
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {filter !== 'all'
                                            ? 'Intenta cambiar el filtro para ver más resultados.'
                                            : 'Comienza creando una nueva unidad organizacional.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
