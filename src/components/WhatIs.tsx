import React from 'react';

export default function WhatIs() {
    return (
        <section className="py-24 px-4 md:px-8 lg:px-16 bg-white overflow-hidden relative">
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px] -translate-x-1/2 opacity-30" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-slate-900">
                        ¿Qué es Creatiendas? <br />
                        <span className="text-green-600">Tu aliado de crecimiento.</span>
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                        Creatiendas es la plataforma líder en LATAM para emprendedores que buscan simplicidad.
                        Convierte tu catálogo en una máquina de ventas por WhatsApp sin configuraciones técnicas tediosas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                        <div className="flex items-center gap-4 text-slate-800 font-bold bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-2xl">✅</span> 0% Comisiones
                        </div>
                        <div className="flex items-center gap-4 text-slate-800 font-bold bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-2xl">⏱️</span> Setup Instantáneo
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-10 shadow-lg">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">
                        Personas ideales
                    </h2>
                    <ul className="grid grid-cols-2 gap-2 text-slate-600 font-bold">
                        <li className="flex items-center gap-2">Emprendedores</li>
                        <li className="flex items-center gap-2">Tiendas</li>
                        <li className="flex items-center gap-2">Marcas</li>
                        <li className="flex items-center gap-2">Negocios</li>
                        <li className="flex items-center gap-2">Dropshipping</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
