import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        faq_category_id: '',
        question: '',
        answer: '',
        sort_order: 0,
        is_published: true,
    });

    function submit(e) {
        e.preventDefault();
        post(route('faqs.store'));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Nueva FAQ</h2>}
        >
            <Head title="Nueva FAQ" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="faq_category_id" className="block text-sm font-medium text-gray-700">Categoría</label>
                                    <select id="faq_category_id" value={data.faq_category_id} onChange={(e) => setData('faq_category_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required>
                                        <option value="">Seleccionar categoría</option>
                                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    {errors.faq_category_id && <p className="mt-1 text-sm text-red-600">{errors.faq_category_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="question" className="block text-sm font-medium text-gray-700">Pregunta</label>
                                    <input type="text" id="question" value={data.question} onChange={(e) => setData('question', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
                                </div>

                                <div>
                                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Respuesta</label>
                                    <textarea id="answer" rows="6" value={data.answer} onChange={(e) => setData('answer', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    {errors.answer && <p className="mt-1 text-sm text-red-600">{errors.answer}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">Orden</label>
                                        <input type="number" id="sort_order" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="is_published" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">Publicada</label>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 disabled:opacity-50">
                                        Crear FAQ
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
