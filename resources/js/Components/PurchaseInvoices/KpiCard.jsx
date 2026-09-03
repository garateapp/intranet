export default function KpiCard({ label, value, tone = 'green' }) {
    const tones = {
        green: 'border-green-200 bg-green-50 text-green-800',
        amber: 'border-amber-200 bg-amber-50 text-amber-800',
        red: 'border-red-200 bg-red-50 text-red-800',
        slate: 'border-slate-200 bg-slate-50 text-slate-800',
        orange: 'border-orange-200 bg-orange-50 text-orange-800',
    };

    return (
        <div className={`rounded-xl border p-4 ${tones[tone]}`}>
            <p className="text-sm font-medium opacity-75">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
        </div>
    );
}
