import { Head, Link } from '@inertiajs/react';

export default function Show({ post, relatedPosts }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getImageUrl = (post) => {
        if (post.featured_image) {
            return `/storage/${post.featured_image}`;
        }
        const color = post.category?.color || '038c34';
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23${color}'/%3E%3Cstop offset='1' stop-color='%23038c34'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='72' fill='white' opacity='0.3'%3E${encodeURIComponent(post.category?.name || 'Noticia')}%3C/text%3E%3C/svg%3E`;
    };

    return (
        <>
            <Head title={`${post.title} - GreenEx Intranet`} />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Image */}
                <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                    <img
                        src={getImageUrl(post)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        {post.category && (
                            <span
                                className="inline-block px-4 py-1.5 text-sm font-bold text-white rounded-full mb-4 shadow-lg"
                                style={{ backgroundColor: post.category.color }}
                            >
                                {post.category.name}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-green-100">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {getInitials(post.user?.name || 'U')}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{post.user?.name}</p>
                                    <p className="text-sm">{post.user?.position || post.user?.department || 'Colaborador'}</p>
                                </div>
                            </div>
                            <span className="text-gray-300">•</span>
                            <time className="text-sm">
                                {formatDate(post.published_at || post.created_at)}
                            </time>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm">{post.views || 0} lecturas</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Article */}
                        <article className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                                {post.excerpt && (
                                    <p className="text-xl text-gray-600 font-medium mb-8 leading-relaxed border-l-4 border-green-500 pl-6">
                                        {post.excerpt}
                                    </p>
                                )}
                                
                                <div 
                                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-3">Etiquetas:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-default"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Back to posts */}
                            <div className="mt-6">
                                <Link
                                    href={route('welcome')}
                                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver al inicio
                                </Link>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            {/* Author Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Publicado por</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {getInitials(post.user?.name || 'U')}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{post.user?.name}</p>
                                        {post.user?.department && (
                                            <p className="text-sm text-gray-600">{post.user.department}</p>
                                        )}
                                        {post.user?.position && (
                                            <p className="text-xs text-gray-500">{post.user.position}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Post Info */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Información</h3>
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-gray-600">Publicado:</dt>
                                        <dd className="text-gray-900 font-medium">
                                            {formatDate(post.published_at || post.created_at)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-600">Lecturas:</dt>
                                        <dd className="text-gray-900 font-medium">{post.views || 0}</dd>
                                    </div>
                                    {post.status && (
                                        <div>
                                            <dt className="text-gray-600">Estado:</dt>
                                            <dd>
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                                    post.status === 'published'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {post.status === 'published' ? '✓ Publicado' : '⏳ Borrador'}
                                                </span>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Share */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Compartir</h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                                        className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        📋 Copiar enlace
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
                    <section className="bg-gray-100 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                📰 Noticias Relacionadas
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={route('posts.show', relatedPost.slug)}
                                        className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                                    >
                                        <div className="h-40 overflow-hidden relative">
                                            <img
                                                src={getImageUrl(relatedPost)}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {relatedPost.category && (
                                                <div className="absolute top-3 left-3">
                                                    <span
                                                        className="px-2 py-0.5 text-xs font-bold text-white rounded-full shadow-lg"
                                                        style={{ backgroundColor: relatedPost.category.color }}
                                                    >
                                                        {relatedPost.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {getInitials(relatedPost.user?.name || 'U')}
                                                    </div>
                                                    <span>{relatedPost.user?.name}</span>
                                                </div>
                                                <span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center">
                                <span className="text-xl font-bold text-white">G</span>
                            </div>
                            <span className="text-xl font-bold">GreenEx</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} GreenEx Intranet • Portal Corporativo
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
