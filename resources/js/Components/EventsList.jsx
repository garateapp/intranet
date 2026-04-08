export default function EventsList({ events, className = '' }) {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No hay eventos próximos.</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.toLocaleDateString('es-CL', { day: 'numeric' }),
            month: date.toLocaleDateString('es-CL', { month: 'short' }).toUpperCase(),
            weekday: date.toLocaleDateString('es-CL', { weekday: 'long' }),
        };
    };

    const getTypeLabel = (type) => {
        const labels = {
            reunion: 'Reunión',
            capacitacion: 'Capacitación',
            celebracion: 'Celebración',
            taller: 'Taller',
            feriado: 'Feriado',
            'team-building': 'Team Building',
            otro: 'Otro',
        };
        return labels[type] || type;
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {events.map((event) => {
                const dateInfo = formatDate(event.event_date);
                return (
                    <div
                        key={event.id}
                        className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
                    >
                        <div
                            className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: event.color || '#038C34' }}
                        >
                            <span className="text-xs font-medium">{dateInfo.month}</span>
                            <span className="text-2xl font-bold">{dateInfo.day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {event.title}
                            </h4>
                            {event.description && (
                                <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                                    {event.description}
                                </p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                {event.type && (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                        {getTypeLabel(event.type)}
                                    </span>
                                )}
                                {event.location && (
                                    <span className="inline-flex items-center">
                                        <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {event.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
