import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Edit({ document, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: document.title || '',
        description: document.description || '',
        file: null,
        category_id: document.category_id || '',
        version: document.version || '1.0',
        is_vigant: document.is_vigant || false,
        is_featured: document.is_featured || false,
        is_published: document.is_published || false,
        sort_order: document.sort_order || 0,
        _method: 'PUT',
    }, { forceFormData: true });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('documents.update', document.id));
    }

    function handleDelete() {
        if (confirm('\u00bfEst\u00e1s seguro de que deseas eliminar este documento?')) {
            router.delete(route('documents.destroy', document.id));
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Editar Documento
                </h2>
            }
        >
            <Head title={`Editar: ${document.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="T\u00edtulo" />
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

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Descripci\u00f3n" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Current File */}
                                {document.file_path && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <h3 className="text-sm font-medium text-gray-900">Archivo actual</h3>
                                        <div className="mt-2 flex items-center gap-3">
                                            <span className="text-sm text-gray-600">
                                                {document.file_name || document.title}
                                            </span>
                                            {document.file_size_formatted && (
                                                <span className="text-xs text-gray-500">
                                                    ({document.file_size_formatted})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* File Upload */}
                                <div>
                                    <InputLabel htmlFor="file" value="Reemplazar archivo (opcional)" />
                                    <input
                                        id="file"
                                        type="file"
                                        onChange={(e) => setData('file', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-green-50 file:text-green-700
                                            hover:file:bg-green-100"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Formatos aceptados: PDF, DOCX, XLSX, PPTX, JPG, PNG, ZIP. Tama\u00f1o m\u00e1ximo: 10MB.
                                    </p>
                                    <InputError message={errors.file} className="mt-2" />
                                </div>

                                {/* Category and Version */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="category_id" value="Categor\u00eda" />
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        >
                                            <option value="">Seleccionar categor\u00eda</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="version" value="Versi\u00f3n" />
                                        <input
                                            id="version"
                                            type="text"
                                            value={data.version}
                                            onChange={(e) => setData('version', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                        <InputError message={errors.version} className="mt-2" />
                                    </div>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <InputLabel htmlFor="sort_order" value="Orden" />
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

                                {/* Checkboxes */}
                                <div className="space-y-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_vigant}
                                            onChange={(e) => setData('is_vigant', e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Vigente</span>
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Destacado</span>
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Publicado</span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <DangerButton
                                        type="button"
                                        onClick={handleDelete}
                                    >
                                        Eliminar Documento
                                    </DangerButton>
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('documents.index')}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            Cancelar
                                        </Link>
                                        <PrimaryButton disabled={processing}>
                                            Actualizar Documento
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
