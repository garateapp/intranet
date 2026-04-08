import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function FileIcon({ extension }) {
    const ext = (extension || '').toUpperCase();

    const config = {
        PDF: { emoji: '📄', bg: 'bg-red-100', text: 'text-red-700' },
        DOC: { emoji: '📝', bg: 'bg-blue-100', text: 'text-blue-700' },
        DOCX: { emoji: '📝', bg: 'bg-blue-100', text: 'text-blue-700' },
        XLS: { emoji: '📊', bg: 'bg-green-100', text: 'text-green-700' },
        XLSX: { emoji: '📊', bg: 'bg-green-100', text: 'text-green-700' },
        PPT: { emoji: '📽️', bg: 'bg-orange-100', text: 'text-orange-700' },
        PPTX: { emoji: '📽️', bg: 'bg-orange-100', text: 'text-orange-700' },
        JPG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        JPEG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        PNG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        SVG: { emoji: '🖼️', bg: 'bg-purple-100', text: 'text-purple-700' },
        ZIP: { emoji: '📦', bg: 'bg-yellow-100', text: 'text-yellow-700' },
        RAR: { emoji: '📦', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    };

    const { emoji, bg, text } = config[ext] || { emoji: '📎', bg: 'bg-gray-100', text: 'text-gray-700' };

    return (
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${bg}`}>
            <span className={`text-3xl ${text}`}>{emoji}</span>
        </div>
    );
}

export default function Show({ document }) {
    return (
        <AuthenticatedLayout>
            <Head title={document.title} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <Link
                        href={route('document-library.index')}
                        className="mb-6 inline-flex items-center text-sm text-green-600 hover:text-green-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Volver al Centro de Documentos
                    </Link>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-8">
                            <div className="flex items-start gap-5">
                                <FileIcon extension={document.file_extension} />
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start gap-3">
                                        <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
                                        {document.is_vigant ? (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                                Vigente
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                Archivado
                                            </span>
                                        )}
                                        {document.is_featured && (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                                \u2605 Destacado
                                            </span>
                                        )}
                                    </div>

                                    {document.category && (
                                        <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {document.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-8">
                            {document.description && (
                                <div className="mb-8">
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                                        Descripci\u00f3n
                                    </h2>
                                    <div className="prose prose-sm max-w-none text-gray-700">
                                        {document.description}
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Versi\u00f3n
                                    </dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {document.version || '1.0'}
                                    </dd>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Tipo de archivo
                                    </dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {(document.file_extension || '').toUpperCase() || document.file_type}
                                    </dd>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Tama\u00f1o
                                    </dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {document.file_size_formatted || 'N/A'}
                                    </dd>
                                </div>

                                {document.uploader && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Subido por
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {document.uploader.name}
                                        </dd>
                                    </div>
                                )}

                                {document.created_at && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Fecha de publicaci\u00f3n
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {new Date(document.created_at).toLocaleDateString('es-CL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </dd>
                                    </div>
                                )}

                                {document.updated_at && document.updated_at !== document.created_at && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            \u00daltima actualizaci\u00f3n
                                        </dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {new Date(document.updated_at).toLocaleDateString('es-CL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </dd>
                                    </div>
                                )}
                            </div>

                            {/* Download */}
                            {document.file_path && (
                                <div className="mt-8 flex justify-center">
                                    <a
                                        href={document.file_path}
                                        download
                                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        Descargar documento
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
