import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import GlobalSearchBar from '@/Components/GlobalSearchBar';
import PostHighlightCard from '@/Components/PostHighlightCard';
import QuickLinkCard from '@/Components/QuickLinkCard';
import PeopleCard from '@/Components/PeopleCard';
import FaqAccordion from '@/Components/FaqAccordion';

export default function Index({ posts, links, people, faqs, query }) {
    const hasResults = posts?.length > 0 || links?.length > 0 || people?.length > 0 || faqs?.length > 0;
    const isSearching = query && query.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Buscador" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Buscador Global
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Busca en noticias, enlaces, personas y preguntas frecuentes
                        </p>
                        <GlobalSearchBar action={route('search.index')} />
                    </div>

                    {/* Empty State */}
                    {!isSearching && (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                ¿Qué estás buscando?
                            </h3>
                            <p className="text-gray-600">
                                Escribe tu búsqueda para encontrar noticias, enlaces, personas y FAQs
                            </p>
                        </div>
                    )}

                    {/* No Results State */}
                    {isSearching && !hasResults && (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Sin resultados
                            </h3>
                            <p className="text-gray-600">
                                No encontramos resultados para "<strong>{query}</strong>". Intenta con otros términos.
                            </p>
                        </div>
                    )}

                    {/* Results */}
                    {isSearching && hasResults && (
                        <div className="space-y-8">
                            {/* Posts */}
                            {posts && posts.length > 0 && (
                                <section>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Publicaciones ({posts.length})
                                        </h2>
                                    </div>
                                    <div className="space-y-3">
                                        {posts.map((post) => (
                                            <PostHighlightCard key={post.id} post={post} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Links */}
                            {links && links.length > 0 && (
                                <section>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Enlaces ({links.length})
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {links.map((link) => (
                                            <QuickLinkCard key={link.id} link={link} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* People */}
                            {people && people.length > 0 && (
                                <section>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Personas ({people.length})
                                        </h2>
                                        <Link
                                            href={route('directory.index', { q: query })}
                                            className="text-sm font-medium text-green-600 hover:text-green-700"
                                        >
                                            Ver en directorio →
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {people.map((person) => (
                                            <PeopleCard key={person.id} person={person} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* FAQs */}
                            {faqs && faqs.length > 0 && (
                                <section>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            FAQs ({faqs.length})
                                        </h2>
                                        <Link
                                            href={route('faq.index', { q: query })}
                                            className="text-sm font-medium text-green-600 hover:text-green-700"
                                        >
                                            Ver todas →
                                        </Link>
                                    </div>
                                    <FaqAccordion items={faqs} />
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
