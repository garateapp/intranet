import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ faqs, categories }) {
    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta FAQ?')) {
            router.delete(route('faqs.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        FAQs
                    </h2>
                    <Link
                        href={route('faqs.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Nueva FAQ
                    </Link>
                </div>
            }
        >
            <Head title="FAQs" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pregunta</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {faqs.data.map((faq) => (
                                        <tr key={faq.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-md truncate">{faq.question}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faq.category?.name || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faq.sort_order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${faq.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {faq.is_published ? 'Publicada' : 'Borrador'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 space-x-2">
                                                <Link href={route('faqs.edit', faq.id)} className="hover:text-green-700">Editar</Link>
                                                <button onClick={() => handleDelete(faq.id)} className="text-red-600 hover:text-red-700">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4">
                                <nav className="inline-flex rounded-md shadow-sm">
                                    {faqs.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-2 text-sm ${link.active ? 'z-10 border border-green-600 bg-green-600 text-white' : link.url ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'} ${index === 0 ? 'rounded-l-md' : ''} ${index === faqs.links.length - 1 ? 'rounded-r-md' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
