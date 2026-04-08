import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(route('faq-categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Categorías de FAQ
                    </h2>
                    <Link
                        href={route('faq-categories.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Nueva Categoría
                    </Link>
                </div>
            }
        >
            <Head title="Categorías de FAQ" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">FAQs</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.faqs_count || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.sort_order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {category.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 space-x-2">
                                                <Link href={route('faq-categories.edit', category.id)} className="hover:text-green-700">Editar</Link>
                                                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-700">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
