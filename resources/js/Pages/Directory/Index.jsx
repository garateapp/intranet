import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PeopleCard from '@/Components/PeopleCard';
import { useState } from 'react';

export default function Index({ people, departments, filters }) {
    const [query, setQuery] = useState(filters.q || '');
    const [department, setDepartment] = useState(filters.department || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('directory.index'), {
            q: query,
            department: department,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Directorio de Personas" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Directorio de Personas
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Encuentra a tus compañeros de trabajo
                        </p>

                        {/* Filters */}
                        <form onSubmit={handleSearch} className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="sm:col-span-2">
                                    <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
                                        Buscar
                                    </label>
                                    <input
                                        type="text"
                                        id="q"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Nombre, cargo, departamento o email"
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                        Departamento
                                    </label>
                                    <select
                                        id="department"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                                    >
                                        <option value="">Todos</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors"
                                >
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Results */}
                    {people.data.length > 0 ? (
                        <>
                            <div className="mb-4 text-sm text-gray-600">
                                Mostrando {people.data.length} de {people.total} personas
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {people.data.map((person) => (
                                    <PeopleCard key={person.id} person={person} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {people.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="inline-flex rounded-md shadow-sm">
                                        {people.links.map((link, index) => (
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
                                                    index === people.links.length - 1 ? 'rounded-r-md' : ''
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No se encontraron personas
                            </h3>
                            <p className="text-gray-600">
                                Intenta con otros filtros de búsqueda
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
