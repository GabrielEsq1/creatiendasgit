import React from 'react';

export default function TestimonialsEN() {
    const testimonials = [
        {
            name: 'Andrea',
            quote: 'Creatiendas allowed me to launch my store in minutes and I already have orders every day. It\'s incredible!'
        },
        {
            name: 'Jhon',
            quote: 'The WhatsApp integration simplifies communication with my customers. No commissions and everything is mine.'
        }
    ];

    return (
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-black border-t border-white/5">
            <div className="max-w-5xl mx-auto">
                <h3 className="text-4xl font-black text-center text-white mb-16">
                    Testimonials 🎁
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-900/80 border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between shadow-2xl shadow-black hover:border-green-500/30 transition-all"
                        >
                            <p className="text-slate-300 italic mb-6 text-lg leading-relaxed">" {t.quote} " ❄️</p>
                            <p className="text-green-400 font-black text-right text-base uppercase tracking-widest">- {t.name} 🎅</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
