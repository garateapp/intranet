export default function PortalSection({ title, subtitle, children, className = '', action = null }) {
    return (
        <section className={`portal-section ${className}`}>
            <div className="portal-section-header mb-6 flex items-center justify-between">
                <div>
                    {title && (
                        <h2 className="text-xl font-bold text-gray-900">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>
                {action && (
                    <div>
                        {action}
                    </div>
                )}
            </div>
            {children}
        </section>
    );
}
