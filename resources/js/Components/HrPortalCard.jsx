import { Link } from '@inertiajs/react';

export default function HrPortalCard({ portal }) {
    if (!portal) {
        return null;
    }

    return (
        <div className="portal-card-accent rounded-xl p-6">
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {portal.title || 'RRHH'}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        {portal.description || 'Vacaciones, permisos, liquidaciones y trámites se gestionan en Buk.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {portal.help_links?.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
                <a
                    href={portal.redirect_url}
                    className="shrink-0 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                    Ir a Buk
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
