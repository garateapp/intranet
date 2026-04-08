import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        icon: '',
        color: '#038C34',
        sort_order: 0,
        is_active: true,
    });

    function submit(e) {
        e.preventDefault();
        post(route('faq-categories.store'));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Nueva Categoría de FAQ
                </h2>
            }
        >
            <Head title="Nueva Categoría FAQ" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea id="description" rows="3" value={data.description} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Icono</label>
                                        <input type="text" id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="info, users, cpu" />
                                    </div>
                                    <div>
                                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                                        <input type="color" id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10" />
                                    </div>
                                    <div>
                                        <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">Orden</label>
                                        <input type="number" id="sort_order" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" id="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">Activo</label>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50">
                                        Crear Categoría
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
