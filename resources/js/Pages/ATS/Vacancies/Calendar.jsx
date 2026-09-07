import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

/**
 * Calendario de ingreso de vacantes de Obra por semana.
 * Muestra en una cuadrícula las vacantes que deben ingresar cada semana
 * y alerta sobre aquellas obras sin semana de inicio o fin.
 */
export default function Calendar({ year, vacancies, incomplete }) {
    const byWeek = {};
    vacancies.forEach((vacancy) => {
        (byWeek[vacancy.entry_week] = byWeek[vacancy.entry_week] || []).push(vacancy);
    });

    const weeks = Array.from({ length: 53 }, (_, i) => i + 1);

    const changeYear = (delta) => {
        router.get(route('ats.vacancies.calendar'), { year: year + delta }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.vacancies.index')} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800">Calendario de Ingresos</h2>
                </div>
            }
        >
            <Head title="Calendario de Ingresos - ATS" />

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
                            <h3 className="text-sm font-semibold text-gray-900">Ingresos por semana · Año {year}</h3>
                            <p className="text-xs text-gray-500">
                                Vacantes de Obra con ingreso programado en la semana.
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
                            const list = byWeek[week] || [];
                            const hasItems = list.length > 0;

                            return (
                                <div
                                    key={week}
                                    className={`min-h-[72px] rounded-lg border p-2 ${hasItems ? 'border-blue-300 bg-blue-50' : 'border-gray-100 bg-gray-50/60'}`}
                                >
                                    <div className={`mb-1 text-xs font-semibold ${hasItems ? 'text-blue-700' : 'text-gray-400'}`}>
                                        Semana {week}
                                    </div>
                                    {list.slice(0, 3).map((vacancy) => (
                                        <Link
                                            key={vacancy.id}
                                            href={route('ats.vacancies.edit', vacancy.id)}
                                            title={vacancy.title}
                                            className="block truncate rounded px-1 py-0.5 text-[10px] leading-tight text-gray-700 transition hover:bg-blue-100"
                                        >
                                            {vacancy.title}
                                        </Link>
                                    ))}
                                    {list.length > 3 && <div className="mt-1 text-[10px] text-gray-400">+{list.length - 3} más</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}