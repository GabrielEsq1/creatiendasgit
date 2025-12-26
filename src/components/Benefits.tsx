import React from 'react';

export default function Benefits() {
    const items = [
        { title: 'Fácil y rápido', icon: '⚡', description: 'Crea y lanza tu tienda en minutos.' },
        { title: 'Todo por WhatsApp', icon: '📲', description: 'Gestiona pedidos directamente desde WhatsApp.' },
        { title: 'Personaliza tu marca', icon: '🎨', description: 'Colores, logo y dominio propio.' },
        { title: 'Sin comisiones', icon: '💰', description: 'Todo el ingreso es 100% tuyo.' },
        { title: 'Compatible con cualquier dispositivo', icon: '📱', description: 'Responsive y móvil‑first.' },
        { title: 'Administra tus productos fácilmente', icon: '🗂️', description: 'Panel simple para agregar y editar productos.' },
    ];

    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-black border-y border-white/5">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-black text-center text-white mb-12">
                    Beneficios Navideños 🎁
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center hover:border-green-500/30 transition-all hover:-translate-y-1 shadow-2xl shadow-black/50"
                        >
                            <div className="text-5xl mb-6 bg-slate-800 w-20 h-20 flex items-center justify-center rounded-2xl shadow-inner">{item.icon}</div>
                            <h4 className="text-xl font-bold text-white mb-3">
                                {item.title}
                            </h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
