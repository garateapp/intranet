import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ logs, users, modules, filters }) {
    const [userId, setUserId] = useState(filters.user_id || '');
    const [action, setAction] = useState(filters.action || '');
    const [module, setModule] = useState(filters.module || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [expandedId, setExpandedId] = useState(null);

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('audit-logs.index'), {
            user_id: userId || undefined,
            action: action || undefined,
            module: module || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        });
    }

    function handlePageChange(url) {
        if (url) {
            router.get(url, {
                user_id: userId || undefined,
                action: action || undefined,
                module: module || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            });
        }
    }

    function toggleExpand(id) {
        setExpandedId(expandedId === id ? null : id);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function getActionBadge(action) {
        switch (action) {
            case 'created':
                return 'bg-green-100 text-green-800';
            case 'updated':
                return 'bg-blue-100 text-blue-800';
            case 'deleted':
                return 'bg-red-100 text-red-800';
            case 'status_changed':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    function getActionLabel(action) {
        switch (action) {
            case 'created':
                return 'Creado';
            case 'updated':
                return 'Actualizado';
            case 'deleted':
                return 'Eliminado';
            case 'status_changed':
                return 'Estado cambiado';
            default:
                return action;
        }
    }

    function formatJson(values) {
        if (!values) return null;
        try {
            return JSON.stringify(values, null, 2);
        } catch {
            return values;
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Registro de Auditoría
                </h2>
            }
        >
            <Head title="Auditoría" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleFilter} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Usuario
                                        </label>
                                        <select
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Todos</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Acción
                                        </label>
                                        <select
                                            value={action}
                                            onChange={(e) => setAction(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Todas</option>
                                            <option value="created">Creado</option>
                                            <option value="updated">Actualizado</option>
                                            <option value="deleted">Eliminado</option>
                                            <option value="status_changed">Estado cambiado</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Módulo
                                        </label>
                                        <select
                                            value={module}
                                            onChange={(e) => setModule(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Todos</option>
                                            {Object.entries(modules).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                    >
                                        Aplicar Filtros
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acción
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Módulo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Registro
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                IP
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Detalles
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.data.map((log) => (
                                            <>
                                                <tr key={log.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {formatDate(log.created_at)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {log.user ? log.user.name : '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionBadge(log.action)}`}
                                                        >
                                                            {getActionLabel(log.action)}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {modules[log.auditable_type] || log.auditable_type || '—'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {log.auditable?.title
                                                            ? log.auditable.title
                                                            : log.auditable
                                                            ? `#${log.auditable.id}`
                                                            : '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 font-mono">
                                                        {log.ip_address || '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                        {(log.old_values || log.new_values) && (
                                                            <button
                                                                onClick={() => toggleExpand(log.id)}
                                                                className="text-green-600 hover:text-green-700"
                                                            >
                                                                {expandedId === log.id ? 'Ocultar' : 'Ver cambios'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                                {expandedId === log.id && (log.old_values || log.new_values) && (
                                                    <tr key={`${log.id}-detail`} className="bg-gray-50">
                                                        <td colSpan="7" className="px-6 py-4">
                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                {log.old_values && (
                                                                    <div>
                                                                        <h4 className="mb-2 text-sm font-medium text-red-700">
                                                                            Valores Anteriores
                                                                        </h4>
                                                                        <pre className="overflow-auto rounded-md bg-white p-4 text-xs text-gray-800 border border-red-200">
                                                                            {formatJson(log.old_values)}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                                {log.new_values && (
                                                                    <div>
                                                                        <h4 className="mb-2 text-sm font-medium text-green-700">
                                                                            Valores Nuevos
                                                                        </h4>
                                                                        <pre className="overflow-auto rounded-md bg-white p-4 text-xs text-gray-800 border border-green-200">
                                                                            {formatJson(log.new_values)}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {logs.data.length === 0 && (
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
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No se encontraron registros
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Intenta cambiar los filtros para ver más resultados.
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {logs.links && logs.links.length > 3 && (
                                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {logs.from} a {logs.to} de {logs.total} registros
                                    </p>
                                    <nav className="flex flex-wrap justify-center gap-1">
                                        {logs.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(link.url)}
                                                disabled={!link.url}
                                                className={`min-w-[36px] px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label || '' }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
