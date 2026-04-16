import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import FaqAccordion from '@/Components/FaqAccordion';
import { useState } from 'react';

export default function Index({ faqs, categories, filters }) {
    const [query, setQuery] = useState(filters.q || '');
    const [category, setCategory] = useState(filters.category || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('faq.index'), {
            q: query,
            category: category,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Preguntas Frecuentes" />

            <div className="py-6">
                <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Preguntas Frecuentes
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Encuentra respuestas rápidas a las consultas más comunes
                        </p>

                        {/* Filters */}
                        <form onSubmit={handleSearch} className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="sm:col-span-2">
                                    <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
                                        Buscar pregunta
                                    </label>
                                    <input
                                        type="text"
                                        id="q"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Escribe tu consulta"
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                                    >
                                        <option value="">Todas</option>
                                        {categories.map((cat) => (
                                            <option key={cat.slug} value={cat.slug}>
                                                {cat.name} ({cat.faqs_count})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors"
                                >
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Categories Quick Links */}
                    {categories.length > 0 && !query && !category && (
                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.slug}
                                    onClick={() => {
                                        setCategory(cat.slug);
                                        router.get(route('faq.index'), { category: cat.slug });
                                    }}
                                    className="rounded-xl border border-gray-200 bg-white p-5 text-left hover:shadow-md hover:border-green-300 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                                            style={{ backgroundColor: cat.color || '#038C34' }}
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                                            <p className="text-xs text-gray-600">{cat.faqs_count} preguntas</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* FAQs */}
                    {faqs.data.length > 0 ? (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                {faqs.total > faqs.per_page && (
                                    <>Mostrando {faqs.from}-{faqs.to} de {faqs.total} preguntas</>
                                )}
                            </div>
                            <FaqAccordion items={faqs.data} />

                            {/* Pagination */}
                            {faqs.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="inline-flex rounded-md shadow-sm">
                                        {faqs.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'z-10 border border-green-600 bg-green-600 text-white'
                                                        : link.url
                                                        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                        : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === faqs.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No se encontraron FAQs
                            </h3>
                            <p className="text-gray-600">
                                Intenta con otros filtros o categorías
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
