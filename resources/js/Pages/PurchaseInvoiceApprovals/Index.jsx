import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KpiCard from '@/Components/PurchaseInvoices/KpiCard';
import Pagination from '@/Components/PurchaseInvoices/Pagination';
import StatusBadge from '@/Components/PurchaseInvoices/StatusBadge';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const money = (value, currency) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: currency || 'CLP', maximumFractionDigits: 0 }).format(value || 0);
const date = (value) => value ? new Intl.DateTimeFormat('es-CL').format(new Date(`${value}T12:00:00`)) : '—';

function AgeBadge({ hours }) {
    const style = hours > 48 ? 'bg-red-100 text-red-700' : hours >= 24 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${style}`}>{hours < 24 ? `${hours} h` : `${Math.floor(hours / 24)} d`}</span>;
}

export default function Index({ invoices, stats, filters }) {
    const [search, setSearch] = useState(filters.buscar || '');
    const apply = (event) => {
        event.preventDefault();
        router.get(route('purchase-invoice-approvals.index'), { buscar: search, estado: filters.estado || '' }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Aprobación de facturas</h2>}>
            <Head title="Aprobación de facturas" />
            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Órdenes de compra SAP</p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900">Facturas bajo tu responsabilidad</h1>
                    <p className="mt-1 text-sm text-gray-500">Revisa diferencias de cantidad y monto antes de decidir.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <KpiCard label="Pendientes" value={stats.pending} tone="amber" />
                    <KpiCard label="Aprobadas esta semana" value={stats.approved_week} />
                    <KpiCard label="Objetadas" value={stats.objected} tone="red" />
                    <KpiCard label="Por vencer" value={stats.due_soon} tone="orange" />
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <form onSubmit={apply} className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row">
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Proveedor, folio u OC" className="w-full rounded-lg border-gray-300 text-sm focus:border-green-500 focus:ring-green-500 sm:max-w-sm" />
                        <select value={filters.estado || ''} onChange={(e) => router.get(route('purchase-invoice-approvals.index'), { buscar: search, estado: e.target.value }, { preserveState: true, replace: true })} className="rounded-lg border-gray-300 text-sm focus:border-green-500 focus:ring-green-500">
                            <option value="">Todos los estados</option>
                            <option value="PENDIENTE">Pendientes</option>
                            <option value="APROBADO">Aprobadas</option>
                            <option value="OBJETADO">Objetadas</option>
                            <option value="CANCELADO_SAP">Canceladas SAP</option>
                            <option value="SIN_RESPONSABLE">Sin responsable</option>
                        </select>
                        <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">Buscar</button>
                    </form>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr>
                                <th className="px-4 py-3">Factura / Proveedor</th><th className="px-4 py-3">Fechas</th><th className="px-4 py-3">Monto</th><th className="px-4 py-3">OC / Clasificación</th><th className="px-4 py-3">Demora</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3"></th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoices.data.map((invoice) => <tr key={invoice.id} className="hover:bg-green-50/40">
                                    <td className="px-4 py-4"><div className="font-semibold text-gray-900">{invoice.folio || `Doc. ${invoice.factura_doc_num}`}</div><div className="max-w-xs truncate text-gray-500">{invoice.provider}</div></td>
                                    <td className="px-4 py-4 text-gray-600"><div>{date(invoice.invoice_date)}</div><div className={invoice.days_to_due != null && invoice.days_to_due < 0 ? 'font-medium text-red-600' : 'text-xs text-gray-500'}>{invoice.days_to_due == null ? 'Sin vencimiento' : invoice.days_to_due < 0 ? `Vencida hace ${Math.abs(invoice.days_to_due)} d` : `Vence en ${invoice.days_to_due} d`}</div></td>
                                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900">{money(invoice.total, invoice.currency)}</td>
                                    <td className="px-4 py-4 text-gray-600"><div>OC {invoice.purchase_orders.join(', ') || '—'}</div><div className="text-xs text-gray-500">{[...invoice.areas, ...invoice.species].join(' · ') || 'Sin clasificación'}</div></td>
                                    <td className="px-4 py-4"><AgeBadge hours={invoice.age_hours} /></td>
                                    <td className="px-4 py-4"><StatusBadge status={invoice.status} /></td>
                                    <td className="px-4 py-4 text-right"><Link href={route('purchase-invoice-approvals.show', invoice.id)} className="font-semibold text-green-700 hover:text-green-900">Ver</Link></td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-gray-100 md:hidden">
                        {invoices.data.map((invoice) => <Link key={invoice.id} href={route('purchase-invoice-approvals.show', invoice.id)} className="block p-4 active:bg-green-50">
                            <div className="flex items-start justify-between gap-3"><div><p className="font-bold text-gray-900">{invoice.folio}</p><p className="text-sm text-gray-600">{invoice.provider}</p></div><StatusBadge status={invoice.status} /></div>
                            <p className="mt-3 text-xl font-bold text-gray-900">{money(invoice.total, invoice.currency)}</p>
                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500"><span>OC {invoice.purchase_orders.join(', ') || '—'}</span><AgeBadge hours={invoice.age_hours} /></div>
                        </Link>)}
                    </div>

                    {invoices.data.length === 0 && <div className="p-12 text-center text-gray-500">No hay facturas para los filtros seleccionados.</div>}
                    <Pagination links={invoices.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
