import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        origin: '',
        cv_url: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ats.candidates.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.candidates.index')} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800">Nuevo Candidato</h2>
                </div>
            }
        >
            <Head title="Nuevo Candidato - ATS" />

            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Nombre completo"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="correo@ejemplo.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    {/* Teléfono */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="+56 9 1234 5678"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Origen */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Origen</label>
                        <input
                            type="text"
                            value={data.origin}
                            onChange={(e) => setData('origin', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="LinkedIn, Referido, Sitio Web..."
                        />
                        {errors.origin && <p className="mt-1 text-xs text-red-600">{errors.origin}</p>}
                    </div>

                    {/* URL del CV */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">URL del CV</label>
                        <input
                            type="url"
                            value={data.cv_url}
                            onChange={(e) => setData('cv_url', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="https://drive.google.com/..."
                        />
                        {errors.cv_url && <p className="mt-1 text-xs text-red-600">{errors.cv_url}</p>}
                    </div>

                    {/* Notas */}
                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Información adicional sobre el candidato..."
                        />
                        {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes}</p>}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href={route('ats.candidates.index')}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Crear Candidato'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
