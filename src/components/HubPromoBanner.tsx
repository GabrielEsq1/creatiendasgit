'use client';

import React from 'react';
import { MessageSquare, ShoppingBag, ArrowRight } from 'lucide-react';

export default function HubPromoBanner() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-slate-50 border-y border-slate-100">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        🚀 Descubre el Hub Total
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                        Potencia tu negocio con nuestro ecosistema completo
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Dos herramientas poderosas, una sola misión: hacer crecer tu negocio
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {/* B2BChat Card */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-blue-500/30 transition-all hover:-translate-y-1 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <MessageSquare className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mb-1">
                                    B2B
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">B2BChat</h3>
                                <p className="text-slate-600 text-sm">Tu motor de conversaciones B2B</p>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Genera conversaciones calificadas entre empresas reales</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Elimina correos perdidos, LinkedIn frío y WhatsApp informal</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Conecta con decisores verificados</span>
                            </li>
                        </ul>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                EMPRESAS VERIFICADAS
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                CONVERSACIONES REALES
                            </span>
                        </div>
                    </div>

                    {/* CreaTiendas Card */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-green-500/30 transition-all hover:-translate-y-1 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-green-50 p-4 rounded-2xl">
                                <ShoppingBag className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <div className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mb-1">
                                    B2C
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">CreaTiendas</h3>
                                <p className="text-slate-600 text-sm">Convierte conversaciones en ventas</p>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Transforma chats en pedidos reales</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Tienda online conectada a WhatsApp</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-600 font-bold">✓</span>
                                <span className="text-slate-700 text-sm">Sin comisiones · Sin fricción · Activación inmediata</span>
                            </li>
                        </ul>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                VENTAS DIRECTAS
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                                EJECUCIÓN INMEDIATA
                            </span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <a
                        href="https://b2-chat-ruddy.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#22c55e] text-white font-bold px-8 py-4 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Visitar Hub Total
                        <ArrowRight className="w-5 h-5" />
                    </a>
                    <p className="text-slate-500 text-sm mt-4">
                        Más de 1,000 empresas activas · Conversaciones con intención real
                    </p>
                </div>
            </div>
        </section>
    );
}
