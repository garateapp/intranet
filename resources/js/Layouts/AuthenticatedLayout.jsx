import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children, rightSidebar }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navLinkClass = (active) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            active
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    const navSectionClass = 'px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider';

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top navbar */}
            <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white">
                <div className="flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:flex"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('search.index')}
                            className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600 sm:flex"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <span className="hidden lg:inline">Buscar</span>
                            <kbd className="hidden rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 lg:inline">⌘K</kbd>
                        </Link>
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden sm:inline">{user.name}</span>
                                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 focus:outline-none lg:hidden"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Left Sidebar */}
                <aside
                    className={`${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed inset-y-0 left-0 z-20 mt-16 w-60 flex-col overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:mt-0 lg:flex ${
                        sidebarOpen ? 'flex' : 'hidden lg:flex'
                    } ${sidebarOpen ? '' : 'lg:-translate-x-0'}`}
                >
                    <nav className="flex flex-1 flex-col gap-1 p-3">
                        <Link href={route('dashboard')} className={navLinkClass(route().current('dashboard'))}>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Inicio
                        </Link>

                        <div className={navSectionClass}>Portal</div>
                        <Link href={route('directory.index')} className={navLinkClass(route().current('directory.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Personas
                        </Link>
                        <Link href={route('faq.index')} className={navLinkClass(route().current('faq.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            FAQ
                        </Link>
                        <Link href={route('organigram.index')} className={navLinkClass(route().current('organigram.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Organigrama
                        </Link>
                        <Link href={route('calendar.index')} className={navLinkClass(route().current('calendar.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Calendario
                        </Link>
                        <Link href={route('onboarding.index')} className={navLinkClass(route().current('onboarding.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Onboarding
                        </Link>

                        <div className="mt-2 border-t border-gray-100 pt-2">
                            <div className={navSectionClass}>Recursos</div>
                        </div>
                        <Link href={route('documents.index')} className={navLinkClass(route().current('documents.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Documentos
                        </Link>
                        <Link href={route('services.index')} className={navLinkClass(route().current('services.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Servicios
                        </Link>
                        <Link href={route('my-requests.index')} className={navLinkClass(route().current('my-requests.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Mis Solicitudes
                        </Link>
                        <Link href={route('exit-permits.index')} className={navLinkClass(route().current('exit-permits.*'))}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Permisos de Salida
                        </Link>
                        <Link href={route('manager.exit-permits.index')} className={navLinkClass(route().current('manager.exit-permits.*'))}>
                            <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Aprobaciones
                        </Link>

                        <Link href={route('rrhh.index')} className={`mt-2 ${navLinkClass(route().current('rrhh.*'))}`}>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            RRHH
                        </Link>

                        {/* Admin section */}
                        {user.role === 'admin' && (
                            <>
                                <div className="mt-2 border-t border-gray-100 pt-2">
                                    <div className="flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Admin
                                    </div>
                                </div>
                                <Link href={route('users.index')} className={navLinkClass(route().current('users.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    Usuarios
                                </Link>
                                <Link href={route('admin.posts.index')} className={navLinkClass(route().current('admin.posts.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                    Publicaciones
                                </Link>
                                <Link href={route('categories.index')} className={navLinkClass(route().current('categories.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                    Categorías
                                </Link>
                                <Link href={route('links.index')} className={navLinkClass(route().current('links.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    Enlaces
                                </Link>
                                <Link href={route('organizational-units.index')} className={navLinkClass(route().current('organizational-units.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    Unidades
                                </Link>
                                <Link href={route('admin.organigram.index')} className={navLinkClass(route().current('admin.organigram.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" /></svg>
                                    Organigrama BUK
                                </Link>
                                <Link href={route('onboarding-stages.index')} className={navLinkClass(route().current('onboarding-stages.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Onboarding
                                </Link>
                                <Link href={route('admin.documents.index')} className={navLinkClass(route().current('admin.documents.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Documentos
                                </Link>
                                <Link href={route('admin.services.index')} className={navLinkClass(route().current('admin.services.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Servicios
                                </Link>
                                <Link href={route('request-types.index')} className={navLinkClass(route().current('request-types.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    Solicitudes
                                </Link>
                                <Link href={route('surveys.index')} className={navLinkClass(route().current('surveys.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                    Encuestas
                                </Link>
                                <Link href={route('admin.exit-permits.index')} className={navLinkClass(route().current('admin.exit-permits.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Permisos
                                </Link>
                                <Link href={route('faq-categories.index')} className={navLinkClass(route().current('faq-categories.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                    Categorías FAQ
                                </Link>
                                <Link href={route('faqs.index')} className={navLinkClass(route().current('faqs.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    FAQs
                                </Link>
                                <Link href={route('corporate-events.index')} className={navLinkClass(route().current('corporate-events.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.701 2.701 0 002 15.546V2.5C2 1.672 2.672 1 3.5 1h17c.828 0 1.5.672 1.5 1.5v13.046z" /></svg>
                                    Eventos
                                </Link>
                                <Link href={route('settings.index')} className={navLinkClass(route().current('settings.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Configuración
                                </Link>
                                <Link href={route('audit-logs.index')} className={navLinkClass(route().current('audit-logs.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                    Auditoría
                                </Link>
                                <Link href={route('user-activities.index')} className={navLinkClass(route().current('user-activities.*'))}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Actividad
                                </Link>
                            </>
                        )}
                    </nav>
                </aside>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-10 bg-black/20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {header && (
                        <header className="border-b border-gray-200 bg-white">
                            <div className="px-4 py-5 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="flex-1">
                        <div className={`p-4 sm:p-6 lg:p-8 ${rightSidebar ? 'grid grid-cols-1 gap-6 xl:grid-cols-[1fr_20rem]' : ''}`}>
                            <div>{children}</div>
                            {rightSidebar && (
                                <aside className="hidden xl:block">
                                    <div className="sticky top-20 space-y-4">
                                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                                                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                                </span>
                                            </div>
                                        </div>
                                        {rightSidebar}
                                    </div>
                                </aside>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile responsive nav (slide-over) */}
            {showingNavigationDropdown && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-black/20" onClick={() => setShowingNavigationDropdown(false)} />
                    <div className="fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                            <span className="text-sm font-semibold text-gray-900">Navegación</span>
                            <button
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="rounded-md p-1 text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto px-4 py-4">
                            <div className="space-y-1">
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Inicio</ResponsiveNavLink>
                                <div className="pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Portal</div>
                                <ResponsiveNavLink href={route('search.index')} active={route().current('search.*')}>Buscador</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('directory.index')} active={route().current('directory.*')}>Personas</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('faq.index')} active={route().current('faq.*')}>FAQ</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('organigram.index')} active={route().current('organigram.*')}>Organigrama</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('calendar.index')} active={route().current('calendar.*')}>Calendario</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('onboarding.index')} active={route().current('onboarding.*')}>Onboarding</ResponsiveNavLink>
                                <div className="pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recursos</div>
                                <ResponsiveNavLink href={route('documents.index')} active={route().current('documents.*')}>Documentos</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('services.index')} active={route().current('services.*')}>Servicios</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('my-requests.index')} active={route().current('my-requests.*')}>Mis Solicitudes</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('exit-permits.index')} active={route().current('exit-permits.*')}>Permisos de Salida</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('manager.exit-permits.index')} active={route().current('manager.exit-permits.*')}>Aprobaciones</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('rrhh.index')} active={route().current('rrhh.*')}>RRHH</ResponsiveNavLink>
                                {user.role === 'admin' && (
                                    <>
                                        <div className="pt-3 pb-1 text-xs font-semibold text-orange-500 uppercase tracking-wider">Admin</div>
                                        <ResponsiveNavLink href={route('users.index')} active={route().current('users.*')}>Usuarios</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('admin.posts.index')} active={route().current('admin.posts.*')}>Publicaciones</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('categories.index')} active={route().current('categories.*')}>Categorías</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('links.index')} active={route().current('links.*')}>Enlaces</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('organizational-units.index')} active={route().current('organizational-units.*')}>Unidades</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('admin.organigram.index')} active={route().current('admin.organigram.*')}>Organigrama BUK</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('onboarding-stages.index')} active={route().current('onboarding-stages.*')}>Onboarding</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('admin.documents.index')} active={route().current('admin.documents.*')}>Documentos</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('admin.services.index')} active={route().current('admin.services.*')}>Servicios</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('request-types.index')} active={route().current('request-types.*')}>Solicitudes</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('surveys.index')} active={route().current('surveys.*')}>Encuestas</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('admin.exit-permits.index')} active={route().current('admin.exit-permits.*')}>Permisos</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('faq-categories.index')} active={route().current('faq-categories.*')}>Categorías FAQ</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('faqs.index')} active={route().current('faqs.*')}>FAQs</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('corporate-events.index')} active={route().current('corporate-events.*')}>Eventos</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('settings.index')} active={route().current('settings.*')}>Configuración</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('audit-logs.index')} active={route().current('audit-logs.*')}>Auditoría</ResponsiveNavLink>
                                        <ResponsiveNavLink href={route('user-activities.index')} active={route().current('user-activities.*')}>Actividad</ResponsiveNavLink>
                                    </>
                                )}
                            </div>
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <div className="text-sm font-medium text-gray-800">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                                <div className="mt-2 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('logout')} method="post" as="button">Log Out</ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
