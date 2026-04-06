import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        color: '#038c34',
        icon: '',
        sort_order: 0,
        is_active: true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('categories.store'), {
            onSuccess: () => reset(),
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Category
                </h2>
            }
        >
            <Head title="Create Category" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Color and Icon */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="color" value="Color" />
                                        <div className="flex items-center space-x-3 mt-1">
                                            <input
                                                id="color"
                                                type="color"
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                                className="h-10 w-20 rounded border border-gray-300"
                                            />
                                            <input
                                                type="text"
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                                maxLength="7"
                                            />
                                        </div>
                                        <InputError message={errors.color} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="icon" value="Icon (emoji or class)" />
                                        <input
                                            id="icon"
                                            type="text"
                                            value={data.icon}
                                            onChange={(e) => setData('icon', e.target.value)}
                                            placeholder="📰 or fas fa-newspaper"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.icon} className="mt-2" />
                                    </div>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <InputLabel htmlFor="sort_order" value="Sort Order" />
                                    <input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', e.target.value)}
                                        min="0"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    <InputError message={errors.sort_order} className="mt-2" />
                                </div>

                                {/* Active Status */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Active</span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('categories.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Create Category
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
