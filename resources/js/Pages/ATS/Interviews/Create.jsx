import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ application }) {
    const { data, setData, post, processing, errors } = useForm({
        application_id: application.id,
        scheduled_at: '',
        location_link: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ats.interviews.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.application-interviews.index', application.id)} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Programar Entrevista</h2>
                        <p className="text-sm text-gray-500">{application.candidate?.name} · {application.vacancy?.title}</p>
                    </div>
                </div>
            }
        >
            <Head title="Programar Entrevista - ATS" />

            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Fecha y hora *</label>
                        <input
                            type="datetime-local"
                            value={data.scheduled_at}
                            onChange={(e) => setData('scheduled_at', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.scheduled_at && <p className="mt-1 text-xs text-red-600">{errors.scheduled_at}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Enlace de reunión</label>
                        <input
                            type="url"
                            value={data.location_link}
                            onChange={(e) => setData('location_link', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="https://meet.google.com/..."
                        />
                        {errors.location_link && <p className="mt-1 text-xs text-red-600">{errors.location_link}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Temas a tratar, instrucciones especiales..."
                        />
                        {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes}</p>}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href={route('ats.application-interviews.index', application.id)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Programar'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
