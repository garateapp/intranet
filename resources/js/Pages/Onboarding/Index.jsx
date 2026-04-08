import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

function ProgressBar({ progress }) {
    const { percentage, completed, total } = progress;
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="url(#greenGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700 ease-out"
                    />
                    <defs>
                        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#038c34" />
                            <stop offset="100%" stopColor="#80b61f" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
                    <span className="text-xs text-gray-500">completado</span>
                </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">
                {completed} de {total} tareas completadas
            </p>
        </div>
    );
}

function TaskItem({ task }) {
    const isCompleted = task.pivot?.is_completed ?? false;
    const [loading, setLoading] = useState(false);

    function toggleComplete() {
        setLoading(true);
        router.post(
            route('onboarding.complete-task', task.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            }
        );
    }

    const taskTypeIcon = () => {
        switch (task.task_type) {
            case 'resource':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'link':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                );
            case 'faq':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
        }
    };

    const taskTypeLabel = () => {
        switch (task.task_type) {
            case 'resource': return 'Recurso';
            case 'link': return 'Enlace';
            case 'faq': return 'Pregunta frecuente';
            default: return 'Checklist';
        }
    };

    return (
        <div
            className={`group rounded-xl border transition-all duration-200 ${
                isCompleted
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-gray-200 bg-white hover:border-green-200 hover:shadow-md'
            }`}
        >
            <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                        onClick={toggleComplete}
                        disabled={loading}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                            isCompleted
                                ? 'border-green-600 bg-green-600 text-white'
                                : 'border-gray-300 bg-white hover:border-green-400'
                        } ${loading ? 'opacity-50' : ''}`}
                        aria-label={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                        {loading ? (
                            <svg className="h-4 w-4 animate-spin text-green-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : isCompleted ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span className="sr-only">Pendiente</span>
                        )}
                    </button>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <h4
                                    className={`text-base font-semibold transition-colors ${
                                        isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
                                    }`}
                                >
                                    {task.title}
                                </h4>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        {taskTypeIcon()}
                                        {taskTypeLabel()}
                                    </span>
                                    {task.is_required && (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700">
                                            Obligatoria
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {task.description && (
                            <p className={`mt-2 text-sm leading-relaxed ${isCompleted ? 'text-green-700/70' : 'text-gray-600'}`}>
                                {task.description}
                            </p>
                        )}

                        {/* Resource / Link button */}
                        {(task.task_type === 'resource' || task.task_type === 'link') && task.resource_url && (
                            <a
                                href={task.resource_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {task.task_type === 'resource' ? 'Abrir recurso' : 'Ir al enlace'}
                            </a>
                        )}

                        {/* FAQ hint */}
                        {task.task_type === 'faq' && (
                            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                                <p className="text-sm text-amber-800">
                                    Si tienes alguna duda, no dudes en consultar con tu jefe directo o con RRHH.
                                </p>
                            </div>
                        )}

                        {/* Document link */}
                        {task.task_type === 'document' && task.document && (
                            <a
                                href={task.document.file_path ? `/storage/${task.document.file_path}` : route('documents.show', { document: task.document.slug })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Ver documento: {task.document.title}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StageSection({ stage }) {
    const [expanded, setExpanded] = useState(true);
    const tasks = stage.active_tasks || [];
    const completedCount = tasks.filter((t) => t.pivot?.is_completed).length;
    const totalCount = tasks.length;
    const allCompleted = totalCount > 0 && completedCount === totalCount;

    if (totalCount === 0) return null;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Stage header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
            >
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${allCompleted ? 'bg-green-600' : 'bg-green-100'}`}>
                        {allCompleted ? (
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span className="text-base font-bold text-green-700">{completedCount}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{stage.title}</h3>
                        <p className="text-sm text-gray-500">
                            {completedCount} de {totalCount} {completedCount === 1 ? 'tarea completada' : 'tareas completadas'}
                        </p>
                    </div>
                </div>
                <svg
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Stage description */}
            {expanded && stage.description && (
                <div className="px-5 pb-2">
                    <p className="text-sm text-gray-600 leading-relaxed">{stage.description}</p>
                </div>
            )}

            {/* Tasks */}
            {expanded && (
                <div className="px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Index({ stages, progress }) {
    const user = usePage().props.auth.user;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    const firstName = user.name.split(' ')[0];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Onboarding
                    </h2>
                </div>
            }
        >
            <Head title="Onboarding" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {/* Welcome Hero */}
                    <div className="rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-6 shadow-sm border border-green-100 sm:p-8">
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    {getGreeting()}, {firstName} 👋
                                </h1>
                                <p className="mt-2 text-base text-gray-700 sm:text-lg">
                                    ¡Bienvenido/a al proceso de onboarding! Estamos muy contentos de que te unas al equipo.
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Aquí encontrarás todo lo que necesitas para partir con el pie derecho. Vamos completando cada etapa paso a paso.
                                </p>
                            </div>
                            <ProgressBar progress={progress} />
                        </div>
                    </div>

                    {/* Encouragement message */}
                    {progress.percentage === 0 && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center sm:px-6">
                            <p className="text-sm text-blue-800">
                                ¡Es tu primer día! No te preocupes, ve completando las tareas a tu ritmo. Aquí estamos para ayudarte. 💪
                            </p>
                        </div>
                    )}
                    {progress.percentage > 0 && progress.percentage < 100 && (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center sm:px-6">
                            <p className="text-sm text-green-800">
                                ¡Vas muy bien! Sigue así, ya casi lo tienes. 🎯
                            </p>
                        </div>
                    )}
                    {progress.percentage === 100 && (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center sm:px-6">
                            <p className="text-sm text-green-800">
                                ¡Felicitaciones! Completaste todas las tareas de onboarding. ¡Bienvenido/a oficialmente! 🎉🥳
                            </p>
                        </div>
                    )}

                    {/* Stages */}
                    {stages.length > 0 ? (
                        <div className="space-y-6">
                            {stages
                                .filter((stage) => (stage.active_tasks || []).length > 0)
                                .map((stage) => (
                                    <StageSection key={stage.id} stage={stage} />
                                ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No hay tareas pendientes</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron tareas de onboarding para tu perfil. Consulta con RRHH si crees que es un error.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
