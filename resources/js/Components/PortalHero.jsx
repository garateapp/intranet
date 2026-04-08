export default function PortalHero({ greeting, subtitle, children }) {
    return (
        <div className="portal-hero rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-sm border border-green-100">
            <div className="flex items-start justify-between">
                <div>
                    {greeting && (
                        <h1 className="text-2xl font-bold text-gray-900">
                            {greeting}
                        </h1>
                    )}
                    {subtitle && (
                        <p className="mt-2 text-base text-gray-700">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
