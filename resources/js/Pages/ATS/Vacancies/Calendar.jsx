import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

/**
 * Calendario de vacantes de Obra por semana.
 * Muestra en una cuadrícula TODAS las vacantes que ingresan y las que salen
 * cada semana del año, y alerta sobre aquellas obras sin semana de inicio o fin.
 */
export default function Calendar({ year, vacancies, incomplete }) {
    const byWeek = {};
    vacancies.forEach((vacancy) => {
        const key = vacancy.sort_week;
        byWeek[key] = byWeek[key] || { entries: [], exits: [] };
        byWeek[key][vacancy.event_type === 'exit' ? 'exits' : 'entries'].push(vacancy);
    });

    const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

    const changeYear = (delta) => {
        router.get(route('ats.vacancies.calendar'), { year: year + delta }, { preserveState: true });
    };

    const renderItem = (vacancy, extraClass) => (
        <Link
            key={`${vacancy.event_type}-${vacancy.id}`}
            href={route('ats.vacancies.edit', vacancy.id)}
            title={`${vacancy.event_type === 'exit' ? 'Sale' : 'Ingresa'}: ${vacancy.title}`}
            className={`block rounded px-1 py-0.5 text-[10px] leading-tight transition ${extraClass}`}
        >
            {vacancy.title}
        </Link>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.vacancies.index')} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800">Calendario de Ingresos y Salidas</h2>
                </div>
            }
        >
            <Head title="Calendario de Ingresos y Salidas - ATS" />

            <div className="space-y-6">
                {/* Vacantes de obra con semanas incompletas */}
                {incomplete.length > 0 && (
                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                        <h3 className="mb-2 text-sm font-semibold text-orange-800">
                            Vacantes de Obra sin semana de inicio o fin ({incomplete.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {incomplete.map((vacancy) => (
                                <Link
                                    key={vacancy.id}
                                    href={route('ats.vacancies.edit', vacancy.id)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-orange-700 ring-1 ring-orange-200 transition hover:bg-orange-100"
                                >
                                    <span className="font-medium">{vacancy.title}</span>
                                    <span className="rounded-full bg-orange-100 px-2 py-0.5">
                                        {!vacancy.entry_week ? 'Falta semana de inicio' : 'Falta semana de fin'}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cuadrícula de semanas */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Ingresos y salidas por semana · Año {year}</h3>
                            <p className="text-xs text-gray-500">
                                Todas las vacantes de Obra con ingreso o salida programada en la semana.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => changeYear(-1)}
                                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                {year - 1}
                            </button>
                            <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white">{year}</span>
                            <button
                                onClick={() => changeYear(1)}
                                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                {year + 1}
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                        {weeks.map((week) => {
                            const list = byWeek[week] || { entries: [], exits: [] };
                            const hasItems = list.entries.length > 0 || list.exits.length > 0;

                            return (
                                <div
                                    key={week}
                                    className={`flex min-h-[72px] flex-col gap-1 rounded-lg border p-2 ${hasItems ? 'border-blue-300 bg-blue-50' : 'border-gray-100 bg-gray-50/60'}`}
                                >
                                    <div className={`mb-0.5 text-xs font-semibold ${hasItems ? 'text-blue-700' : 'text-gray-400'}`}>
                                        Semana {week}
                                    </div>

                                    {list.entries.length > 0 && (
                                        <div>
                                            <div className="mb-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-blue-600">
                                                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                                Ingresan ({list.entries.length})
                                            </div>
                                            {list.entries.map((v) => renderItem(v, 'text-blue-800 hover:bg-blue-100'))}
                                        </div>
                                    )}

                                    {list.exits.length > 0 && (
                                        <div className="mt-0.5">
                                            <div className="mb-0.5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-amber-600">
                                                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                Salen ({list.exits.length})
                                            </div>
                                            {list.exits.map((v) => renderItem(v, 'text-amber-800 hover:bg-amber-100'))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}