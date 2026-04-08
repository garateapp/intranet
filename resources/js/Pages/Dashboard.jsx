import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PortalHero from '@/Components/PortalHero';
import PortalSection from '@/Components/PortalSection';
import GlobalSearchBar from '@/Components/GlobalSearchBar';
import QuickLinksGrid from '@/Components/QuickLinksGrid';
import PostHighlightCard from '@/Components/PostHighlightCard';
import PeopleCard from '@/Components/PeopleCard';
import EventsList from '@/Components/EventsList';
import HrPortalCard from '@/Components/HrPortalCard';
import FaqAccordion from '@/Components/FaqAccordion';

export default function Dashboard({
    hero,
    quickLinks,
    featuredPosts,
    events,
    directoryUsers,
    faqs,
    hrPortal,
}) {
    return (
        <AuthenticatedLayout>
            <Head title="Inicio" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <PortalHero
                        greeting={hero.greeting}
                        subtitle={hero.subtitle}
                    >
                        <div className="text-sm text-gray-600">
                            {new Date().toLocaleDateString('es-CL', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })}
                        </div>
                    </PortalHero>

                    {/* Global Search */}
                    <PortalSection title="Buscador">
                        <GlobalSearchBar action={route('search.index')} />
                    </PortalSection>

                    {/* Quick Links */}
                    {quickLinks && quickLinks.length > 0 && (
                        <PortalSection
                            title="Accesos Rápidos"
                            subtitle="Herramientas y recursos útiles"
                            action={
                                <Link
                                    href={route('links.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Ver todos →
                                </Link>
                            }
                        >
                            <QuickLinksGrid links={quickLinks} />
                        </PortalSection>
                    )}

                    {/* Featured Posts */}
                    {featuredPosts && featuredPosts.length > 0 && (
                        <PortalSection
                            title="Noticias Destacadas"
                            subtitle="Mantente informado de las últimas novedades"
                            action={
                                <Link
                                    href={route('posts.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Ver todas →
                                </Link>
                            }
                        >
                            <div className="space-y-3">
                                {featuredPosts.map((post) => (
                                    <PostHighlightCard key={post.id} post={post} />
                                ))}
                            </div>
                        </PortalSection>
                    )}

                    {/* Upcoming Events */}
                    {events && events.length > 0 && (
                        <PortalSection
                            title="Próximos Eventos"
                            subtitle="Eventos y actividades corporativas"
                            action={
                                <Link
                                    href={route('calendar.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Ver calendario →
                                </Link>
                            }
                        >
                            <EventsList events={events} />
                        </PortalSection>
                    )}

                    {/* HR Portal Block */}
                    <PortalSection title="Recursos Humanos">
                        <HrPortalCard portal={hrPortal} />
                    </PortalSection>

                    {/* People Directory Preview */}
                    {directoryUsers && directoryUsers.length > 0 && (
                        <PortalSection
                            title="Directorio de Personas"
                            subtitle="Encuentra a tus compañeros de trabajo"
                            action={
                                <Link
                                    href={route('directory.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Ver directorio →
                                </Link>
                            }
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {directoryUsers.map((person) => (
                                    <PeopleCard key={person.id} person={person} />
                                ))}
                            </div>
                        </PortalSection>
                    )}

                    {/* FAQ Preview */}
                    {faqs && faqs.length > 0 && (
                        <PortalSection
                            title="Preguntas Frecuentes"
                            subtitle="Respuestas rápidas a consultas comunes"
                            action={
                                <Link
                                    href={route('faq.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Ver todas →
                                </Link>
                            }
                        >
                            <FaqAccordion items={faqs} />
                        </PortalSection>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
