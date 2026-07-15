import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ stages }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingStage, setEditingStage] = useState(null);
    const [draggedStage, setDraggedStage] = useState(null);

    const createForm = useForm({ name: '', color: '#3B82F6', is_default: false });
    const editForm = useForm({ name: '', color: '#3B82F6', is_default: false });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('ats.stages.store'), {
            onSuccess: () => { setShowCreateModal(false); createForm.reset(); },
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.put(route('ats.stages.update', editingStage.id), {
            onSuccess: () => { setEditingStage(null); editForm.reset(); },
        });
    };

    const handleDelete = (stage) => {
        if (!confirm(`¿Eliminar la etapa "${stage.name}"?`)) return;
        router.delete(route('ats.stages.delete', stage.id));
    };

    const openEditModal = (stage) => {
        setEditingStage(stage);
        editForm.setData({ name: stage.name, color: stage.color, is_default: stage.is_default });
    };

    const handleDragStart = (e, stage) => { setDraggedStage(stage); e.dataTransfer.effectAllowed = 'move'; e.target.style.opacity = '0.5'; };
    const handleDragEnd = (e) => { e.target.style.opacity = '1'; setDraggedStage(null); };
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (!draggedStage) return;
        const currentIndex = stages.findIndex((s) => s.id === draggedStage.id);
        if (currentIndex === targetIndex) return;
        const reordered = [...stages];
        const [moved] = reordered.splice(currentIndex, 1);
        reordered.splice(targetIndex, 0, moved);
        const payload = reordered.map((s, i) => ({ id: s.id, sort_order: i }));
        router.put(route('ats.stages.reorder'), { stages: payload }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Etapas del Pipeline</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Nueva Etapa
                    </button>
                </div>
            }
        >
            <Head title="Etapas - ATS" />

            <div className="mx-auto max-w-2xl">
                <p className="mb-4 text-sm text-gray-500">
                    Arrastra para reordenar. Las etapas marcadas como predeterminadas se asignan automáticamente a nuevas vacantes.
                </p>
                <div className="space-y-2">
                    {stages.map((stage, index) => (
                        <div
                            key={stage.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, stage)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 cursor-grab active:cursor-grabbing"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-500">
                                {stage.sort_order + 1}
                            </span>
                            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: stage.color }} />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                                <span className="ml-2 text-xs text-gray-400">
                                    {stage.vacancies_count} vacante{stage.vacancies_count !== 1 ? 's' : ''}
                                </span>
                            </div>
                            {stage.is_default && (
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                    Predeterminada
                                </span>
                            )}
                            <div className="flex gap-1">
                                <button onClick={() => openEditModal(stage)} className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-yellow-600" title="Editar">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(stage)} className="rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600" title="Eliminar">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Crear */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Nueva Etapa</h3>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
                                <input type="text" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                {createForm.errors.name && <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Color *</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={createForm.data.color} onChange={(e) => createForm.setData('color', e.target.value)} className="h-10 w-10 cursor-pointer rounded border-0" />
                                    <input type="text" value={createForm.data.color} onChange={(e) => createForm.setData('color', e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                {createForm.errors.color && <p className="mt-1 text-xs text-red-600">{createForm.errors.color}</p>}
                            </div>
                            <div className="mb-6">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={createForm.data.is_default} onChange={(e) => createForm.setData('is_default', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">Etapa predeterminada</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => { setShowCreateModal(false); createForm.reset(); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                                <button type="submit" disabled={createForm.processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Crear</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {editingStage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Editar Etapa</h3>
                        <form onSubmit={handleEdit}>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
                                <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                {editForm.errors.name && <p className="mt-1 text-xs text-red-600">{editForm.errors.name}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Color *</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={editForm.data.color} onChange={(e) => editForm.setData('color', e.target.value)} className="h-10 w-10 cursor-pointer rounded border-0" />
                                    <input type="text" value={editForm.data.color} onChange={(e) => editForm.setData('color', e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                </div>
                                {editForm.errors.color && <p className="mt-1 text-xs text-red-600">{editForm.errors.color}</p>}
                            </div>
                            <div className="mb-6">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={editForm.data.is_default} onChange={(e) => editForm.setData('is_default', e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">Etapa predeterminada</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => { setEditingStage(null); editForm.reset(); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                                <button type="submit" disabled={editForm.processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
