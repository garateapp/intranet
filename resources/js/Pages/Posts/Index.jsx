import PublicPostsCarousel from '@/Components/PublicPostsCarousel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusStyles = {
    published: 'bg-emerald-50 text-emerald-800 ring-emerald-700/10',
    draft: 'bg-stone-100 text-stone-700 ring-stone-600/10',
    archived: 'bg-amber-50 text-amber-800 ring-amber-700/10',
};

const statusLabels = { published: 'Publicado', draft: 'Borrador', archived: 'Archivado' };

export default function Index({ posts, featuredPosts = [], postStats = {}, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    function handleFilter(event) {
        event.preventDefault();
        router.get(route('admin.posts.index'), {
            search: search || undefined,
            status: status || undefined,
            category_id: categoryId || undefined,
        }, { preserveState: true, replace: true });
    }

    function handleDelete(slug) {
        if (window.confirm('¿Deseas eliminar esta publicación? Esta acción no se puede deshacer.')) {
            router.delete(route('admin.posts.destroy', slug), { preserveScroll: true });
        }
    }

    function formatDate(date, options = {}) {
        if (!date) return 'Sin fecha';
        return new Intl.DateTimeFormat('es-CL', {
            day: '2-digit', month: 'short', year: 'numeric', ...options,
        }).format(new Date(date));
    }

    function getInitials(name = 'Equipo editorial') {
        return name.split(' ').filter(Boolean).map((word) => word[0]).join('').toUpperCase().slice(0, 2);
    }

    function getImageUrl(post) {
        if (post.featured_image) return `/storage/${post.featured_image}`;
        const color = (post.category?.color || '#2f6f4e').replace('#', '');
        const label = encodeURIComponent(post.category?.name || 'Actualidad');
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect width='1200' height='675' fill='%23${color}'/%3E%3Cpath d='M0 520L330 360L610 500L940 250L1200 410V675H0Z' fill='%23ffffff' opacity='.1'/%3E%3Ctext x='70' y='110' font-family='Arial' font-size='34' fill='white' opacity='.72'%3E${label}%3C/text%3E%3C/svg%3E`;
    }

    const hasActiveFilters = search || status || categoryId;

    return (
        <AuthenticatedLayout
            header={(
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Sala de redacción</p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">Noticias y publicaciones</h2>
                    </div>
                    <Link href={route('admin.posts.create')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 active:translate-y-0">
                        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                        Nueva publicación
                    </Link>
                </div>
            )}
        >
            <Head title="Noticias y publicaciones" />

            <div className="mx-auto max-w-[1400px] space-y-12 pb-10">
                <section className="grid gap-8 border-b border-stone-200 pb-9 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="text-sm font-medium text-emerald-800">Contenido corporativo</p>
                        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-stone-950 sm:text-5xl">Historias que mantienen informada a la organización.</h1>
                        <p className="mt-5 max-w-[62ch] text-base leading-7 text-stone-600">Crea, organiza y publica novedades desde una vista editorial pensada para revisar el contenido de un vistazo.</p>
                    </div>
                    <dl className="grid grid-cols-3 divide-x divide-stone-200 border-y border-stone-200 py-4">
                        {[
                            ['Total', postStats.total ?? 0],
                            ['Publicadas', postStats.published ?? 0],
                            ['Borradores', postStats.drafts ?? 0],
                        ].map(([label, value]) => (
                            <div key={label} className="px-4 first:pl-0 last:pr-0 lg:first:pl-4">
                                <dt className="text-xs text-stone-500">{label}</dt>
                                <dd className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {featuredPosts.length > 0 && (
                    <section aria-labelledby="featured-news-title">
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Selección editorial</p>
                                <h2 id="featured-news-title" className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">Noticias destacadas</h2>
                            </div>
                            <span className="hidden text-sm text-stone-500 sm:block">{featuredPosts.length} en portada</span>
                        </div>
                        <PublicPostsCarousel posts={featuredPosts} formatDate={formatDate} getImageUrl={getImageUrl} getInitials={getInitials} getPostHref={(post) => route('admin.posts.edit', post.slug)} linkLabel="Revisar publicación" />
                    </section>
                )}

                <section aria-labelledby="all-posts-title">
                    <div className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Archivo editorial</p>
                            <h2 id="all-posts-title" className="mt-1 text-2xl font-semibold tracking-tight text-stone-950">Todas las publicaciones</h2>
                        </div>
                        <form onSubmit={handleFilter} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[16rem_10rem_11rem_auto]" aria-label="Filtrar publicaciones">
                            <label className="sr-only" htmlFor="post-search">Buscar por título</label>
                            <input id="post-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título" className="rounded-lg border-stone-300 bg-white text-sm text-stone-900 shadow-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-emerald-700" />
                            <label className="sr-only" htmlFor="post-status">Estado</label>
                            <select id="post-status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border-stone-300 bg-white text-sm text-stone-700 shadow-none focus:border-emerald-700 focus:ring-emerald-700">
                                <option value="">Todos los estados</option><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option>
                            </select>
                            <label className="sr-only" htmlFor="post-category">Categoría</label>
                            <select id="post-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="rounded-lg border-stone-300 bg-white text-sm text-stone-700 shadow-none focus:border-emerald-700 focus:ring-emerald-700">
                                <option value="">Todas las categorías</option>
                                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                            </select>
                            <button type="submit" className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-stone-700 focus:ring-offset-2 active:scale-[0.98]">Filtrar</button>
                        </form>
                    </div>

                    <div className="border-t border-stone-300">
                        {posts.data.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                                    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 5.5h12A1.5 1.5 0 0119.5 7v12L16 16.5 12.5 19 9 16.5 5.5 19V7A1.5 1.5 0 017 5.5" /></svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-stone-900">No encontramos publicaciones</h3>
                                <p className="mt-2 text-sm text-stone-500">{hasActiveFilters ? 'Prueba con otros filtros o limpia la búsqueda.' : 'Crea la primera noticia para comenzar el archivo editorial.'}</p>
                            </div>
                        ) : posts.data.map((post) => (
                            <article key={post.id} className="group grid gap-5 border-b border-stone-200 py-6 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-center">
                                <Link href={route('admin.posts.edit', post.slug)} className="block overflow-hidden rounded-xl bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2">
                                    <img src={getImageUrl(post)} alt={`Portada de ${post.title}`} className="aspect-[16/10] h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
                                </Link>
                                <div className="min-w-0">
                                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                                        <span className={`inline-flex rounded-md px-2 py-1 font-semibold ring-1 ring-inset ${statusStyles[post.status] || statusStyles.draft}`}>{statusLabels[post.status] || post.status}</span>
                                        {post.category && <span className="font-medium text-stone-600">{post.category.name}</span>}
                                        {post.is_pinned && <span className="font-medium text-amber-700">Prioritaria</span>}
                                        {post.is_featured && <span className="font-medium text-emerald-700">Destacada</span>}
                                    </div>
                                    <Link href={route('admin.posts.edit', post.slug)} className="focus:outline-none focus-visible:underline"><h3 className="text-xl font-semibold leading-snug tracking-tight text-stone-950 transition group-hover:text-emerald-800">{post.title}</h3></Link>
                                    {post.excerpt && <p className="mt-2 line-clamp-2 max-w-[70ch] text-sm leading-6 text-stone-600">{post.excerpt}</p>}
                                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                                        <span>{post.user?.name || 'Equipo editorial'}</span><span aria-hidden="true">/</span><time dateTime={post.published_at || post.created_at}>{formatDate(post.published_at || post.created_at)}</time><span aria-hidden="true">/</span><span>{post.views || 0} lecturas</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:justify-end">
                                    <div className="mr-2 hidden text-right text-xs leading-5 text-stone-500 xl:block"><p>{post.show_in_public ? 'Sitio público' : 'Sin acceso público'}</p><p>{post.show_in_dashboard ? 'Visible en intranet' : 'Fuera del dashboard'}</p></div>
                                    <Link href={route('admin.posts.edit', post.slug)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 active:scale-[0.98]">Editar</Link>
                                    <button type="button" onClick={() => handleDelete(post.slug)} className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 active:scale-[0.98]">Eliminar</button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {posts.links.length > 3 && (
                        <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Paginación">
                            {posts.links.map((link, index) => (
                                <button key={`${link.label}-${index}`} type="button" onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })} disabled={!link.url} aria-current={link.active ? 'page' : undefined} className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 ${link.active ? 'bg-emerald-800 text-white' : link.url ? 'border border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-800' : 'cursor-not-allowed bg-stone-100 text-stone-400'}`} dangerouslySetInnerHTML={{ __html: link.label || '' }} />
                            ))}
                        </nav>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
