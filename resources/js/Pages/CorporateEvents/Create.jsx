import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        event_date: '',
        end_date: '',
        location: '',
        type: '',
        color: '#038C34',
        is_featured: false,
        is_published: true,
    });

    function submit(e) {
        e.preventDefault();
        post(route('corporate-events.store'));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Nuevo Evento Corporativo</h2>}
        >
            <Head title="Nuevo Evento" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                                    <input type="text" id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea id="description" rows="4" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                                        <input type="datetime-local" id="event_date" value={data.event_date} onChange={(e) => setData('event_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                        {errors.event_date && <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Fecha de Término (opcional)</label>
                                        <input type="datetime-local" id="end_date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
                                        <input type="text" id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
                                        <input type="text" id="type" value={data.type} onChange={(e) => setData('type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="reunion, capacitacion, etc." />
                                    </div>
                                    <div>
                                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                                        <input type="color" id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="is_featured" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                        <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">Destacado</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="is_published" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">Publicado</label>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50">
                                        Crear Evento
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
