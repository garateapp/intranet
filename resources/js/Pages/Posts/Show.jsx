import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ post, relatedPosts = [], isPublicView = true }) {
    const authUser = usePage().props.auth?.user;
    const [copyState, setCopyState] = useState('idle');

    function formatDate(date, includeTime = false) {
        return new Intl.DateTimeFormat('es-CL', {
            day: 'numeric', month: 'long', year: 'numeric',
            ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
        }).format(new Date(date));
    }

    function getInitials(name = 'Equipo editorial') {
        return name.split(' ').filter(Boolean).map((word) => word[0]).join('').toUpperCase().slice(0, 2);
    }

    function getImageUrl(item) {
        if (item.featured_image) return `/storage/${item.featured_image}`;
        const color = (item.category?.color || '#2f6f4e').replace('#', '');
        const label = encodeURIComponent(item.category?.name || 'Actualidad');
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='800'%3E%3Crect width='1400' height='800' fill='%23${color}'/%3E%3Cpath d='M0 620L400 390L760 590L1100 300L1400 520V800H0Z' fill='%23ffffff' opacity='.1'/%3E%3Ctext x='80' y='130' font-family='Arial' font-size='42' fill='white' opacity='.72'%3E${label}%3C/text%3E%3C/svg%3E`;
    }

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopyState('copied');
            window.setTimeout(() => setCopyState('idle'), 2200);
        } catch {
            setCopyState('error');
        }
    }

    const backHref = authUser ? route('dashboard') : route('welcome');
    const publishedAt = post.published_at || post.created_at;

    return (
        <div className="min-h-[100dvh] bg-[#f7f6f2] text-stone-900">
            <Head>
                <title>{`${post.title} | Noticias Gárate`}</title>
                <meta head-key="description" name="description" content={post.excerpt || post.title} />
            </Head>

            <header className="border-b border-stone-200 bg-[#f7f6f2]/95 backdrop-blur">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
                    <Link href={backHref} className="inline-flex items-center gap-3 rounded-md text-sm font-semibold text-stone-700 transition hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-4 focus:ring-offset-[#f7f6f2]">
                        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m6 6-6-6 6-6" /></svg>
                        {authUser ? 'Volver a la intranet' : 'Volver al inicio'}
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 sm:block">Noticias Gárate</span>
                        <img src="/img/logo-garate.png" alt="Gárate" className="h-9 w-9 object-contain" />
                    </div>
                </div>
            </header>

            <main>
                <article>
                    <div className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8 lg:pb-14">
                        <div className="max-w-5xl">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
                                <span>{post.category?.name || 'Actualidad'}</span>
                                {post.is_featured && <><span className="h-1 w-1 rounded-full bg-stone-400" aria-hidden="true" /><span>Destacada</span></>}
                            </div>
                            <h1 className="mt-6 max-w-[18ch] text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-stone-950 sm:text-5xl lg:text-6xl">{post.title}</h1>
                            {post.excerpt && <p className="mt-7 max-w-[68ch] text-pretty text-lg leading-8 text-stone-600 sm:text-xl">{post.excerpt}</p>}
                        </div>
                        <div className="self-end border-y border-stone-300 py-5">
                            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Publicado por</p>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-sm font-semibold text-white">{getInitials(post.user?.name)}</span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-stone-900">{post.user?.name || 'Equipo editorial'}</p>
                                    <p className="truncate text-xs text-stone-500">{post.user?.position || post.user?.department || 'Comunicaciones'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <figure className="mx-auto max-w-[1400px] px-0 sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-stone-200 sm:rounded-2xl">
                            <img src={getImageUrl(post)} alt={`Imagen principal de ${post.title}`} className="aspect-[16/8] min-h-[22rem] w-full object-cover" />
                        </div>
                    </figure>

                    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,44rem)_15rem] lg:justify-between lg:px-8">
                        <div>
                            <div className="mb-9 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-stone-200 pb-5 text-sm text-stone-500">
                                <time dateTime={publishedAt}>{formatDate(publishedAt, true)}</time>
                                <span className="h-1 w-1 rounded-full bg-stone-400" aria-hidden="true" />
                                <span>{post.views || 0} lecturas</span>
                                <span className="h-1 w-1 rounded-full bg-stone-400" aria-hidden="true" />
                                <span>{isPublicView ? 'Acceso público' : 'Acceso interno'}</span>
                            </div>
                            <div className="post-article-content prose prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-stone-950 prose-p:leading-8 prose-p:text-stone-700 prose-a:text-emerald-800 prose-a:decoration-emerald-300 prose-strong:text-stone-900 prose-blockquote:border-emerald-700 prose-blockquote:text-stone-600" dangerouslySetInnerHTML={{ __html: post.content }} />

                            {post.tags?.length > 0 && (
                                <div className="mt-12 border-t border-stone-200 pt-6">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Temas</p>
                                    <div className="flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-md bg-stone-200/70 px-3 py-1.5 text-sm text-stone-700">{tag}</span>)}</div>
                                </div>
                            )}
                        </div>

                        <aside className="lg:border-l lg:border-stone-200 lg:pl-8" aria-label="Información de la noticia">
                            <div className="lg:sticky lg:top-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Compartir</p>
                                <button type="button" onClick={copyLink} className="mt-3 inline-flex w-full items-center justify-between gap-3 rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition hover:border-emerald-700 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 active:scale-[0.98]">
                                    {copyState === 'copied' ? 'Enlace copiado' : 'Copiar enlace'}
                                    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.5 15.5h-2A2.5 2.5 0 014 13V6.5A2.5 2.5 0 016.5 4H13a2.5 2.5 0 012.5 2.5v2m-5 0H17a2.5 2.5 0 012.5 2.5v6.5A2.5 2.5 0 0117 20h-6.5A2.5 2.5 0 018 17.5V11a2.5 2.5 0 012.5-2.5Z" /></svg>
                                </button>
                                <p role="status" className={`mt-2 text-xs ${copyState === 'error' ? 'text-red-700' : 'text-emerald-800'}`}>{copyState === 'error' ? 'No pudimos copiar el enlace. Cópialo desde la barra del navegador.' : copyState === 'copied' ? 'Listo para compartir.' : ''}</p>
                            </div>
                        </aside>
                    </div>
                </article>

                {relatedPosts.length > 0 && (
                    <section className="border-t border-stone-200 bg-white py-14 sm:py-20" aria-labelledby="related-title">
                        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                            <div className="mb-8 max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Sigue leyendo</p>
                                <h2 id="related-title" className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-stone-950">Más noticias de la organización</h2>
                            </div>
                            <div className="grid gap-6 lg:grid-cols-2">
                                {relatedPosts.map((relatedPost, index) => (
                                    <Link key={relatedPost.id} href={route('public.posts.show', relatedPost.slug)} className={`group grid overflow-hidden border-t border-stone-300 pt-5 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-4 ${index === 0 ? 'gap-5 sm:grid-cols-[1.2fr_1fr] lg:row-span-2 lg:block' : 'gap-5 sm:grid-cols-[11rem_1fr]'}`}>
                                        <div className={`overflow-hidden rounded-xl bg-stone-100 ${index === 0 ? 'lg:mb-6' : ''}`}><img src={getImageUrl(relatedPost)} alt={`Portada de ${relatedPost.title}`} className={`w-full object-cover transition duration-500 group-hover:scale-[1.035] ${index === 0 ? 'aspect-[16/10]' : 'aspect-[4/3] h-full'}`} /></div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{relatedPost.category?.name || 'Actualidad'}</p>
                                            <h3 className={`${index === 0 ? 'mt-3 text-2xl' : 'mt-2 text-xl'} font-semibold leading-tight tracking-tight text-stone-950 transition group-hover:text-emerald-800`}>{relatedPost.title}</h3>
                                            {relatedPost.excerpt && <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{relatedPost.excerpt}</p>}
                                            <time className="mt-4 block text-xs text-stone-500" dateTime={relatedPost.published_at || relatedPost.created_at}>{formatDate(relatedPost.published_at || relatedPost.created_at)}</time>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="border-t border-stone-800 bg-stone-950 py-8 text-stone-300">
                <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 text-sm sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3"><img src="/img/logo-garate.png" alt="Gárate" className="h-8 w-8 object-contain" /><span className="font-semibold text-white">Noticias Gárate</span></div>
                    <p>© {new Date().getFullYear()} Portal corporativo</p>
                </div>
            </footer>
        </div>
    );
}
