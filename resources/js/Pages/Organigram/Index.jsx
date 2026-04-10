import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

function getInitials(name) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

// Individual member card within a unit
function MemberBadge({ user }) {
    return (
        <a
            href={`mailto:${user.email}`}
            className="group flex items-center gap-2 rounded-lg bg-white/80 p-2 transition-all hover:bg-white hover:shadow-md"
            title={user.email ? `Enviar correo a ${user.name}` : user.name}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-xs font-bold text-white">
                {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
                {user.position && (
                    <p className="text-[10px] text-gray-500 truncate">{user.position}</p>
                )}
            </div>
        </a>
    );
}

// Unit box in the org chart with recursive children
function OrgUnit({ unit, depth = 0 }) {
    const hasMembers = unit.users && unit.users.length > 0;
    const activeChildren = (unit.children || []).filter(c => c.is_active)
        .sort((a, b) => a.sort_order - b.sort_order);
    const hasChildren = activeChildren.length > 0;

    // Color scheme based on depth
    const colorSchemes = [
        { border: 'border-green-500', bg: 'from-green-50 to-emerald-50', text: 'text-green-800', title: 'text-lg' },
        { border: 'border-blue-500', bg: 'from-blue-50 to-indigo-50', text: 'text-blue-800', title: 'text-base' },
        { border: 'border-purple-500', bg: 'from-purple-50 to-violet-50', text: 'text-purple-800', title: 'text-sm' },
        { border: 'border-orange-500', bg: 'from-orange-50 to-amber-50', text: 'text-orange-800', title: 'text-sm' },
        { border: 'border-pink-500', bg: 'from-pink-50 to-rose-50', text: 'text-pink-800', title: 'text-sm' },
    ];
    const scheme = colorSchemes[Math.min(depth, colorSchemes.length - 1)];

    return (
        <div className="flex flex-col items-center">
            {/* Unit Card */}
            <div
                className={`relative rounded-xl border-2 shadow-lg transition-all hover:shadow-xl ${scheme.border} bg-gradient-to-br ${scheme.bg}`}
            >
                <div className="p-3 min-w-[200px] max-w-[280px]">
                    {/* Unit Name */}
                    <h3 className={`font-bold text-center mb-2 ${scheme.title} ${scheme.text}`}>
                        {unit.name}
                    </h3>
                    {unit.description && (
                        <p className="text-xs text-gray-600 text-center mb-2">{unit.description}</p>
                    )}

                    {/* Members */}
                    {hasMembers && (
                        <div className="space-y-1.5">
                            {unit.users.map((user) => (
                                <MemberBadge key={user.id} user={user} />
                            ))}
                        </div>
                    )}

                    {/* Member count badge */}
                    {!hasMembers && (
                        <div className="text-center text-xs text-gray-400 italic py-2">
                            Sin miembros
                        </div>
                    )}
                </div>
            </div>

            {/* Render Children with connectors */}
            {hasChildren && (
                <div className="mt-4">
                    {/* Vertical line from parent */}
                    <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-gray-300"></div>
                    </div>

                    {/* Children in a row */}
                    <div className="flex gap-4 items-start">
                        {activeChildren.map((child) => (
                            <div key={child.id} className="flex flex-col items-center">
                                {/* Vertical line to each child */}
                                <div className="w-0.5 h-6 bg-gray-300"></div>

                                {/* Recursive child */}
                                <OrgUnit unit={child} depth={depth + 1} />
                            </div>
                        ))}
                    </div>
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

export default function Index({ units, unassignedCount }) {
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

                    {/* Notice for unassigned users */}
                    {unassignedCount > 0 && (
                        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium text-amber-800">
                                        Hay {unassignedCount} {unassignedCount === 1 ? 'usuario sin asignar' : 'usuarios sin asignar'}
                                    </h3>
                                    <div className="mt-1 text-sm text-amber-700">
                                        <p>Estos usuarios no pertenecen a ninguna unidad organizacional y no aparecerán en el organigrama.</p>
                                    </div>
                                    <div className="mt-2">
                                        <a
                                            href={route('organizational-units.index')}
                                            className="inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-900 underline"
                                        >
                                            Ir a asignar miembros
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {rootUnits.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="overflow-x-auto">
                                    <div className="min-w-max">
                                        <div className="flex gap-8 items-start">
                                            {rootUnits.map((unit) => (
                                                <OrgUnit key={unit.id} unit={unit} depth={0} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
