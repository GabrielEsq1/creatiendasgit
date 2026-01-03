import React from 'react';

export default function Features() {
    const features = [
        'Catálogo profesional',
        'Carrito conectado a WhatsApp',
        'Botón directo para pedidos',
        'Diseño moderno',
        'Personalización visual',
        'Dominio o enlace personalizable',
        'Inventario',
        'Estadísticas',
    ];

    return (
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-white" id="features">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-black text-center text-slate-900 mb-16">
                    Características
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feat, idx) => (
                        <li key={idx} className="flex items-center space-x-4 text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-green-500/20 transition-colors">
                            <div className="bg-green-500/10 p-2 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-green-600 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg">{feat}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
