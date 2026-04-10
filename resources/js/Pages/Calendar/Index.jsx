import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

function getEventColor(type) {
    const colors = {
        'meeting': { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
        'holiday': { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
        'deadline': { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
        'celebration': { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
        'training': { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
        'default': { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    };
    return colors[type] || colors['default'];
}

function getDayNames(locale = 'es') {
    return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
}

function getMonthNames(locale = 'es') {
    return [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0, Sunday = 6
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function isToday(date) {
    return isSameDay(date, new Date());
}

export default function Index({ events }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', 'day'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState([]);

    const eventsList = events.data || [];

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthNames = getMonthNames();
    const dayNames = getDayNames();

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

        const days = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            days.push({
                date: new Date(currentYear, currentMonth - 1, day),
                isCurrentMonth: false,
                isPrevMonth: true,
                events: []
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dayEvents = eventsList.filter(event => {
                const eventDate = new Date(event.event_date);
                return isSameDay(eventDate, date);
            });

            days.push({
                date,
                isCurrentMonth: true,
                isPrevMonth: false,
                events: dayEvents
            });
        }

        // Next month days to fill the grid
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(currentYear, currentMonth + 1, day);
            const dayEvents = eventsList.filter(event => {
                const eventDate = new Date(event.event_date);
                return isSameDay(eventDate, date);
            });

            days.push({
                date,
                isCurrentMonth: false,
                isPrevMonth: false,
                events: dayEvents
            });
        }

        return days;
    }, [currentYear, currentMonth, eventsList]);

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setSelectedDate(newDate);
        setCurrentDate(newDate);
    };

    const navigateDay = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + direction);
        setSelectedDate(newDate);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const handleDayClick = (day) => {
        setSelectedDate(day.date);
        setCurrentDate(day.date);
        if (day.events.length > 0) {
            setSelectedEvents(day.events);
            setShowEventModal(true);
        }
    };

    const getWeekDays = () => {
        const startOfWeek = new Date(selectedDate);
        const day = startOfWeek.getDay();
        const diff = day === 0 ? 6 : day - 1; // Adjust to Monday
        startOfWeek.setDate(startOfWeek.getDate() - diff);

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            const dayEvents = eventsList.filter(event => {
                const eventDate = new Date(event.event_date);
                return isSameDay(eventDate, date);
            });
            weekDays.push({ date, events: dayEvents });
        }
        return weekDays;
    };

    const getDayEvents = () => {
        return eventsList.filter(event => {
            const eventDate = new Date(event.event_date);
            return isSameDay(eventDate, selectedDate);
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Calendario
                    </h2>
                </div>
            }
        >
            <Head title="Calendario Corporativo" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Calendar Header */}
                    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {monthNames[currentMonth]} {currentYear}
                                </h1>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => view === 'month' ? navigateMonth(-1) : view === 'week' ? navigateWeek(-1) : navigateDay(-1)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={goToToday}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Hoy
                                    </button>
                                    <button
                                        onClick={() => view === 'month' ? navigateMonth(1) : view === 'week' ? navigateWeek(1) : navigateDay(1)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* View Switcher */}
                            <div className="flex items-center gap-2">
                                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                                    {['month', 'week', 'day'].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => setView(v)}
                                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                                view === v
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Día'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month View */}
                    {view === 'month' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                                {dayNames.map((day) => (
                                    <div key={day} className="py-3 text-center text-sm font-semibold text-gray-700">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7">
                                {calendarDays.map((day, index) => {
                                    const today = isToday(day.date);
                                    const isSelected = isSameDay(day.date, selectedDate);
                                    const colorClasses = day.events.length > 0 ? getEventColor(day.events[0].type) : null;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleDayClick(day)}
                                            className={`min-h-[100px] p-2 border-b border-r border-gray-200 cursor-pointer transition-colors ${
                                                day.isCurrentMonth
                                                    ? 'bg-white hover:bg-gray-50'
                                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-400'
                                            } ${isSelected ? 'ring-2 ring-inset ring-green-500' : ''}`}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                                    today
                                                        ? 'bg-green-500 text-white'
                                                        : isSelected
                                                        ? 'text-green-600 font-bold'
                                                        : ''
                                                }`}>
                                                    {day.date.getDate()}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                {day.events.slice(0, 3).map((event, idx) => {
                                                    const eventColor = getEventColor(event.type);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`px-2 py-1 text-xs font-medium rounded truncate ${eventColor.light} ${eventColor.text} border ${eventColor.border}`}
                                                            title={event.title}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    );
                                                })}
                                                {day.events.length > 3 && (
                                                    <div className="text-xs text-gray-500 pl-2">
                                                        +{day.events.length - 3} más
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Week View */}
                    {view === 'week' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-7">
                                {getWeekDays().map((day, index) => {
                                    const today = isToday(day.date);
                                    const isSelected = isSameDay(day.date, selectedDate);

                                    return (
                                        <div
                                            key={index}
                                            className={`border-r border-gray-200 p-3 cursor-pointer transition-colors min-h-[400px] ${
                                                today ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                                            } ${isSelected ? 'ring-2 ring-inset ring-green-500' : ''}`}
                                            onClick={() => {
                                                setSelectedDate(day.date);
                                                if (day.events.length > 0) {
                                                    setSelectedEvents(day.events);
                                                    setShowEventModal(true);
                                                }
                                            }}
                                        >
                                            <div className="text-center mb-3">
                                                <div className={`text-sm font-semibold mb-1 ${
                                                    today ? 'text-green-600' : 'text-gray-700'
                                                }`}>
                                                    {dayNames[day.date.getDay() === 0 ? 6 : day.date.getDay() - 1]}
                                                </div>
                                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
                                                    today ? 'bg-green-500 text-white' : ''
                                                }`}>
                                                    {day.date.getDate()}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {day.events.map((event, idx) => {
                                                    const eventColor = getEventColor(event.type);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`p-2 rounded-lg border-l-4 ${eventColor.bg} ${eventColor.light} ${eventColor.border}`}
                                                        >
                                                            <div className={`text-xs font-semibold ${eventColor.text}`}>
                                                                {event.title}
                                                            </div>
                                                            {event.location && (
                                                                <div className="text-xs text-gray-600 mt-1">
                                                                    {event.location}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Day View */}
                    {view === 'day' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {selectedDate.toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </h2>
                            </div>

                            <div className="p-6">
                                {getDayEvents().length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-lg font-medium">No hay eventos para este día</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {getDayEvents().map((event, idx) => {
                                            const eventColor = getEventColor(event.type);
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-4 rounded-lg border-l-4 ${eventColor.border} ${eventColor.light}`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h3 className={`text-lg font-bold ${eventColor.text}`}>
                                                                {event.title}
                                                            </h3>
                                                            {event.description && (
                                                                <p className="mt-2 text-sm text-gray-700">
                                                                    {event.description}
                                                                </p>
                                                            )}
                                                            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                                                                {event.location && (
                                                                    <div className="flex items-center gap-1">
                                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                        {event.location}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1">
                                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    {new Date(event.event_date).toLocaleTimeString('es-ES', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${eventColor.bg} text-white`}>
                                                            {event.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Event Modal */}
                    {showEventModal && selectedEvents.length > 0 && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                            onClick={() => setShowEventModal(false)}
                        >
                            <div
                                className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Eventos del {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                        </h3>
                                        <button
                                            onClick={() => setShowEventModal(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {selectedEvents.map((event, idx) => {
                                        const eventColor = getEventColor(event.type);
                                        return (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-lg border-l-4 ${eventColor.border} ${eventColor.light}`}
                                            >
                                                <h4 className={`font-bold ${eventColor.text} mb-2`}>
                                                    {event.title}
                                                </h4>
                                                {event.description && (
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        {event.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                                    {event.location && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {event.location}
                                                        </span>
                                                    )}
                                                    <span>
                                                        {new Date(event.event_date).toLocaleTimeString('es-ES', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
