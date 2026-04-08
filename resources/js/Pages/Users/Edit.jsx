import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        department: user.department || '',
        position: user.position || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        is_directory_visible: user.is_directory_visible,
        is_directory_featured: user.is_directory_featured,
        avatar: null,
        _method: 'PUT',
    });

    function submit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.keys(data).forEach(key => {
            if (data[key] !== null && key !== 'avatar') formData.append(key, data[key]);
        });
        if (data.avatar) formData.append('avatar', data.avatar);
        post(route('users.update', user.id), { forceFormData: true });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Editar Usuario: {user.name}
                </h2>
            }
        >
            <Head title="Editar Usuario" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Avatar Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">
                                            {user.avatar && !user.avatar.includes('://') ? (
                                                <img src={user.avatar_url || `/storage/${user.avatar}`} alt={user.name} className="h-full w-full object-cover" />
                                            ) : user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-bold text-green-700">
                                                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('avatar', e.target.files[0])}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">JPG, PNG o GIF. Máximo 2MB. Dejar vacío para mantener la foto actual.</p>
                                            {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                            Departamento
                                        </label>
                                        <input
                                            type="text"
                                            id="department"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                            Cargo
                                        </label>
                                        <input
                                            type="text"
                                            id="position"
                                            value={data.position}
                                            onChange={(e) => setData('position', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Ubicación
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                        Biografía
                                    </label>
                                    <textarea
                                        id="bio"
                                        rows="3"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_directory_visible"
                                            checked={data.is_directory_visible}
                                            onChange={(e) => setData('is_directory_visible', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <label htmlFor="is_directory_visible" className="ml-2 block text-sm text-gray-700">
                                            Visible en directorio
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_directory_featured"
                                            checked={data.is_directory_featured}
                                            onChange={(e) => setData('is_directory_featured', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <label htmlFor="is_directory_featured" className="ml-2 block text-sm text-gray-700">
                                            Destacado en inicio
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Guardiar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
