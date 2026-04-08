import QuickLinkCard from './QuickLinkCard';

export default function QuickLinksGrid({ links, className = '' }) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
            {links.map((link) => (
                <QuickLinkCard key={link.id} link={link} />
            ))}
        </div>
    );
}
