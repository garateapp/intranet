import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function Index({ defaults, signature, html }) {
    const [copiedHtml, setCopiedHtml] = useState(false);
    const [copiedImage, setCopiedImage] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const previewRef = useRef(null);

    const { data, setData, post, errors, processing } = useForm({
        phone: defaults.phone || '',
        role: defaults.role || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('firma.generate'));
    };

    async function toDataURL(url) {
        const res = await fetch(url, { mode: 'cors' });
        const blob = await res.blob();
        return await new Promise((r) => {
            const reader = new FileReader();
            reader.onload = () => r(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    async function embedImagesAsBase64(container) {
        const imgs = container.querySelectorAll('img');
        await Promise.all(
            [...imgs].map(async (img) => {
                try {
                    if (img.src.startsWith('data:')) return;
                    const dataUrl = await toDataURL(img.src);
                    img.setAttribute('src', dataUrl);
                } catch (e) {
                    // skip failed images
                }
            })
        );
    }

    async function copySignatureHtml() {
        const container = previewRef.current;
        if (!container) return;

        try {
            const imgs = container.querySelectorAll('img');
            const originalSrcs = [...imgs].map((img) => ({
                el: img,
                src: img.getAttribute('src'),
            }));

            await embedImagesAsBase64(container);

            const htmlStr = container.innerHTML;
            const textStr = container.innerText;

            if (navigator.clipboard && window.ClipboardItem) {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([htmlStr], { type: 'text/html' }),
                        'text/plain': new Blob([textStr], { type: 'text/plain' }),
                    }),
                ]);
            } else {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlStr;
                tempDiv.style.position = 'fixed';
                tempDiv.style.left = '-99999px';
                document.body.appendChild(tempDiv);
                const range = document.createRange();
                range.selectNodeContents(tempDiv);
                const sel = getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                document.execCommand('copy');
                sel.removeAllRanges();
                tempDiv.remove();
            }

            originalSrcs.forEach(({ el, src }) => el.setAttribute('src', src));

            setCopiedHtml(true);
            setTimeout(() => setCopiedHtml(false), 2000);
        } catch (err) {
            console.error('Error al copiar HTML:', err);
        }
    }

    async function copySignatureImage() {
        const container = previewRef.current;
        if (!container) return;

        setGeneratingImage(true);

        try {
            const originalSrcs = [...container.querySelectorAll('img')].map((img) => ({
                el: img,
                src: img.getAttribute('src'),
            }));

            await embedImagesAsBase64(container);

            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: false,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            originalSrcs.forEach(({ el, src }) => el.setAttribute('src', src));

            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob((b) => {
                    if (b) resolve(b);
                    else reject(new Error('No se pudo generar el blob'));
                }, 'image/png');
            });

            let clipboardWorks = false;
            try {
                if (navigator.clipboard && window.ClipboardItem) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob }),
                    ]);
                    clipboardWorks = true;
                }
            } catch (_) {
                // clipboard image write not supported
            }

            if (!clipboardWorks) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'firma-correo.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
            }

            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
        } catch (err) {
            console.error('Error al generar imagen:', err);
        } finally {
            setGeneratingImage(false);
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pie de Firma
                </h2>
            }
        >
            <Head title="Pie de Firma" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Generador de firma de correo
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Tu nombre y correo se completan con la información de tu cuenta.
                                    Completa los campos y presiona "Generar firma" para ver la vista previa.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nombre" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={defaults.name}
                                        readOnly
                                        disabled
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Correo" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={defaults.email}
                                        readOnly
                                        disabled
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="role" value="Cargo" />
                                    <TextInput
                                        id="role"
                                        className="mt-1 block w-full"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        required
                                        maxLength={120}
                                        placeholder="Ej: Gerente General"
                                    />
                                    <InputError className="mt-2" message={errors.role} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="phone" value="Teléfono" />
                                    <TextInput
                                        id="phone"
                                        className="mt-1 block w-full"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                        maxLength={50}
                                        placeholder="56999999999"
                                    />
                                    <InputError className="mt-2" message={errors.phone} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Generando...' : 'Generar firma'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </section>
                    </div>

                    {signature && (
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Vista previa
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={copySignatureHtml}
                                        className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                                            copiedHtml
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {copiedHtml ? (
                                            <>
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                HTML copiado
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                </svg>
                                                Copiar HTML
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={copySignatureImage}
                                        disabled={generatingImage}
                                        className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                                            copiedImage
                                                ? 'bg-green-600 text-white'
                                                : generatingImage
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-300 hover:bg-green-100'
                                        }`}
                                    >
                                        {copiedImage ? (
                                            <>
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {generatingImage ? 'Imagen copiada' : 'Descargado'}
                                            </>
                                        ) : generatingImage ? (
                                            <>
                                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Generando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Copiar como imagen
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">
                                <strong>Copiar HTML:</strong> Para Gmail, Outlook web u otros editores HTML.
                                <br />
                                <strong>Copiar como imagen:</strong> Para pegar directamente en clientes de correo de escritorio.
                            </p>

                            <div
                                ref={previewRef}
                                id="signature-preview"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        </div>
                    )}

                    {!signature && (
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <div className="py-12 text-center text-gray-400 border border-dashed rounded-lg">
                                Completa el formulario y presiona "Generar firma" para ver la vista previa aquí.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
