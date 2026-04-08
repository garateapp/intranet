import { Link } from '@inertiajs/react';

export default function PostHighlightCard({ post }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Link
            href={route('posts.show', { post: post.slug })}
            className="group block rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-green-300"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-700 truncate">
                        {post.title}
                    </h3>
                    {post.excerpt && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                        {post.category && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                {post.category}
                            </span>
                        )}
                        {post.published_at && (
                            <span>{formatDate(post.published_at)}</span>
                        )}
                    </div>
                </div>
                {post.is_pinned && (
                    <svg className="h-5 w-5 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0114 15a3.989 3.989 0 01-3.667-1.02 1 1 0 01-.285-1.05l1.715-5.349L10 7V3a1 1 0 011-1zm-4 8.89l-1.738 5.42a1 1 0 00.285 1.05A3.989 3.989 0 008 18a3.989 3.989 0 003.667-1.02 1 1 0 00.285-1.05l-1.715-5.349L14 9l1.233-.616a1 1 0 00-.894-1.79l-1.599.8L10 5.323V3a1 1 0 10-2 0v2.323L4.054 6.9l-1.599-.8a1 1 0 00-.894 1.79L2.8 8.5l1.2 1.5V10.89z" />
                    </svg>
                )}
            </div>
        </Link>
    );
}
