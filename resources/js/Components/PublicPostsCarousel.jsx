import { Link } from '@inertiajs/react';

export default function PublicPostsCarousel({ posts = [], formatDate, getImageUrl, getInitials }) {
    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="carousel w-full rounded-3xl shadow-2xl">
            {posts.map((post, index) => {
                const slideId = `public-post-slide-${post.id}`;
                const prevId = `public-post-slide-${posts[(index - 1 + posts.length) % posts.length].id}`;
                const nextId = `public-post-slide-${posts[(index + 1) % posts.length].id}`;

                return (
                    <div
                        key={post.id}
                        id={slideId}
                        className="carousel-item relative w-full"
                    >
                        <div className="relative min-h-[420px] w-full overflow-hidden">
                            <img
                                src={getImageUrl(post)}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

                            <div className="absolute inset-0 flex items-end">
                                <div className="max-w-3xl space-y-4 px-6 py-10 md:px-10 md:py-12">
                                    <div className="flex flex-wrap items-center gap-3">
                                        {post.category && (
                                            <span
                                                className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white"
                                                style={{ backgroundColor: post.category.color || '#038c34' }}
                                            >
                                                {post.category.name}
                                            </span>
                                        )}
                                        {post.is_pinned && (
                                            <span className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                                                Prioritario
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="max-w-2xl text-3xl font-black leading-tight text-white md:text-5xl">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="max-w-2xl text-base text-green-50 md:text-lg">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-sm text-green-100">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-green-500 text-sm font-bold text-white">
                                                {getInitials(post.user?.name || 'U')}
                                            </div>
                                            <span>{post.user?.name}</span>
                                        </div>
                                        <span className="hidden text-white/60 md:inline">•</span>
                                        <span>{formatDate(post.published_at || post.created_at)}</span>
                                    </div>

                                    <Link
                                        href={route('public.posts.show', { post: post.slug })}
                                        className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:bg-lime-100"
                                    >
                                        Leer publicación
                                    </Link>
                                </div>
                            </div>

                            {posts.length > 1 && (
                                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                    <a href={`#${prevId}`} className="btn btn-circle btn-sm border-none bg-black/55 text-white hover:bg-black/75 md:btn-md">
                                        ❮
                                    </a>
                                    <a href={`#${nextId}`} className="btn btn-circle btn-sm border-none bg-black/55 text-white hover:bg-black/75 md:btn-md">
                                        ❯
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
