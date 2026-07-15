import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Pipeline({ vacancy, availableStages }) {
    const [draggedStage, setDraggedStage] = useState(null);
    const { data, setData, post, processing } = useForm({ stage_id: '' });

    const handleDragStart = (e, vs) => {
        setDraggedStage(vs);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedStage(null);
    };

    const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (!draggedStage) return;
        const currentIndex = vacancy.stages.findIndex((s) => s.pivot.id === draggedStage.pivot.id);
        if (currentIndex === targetIndex) return;

        const reordered = [...vacancy.stages];
        const [moved] = reordered.splice(currentIndex, 1);
        reordered.splice(targetIndex, 0, moved);

        const payload = reordered.map((s, i) => ({ id: s.pivot.id, sort_order: i }));
        router.put(route('ats.vacancies.pipeline.reorder', vacancy.id), { stages: payload }, { preserveState: true });
    };

    const handleAddStage = (e) => {
        e.preventDefault();
        if (!data.stage_id) return;
        post(route('ats.vacancies.pipeline.store', vacancy.id), {
            onSuccess: () => setData('stage_id', ''),
        });
    };

    const handleRemoveStage = (stageId) => {
        router.delete(route('ats.vacancies.pipeline.destroy', [vacancy.id, stageId]), { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href={route('ats.vacancies.show', vacancy.id)} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Pipeline: {vacancy.title}</h2>
                        <p className="text-sm text-gray-500">Configura las etapas del proceso de selección</p>
                    </div>
                </div>
            }
        >
            <Head title={`Pipeline - ${vacancy.title}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Lista de etapas actuales */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">Etapas actuales ({vacancy.stages?.length || 0})</h3>
                    <div className="space-y-2">
                        {vacancy.stages?.map((stage, index) => (
                            <div
                                key={stage.pivot.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, stage)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm cursor-grab active:cursor-grabbing"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-500">
                                    {index + 1}
                                </span>
                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color }} />
                                <span className="flex-1 text-sm font-medium text-gray-900">{stage.name}</span>
                                {!stage.is_default && (
                                    <button
                                        onClick={() => handleRemoveStage(stage.id)}
                                        className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                        title="Remover etapa"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        {(!vacancy.stages || vacancy.stages.length === 0) && (
                            <p className="py-4 text-center text-sm text-gray-500">No hay etapas configuradas.</p>
                        )}
                    </div>
                </div>

                {/* Agregar etapa */}
                {availableStages.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Agregar etapa</h3>
                        <form onSubmit={handleAddStage} className="flex gap-3">
                            <select
                                value={data.stage_id}
                                onChange={(e) => setData('stage_id', e.target.value)}
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar etapa...</option>
                                {availableStages.map((stage) => (
                                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={processing || !data.stage_id}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                Agregar
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
