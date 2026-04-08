import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ documents, categories, filters }) {
    const [categoryId, setCategoryId] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [trashed, setTrashed] = useState(filters.trashed || '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('admin.documents.index'), {
            category: categoryId || undefined,
            status: status || undefined,
            trashed: trashed || undefined,
        });
    }

    function handleDelete(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
            router.delete(route('admin.documents.destroy', id));
        }
    }

    function handleRestore(id) {
        router.put(route('admin.documents.restore', id));
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return '-';
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        let size = bytes;
        while (size >= 1024 && i < units.length - 1) {
            size /= 1024;
            i++;
        }
        return `${size.toFixed(1)} ${units[i]}`;
    };

    const getFileIcon = (fileType) => {
        if (!fileType) return '📄';
        const icons = {
            pdf: '📕',
            doc: '📘', docx: '📘',
            xls: '📗', xlsx: '📗',
            ppt: '📙', pptx: '📙',
        };
        return icons[fileType.toLowerCase()] || '📄';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Documentos
                    </h2>
                    <Link
                        href={route('admin.documents.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Nuevo Documento
                    </Link>
                </div>
            }
        >
            <Head title="Documentos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filters */}
                            <form onSubmit={handleFilter} className="mb-6 flex flex-wrap gap-4">
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="published">Publicados</option>
                                    <option value="unpublished">No publicados</option>
                                </select>
                                <select
                                    value={trashed}
                                    onChange={(e) => setTrashed(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                >
                                    <option value="">Solo activos</option>
                                    <option value="with">Incluir eliminados</option>
                                    <option value="only">Solo eliminados</option>
                                </select>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                >
                                    Filtrar
                                </button>
                            </form>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doc.</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Versión</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {documents.data.map((doc) => (
                                            <tr key={doc.id} className={doc.deleted_at ? 'bg-gray-50' : ''}>
                                                <td className="px-4 py-2 text-lg">{getFileIcon(doc.file_type)}</td>
                                                <td className="px-4 py-2">
                                                    <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                                                    <div className="text-xs text-gray-500">{formatFileSize(doc.file_size)} • {doc.uploaded_by?.name}</div>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{doc.category?.name || '-'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{doc.version}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <div className="flex flex-wrap gap-1">
                                                        {doc.is_published && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">Publicado</span>}
                                                        {doc.is_vigant && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Vigente</span>}
                                                        {doc.is_featured && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Destacado</span>}
                                                        {doc.deleted_at && <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">Eliminado</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-green-600 space-x-2">
                                                    {!doc.deleted_at ? (
                                                        <>
                                                            <Link href={route('admin.documents.edit', doc.id)} className="hover:text-green-700">Editar</Link>
                                                            <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-700">Eliminar</button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleRestore(doc.id)} className="text-blue-600 hover:text-blue-700">Restaurar</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {documents.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="inline-flex rounded-md shadow-sm">
                                        {documents.links.map((link, i) => (
                                            <button
                                                key={i}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm ${link.active ? 'z-10 border border-green-600 bg-green-600 text-white' : link.url ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'} ${i === 0 ? 'rounded-l-md' : ''} ${i === documents.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
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
