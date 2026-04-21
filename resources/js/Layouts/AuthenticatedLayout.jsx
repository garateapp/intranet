import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:-my-px sm:ms-10 sm:flex items-center">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Inicio
                                </NavLink>

                                {/* Dropdown: Portal */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className={`inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                            route().current('search.*') || route().current('directory.*') || route().current('faq.*') || route().current('organigram.*') || route().current('calendar.*') || route().current('onboarding.*')
                                                ? 'text-gray-900 border-b-2 border-green-500'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}>
                                            Portal
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('search.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                Buscador
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('directory.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Personas
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('faq.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Preguntas Frecuentes
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('organigram.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                Organigrama
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('calendar.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Calendario
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('onboarding.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                Onboarding
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>

                                {/* Dropdown: Recursos */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className={`inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                            route().current('documents.*') || route().current('services.*') || route().current('my-requests.*')
                                                ? 'text-gray-900 border-b-2 border-green-500'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}>
                                            Recursos
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('documents.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                Documentos
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('services.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Estado de Servicios
                                            </div>
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('my-requests.index')}>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Mis Solicitudes
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>

                                <NavLink
                                    href={route('rrhh.index')}
                                    active={route().current('rrhh.*')}
                                >
                                    RRHH
                                </NavLink>

                                {/* Dropdown: Admin (solo admin) */}
                                {user.role === 'admin' && (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className={`inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                                route().current('users.*') || route().current('admin.posts.*') || route().current('categories.*') || route().current('links.*') || route().current('settings.*') || route().current('faq-categories.*') || route().current('faqs.*') || route().current('corporate-events.*') || route().current('organizational-units.*') || route().current('admin.organigram.*') || route().current('onboarding-stages.*') || route().current('onboarding-tasks.*') || route().current('documents.*') || route().current('services.*') || route().current('request-types.*') || route().current('user-requests.*') || route().current('audit-logs.*') || route().current('user-activities.*')
                                                    ? 'text-gray-900 border-b-2 border-orange-500'
                                                    : 'text-orange-600 hover:text-orange-700'
                                            }`}>
                                                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Admin
                                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Gestión de Usuarios</div>
                                            <Dropdown.Link href={route('users.index')}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                    Usuarios / Directorio
                                                </div>
                                            </Dropdown.Link>

                                            <div className="border-t border-gray-100 my-1"></div>
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contenidos</div>
                                            <Dropdown.Link href={route('admin.posts.index')}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                                    Publicaciones
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('categories.index')}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                                    Categorías
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('links.index')}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                    Enlaces Útiles
                                                </div>
                                            </Dropdown.Link>

                                            <div className="border-t border-gray-100 my-1"></div>
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Organizacional</div>
                                            <Dropdown.Link href={route('organizational-units.index')}>
                                                <div className="flex items-center gap-2">Organigrama</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('admin.organigram.index')}>
                                                <div className="flex items-center gap-2">Importar organigrama BUK</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('onboarding-stages.index')}>
                                                <div className="flex items-center gap-2">Onboarding (Etapas)</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('onboarding-tasks.index')}>
                                                <div className="flex items-center gap-2">Onboarding (Tareas)</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('admin.documents.index')}>
                                                <div className="flex items-center gap-2">Documentos</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('admin.services.index')}>
                                                <div className="flex items-center gap-2">Servicios</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('request-types.index')}>
                                                <div className="flex items-center gap-2">Tipos de Solicitud</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('user-requests.index')}>
                                                <div className="flex items-center gap-2">Solicitudes</div>
                                            </Dropdown.Link>

                                            <div className="border-t border-gray-100 my-1"></div>
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQ & Eventos</div>
                                            <Dropdown.Link href={route('faq-categories.index')}>
                                                <div className="flex items-center gap-2">Categorías FAQ</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('faqs.index')}>
                                                <div className="flex items-center gap-2">FAQs</div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('corporate-events.index')}>
                                                <div className="flex items-center gap-2">Eventos Corporativos</div>
                                            </Dropdown.Link>

                                            <div className="border-t border-gray-100 my-1"></div>
                                            <Dropdown.Link href={route('settings.index')}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Configuración
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('audit-logs.index')}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                                    Auditoría
                                                </div>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('user-activities.index')}>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Actividad de Usuarios
                                                </div>
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Inicio
                        </ResponsiveNavLink>

                        {/* Portal group */}
                        <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Portal</div>
                        <ResponsiveNavLink href={route('search.index')} active={route().current('search.index')}>Buscador</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('directory.index')} active={route().current('directory.index')}>Personas</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('faq.index')} active={route().current('faq.index')}>Preguntas Frecuentes</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('organigram.index')} active={route().current('organigram.index')}>Organigrama</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('calendar.index')} active={route().current('calendar.index')}>Calendario</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('onboarding.index')} active={route().current('onboarding.index')}>Onboarding</ResponsiveNavLink>

                        {/* Recursos group */}
                        <div className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recursos</div>
                        <ResponsiveNavLink href={route('admin.documents.index')} active={route().current('documents.index')}>Documentos</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.services.index')} active={route().current('services.index')}>Estado de Servicios</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('my-requests.index')} active={route().current('my-requests.index')}>Mis Solicitudes</ResponsiveNavLink>

                        <ResponsiveNavLink
                            href={route('rrhh.index')}
                            active={route().current('rrhh.index')}
                        >
                            RRHH
                        </ResponsiveNavLink>

                        {/* Admin group */}
                        {user.role === 'admin' && (
                            <>
                                <div className="px-4 pt-4 pb-1 text-xs font-semibold text-orange-400 uppercase tracking-wider">Administración</div>
                                <ResponsiveNavLink href={route('users.index')} active={route().current('users.*')}>
                                    <span className="flex items-center gap-1">Usuarios <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-800 rounded">Admin</span></span>
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.posts.index')} active={route().current('admin.posts.*')}>Publicaciones</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('categories.index')} active={route().current('categories.*')}>Categorías</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('links.index')} active={route().current('links.*')}>Enlaces</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('settings.index')} active={route().current('settings.index')}>Configuración</ResponsiveNavLink>
                                <div className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Portal Fase 2</div>
                                <ResponsiveNavLink href={route('organizational-units.index')} active={route().current('organizational-units.*')}>Organigrama</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.organigram.index')} active={route().current('admin.organigram.*')}>Importar organigrama BUK</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('onboarding-stages.index')} active={route().current('onboarding-stages.*')}>Onboarding (Etapas)</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('onboarding-tasks.index')} active={route().current('onboarding-tasks.*')}>Onboarding (Tareas)</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.documents.index')} active={route().current('admin.documents.*')}>Documentos (Admin)</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('admin.services.index')} active={route().current('admin.services.*')}>Servicios (Admin)</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('request-types.index')} active={route().current('request-types.*')}>Tipos de Solicitud</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('user-requests.index')} active={route().current('user-requests.*')}>Solicitudes</ResponsiveNavLink>
                                <div className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQ & Eventos</div>
                                <ResponsiveNavLink href={route('faq-categories.index')} active={route().current('faq-categories.*')}>Categorías FAQ</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('faqs.index')} active={route().current('faqs.*')}>FAQs</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('corporate-events.index')} active={route().current('corporate-events.*')}>Eventos</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('audit-logs.index')} active={route().current('audit-logs.*')}>Auditoría</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('user-activities.index')} active={route().current('user-activities.*')}>Actividad de Usuarios</ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
