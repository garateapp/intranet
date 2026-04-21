import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PortalHero from '@/Components/PortalHero';
import PortalSection from '@/Components/PortalSection';
import GlobalSearchBar from '@/Components/GlobalSearchBar';
import QuickLinksGrid from '@/Components/QuickLinksGrid';
import PeopleCard from '@/Components/PeopleCard';
import EventsList from '@/Components/EventsList';
import HrPortalCard from '@/Components/HrPortalCard';
import FaqAccordion from '@/Components/FaqAccordion';
import SurveyCard from '@/Components/SurveyCard';

export default function Dashboard({
    hero,
    quickLinks,
    featuredPosts,
    events,
    directoryUsers,
    faqs,
    hrPortal,
    services,
    onboarding,
    recentRequests,
    surveys,
}) {
    const activeSurveys = surveys?.filter((survey) => !survey.is_closed) ?? [];
    const closedSurveys = surveys?.filter((survey) => survey.is_closed) ?? [];

    const getStatusBadgeColor = (status) => {
        const colors = {
            operativo: 'bg-green-100 text-green-800',
            degradado: 'bg-yellow-100 text-yellow-800',
            incidente: 'bg-red-100 text-red-800',
            mantenimiento: 'bg-blue-100 text-blue-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getRequestStatusColor = (status) => {
        const colors = {
            pendiente: 'bg-gray-100 text-gray-800',
            en_revision: 'bg-yellow-100 text-yellow-800',
            aprobada: 'bg-green-100 text-green-800',
            rechazada: 'bg-red-100 text-red-800',
            completada: 'bg-blue-100 text-blue-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPostImageUrl = (post) => {
        if (post.featured_image) {
            return `/storage/${post.featured_image}`;
        }

        const color = post.category?.color?.replace('#', '') || '038c34';

        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23${color}'/%3E%3Cstop offset='1' stop-color='%23014622'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='64' fill='white' opacity='0.25'%3E${encodeURIComponent(post.category?.name || 'Noticia')}%3C/text%3E%3C/svg%3E`;
    };

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

                    {activeSurveys.length > 0 && (
                        <PortalSection
                            title="Encuestas Activas"
                            subtitle="Participa en las encuestas vigentes antes de que finalicen"
                        >
                            <div className="space-y-6">
                                {activeSurveys.map((survey) => (
                                    <SurveyCard key={survey.id} survey={survey} />
                                ))}
                            </div>
                        </PortalSection>
                    )}

                    {/* Featured Posts */}
                    {featuredPosts && featuredPosts.length > 0 && (
                        <PortalSection
                            title="Noticias Destacadas"
                            subtitle="Mantente informado de las últimas novedades"
                            action={
                                featuredPosts[0] ? (
                                    <Link
                                        href={route('public.posts.show', { post: featuredPosts[0].slug })}
                                        className="text-sm font-medium text-green-600 hover:text-green-700"
                                    >
                                        Abrir destacada →
                                    </Link>
                                ) : null
                            }
                        >
                            <div className="carousel w-full rounded-2xl bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 shadow-xl">
                                {featuredPosts.map((post, index) => {
                                    const slideId = `dashboard-post-slide-${post.id}`;
                                    const prevId = `dashboard-post-slide-${featuredPosts[(index - 1 + featuredPosts.length) % featuredPosts.length].id}`;
                                    const nextId = `dashboard-post-slide-${featuredPosts[(index + 1) % featuredPosts.length].id}`;

                                    return (
                                        <div
                                            key={post.id}
                                            id={slideId}
                                            className="carousel-item relative w-full"
                                        >
                                            <div className="relative min-h-[260px] w-full overflow-hidden md:min-h-[300px]">
                                                <img
                                                    src={getPostImageUrl(post)}
                                                    alt={post.title}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
                                                <div className="relative flex h-full w-full flex-col justify-between px-6 py-8 md:px-10">
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {post.category && (
                                                            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-50">
                                                                {post.category.name}
                                                            </span>
                                                        )}
                                                        {post.is_pinned && (
                                                            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                                                                Prioritario
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <h3 className="max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
                                                            {post.title}
                                                        </h3>
                                                        {post.excerpt && (
                                                            <p className="max-w-2xl text-sm text-green-50/90 md:text-base">
                                                                {post.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                                    <div className="text-sm text-green-100/90">
                                                        {post.published_at && <span>{post.published_at}</span>}
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {featuredPosts.length > 1 && (
                                                            <>
                                                                <a href={`#${prevId}`} className="btn btn-circle btn-sm border-none bg-white/15 text-white hover:bg-white/25">
                                                                    ❮
                                                                </a>
                                                                <a href={`#${nextId}`} className="btn btn-circle btn-sm border-none bg-white/15 text-white hover:bg-white/25">
                                                                    ❯
                                                                </a>
                                                            </>
                                                        )}

                                                        <Link
                                                            href={route('public.posts.show', { post: post.slug })}
                                                            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-lime-100"
                                                        >
                                                            Ver noticia
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </PortalSection>
                    )}

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

                    {closedSurveys.length > 0 && (
                        <PortalSection
                            title="Encuestas Cerradas"
                            subtitle="Resultados y registros de encuestas que ya finalizaron"
                        >
                            <div className="space-y-6">
                                {closedSurveys.map((survey) => (
                                    <SurveyCard key={survey.id} survey={survey} />
                                ))}
                            </div>
                        </PortalSection>
                    )}

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

                    {/* Phase 2: Onboarding Progress */}
                    {onboarding && onboarding.total > 0 && onboarding.has_pending && (
                        <PortalSection
                            title="Tu Onboarding"
                            subtitle={`Has completado ${onboarding.completed} de ${onboarding.total} tareas`}
                            action={
                                <Link
                                    href={route('onboarding.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Continuar →
                                </Link>
                            }
                        >
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 flex-shrink-0">
                                        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#038c34" strokeWidth="3" strokeDasharray={`${onboarding.percentage}, 100`} />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-bold text-gray-900">{onboarding.percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                            {onboarding.percentage === 0
                                                ? '¡Bienvenido/a! Comienza tu onboarding para ubicarte rápidamente.'
                                                : onboarding.percentage < 100
                                                ? '¡Vas avanzado/a! Sigue completando las tareas restantes.'
                                                : '¡Felicitaciones! Has completado todo tu onboarding.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </PortalSection>
                    )}

                    {/* Phase 2: Services Status */}
                    {services && services.length > 0 && (
                        <PortalSection
                            title="Estado de Servicios"
                            subtitle="Visibilidad de herramientas internas"
                            action={
                                <Link
                                    href={route('services.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Ver todos →
                                </Link>
                            }
                        >
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {services.map((service) => (
                                    <div key={service.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${service.status_badge_color}`}>
                                            {service.status_label}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                                            {service.status_message && (
                                                <p className="text-xs text-gray-500 truncate">{service.status_message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PortalSection>
                    )}

                    {/* Phase 2: Recent Requests */}
                    {recentRequests && recentRequests.length > 0 && (
                        <PortalSection
                            title="Mis Solicitudes Recientes"
                            subtitle="Seguimiento de tus gestiones"
                            action={
                                <Link
                                    href={route('my-requests.index')}
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    Ver todas →
                                </Link>
                            }
                        >
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {recentRequests.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm font-mono text-gray-600">{req.reference_code}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{req.title}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getRequestStatusColor(req.status)}`}>
                                                        {req.status_label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{req.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </PortalSection>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
