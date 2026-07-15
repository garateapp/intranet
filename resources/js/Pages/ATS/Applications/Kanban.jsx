import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Kanban({ vacancy, columns, candidates }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [draggedApp, setDraggedApp] = useState(null);
    const [hireModal, setHireModal] = useState(null);

    const handleDragStart = (e, application) => {
        setDraggedApp(application);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedApp(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetStageId) => {
        e.preventDefault();
        if (!draggedApp || draggedApp.stage_id === targetStageId) return;

        router.patch(route('ats.applications.move', draggedApp.id), {
            stage_id: targetStageId,
        }, {
            preserveState: true,
            onSuccess: () => setDraggedApp(null),
        });
    };

    const handleAddCandidate = (e) => {
        e.preventDefault();
        if (!selectedCandidate) return;

        const firstStage = columns[0]?.stage_id;
        router.post(route('ats.applications.store'), {
            candidate_id: selectedCandidate,
            vacancy_id: vacancy.id,
            stage_id: firstStage,
        }, {
            preserveState: true,
            onSuccess: () => {
                setSelectedCandidate('');
                setShowAddModal(false);
            },
        });
    };

    const handleHire = (application) => {
        router.patch(route('ats.applications.hire', application.id), {}, {
            preserveState: true,
            onSuccess: () => setHireModal(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('ats.vacancies.index')} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-gray-800">{vacancy.title}</h2>
                                {vacancy.status === 'closed' && (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                        Cerrada
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">Pipeline de selección</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('ats.vacancies.pipeline', vacancy.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Configurar
                        </Link>
                        {vacancy.status !== 'closed' && (
                            <button onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Agregar Candidato
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Kanban - ${vacancy.title}`} />

            {vacancy.status === 'closed' && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    Esta vacante está cerrada. No se pueden agregar ni mover candidatos.
                </div>
            )}

            {/* Tablero Kanban */}
            <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4" style={{ minWidth: `${columns.length * 300}px` }}>
                    {columns.map((column) => (
                        <div
                            key={column.stage_id}
                            className="flex w-72 flex-shrink-0 flex-col rounded-xl border border-gray-200 bg-gray-50"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.stage_id)}
                        >
                            <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-3">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: column.stage_color }} />
                                <h3 className="text-sm font-semibold text-gray-800">{column.stage_name}</h3>
                                <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                                    {column.applications.length}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2" style={{ minHeight: '200px' }}>
                                {column.applications.map((app) => (
                                    <div
                                        key={app.id}
                                        draggable={vacancy.status !== 'closed'}
                                        onDragStart={(e) => handleDragStart(e, app)}
                                        onDragEnd={handleDragEnd}
                                        className={`rounded-lg border p-3 shadow-sm transition ${
                                            app.hired_at
                                                ? 'border-green-300 bg-green-50'
                                                : 'cursor-grab border-gray-200 bg-white hover:border-blue-300 hover:shadow-md active:cursor-grabbing'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                                app.hired_at ? 'bg-green-200 text-green-800' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {app.hired_at ? '✓' : app.candidate?.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900">{app.candidate?.name}</p>
                                                <p className="truncate text-xs text-gray-500">{app.candidate?.email}</p>
                                            </div>
                                        </div>

                                        {app.hired_at ? (
                                            <div className="mt-2 rounded-md bg-green-100 px-2 py-1 text-center text-[10px] font-semibold text-green-700">
                                                CONTRATADO
                                            </div>
                                        ) : vacancy.status !== 'closed' ? (
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400">
                                                    {app.applied_at ? new Date(app.applied_at).toLocaleDateString('es-CL') : ''}
                                                </span>
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('ats.candidates.show', app.candidate?.id)}
                                                        className="text-[10px] font-medium text-blue-600 hover:text-blue-700"
                                                    >
                                                        Ver
                                                    </Link>
                                                    <button
                                                        onClick={() => setHireModal(app)}
                                                        className="text-[10px] font-medium text-green-600 hover:text-green-700"
                                                    >
                                                        Contratar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400">
                                                    {app.applied_at ? new Date(app.applied_at).toLocaleDateString('es-CL') : ''}
                                                </span>
                                                <Link
                                                    href={route('ats.candidates.show', app.candidate?.id)}
                                                    className="text-[10px] font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    Ver perfil
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {column.applications.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <svg className="mb-2 h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        <p className="text-xs text-gray-400">Arrastra candidatos aquí</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Agregar Candidato */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Agregar Candidato al Pipeline</h3>
                        <form onSubmit={handleAddCandidate}>
                            <select
                                value={selectedCandidate}
                                onChange={(e) => setSelectedCandidate(e.target.value)}
                                className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar candidato...</option>
                                {candidates.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={!selectedCandidate}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Contratar Candidato */}
            {hireModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Contratar Candidato</h3>
                                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                            </div>
                        </div>
                        <p className="mb-1 text-sm text-gray-700">
                            Seleccionar a <strong>{hireModal.candidate?.name}</strong> para cubrir la vacante <strong>{vacancy.title}</strong>.
                        </p>
                        <p className="mb-6 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                            La vacante se cerrará automáticamente y no se podrán agregar más candidatos.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setHireModal(null)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleHire(hireModal)}
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                Confirmar Contratación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
