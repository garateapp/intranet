import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ candidates, filters, origins }) {
    const [search, setSearch] = useState(filters.search || '');
    const [originFilter, setOriginFilter] = useState(filters.origin || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('ats.candidates.index'), { search, origin: originFilter }, { preserveState: true });
    };

    const handleOriginFilter = (origin) => {
        const newOrigin = origin === originFilter ? '' : origin;
        setOriginFilter(newOrigin);
        router.get(route('ats.candidates.index'), { search, origin: newOrigin }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Candidatos</h2>
                    <Link
                        href={route('ats.candidates.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Nuevo Candidato
                    </Link>
                </div>
            }
        >
            <Head title="Candidatos - ATS" />

            {/* Filtros de origen */}
            {origins.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">Origen:</span>
                    {origins.map((origin) => (
                        <button
                            key={origin}
                            onClick={() => handleOriginFilter(origin)}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition ${
                                originFilter === origin
                                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-300'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {origin}
                        </button>
                    ))}
                </div>
            )}

            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o email..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </form>

            {/* Tabla de candidatos */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-medium uppercase text-gray-500">
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Teléfono</th>
                                <th className="px-4 py-3">Origen</th>
                                <th className="px-4 py-3 text-center">Postulaciones</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {candidates.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                                        No se encontraron candidatos.
                                    </td>
                                </tr>
                            ) : (
                                candidates.data.map((candidate) => (
                                    <tr key={candidate.id} className="transition hover:bg-gray-50/50">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route('ats.candidates.show', candidate.id)}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                    {candidate.name?.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900 hover:text-blue-600">{candidate.name}</span>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{candidate.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{candidate.phone || '-'}</td>
                                        <td className="px-4 py-3">
                                            {candidate.origin ? (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                                    {candidate.origin}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600">{candidate.applications_count}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('ats.candidates.show', candidate.id)}
                                                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                                                    title="Ver"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </Link>
                                                <Link
                                                    href={route('ats.candidates.edit', candidate.id)}
                                                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-yellow-600"
                                                    title="Editar"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginación */}
            {candidates.last_page > 1 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex gap-1">
                        {candidates.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
