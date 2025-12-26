import React from 'react';

export default function WhatIs() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-black">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 1 */}
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-10 flex flex-col justify-center hover:border-green-500/30 transition-all">
                    <h2 className="text-2xl font-black text-white mb-4">
                        ¿Qué es Creatiendas? 🎁
                    </h2>
                    <p className="text-slate-400 leading-relaxed font-medium">
                        Creatiendas permite crear una tienda online en minutos, sin
                        complicaciones y sin comisiones. Todo lo que necesitas para vender
                        tus productos directamente por WhatsApp. ✨
                    </p>
                </div>
                {/* Card 2 */}
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-10 flex flex-col justify-center hover:border-green-500/30 transition-all">
                    <h2 className="text-2xl font-black text-white mb-4">
                        Personas ideales 🎅
                    </h2>
                    <ul className="grid grid-cols-2 gap-2 text-slate-400 font-bold">
                        <li className="flex items-center gap-2"><span>❄️</span> Emprendedores</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Tiendas</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Marcas</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Negocios</li>
                        <li className="flex items-center gap-2"><span>❄️</span> Dropshipping</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
