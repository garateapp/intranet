import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Edit({ post: currentPost, categories }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: currentPost.title || '',
        excerpt: currentPost.excerpt || '',
        content: currentPost.content || '',
        category_id: currentPost.category_id ? String(currentPost.category_id) : '',
        status: currentPost.status || 'draft',
        is_featured: currentPost.is_featured ? '1' : '0',
        is_pinned: currentPost.is_pinned ? '1' : '0',
        published_at: currentPost.published_at ? new Date(currentPost.published_at).toISOString().slice(0, 16) : '',
        tags: Array.isArray(currentPost.tags) ? currentPost.tags.join(', ') : '',
        featured_image: null,
    });

    function handleSubmit(e) {
        e.preventDefault();

        console.log('Submitting form with data:', data);

        if (!data.content || data.content.trim() === '' || data.content === '<p></p>') {
            alert('El contenido no puede estar vacío');
            return;
        }

        // Use router.post with FormData to ensure proper data transmission
        router.post(route('posts.update', currentPost.id), {
            _method: 'PUT',
            title: data.title,
            excerpt: data.excerpt || '',
            content: data.content,
            category_id: data.category_id,
            status: data.status,
            is_featured: data.is_featured,
            is_pinned: data.is_pinned,
            published_at: data.published_at || null,
            tags: data.tags || '',
            featured_image: data.featured_image,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update successful');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Post
                </h2>
            }
        >
            <Head title="Edit Post" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="Title" />
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <InputLabel htmlFor="excerpt" value="Excerpt" />
                                    <textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        rows="2"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    <InputError message={errors.excerpt} className="mt-2" />
                                </div>

                                {/* Content */}
                                <div>
                                    <InputLabel htmlFor="content" value="Content" />
                                    {/* RichTextEditor component */}
                                    <div className="mt-1">
                                        <RichTextEditor
                                            value={data.content}
                                            onChange={(content) => {
                                                console.log('RichTextEditor onChange called, content length:', content?.length);
                                                setData('content', content);
                                            }}
                                            placeholder="Start writing your post content..."
                                        />
                                    </div>
                                    <InputError message={errors.content} className="mt-2" />
                                </div>

                                {/* Category and Status */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="category_id" value="Category" />
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                            required
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                {/* Published At */}
                                {data.status === 'published' && (
                                    <div>
                                        <InputLabel htmlFor="published_at" value="Published At (Optional)" />
                                        <input
                                            id="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.published_at} className="mt-2" />
                                    </div>
                                )}

                                {/* Tags */}
                                <div>
                                    <InputLabel htmlFor="tags" value="Tags (comma separated)" />
                                    <input
                                        id="tags"
                                        type="text"
                                        value={data.tags}
                                        onChange={(e) => setData('tags', e.target.value)}
                                        placeholder="news, update, announcement"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    <InputError message={errors.tags} className="mt-2" />
                                </div>

                                {/* Featured Image */}
                                <div>
                                    <InputLabel htmlFor="featured_image" value="Featured Image" />
                                    {currentPost.featured_image && (
                                        <div className="mb-2">
                                            <img
                                                src={`/storage/${currentPost.featured_image}`}
                                                alt="Current featured image"
                                                className="h-32 w-auto object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    <input
                                        id="featured_image"
                                        type="file"
                                        onChange={(e) => setData('featured_image', e.target.files[0])}
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <InputError message={errors.featured_image} className="mt-2" />
                                </div>

                                {/* Options */}
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Featured</span>
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_pinned}
                                            onChange={(e) => setData('is_pinned', e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Pinned</span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('posts.index')}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Update Post
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
