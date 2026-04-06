import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ links, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [isActive, setIsActive] = useState(filters.is_active !== undefined ? filters.is_active : '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('links.index'), {
            search,
            category_id: categoryId,
            is_active: isActive,
        });
    }

    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this link?')) {
            router.delete(route('links.destroy', id));
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Links Management
                    </h2>
                    <Link
                        href={route('links.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Create New Link
                    </Link>
                </div>
            }
        >
            <Head title="Links" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-4 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleFilter} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Search
                                        </label>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search by title..."
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Category
                                        </label>
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            value={isActive}
                                            onChange={(e) => setIsActive(e.target.value === '' ? '' : e.target.value === '1')}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">All</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {links.data.length === 0 ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No links found.
                                    </div>
                                ) : (
                                    links.data.map((link) => (
                                        <div
                                            key={link.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {link.title}
                                                    </h3>
                                                    {link.category && (
                                                        <span
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                                                            style={{ backgroundColor: link.category.color }}
                                                        >
                                                            {link.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                        link.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {link.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>

                                            {link.description && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {link.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-sm">
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-600 hover:text-green-800 truncate flex-1 mr-2"
                                                >
                                                    {link.url}
                                                </a>
                                                <span className="text-gray-400 text-xs whitespace-nowrap">
                                                    {link.clicks} clicks
                                                </span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route('links.edit', link.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(link.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {links.links.length > 3 && (
                                <div className="mt-6">
                                    <div className="flex justify-center space-x-2">
                                        {links.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-1 rounded ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-100'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label || '' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
