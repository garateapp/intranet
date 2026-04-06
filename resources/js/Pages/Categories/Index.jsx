import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this category? This action cannot be undone if the category has posts or links.')) {
            router.delete(route('categories.destroy', id));
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Categories Management
                    </h2>
                    <Link
                        href={route('categories.create')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700"
                    >
                        Create New Category
                    </Link>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {categories.length === 0 ? (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No categories found.
                                    </div>
                                ) : (
                                    categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    {category.icon && (
                                                        <span className="text-2xl">{category.icon}</span>
                                                    )}
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        category.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>

                                            {category.description && (
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {category.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="space-y-1">
                                                    <div className="text-gray-500">
                                                        <span className="font-medium">{category.posts_count}</span> posts
                                                    </div>
                                                    <div className="text-gray-400 text-xs">
                                                        Order: {category.sort_order}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className="inline-block w-6 h-6 rounded border border-gray-300"
                                                        style={{ backgroundColor: category.color }}
                                                        title={category.color}
                                                    ></span>
                                                    <Link
                                                        href={route('categories.edit', category.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
