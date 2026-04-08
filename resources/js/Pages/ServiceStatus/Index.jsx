import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const statusBadgeClasses = {
    operativo: 'bg-green-100 text-green-800',
    degradado: 'bg-yellow-100 text-yellow-800',
    incidente: 'bg-red-100 text-red-800',
    mantenimiento: 'bg-blue-100 text-blue-800',
};

function ServiceCard({ service }) {
    const [expanded, setExpanded] = useState(false);

    const allOperational = service.status === 'operativo';

    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div
                className="flex cursor-pointer items-center justify-between p-6 hover:bg-gray-50"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                        {allOperational ? (
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-semibold text-gray-900">{service.name}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeClasses[service.status_badge_color] || 'bg-gray-100 text-gray-800'}`}>
                                {service.status_label}
                            </span>
                        </div>
                        {service.status_message && (
                            <p className="mt-1 text-sm text-gray-500">{service.status_message}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                            Última verificación: {service.last_checked_at}
                        </p>
                    </div>
                </div>
                <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {expanded && service.status_history && service.status_history.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Historial de cambios</h4>
                    <div className="space-y-3">
                        {service.status_history.map((change) => (
                            <div key={change.id} className="flex items-start gap-3 text-sm">
                                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadgeClasses[change.old_status] || 'bg-gray-100 text-gray-600'}`}>
                                            {change.old_status}
                                        </span>
                                        <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadgeClasses[change.new_status] || 'bg-gray-100 text-gray-600'}`}>
                                            {change.new_status}
                                        </span>
                                    </div>
                                    {change.message && (
                                        <p className="mt-1 text-xs text-gray-500">{change.message}</p>
                                    )}
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        Por {change.changed_by.name} · {change.created_at}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Index({ services, summary }) {
    const allOperational = summary.with_issues === 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Estado de Servicios
                </h2>
            }
        >
            <Head title="Estado de Servicios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {allOperational && (
                        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-6 py-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-medium text-green-800">
                                Todos los servicios operativos &#10003;
                            </p>
                        </div>
                    )}

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-gray-500">Total</div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">{summary.total}</div>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-green-600">Operativos</div>
                                <div className="mt-2 text-3xl font-bold text-green-700">{summary.operativos}</div>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-sm font-medium text-red-600">Con problemas</div>
                                <div className="mt-2 text-3xl font-bold text-red-700">{summary.with_issues}</div>
                            </div>
                        </div>
                    </div>

                    {/* Service list */}
                    <div className="space-y-4">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
