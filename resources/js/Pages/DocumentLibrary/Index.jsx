import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PortalHero from '@/Components/PortalHero';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function FileIcon({ extension }) {
    const ext = (extension || '').toUpperCase();

    const config = {
        PDF: { emoji: '📄', bg: 'bg-red-100', text: 'text-red-700' },
        DOC: { emoji: '📝', bg: 'bg-blue-100', text: 'text-blue-700' },
        DOCX: { emoji: '📝', bg: 'bg-blue-100', text: 'text-blue-700' },
        XLS: { emoji: '📊', bg: 'bg-green-100', text: 'text-green-700' },
        XLSX: { emoji: '📊', bg: 'bg-green-100', text: 'text-green-700' },
        PPT: { emoji: '📽️', bg: 'bg-orange-100', text: 'text-orange-700' },
        PPTX: { emoji: '📽️', bg: 'bg-orange-100', text: 'text-orange-700' },
        JPG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        JPEG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        PNG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        SVG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        ZIP: { emoji: '📦', bg: 'bg-yellow-100', text: 'text-yellow-700' },
        RAR: { emoji: '📦', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    };

    const { emoji, bg, text } = config[ext] || { emoji: '📎', bg: 'bg-gray-100', text: 'text-gray-700' };

    return (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bg}`}>
            <span className={`text-xl ${text}`}>{emoji}</span>
        </div>
    );
}

export default function Index({ documents, categories, filters }) {
    const [search, setSearch] = useState(filters.q || '');
    const [category, setCategory] = useState(filters.category || '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('document-library.index'), {
            q: search,
            category: category || undefined,
        });
    }

    function handleReset() {
        setSearch('');
        setCategory('');
        router.get(route('document-library.index'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Centro de Documentos" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <PortalHero
                        greeting="Centro de Documentos"
                        subtitle="Encuentra toda la documentación de la empresa organizada por categoría. Busca por nombre o filtra según tus necesidades."
                    />

                    {/* Filters */}
                    <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleFilter} className="flex flex-col gap-4 md:flex-row md:items-end">
                                <div className="flex-1">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                                        Buscar
                                    </label>
                                    <input
                                        id="search"
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Buscar por título o descripción..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>

                                <div className="w-full md:w-64">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                        Categoría
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.slug}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                    >
                                        Filtrar
                                    </button>
                                    {(search || category) && (
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Documents Grid */}
                    <div className="mt-6">
                        {documents.data.length === 0 ? (
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-12 text-center">
                                    <div className="mx-auto h-16 w-16 text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron documentos</h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Intenta con otros términos de búsqueda o cambia el filtro de categoría.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {documents.data.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                                        >
                                            <div className="p-5">
                                                <div className="flex items-start gap-4">
                                                    <FileIcon extension={doc.file_extension} />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-green-700 transition-colors">
                                                            {doc.title}
                                                        </h3>
                                                        {doc.description && (
                                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                                                {doc.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {doc.category && (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            {doc.category.name}
                                                        </span>
                                                    )}
                                                    {doc.is_vigant ? (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                                            Vigente
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                            Archivado
                                                        </span>
                                                    )}
                                                    {doc.is_featured && (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                                            \u2605 Destacado
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                                    <span>Versiín {doc.version || '1.0'}</span>
                                                    <span>{doc.file_size_formatted || doc.file_type}</span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                                                <Link
                                                    href={route('document-library.show', doc.slug)}
                                                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                                                >
                                                    Ver detalle \u2192
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

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
                                                    onClick={() => link.url && router.get(link.url, { q: filters.q || '', category: filters.category || undefined })}
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
