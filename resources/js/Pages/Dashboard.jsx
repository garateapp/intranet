import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ stats, allPosts }) {
    const user = usePage().props.auth.user;
    const isAdmin = user.role === 'admin';
    const [carouselIndex, setCarouselIndex] = useState(0);

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getImageUrl = (post) => {
        if (post.featured_image) {
            return `/storage/${post.featured_image}`;
        }
        const color = post.category?.color || '038c34';
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23${color}'/%3E%3Cstop offset='1' stop-color='%23038c34'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='white' opacity='0.3'%3E${encodeURIComponent(post.category?.name || 'Noticia')}%3C/text%3E%3C/svg%3E`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const nextSlide = () => {
        if (stats.recent_posts.length > 0) {
            const newIndex = (carouselIndex + 1) % stats.recent_posts.length;
            setCarouselIndex(newIndex);
            scrollToSlide(newIndex);
        }
    };

    const prevSlide = () => {
        if (stats.recent_posts.length > 0) {
            const newIndex = (carouselIndex - 1 + stats.recent_posts.length) % stats.recent_posts.length;
            setCarouselIndex(newIndex);
            scrollToSlide(newIndex);
        }
    };

    const scrollToSlide = (index) => {
        const element = document.getElementById(`item-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
    };

    const handleDotClick = (index) => {
        setCarouselIndex(index);
        scrollToSlide(index);
    };

    const quickActions = isAdmin ? [
        { label: 'Nueva Publicación', icon: '✍️', link: route('posts.create'), color: 'from-green-500 to-emerald-600' },
        { label: 'Agregar Enlace', icon: '🔗', link: route('links.create'), color: 'from-blue-500 to-cyan-600' },
        { label: 'Gestionar Categorías', icon: '📂', link: route('categories.index'), color: 'from-purple-500 to-violet-600' },
        { label: 'Configuración', icon: '⚙️', link: route('settings.index'), color: 'from-gray-600 to-gray-700' },
    ] : [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-white">G</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {isAdmin ? 'Panel de Administración' : 'Mi Portal'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {isAdmin ? 'Gestión de contenido' : `${user.department || 'GreenEx'} • ${user.position || 'Colaborador'}`}
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* News Carousel */}
                    <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
                        {stats.recent_posts.length > 0 ? (
                            <div className="relative">
                                <div
                                    id="news-carousel"
                                    className="carousel carousel-center w-full bg-white shadow-2xl border border-gray-100"
                                    style={{ scrollBehavior: 'smooth' }}
                                >
                                    {stats.recent_posts.map((post, index) => (
                                        <div
                                            key={post.id}
                                            id={`item-${index}`}
                                            className="carousel-item w-full"
                                        >
                                            <div className="flex flex-col lg:flex-row w-full">
                                                <div className="lg:w-2/5 relative h-48 lg:h-72 overflow-hidden">
                                                    <img
                                                        src={getImageUrl(post)}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r"></div>
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        {post.category && (
                                                            <span
                                                                className="px-2 py-0.5 text-xs font-bold text-white rounded-full shadow-lg"
                                                                style={{ backgroundColor: post.category.color }}
                                                            >
                                                                {post.category.name}
                                                            </span>
                                                        )}
                                                        {post.is_pinned && (
                                                            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                                                                📌
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="lg:w-3/5 p-4 lg:p-6 flex flex-col justify-center">
                                                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-1">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                                {getInitials(post.user?.name || 'U')}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-900">{post.user?.name}</p>
                                                                <p className="text-xs text-gray-500">{formatDate(post.published_at || post.created_at)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {post.status === 'published' ? (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                                    ✓ Publicado
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                                                    ⏳ Borrador
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {isAdmin && (
                                                            <Link
                                                                href={route('posts.edit', post.id)}
                                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                Editar
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={route('posts.show', post.slug)}
                                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Leer Publicación
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {stats.recent_posts.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle bg-white/90 hover:bg-white shadow-lg border border-gray-200"
                                        >
                                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle bg-white/90 hover:bg-white shadow-lg border border-gray-200"
                                        >
                                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="-mx-4 sm:-mx-6 lg:-mx-8 rounded-none bg-white p-8 text-center shadow-lg border border-gray-100">
                                <div className="text-5xl mb-3">📰</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No hay publicaciones aún</h3>
                                <p className="text-gray-600 text-sm">Las noticias aparecerán aquí cuando se publiquen</p>
                                {isAdmin && (
                                    <Link
                                        href={route('posts.create')}
                                        className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md transition-all"
                                    >
                                        ✍️ Crear primera publicación
                                    </Link>
                                )}
                            </div>
                        )}

                        {stats.recent_posts.length > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-3">
                                {stats.recent_posts.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDotClick(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            index === carouselIndex ? 'w-8 bg-green-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* All Recent Posts */}
                    {allPosts && allPosts.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    📰 Todas las Noticias
                                </h3>
                                <Link
                                    href={route('posts.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
                                >
                                    Ver todas →
                                </Link>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={route('posts.index')}
                                        className="group block rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1"
                                    >
                                        <div className="h-40 overflow-hidden relative">
                                            <img
                                                src={getImageUrl(post)}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {post.category && (
                                                <div className="absolute top-3 left-3">
                                                    <span
                                                        className="px-2 py-0.5 text-xs font-bold text-white rounded-full shadow-lg"
                                                        style={{ backgroundColor: post.category.color }}
                                                    >
                                                        {post.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {getInitials(post.user?.name || 'U')}
                                                    </div>
                                                    <span>{post.user?.name}</span>
                                                </div>
                                                <span>{formatDate(post.published_at || post.created_at)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions - Admin Only */}
                    {isAdmin && quickActions.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                ⚡ Acciones Rápidas
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {quickActions.map((action, index) => (
                                    <Link
                                        key={index}
                                        href={action.link}
                                        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} p-5 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105`}
                                    >
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                                        <div className="relative flex items-center gap-3">
                                            <span className="text-3xl group-hover:scale-110 transition-transform">
                                                {action.icon}
                                            </span>
                                            <span className="font-semibold text-sm">
                                                {action.label}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Links */}
                    <div className="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        🔗 Enlaces Recientes
                                    </h3>
                                    <p className="text-blue-100 text-xs mt-1">
                                        Recursos y herramientas disponibles
                                    </p>
                                </div>
                                {isAdmin && (
                                    <Link
                                        href={route('links.index')}
                                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors text-xs font-medium border border-white/30"
                                    >
                                        Ver Todos →
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="p-5">
                            {stats.recent_links.length > 0 ? (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {stats.recent_links.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-start gap-3 rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-lg transition-all bg-gradient-to-r from-white to-blue-50/30"
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">
                                                {link.icon || '🔗'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate mb-1">
                                                    {link.title}
                                                </h4>
                                                {link.description && (
                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                        {link.description}
                                                    </p>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-3">🔗</div>
                                    <p className="text-gray-500 mb-2">No hay enlaces aún</p>
                                    {isAdmin && (
                                        <Link
                                            href={route('links.create')}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            ➕ Agregar primer enlace
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
