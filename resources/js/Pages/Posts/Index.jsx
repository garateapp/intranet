import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ posts, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    function handleFilter(e) {
        e.preventDefault();
        router.get(route('posts.index'), {
            search,
            status,
            category_id: categoryId,
        });
    }

    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(route('posts.destroy', id));
        }
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Posts Management
                    </h2>
                    <Link
                        href={route('posts.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Create New Post
                    </Link>
                </div>
            }
        >
            <Head title="Posts" />

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
                                            Status
                                        </label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">All</option>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
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

                    {/* Posts Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Author
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Published
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {posts.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    No posts found.
                                                </td>
                                            </tr>
                                        ) : (
                                            posts.data.map((post) => (
                                                <tr key={post.id}>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {post.title}
                                                        </div>
                                                        {post.is_pinned && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                Pinned
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {post.category ? (
                                                            <span
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                                                                style={{ backgroundColor: post.category.color }}
                                                            >
                                                                {post.category.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">No Category</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                post.status === 'published'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : post.status === 'draft'
                                                                    ? 'bg-gray-100 text-gray-800'
                                                                    : 'bg-orange-100 text-orange-800'
                                                            }`}
                                                        >
                                                            {post.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {post.user?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {post.published_at ? formatDate(post.published_at) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route('posts.edit', post.id)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {posts.links.length > 3 && (
                                <div className="mt-4">
                                    <div className="flex justify-center space-x-2">
                                        {posts.links.map((link, index) => (
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
