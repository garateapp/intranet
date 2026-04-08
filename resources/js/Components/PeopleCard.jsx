export default function PeopleCard({ person }) {
    const getInitials = (name) => {
        return name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="portal-card-accent rounded-xl p-5 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-lg font-bold">
                    {person.avatar ? (
                        <img
                            src={person.avatar}
                            alt={person.name}
                            className="h-16 w-16 rounded-full object-cover"
                        />
                    ) : (
                        getInitials(person.name)
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                        {person.name}
                    </h3>
                    {person.position && (
                        <p className="mt-1 text-sm font-medium text-gray-700">
                            {person.position}
                        </p>
                    )}
                    {person.department && (
                        <p className="mt-1 text-sm text-gray-600">
                            {person.department}
                        </p>
                    )}
                    {person.email && (
                        <a
                            href={`mailto:${person.email}`}
                            className="mt-2 inline-flex items-center text-xs text-green-600 hover:text-green-700"
                        >
                            <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {person.email}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
