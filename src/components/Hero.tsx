"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import VideoModal from './VideoModal';

export default function Hero() {
    const [showVideo, setShowVideo] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch for interactive elements if needed, 
    // though purely visual generic rendering is usually fine.

    return (
        <section className="relative overflow-hidden bg-black pt-8 pb-24 lg:pt-12 lg:pb-32 px-4 md:px-8">
            {/* Minimal Background (No glows for total black feel) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/2 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* 1. Onboarding Button */}
                <div className="flex justify-center mb-10">
                    <a
                        href="https://meet.brevo.com/gabriel-esquivia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-4 bg-[#FFD700] border-2 border-amber-500/30 hover:border-amber-600 rounded-2xl px-6 py-3 transition-all hover:shadow-2xl hover:shadow-amber-500/30 hover:-translate-y-1"
                    >
                        <div className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-black text-amber-900 tracking-widest leading-none mb-1">Cupos Limitados</p>
                            <p className="text-sm font-black text-amber-900">Agenda tu Onboarding GRATIS</p>
                        </div>
                        <div className="bg-amber-900/10 p-2 rounded-xl text-amber-900 group-hover:bg-amber-900/20 transition-colors">
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                    </a>
                </div>

                {/* 2. Main Headline */}
                <div className="text-center max-w-5xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-white">
                        El <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Shopify</span>
                        <br />
                        <span className="text-white">de <span className="text-green-500 underline decoration-green-500/30 decoration-8 underline-offset-8">WhatsApp</span> 🎄</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        Crea tu propia tienda online en <span className="text-white font-bold">2 minutos ❄️</span>.
                        Tus clientes te piden por WhatsApp sin fricción. <br className="hidden md:block" />
                        <span className="text-green-400 font-extrabold bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg">🎁 0% COMISIONES. 100% GRATIS.</span>
                    </p>
                </div>

                {/* 3. CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-24 px-4">
                    <Link
                        href="/auth/register"
                        className="group relative inline-flex min-h-[48px] sm:min-h-[56px] md:h-16 w-full sm:w-auto items-center justify-center rounded-xl sm:rounded-2xl bg-green-500 px-6 sm:px-8 md:px-10 font-black text-white shadow-2xl shadow-green-500/30 transition-all hover:bg-green-600 hover:scale-105 active:scale-95 text-base sm:text-lg md:text-xl tracking-tight"
                    >
                        <span>🚀 Crear mi tienda YA</span>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shine" />
                    </Link>

                    <button
                        onClick={() => setShowVideo(true)}
                        className="group inline-flex min-h-[48px] sm:min-h-[56px] md:h-16 w-full sm:w-auto items-center justify-center rounded-xl sm:rounded-2xl border-2 border-slate-800 bg-slate-900 px-6 sm:px-8 md:px-10 font-bold text-slate-300 transition-all hover:border-green-500 hover:text-green-400 hover:shadow-lg text-base sm:text-lg md:text-xl"
                    >
                        <div className="mr-2 sm:mr-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-800 group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        Ver Demo ✨
                    </button>
                </div>

                {/* 4. Comparison Table (RESTORED) */}
                <div className="max-w-4xl mx-auto mb-20">
                    {/* Mobile scroll hint */}
                    <div className="text-center mb-2 sm:hidden">
                        <p className="text-xs text-gray-400 font-medium">← Desliza para ver más →</p>
                    </div>

                    {/* Horizontal scroll wrapper for mobile */}
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="px-4 sm:px-0 min-w-max sm:min-w-0">
                            <div className="overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-slate-800 bg-slate-900 shadow-2xl shadow-green-900/20">
                                <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
                                    <thead>
                                        <tr className="bg-slate-950/50">
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider">Característica</th>
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Otros</th>
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider text-center bg-[#22c55e]">Creatiendas 🎁</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        <tr className="group hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-300">Precio mensual</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-rose-500 font-extrabold text-xs sm:text-sm md:text-base">$29+ USD</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-400 font-black bg-green-500/5 text-xs sm:text-sm md:text-base">¡GRATIS! 🎅</td>
                                        </tr>
                                        <tr className="group hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-300">Tiempo de setup</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-slate-500 font-semibold text-xs sm:text-sm md:text-base">Horas / Días</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-400 font-black bg-green-500/5 text-xs sm:text-sm md:text-base">2 minutos ⚡</td>
                                        </tr>
                                        <tr className="group hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-300">WhatsApp nativo</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-rose-500 font-bold">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                                                    <span className="text-base sm:text-lg">❌</span> Plugins extra
                                                </div>
                                            </td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-400 font-black bg-green-500/5">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2 font-black text-xs sm:text-sm md:text-base">
                                                    <span className="text-lg sm:text-xl">✅</span> Integrado ❄️
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Minimal Social Proof */}
                <div className="flex flex-wrap justify-center gap-16 text-center border-t border-slate-800 pt-12">
                    <div>
                        <div className="text-4xl font-black text-white mb-1">+2,500</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Tiendas Creadas ✨</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-1">2m</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Tiempo de Setup ⚡</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white mb-1">LATAM</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Hecho para nosotros 🎁</div>
                    </div>
                </div>
            </div>

            {/* Video Modal Component */}
            <VideoModal
                isOpen={showVideo}
                onClose={() => setShowVideo(false)}
                videoSrc="https://youtu.be/XQQfQYZ0Phk"
            />
        </section>
    );
}
