import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión - GreenEx" />

            <div className="relative min-h-screen flex overflow-hidden bg-gray-100">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Left Side - Hero Section */}
                <div className="hidden lg:flex lg:w-1/2 relative z-10">
                    <div className="flex flex-col justify-center items-center p-12 text-white">
                        {/* Logo */}
                        <div className="mb-12 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 transform hover:rotate-12 transition-transform duration-300">
                                <span className="text-5xl font-bold text-white">G</span>
                            </div>
                            <h1 className="text-5xl font-bold mb-4">GreenEx</h1>
                            <p className="text-green-200 text-lg">Portal Corporativo Intranet</p>
                        </div>

                        {/* Features */}
                        <div className="space-y-8 max-w-md">
                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                                <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Noticias Actualizadas</h3>
                                    <p className="text-green-100 text-sm">Mantente informado con las últimas novedades de la empresa</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Recursos Útiles</h3>
                                    <p className="text-green-100 text-sm">Accede a herramientas y enlaces corporativos</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Comunicación Interna</h3>
                                    <p className="text-green-100 text-sm">Conecta con tu equipo y departamentos</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-12 text-center">
                            <p className="text-green-200 text-sm">
                                © {new Date().getFullYear()} GreenEx • Diseñado con 💚 para nuestros colaboradores
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center shadow-xl mx-auto mb-4">
                                <span className="text-3xl font-bold text-white">G</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">GreenEx</h1>
                            <p className="text-gray-600">Portal Corporativo</p>
                        </div>

                        {/* Login Card */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    ¡Bienvenido! 👋
                                </h2>
                                <p className="text-gray-600">
                                    Inicia sesión para acceder a tu intranet
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <p className="text-sm font-medium text-green-700 text-center">
                                        {status}
                                    </p>
                                </div>
                            )}

                            {/* Google Login Button */}
                            <a
                                href={route('auth.google')}
                                className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all hover:border-green-400 hover:shadow-lg hover:bg-green-50"
                            >
                                <svg className="h-6 w-6" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Continuar con Google</span>
                            </a>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-4 text-gray-500 font-medium">
                                        o usa tu email
                                    </span>
                                </div>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email */}
                                <div>
                                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-sm font-semibold text-gray-700 mb-2" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="tu@correo.com"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <InputLabel htmlFor="password" value="Contraseña" className="text-sm font-semibold text-gray-700" />
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData('remember', e.target.checked)
                                            }
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">
                                            Recordarme
                                        </span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center items-center gap-2 py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Iniciando sesión...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Iniciar Sesión</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Register Link */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    ¿No tienes cuenta?{' '}
                                    <Link
                                        href={route('register')}
                                        className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
                                    >
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                🔒 Acceso seguro y protegido
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}
