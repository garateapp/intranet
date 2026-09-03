const styles = {
    PENDIENTE: 'bg-amber-100 text-amber-800 ring-amber-200',
    APROBADO: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    OBJETADO: 'bg-red-100 text-red-800 ring-red-200',
    CANCELADO_SAP: 'bg-slate-200 text-slate-700 ring-slate-300',
    SIN_RESPONSABLE: 'bg-orange-100 text-orange-800 ring-orange-200',
    PENDIENTE_ASIGNACION: 'bg-violet-100 text-violet-800 ring-violet-200',
};

const labels = {
    PENDIENTE: 'Pendiente',
    APROBADO: 'Aprobado',
    OBJETADO: 'Objetado',
    CANCELADO_SAP: 'Cancelado SAP',
    SIN_RESPONSABLE: 'Sin responsable',
    PENDIENTE_ASIGNACION: 'Pendiente de asignación',
};

export default function StatusBadge({ status }) {
    return (
        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status] || 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
            {labels[status] || status}
        </span>
    );
}
