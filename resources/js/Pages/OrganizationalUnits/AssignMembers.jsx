import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

function getInitials(name) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

export default function AssignMembers({ unit, availableUsers, allUnits }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState(
        unit.users ? unit.users.map(u => u.id) : []
    );
    const [filterUnit, setFilterUnit] = useState('all');
    const [saving, setSaving] = useState(false);

    const currentMemberIds = new Set(selectedUsers);

    const filteredUsers = availableUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.position && user.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesUnit = filterUnit === 'all' || 
            (filterUnit === 'unassigned' && !user.organizational_unit_id) ||
            user.organizational_unit_id == filterUnit;

        return matchesSearch && matchesUnit;
    });

    const handleToggleUser = (userId) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSelectAll = () => {
        const filteredIds = filteredUsers.map(u => u.id);
        setSelectedUsers(prev => {
            const newIds = [...new Set([...prev, ...filteredIds])];
            return newIds;
        });
    };

    const handleDeselectAll = () => {
        const filteredIds = new Set(filteredUsers.map(u => u.id));
        setSelectedUsers(prev => prev.filter(id => !filteredIds.has(id)));
    };

    const handleSave = () => {
        setSaving(true);
        router.post(route('organizational-units.update-members', unit.id), {
            user_ids: selectedUsers,
        }, {
            onFinish: () => setSaving(false),
        });
    };

    const getUnitName = (unitId) => {
        if (!unitId) return 'Sin asignar';
        const found = allUnits.find(u => u.id === unitId);
        return found ? found.name : 'Desconocida';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Asignar Miembros - {unit.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Asignar Miembros - ${unit.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{unit.name}</h1>
                            {unit.description && (
                                <p className="mt-1 text-sm text-gray-600">{unit.description}</p>
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-lg font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Available Users */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Usuarios Disponibles
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSelectAll}
                                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                                            >
                                                Seleccionar filtrados
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                onClick={handleDeselectAll}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Deseleccionar filtrados
                                            </button>
                                        </div>
                                    </div>

                                    {/* Filters */}
                                    <div className="mb-4 space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre, email, cargo o departamento..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-600">Filtrar por unidad:</label>
                                            <select
                                                value={filterUnit}
                                                onChange={(e) => setFilterUnit(e.target.value)}
                                                className="rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                                            >
                                                <option value="all">Todos</option>
                                                <option value="unassigned">Sin asignar</option>
                                                {allUnits.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Users List */}
                                    <div className="border-t border-gray-200 pt-4">
                                        {filteredUsers.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                No se encontraron usuarios con los filtros aplicados
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                                {filteredUsers.map((user) => {
                                                    const isSelected = currentMemberIds.has(user.id);
                                                    return (
                                                        <div
                                                            key={user.id}
                                                            onClick={() => handleToggleUser(user.id)}
                                                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                                isSelected
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-200 bg-white hover:border-green-300'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => handleToggleUser(user.id)}
                                                                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                                            />
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-sm font-bold">
                                                                {getInitials(user.name)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {user.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                                {user.position && (
                                                                    <p className="text-xs text-gray-600">{user.position}</p>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    user.organizational_unit_id
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                    {getUnitName(user.organizational_unit_id)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 text-sm text-gray-600">
                                        Mostrando {filteredUsers.length} de {availableUsers.length} usuarios
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Members */}
                        <div>
                            <div className="bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Miembros Actuales
                                    </h3>
                                    
                                    {selectedUsers.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No hay miembros asignados
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {availableUsers
                                                .filter(u => currentMemberIds.has(u.id))
                                                .map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                                                    >
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-sm font-bold">
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {user.name}
                                                            </p>
                                                            {user.position && (
                                                                <p className="text-xs text-gray-600 truncate">{user.position}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleUser(user.id);
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                            title="Remover"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold text-green-600">{selectedUsers.length}</span> {selectedUsers.length === 1 ? 'miembro' : 'miembros'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Help */}
                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-semibold text-blue-900">Ayuda</h4>
                                        <p className="mt-1 text-xs text-blue-800">
                                            Selecciona los usuarios que deseas asignar a esta unidad organizacional. 
                                            Los usuarios marcados con "Sin asignar" no pertenecen a ninguna unidad.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
