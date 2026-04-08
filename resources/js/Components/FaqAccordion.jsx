import { useState } from 'react';

export default function FaqAccordion({ items }) {
    const [openIndex, setOpenIndex] = useState(null);

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No hay FAQs disponibles.</p>
            </div>
        );
    }

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {items.map((faq, index) => (
                <div
                    key={faq.id}
                    className="rounded-lg border border-gray-200 bg-white overflow-hidden"
                >
                    <button
                        onClick={() => toggle(index)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-base font-semibold text-gray-900 pr-4">
                            {faq.question}
                        </span>
                        <svg
                            className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                                openIndex === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {openIndex === index && (
                        <div className="px-5 pb-4 text-sm text-gray-700 border-t border-gray-100 pt-4">
                            <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
