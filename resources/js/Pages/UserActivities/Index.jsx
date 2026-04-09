import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const STATUS_COLORS = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    page_visit: 'bg-blue-100 text-blue-800',
    api_request: 'bg-purple-100 text-purple-800',
    account_update: 'bg-yellow-100 text-yellow-800',
};

const DEVICE_ICONS = {
    desktop: '🖥️',
    mobile: '📱',
    tablet: '📋',
};

export default function Index({ users }) {
    const [activities, setActivities] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [action, setAction] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [device, setDevice] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);

    async function fetchActivities(pageNum = 1) {
        setLoading(true);
        const params = new URLSearchParams();
        if (userId) params.set('user_id', userId);
        if (action) params.set('action', action);
        if (dateFrom) params.set('date_from', dateFrom);
        if (dateTo) params.set('date_to', dateTo);
        if (device) params.set('device', device);
        params.set('page', pageNum);
        params.set('per_page', '20');

        try {
            const res = await fetch(`/api/admin/user-activities?${params}`, {
                headers: { 'Accept': 'application/json' },
            });
            const json = await res.json();
            if (json.success) {
                setActivities(json.data.data);
                setMeta(json.data);
                setPage(pageNum);
            }
        } catch (err) {
            console.error('Error fetching activities:', err);
        }
        setLoading(false);
    }

    async function fetchStats() {
        try {
            const res = await fetch('/api/admin/user-activities/stats?days=30', {
                headers: { 'Accept': 'application/json' },
            });
            const json = await res.json();
            if (json.success) {
                setStats(json.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }

    useEffect(() => {
        fetchActivities(1);
        fetchStats();
    }, []);

    function handleFilter(e) {
        e.preventDefault();
        fetchActivities(1);
    }

    function handleExport() {
        window.location.href = '/api/admin/user-activities/export';
    }

    function formatAction(act) {
        const labels = {
            login: 'Inicio de sesión',
            logout: 'Cierre de sesión',
            page_visit: 'Visita de página',
            api_request: 'Solicitud API',
            account_update: 'Actualización de cuenta',
        };
        return labels[act] || act;
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Actividad de Usuarios
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            📥 Exportar CSV
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Actividad de Usuarios" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Summary */}
                    {stats && (
                        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-sm text-gray-500">Actividades (30 días)</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_activities.toLocaleString()}</p>
                            </div>
                            <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-sm text-gray-500">Usuarios únicos</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.unique_users}</p>
                            </div>
                            <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-sm text-gray-500">Sesiones hoy</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.by_action?.login || 0}
                                </p>
                            </div>
                            <div className="rounded-lg bg-white p-4 shadow">
                                <p className="text-sm text-gray-500">Dispositivos móviles</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.by_device?.mobile || 0}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="mb-6 rounded-lg bg-white p-4 shadow">
                        <form onSubmit={handleFilter} className="flex flex-wrap gap-4">
                            <select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                            >
                                <option value="">Todos los usuarios</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                            >
                                <option value="">Todas las acciones</option>
                                <option value="login">Inicio de sesión</option>
                                <option value="logout">Cierre de sesión</option>
                                <option value="page_visit">Visita de página</option>
                                <option value="api_request">Solicitud API</option>
                                <option value="account_update">Actualización de cuenta</option>
                            </select>
                            <select
                                value={device}
                                onChange={(e) => setDevice(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                            >
                                <option value="">Todos los dispositivos</option>
                                <option value="desktop">🖥️ Escritorio</option>
                                <option value="mobile">📱 Móvil</option>
                                <option value="tablet">📋 Tablet</option>
                            </select>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                            />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                            >
                                Filtrar
                            </button>
                        </form>
                    </div>

                    {/* Activity Table */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        {loading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispositivo</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Navegador</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {activities.map((activity) => (
                                                <tr key={activity.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                        {formatDate(activity.created_at)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{activity.user?.name || 'N/A'}</div>
                                                        <div className="text-xs text-gray-500">{activity.user?.email || ''}</div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[activity.action] || 'bg-gray-100 text-gray-800'}`}>
                                                            {formatAction(activity.action)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                        <span className="text-sm">{DEVICE_ICONS[activity.device] || '🖥️'}</span>
                                                        <span className="ml-1 text-xs text-gray-500">{activity.os}</span>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                                                        {activity.ip_address}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                        {activity.browser}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {meta && meta.links && meta.links.length > 3 && (
                                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
                                        <div className="text-sm text-gray-700">
                                            Mostrando {meta.from} - {meta.to} de {meta.total}
                                        </div>
                                        <nav className="inline-flex rounded-md shadow-sm">
                                            {meta.links.map((link, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => link.url && fetchActivities(i + 1)}
                                                    disabled={!link.url}
                                                    className={`px-3 py-2 text-sm ${
                                                        link.active
                                                            ? 'z-10 border border-green-600 bg-green-600 text-white'
                                                            : link.url
                                                            ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                            : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    } ${i === 0 ? 'rounded-l-md' : ''} ${i === meta.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
