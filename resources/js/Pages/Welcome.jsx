import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, featuredPosts, pinnedPosts, recentPosts, activeLinks, categories }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getImageUrl = (post) => {
        if (post.featured_image) {
            return `/storage/${post.featured_image}`;
        }
        // Placeholder gradient images based on category color
        const color = post.category?.color || '038c34';
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23${color}'/%3E%3Cstop offset='1' stop-color='%23038c34'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='white' opacity='0.3'%3E${encodeURIComponent(post.category?.name || 'Noticia')}%3C/text%3E%3C/svg%3E`;
    };

    return (
        <>
            <Head title="Gárate Intranet - Portal Corporativo" />

            <div className="min-h-screen relative overflow-hidden bg-gray-50">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {/* Header */}
                <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/img/logo-garate.png"
                                    alt="Garate Logo"
                                    className="w-12 h-12 object-contain drop-shadow-lg"
                                />
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Gárate</h1>
                                    <p className="text-xs text-green-200">Portal Corporativo</p>
                                </div>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2.5 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        Ir al Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-2.5 text-white font-semibold border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        {/* <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 bg-gradient-to-r from-lime-400 to-green-500 text-white font-semibold rounded-lg hover:from-lime-500 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Registrarse
                                        </Link> */}
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="animate-fade-in">
                            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                                Bienvenido a tu
                                <span className="block bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                                    Intranet Corporativa
                                </span>
                            </h2>
                            <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto">
                                Tu punto de acceso central para noticias, eventos, recursos y herramientas de la empresa
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                    <div className="text-4xl font-bold text-lime-400 mb-2">
                                        {recentPosts?.length || 0}+
                                    </div>
                                    <div className="text-sm text-green-100">Publicaciones</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                    <div className="text-4xl font-bold text-orange-400 mb-2">
                                        {activeLinks?.length || 0}+
                                    </div>
                                    <div className="text-sm text-green-100">Enlaces Útiles</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                    <div className="text-4xl font-bold text-green-300 mb-2">
                                        {categories?.length || 0}
                                    </div>
                                    <div className="text-sm text-green-100">Categorías</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                                    <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
                                    <div className="text-sm text-green-100">Disponibilidad</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Post - Hero Style */}
                {featuredPosts && featuredPosts.length > 0 && (
                    <section className="relative z-10 pb-16 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Main Featured Post */}
                            <div className="group relative overflow-hidden rounded-2xl shadow-2xl mb-8">
                                <img
                                    src={getImageUrl(featuredPosts[0])}
                                    alt={featuredPosts[0].title}
                                    className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span
                                            className="px-4 py-1.5 text-sm font-bold text-white rounded-full"
                                            style={{ backgroundColor: featuredPosts[0].category?.color || '#038c34' }}
                                        >
                                            {featuredPosts[0].category?.name || 'Noticia'}
                                        </span>
                                        {featuredPosts[0].is_pinned && (
                                            <span className="px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full">
                                                📌 Destacado
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 line-clamp-2">
                                        {featuredPosts[0].title}
                                    </h3>
                                    <p className="text-green-100 text-lg mb-4 line-clamp-3 max-w-3xl">
                                        {featuredPosts[0].excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-green-200 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {getInitials(featuredPosts[0].user?.name || 'U')}
                                            </div>
                                            <span>{featuredPosts[0].user?.name}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{formatDate(featuredPosts[0].published_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Featured Posts */}
                            {featuredPosts.length > 1 && (
                                <div className="grid md:grid-cols-2 gap-8">
                                    {featuredPosts.slice(1).map((post) => (
                                        <div key={post.id} className="group relative overflow-hidden rounded-xl shadow-xl">
                                            <img
                                                src={getImageUrl(post)}
                                                alt={post.title}
                                                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span
                                                        className="px-3 py-1 text-xs font-bold text-white rounded-full"
                                                        style={{ backgroundColor: post.category?.color || '#038c34' }}
                                                    >
                                                        {post.category?.name || 'Noticia'}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
                                                    {post.title}
                                                </h4>
                                                <p className="text-green-100 text-sm line-clamp-2 mb-3">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center gap-2 text-green-200 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-6 h-6 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                            {getInitials(post.user?.name || 'U')}
                                                        </div>
                                                        <span>{post.user?.name}</span>
                                                    </div>
                                                    <span>•</span>
                                                    <span>{formatDate(post.published_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Pinned Posts - Announcements */}
                {pinnedPosts && pinnedPosts.length > 0 && (
                    <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        📌 Anuncios Importantes
                                    </h3>
                                    <p className="text-green-200">Información crítica que debes conocer</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pinnedPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={getImageUrl(post)}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                                                    IMPORTANTE
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                {post.category && (
                                                    <span
                                                        className="px-3 py-1 text-xs font-semibold text-white rounded-full"
                                                        style={{ backgroundColor: post.category.color }}
                                                    >
                                                        {post.category.name}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                                        {getInitials(post.user?.name || 'U')}
                                                    </div>
                                                    <span>{post.user?.name}</span>
                                                </div>
                                                <span>{formatDate(post.published_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Quick Links & Categories */}
                <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/20 to-black/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-8">
                                    🔗 Enlaces Rápidos
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {activeLinks?.slice(0, 6).map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:border-lime-400/50 hover:bg-white/15 transition-all hover:-translate-y-1"
                                        >
                                            <div className="text-3xl mb-3">
                                                {link.icon || '🔗'}
                                            </div>
                                            <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-lime-400 transition-colors line-clamp-1">
                                                {link.title}
                                            </h4>
                                            <p className="text-xs text-green-200 line-clamp-2">
                                                {link.description}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-white mb-8">
                                    📂 Categorías
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {categories?.map((category) => (
                                        <div
                                            key={category.id}
                                            className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <span className="text-3xl">{category.icon || '📁'}</span>
                                                <span className="text-xs text-green-200">
                                                    {category.posts_count} posts
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-semibold text-white mb-1">
                                                {category.name}
                                            </h4>
                                            <p className="text-xs text-green-200 line-clamp-2">
                                                {category.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Posts Grid - News Portal Style */}
                {recentPosts && recentPosts.length > 0 && (
                    <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        📝 Publicaciones Recientes
                                    </h3>
                                    <p className="text-green-200">Últimas actualizaciones de la empresa</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {recentPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={getImageUrl(post)}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {post.category && (
                                                <div className="absolute top-4 left-4">
                                                    <span
                                                        className="px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg"
                                                        style={{ backgroundColor: post.category.color }}
                                                    >
                                                        {post.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                                        {getInitials(post.user?.name || 'U')}
                                                    </div>
                                                    <span>{post.user?.name}</span>
                                                </div>
                                                <span>{formatDate(post.published_at || post.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-black/20 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <img
                                src="/img/logo-garate.png"
                                alt="Garate Logo"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="text-xl font-bold text-white">Gárate</span>
                        </div>
                        <p className="text-green-200 text-sm mb-2">
                            Portal Corporativo Intranet © {new Date().getFullYear()}
                        </p>
                        <p className="text-green-300 text-xs">
                            Diseñado con 💚 para nuestros colaboradores
                        </p>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </>
    );
}
