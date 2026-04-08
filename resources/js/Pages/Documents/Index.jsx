import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ documents, categories, filters }) {
    const [categoryId, setCategoryId] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [trashed, setTrashed] = useState(filters.trashed || '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('documents.index'), {
            category: categoryId || undefined,
            status: status || undefined,
            trashed: trashed || undefined,
        });
    }

    function handleDelete(id) {
        if (confirm('\u00bfEst\u00e1s seguro de que deseas eliminar este documento?')) {
            router.delete(route('documents.destroy', id));
        }
    }

    function handleRestore(id) {
        if (confirm('\u00bfDeseas restaurar este documento eliminado?')) {
            router.put(route('documents.restore', id));
        }
    }

    function handleToggleFeatured(id, currentValue) {
        router.put(route('documents.toggle-featured', id), {
            is_featured: !currentValue,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gesti\u00f3n de Documentos
                    </h2>
                    <Link
                        href={route('documents.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Nuevo Documento
                    </Link>
                </div>
            }
        >
            <Head title="Gesti\u00f3n de Documentos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-4 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleFilter} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Categor\u00eda
                                        </label>
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Todas</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Estado
                                        </label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Todos</option>
                                            <option value="published">Publicado</option>
                                            <option value="archived">Archivado</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Eliminados
                                        </label>
                                        <select
                                            value={trashed}
                                            onChange={(e) => setTrashed(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Solo activos</option>
                                            <option value="1">Incluir eliminados</option>
                                            <option value="only">Solo eliminados</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                        >
                                            Aplicar Filtros
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {documents.data.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                    No se encontraron documentos.
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">T\u00edtulo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categor\u00eda</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Versi\u00f3n</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vigente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destacado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documents.data.map((doc) => (
                                            <tr key={doc.id} className={doc.deleted_at ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                                                    {doc.deleted_at && (
                                                        <div className="text-xs text-red-600 mt-1">
                                                            Eliminado
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doc.category ? doc.category.name : '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doc.version || '1.0'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {doc.is_vigant ? (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                                            S\u00ed
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                            No
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleToggleFeatured(doc.id, doc.is_featured)}
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                                                            doc.is_featured
                                                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {doc.is_featured ? '\u2605 S\u00ed' : '\u2606 No'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {doc.deleted_at ? (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                            Eliminado
                                                        </span>
                                                    ) : doc.is_published ? (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            Publicado
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                            Borrador
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 space-x-2">
                                                    {doc.deleted_at ? (
                                                        <button
                                                            onClick={() => handleRestore(doc.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            Restaurar
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <Link
                                                                href={route('documents.edit', doc.id)}
                                                                className="hover:text-green-800"
                                                            >
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(doc.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Pagination */}
                            {documents.links && documents.links.length > 3 && (
                                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {documents.from} a {documents.to} de {documents.total} documentos
                                    </p>
                                    <nav className="flex justify-center space-x-1">
                                        {documents.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url, {
                                                    category: categoryId || undefined,
                                                    status: status || undefined,
                                                    trashed: trashed || undefined,
                                                })}
                                                disabled={!link.url}
                                                className={`min-w-[36px] px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label || '' }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
