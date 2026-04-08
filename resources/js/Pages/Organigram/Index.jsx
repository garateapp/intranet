import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

function getInitials(name) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

function MemberAvatar({ user }) {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-sm font-bold">
                {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                {user.position && (
                    <p className="text-xs text-gray-500 truncate">{user.position}</p>
                )}
            </div>
            {user.email && (
                <a
                    href={`mailto:${user.email}`}
                    className="shrink-0 text-xs text-green-600 hover:text-green-700"
                    title="Enviar correo"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </a>
            )}
        </div>
    );
}

function UnitCard({ unit, depth = 0 }) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = unit.children && unit.children.length > 0;
    const hasMembers = unit.users && unit.users.length > 0;
    const totalMembers = hasMembers ? unit.users.length : 0;

    return (
        <div className={depth > 0 ? 'ml-6 border-l-2 border-green-300 pl-4' : ''}>
            <div
                className={`mb-3 rounded-lg border-2 border-green-200 bg-white shadow-sm transition-shadow hover:shadow-md ${
                    expanded ? 'ring-2 ring-green-300' : ''
                }`}
            >
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex w-full items-center justify-between p-4 text-left"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            {(hasChildren || hasMembers) && (
                                <svg
                                    className={`h-4 w-4 text-green-600 transition-transform duration-200 ${
                                        expanded ? 'rotate-90' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            <h3 className="text-base font-semibold text-gray-900">{unit.name}</h3>
                        </div>
                        {unit.description && (
                            <p className="mt-1 text-sm text-gray-600">{unit.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {totalMembers} {totalMembers === 1 ? 'miembro' : 'miembros'}
                            </span>
                            {hasChildren && (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-lime-100 text-lime-800">
                                    {unit.children.length} {unit.children.length === 1 ? 'sub-unidad' : 'sub-unidades'}
                                </span>
                            )}
                        </div>
                    </div>
                </button>

                {expanded && (
                    <div className="border-t border-green-100">
                        {hasMembers && (
                            <div className="p-4">
                                <h4 className="mb-2 text-sm font-medium text-gray-700">
                                    Equipo
                                </h4>
                                <div className="divide-y divide-gray-100">
                                    {unit.users.map((user) => (
                                        <MemberAvatar key={user.id} user={user} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {expanded && hasChildren && (
                <div>
                    {unit.children
                        .filter((child) => child.is_active)
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((child) => (
                            <UnitCard key={child.id} unit={child} depth={depth + 1} />
                        ))}
                </div>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No hay unidades organizacionales
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
                El organigrama será visible una vez que el administrador configure las unidades y equipos.
            </p>
        </div>
    );
}

export default function Index({ units }) {
    const rootUnits = (units || [])
        .filter((u) => !u.parent_id)
        .filter((u) => u.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Organigrama
                    </h2>
                </div>
            }
        >
            <Head title="Organigrama" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Estructura Organizacional</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Explora las unidades y equipos que conforman la organización.
                        </p>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {rootUnits.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="space-y-2">
                                    {rootUnits.map((unit) => (
                                        <UnitCard key={unit.id} unit={unit} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
