import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex flex-wrap justify-center gap-1 border-t border-gray-100 px-4 py-4" aria-label="Paginación">
            {links.map((link, index) => link.url ? (
                <Link
                    key={index}
                    href={link.url}
                    preserveScroll
                    className={`rounded-md px-3 py-1.5 text-sm ${link.active ? 'bg-green-600 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ) : (
                <span key={index} className="rounded-md px-3 py-1.5 text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
            ))}
        </nav>
    );
}
