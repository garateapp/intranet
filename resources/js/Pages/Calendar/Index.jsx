import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import EventsList from '@/Components/EventsList';

export default function Index({ events }) {
    return (
        <AuthenticatedLayout>
            <Head title="Calendario Corporativo" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Calendario Corporativo
                        </h1>
                        <p className="text-gray-600">
                            Próximos eventos y actividades de la empresa
                        </p>
                    </div>

                    {/* Events */}
                    {events.data.length > 0 ? (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                {events.total > events.per_page && (
                                    <>Mostrando {events.from}-{events.to} de {events.total} eventos</>
                                )}
                            </div>
                            <EventsList events={events.data} />

                            {/* Pagination */}
                            {events.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="inline-flex rounded-md shadow-sm">
                                        {events.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'z-10 border border-green-600 bg-green-600 text-white'
                                                        : link.url
                                                        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                        : 'border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === events.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No hay eventos próximos
                            </h3>
                            <p className="text-gray-600">
                                Los eventos corporativos aparecerán aquí cuando se publiquen
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
