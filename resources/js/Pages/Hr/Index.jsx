import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import HrPortalCard from '@/Components/HrPortalCard';
import PortalSection from '@/Components/PortalSection';

export default function Index({ portal }) {
    return (
        <AuthenticatedLayout>
            <Head title="Recursos Humanos" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Recursos Humanos
                        </h1>
                        <p className="text-gray-600">
                            Gestión de vacaciones, permisos, liquidaciones y más
                        </p>
                    </div>

                    {/* Main HR Card */}
                    <HrPortalCard portal={portal} />

                    {/* Additional Info */}
                    <PortalSection title="Información Importante">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="prose prose-sm max-w-none text-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    ¿Dónde gestiono mis temas de RRHH?
                                </h3>
                                <p className="mb-4">
                                    Todos los trámites de Recursos Humanos se gestionan a través de la plataforma{' '}
                                    <strong>Buk</strong>. Esto incluye:
                                </p>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li><strong>Vacaciones:</strong> Solicita y revisa el estado de tus vacaciones</li>
                                    <li><strong>Permisos:</strong> Solicita permisos administrativos y revisa su aprobación</li>
                                    <li><strong>Liquidaciones:</strong> Descarga tus comprobantes de sueldo mensuales</li>
                                    <li><strong>Documentos:</strong> Accede a tus documentos laborales y certificados</li>
                                    <li><strong>Beneficios:</strong> Revisa tus beneficios como empleado</li>
                                </ul>
                                <p className="mb-4">
                                    Haz clic en el botón <strong>"Ir a Buk"</strong> para acceder directamente a la plataforma.
                                </p>
                            </div>
                        </div>
                    </PortalSection>

                    {/* Help Links */}
                    <PortalSection title="Enlaces de Ayuda">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {portal.help_links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md hover:border-green-300 transition-all"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{link.label}</h4>
                                        <p className="text-xs text-gray-600 mt-1">Acceder directamente</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </PortalSection>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
