import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KpiCard from '@/Components/PurchaseInvoices/KpiCard';
import Pagination from '@/Components/PurchaseInvoices/Pagination';
import StatusBadge from '@/Components/PurchaseInvoices/StatusBadge';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const money = (value, currency) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: currency || 'CLP', maximumFractionDigits: 0 }).format(value || 0);

export default function Accounting({ invoices, stats, filters, options }) {
    const { purchaseInvoiceAccess = {} } = usePage().props;
    const [sending, setSending] = useState(false);
    const emptyFilters = { estado: '', responsable: '', proveedor: '', sucursal: '', area: '', especie: '', fecha_desde: '', fecha_hasta: '', oc: '', folio: '', asociacion: '', asignacion: '', origen_responsable: '', cuenta: '' };
    const [form, setForm] = useState({ ...emptyFilters, ...filters });
    const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const submit = (event) => { event.preventDefault(); router.get(route('purchase-invoice-approvals.accounting'), form, { preserveState: true, replace: true }); };
    const clear = () => { setForm(emptyFilters); router.get(route('purchase-invoice-approvals.accounting')); };
    const sendReminder = () => {
        if (window.confirm('¿Enviar ahora el resumen de facturas pendientes por vencer (11 días) a todos los responsables?')) {
            setSending(true);
            router.post(route('purchase-invoice-approvals.send-reminder'), {}, { preserveScroll: true, onFinish: () => setSending(false) });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Control de facturas · Contabilidad</h2>}>
            <Head title="Facturas · Contabilidad" />
            <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6">
                <div><p className="text-sm font-semibold uppercase tracking-wider text-green-700">Vista global</p><h1 className="mt-1 text-2xl font-bold text-gray-900">Seguimiento de aprobaciones</h1></div>
                {purchaseInvoiceAccess.sendReminder && <div className="flex justify-end"><button onClick={sendReminder} disabled={sending} className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">{sending ? 'Enviando...' : 'Enviar recordatorio'}</button></div>}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8"><KpiCard label="Pendientes" value={stats.pending} tone="amber" /><KpiCard label="Aprobadas" value={stats.approved} /><KpiCard label="Objetadas" value={stats.objected} tone="red" /><KpiCard label="Sin responsable" value={stats.unmapped} tone="orange" /><KpiCard label="Sin OC" value={stats.without_po} tone="orange" /><KpiCard label="> 24 horas" value={stats.over_24h} tone="amber" /><KpiCard label="> 48 horas" value={stats.over_48h} tone="red" /><KpiCard label="> 72 horas" value={stats.over_72h} tone="red" /></div>

                <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <select value={form.estado} onChange={(e) => change('estado', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Todos los estados</option>{['PENDIENTE','PENDIENTE_ASIGNACION','APROBADO','OBJETADO','SIN_RESPONSABLE','CANCELADO_SAP'].map((value) => <option key={value}>{value}</option>)}</select>
                    <select value={form.responsable} onChange={(e) => change('responsable', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Todos los responsables</option>{options.responsibles.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
                    <input value={form.proveedor} onChange={(e) => change('proveedor', e.target.value)} placeholder="Proveedor" className="rounded-lg border-gray-300 text-sm" />
                    <select value={form.sucursal} onChange={(e) => change('sucursal', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Todas las sucursales</option>{options.branches.map((branch) => <option key={branch} value={branch}>Sucursal {branch}</option>)}</select>
                    <select value={form.area} onChange={(e) => change('area', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Todas las áreas</option>{options.areas.map((area) => <option key={area.area} value={area.area}>{area.nombre_area || area.area}</option>)}</select>
                    <select value={form.especie} onChange={(e) => change('especie', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Todas las especies</option>{options.species.map((species) => <option key={species.especie} value={species.especie}>{species.nombre_especie || species.especie}</option>)}</select>
                    <input type="date" value={form.fecha_desde} onChange={(e) => change('fecha_desde', e.target.value)} className="rounded-lg border-gray-300 text-sm" aria-label="Fecha factura desde" />
                    <input type="date" value={form.fecha_hasta} onChange={(e) => change('fecha_hasta', e.target.value)} className="rounded-lg border-gray-300 text-sm" aria-label="Fecha factura hasta" />
                    <input value={form.oc} onChange={(e) => change('oc', e.target.value)} placeholder="Número OC" className="rounded-lg border-gray-300 text-sm" />
                    <input value={form.folio} onChange={(e) => change('folio', e.target.value)} placeholder="Folio factura" className="rounded-lg border-gray-300 text-sm" />
                    <select value={form.asociacion} onChange={(e) => change('asociacion', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Con y sin OC</option><option value="con_oc">Con OC</option><option value="sin_oc">Sin OC</option></select>
                    <select value={form.asignacion} onChange={(e) => change('asignacion', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Con y sin responsable</option><option value="asignada">Responsable asignado</option><option value="sin_asignar">Sin asignar</option></select>
                    <select value={form.origen_responsable} onChange={(e) => change('origen_responsable', e.target.value)} className="rounded-lg border-gray-300 text-sm"><option value="">Cualquier origen</option><option value="SAP_OWNER">Responsable SAP</option><option value="MANUAL">Responsable manual</option></select>
                    <input value={form.cuenta} onChange={(e) => change('cuenta', e.target.value)} placeholder="Cuenta contable" className="rounded-lg border-gray-300 text-sm" />
                </div><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={clear} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600">Limpiar</button><button className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white">Aplicar filtros</button></div></form>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 text-sm"><thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Factura</th><th className="px-4 py-3">Proveedor</th><th className="px-4 py-3">Monto</th><th className="px-4 py-3">OC</th><th className="px-4 py-3">Responsables</th><th className="px-4 py-3">Demora</th><th className="px-4 py-3">Estado</th><th></th></tr></thead><tbody className="divide-y divide-gray-100">{invoices.data.map((invoice) => <tr key={invoice.id} className="hover:bg-gray-50"><td className="whitespace-nowrap px-4 py-4 font-semibold">{invoice.folio}</td><td className="max-w-xs px-4 py-4 text-gray-600">{invoice.provider}</td><td className="whitespace-nowrap px-4 py-4 font-semibold">{money(invoice.total, invoice.currency)}</td><td className="px-4 py-4">{invoice.purchase_orders.join(', ') || invoice.manual_purchase_order || <span className="font-semibold text-orange-700">SIN OC</span>}</td><td className="px-4 py-4">{invoice.responsibles.map((responsible) => <div key={`${responsible.source}-${responsible.owner_code || responsible.name}`} className="whitespace-nowrap"><span className={responsible.name ? 'text-gray-700' : 'font-medium text-orange-700'}>{responsible.name || `OwnerCode ${responsible.owner_code} sin homologar`}</span> <span className="text-xs text-gray-400">({responsible.source === 'MANUAL' ? 'Manual' : responsible.status})</span></div>)}</td><td className={`px-4 py-4 font-semibold ${invoice.age_hours > 48 ? 'text-red-600' : invoice.age_hours >= 24 ? 'text-amber-600' : 'text-green-700'}`}>{invoice.age_hours < 24 ? `${invoice.age_hours} h` : `${Math.floor(invoice.age_hours / 24)} d`}</td><td className="px-4 py-4"><StatusBadge status={invoice.status} /></td><td className="px-4 py-4"><Link href={route('purchase-invoice-approvals.show', invoice.id)} className="font-semibold text-green-700">Ver</Link></td></tr>)}</tbody></table></div>{invoices.data.length === 0 && <p className="p-10 text-center text-gray-500">No hay resultados.</p>}<Pagination links={invoices.links} /></div>
            </div>
        </AuthenticatedLayout>
    );
}
