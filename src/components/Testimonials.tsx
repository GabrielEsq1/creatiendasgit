import React from 'react';

export default function Testimonials() {
    const testimonials = [
        {
            name: 'Andrea',
            quote: 'Creatiendas me permitió lanzar mi tienda en minutos y ya tengo pedidos todos los días. ¡Es increíble!'
        },
        {
            name: 'Jhon',
            quote: 'La integración con WhatsApp simplifica la comunicación con mis clientes. No hay comisiones y todo es mío.'
        }
    ];

    return (
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-slate-50 border-t border-slate-100">
            <div className="max-w-5xl mx-auto">
                <h3 className="text-4xl font-black text-center text-slate-900 mb-16">
                    Testimonios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col justify-between shadow-xl shadow-slate-200 hover:border-green-500/30 transition-all"
                        >
                            <p className="text-slate-600 italic mb-6 text-lg leading-relaxed">" {t.quote} "</p>
                            <p className="text-green-600 font-black text-right text-base uppercase tracking-widest">- {t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
