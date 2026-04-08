import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            department: user.department || '',
            position: user.position || '',
            phone: user.phone || '',
            location: user.location || '',
            bio: user.bio || '',
            avatar: null,
            _method: 'PATCH',
        });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('department', data.department);
        formData.append('position', data.position);
        formData.append('phone', data.phone);
        formData.append('location', data.location);
        formData.append('bio', data.bio);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        post(route('profile.update'), formData, {
            forceFormData: true,
            onSuccess: () => setData('avatar', null),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Información del Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Actualiza la información de tu perfil y correo electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Avatar Upload */}
                <div>
                    <InputLabel htmlFor="avatar" value="Foto de Perfil" />
                    <div className="mt-2 flex items-center gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-green-100 flex items-center justify-center">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                            ) : user.avatar && user.avatar.startsWith('avatars/') ? (
                                <img src={`/storage/${user.avatar}`} alt={user.name} className="h-full w-full object-cover" />
                            ) : user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-green-700">{user.initials}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                onChange={(e) => setData('avatar', e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">JPG, PNG o GIF. Máximo 2MB.</p>
                            {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
                        </div>
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="department" value="Departamento" />

                        <TextInput
                            id="department"
                            className="mt-1 block w-full"
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            autoComplete="organization-title"
                        />

                        <InputError className="mt-2" message={errors.department} />
                    </div>

                    <div>
                        <InputLabel htmlFor="position" value="Cargo" />

                        <TextInput
                            id="position"
                            className="mt-1 block w-full"
                            value={data.position}
                            onChange={(e) => setData('position', e.target.value)}
                            autoComplete="organization-title"
                        />

                        <InputError className="mt-2" message={errors.position} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="phone" value="Teléfono" />

                        <TextInput
                            id="phone"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            autoComplete="tel"
                        />

                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="Ubicación" />

                        <TextInput
                            id="location"
                            className="mt-1 block w-full"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            autoComplete="address-level2"
                        />

                        <InputError className="mt-2" message={errors.location} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Biografía" />

                    <textarea
                        id="bio"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        rows="3"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Tu correo electrónico no está verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Guardado.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
