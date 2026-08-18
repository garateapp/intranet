import { Link } from '@inertiajs/react';

export default function PublicPostsCarousel({
    posts = [],
    formatDate,
    getImageUrl,
    getInitials,
    getPostHref = (post) => route('public.posts.show', { post: post.slug }),
    linkLabel = 'Leer publicación',
}) {
    if (posts.length === 0) return null;

    return (
        <div className="carousel w-full overflow-hidden rounded-2xl bg-stone-900 shadow-[0_28px_70px_-40px_rgba(24,32,27,0.65)]" aria-label="Noticias destacadas">
            {posts.map((post, index) => {
                const slideId = `public-post-slide-${post.id}`;
                const prevId = `public-post-slide-${posts[(index - 1 + posts.length) % posts.length].id}`;
                const nextId = `public-post-slide-${posts[(index + 1) % posts.length].id}`;

                return (
                    <article key={post.id} id={slideId} className="carousel-item relative w-full" aria-roledescription="diapositiva" aria-label={`${index + 1} de ${posts.length}`}>
                        <div className="relative min-h-[30rem] w-full overflow-hidden sm:min-h-[34rem]">
                            <img src={getImageUrl(post)} alt={`Portada de ${post.title}`} className="absolute inset-0 h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/68 to-stone-950/10" />
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950/45 to-transparent" />

                            <div className="relative flex min-h-[30rem] items-end px-6 py-8 sm:min-h-[34rem] sm:px-10 sm:py-10 lg:px-14">
                                <div className="max-w-[46rem]">
                                    <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                                        {post.category && <span className="border-l-2 border-emerald-400 pl-3">{post.category.name}</span>}
                                        {post.is_pinned && <span className="text-amber-300">Prioritaria</span>}
                                    </div>
                                    <h3 className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl">{post.title}</h3>
                                    {post.excerpt && <p className="mt-4 line-clamp-3 max-w-[62ch] text-base leading-7 text-stone-200 sm:text-lg">{post.excerpt}</p>}

                                    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-stone-200">
                                        <div className="flex items-center gap-2.5">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-xs font-semibold text-white backdrop-blur">{getInitials(post.user?.name || 'Equipo editorial')}</span>
                                            <span>{post.user?.name || 'Equipo editorial'}</span>
                                        </div>
                                        <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />
                                        <time dateTime={post.published_at || post.created_at}>{formatDate(post.published_at || post.created_at)}</time>
                                    </div>

                                    <Link href={getPostHref(post)} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-stone-900 active:translate-y-0">
                                        {linkLabel}
                                        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>
                                    </Link>
                                </div>
                            </div>

                            {posts.length > 1 && (
                                <div className="absolute bottom-8 right-6 flex gap-2 sm:right-10 sm:bottom-10">
                                    <a href={`#${prevId}`} aria-label="Noticia destacada anterior" className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/25 bg-stone-950/45 text-white backdrop-blur transition hover:bg-white hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-white">
                                        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
                                    </a>
                                    <a href={`#${nextId}`} aria-label="Siguiente noticia destacada" className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/25 bg-stone-950/45 text-white backdrop-blur transition hover:bg-white hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-white">
                                        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
