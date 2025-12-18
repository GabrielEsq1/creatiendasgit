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
        <section className="relative overflow-hidden bg-[#0f172a] text-white py-20 lg:py-28 px-4 md:px-8">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* 1. Onboarding Badge (NEW) */}
                <div className="flex justify-center mb-8">
                    <a
                        href="https://meet.brevo.com/gabriel-esquivia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:border-green-500/50 backdrop-blur-md rounded-full px-4 py-2 transition-all hover:bg-white/10"
                    >
                        <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-green-300 group-hover:text-green-200">
                            Agenda tu Onboarding GRATIS
                        </span>
                        <svg className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>

                {/* 2. Main Headline */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                        El <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Shopify de WhatsApp</span>
                        <br />
                        <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-300">para Latinoamérica</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Crea tu tienda en <span className="text-white font-semibold">2 minutos</span>. Recibe pedidos directo en tu WhatsApp.
                        <br className="hidden md:block" />
                        Sin comisiones. Sin tarjeta de crédito. <span className="text-green-400 font-bold">100% Gratis.</span>
                    </p>
                </div>

                {/* 3. CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-16">
                    <Link
                        href="/auth/register"
                        className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-green-500 px-8 font-bold text-white shadow-2xl shadow-green-500/40 transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95 text-lg"
                    >
                        <span className="mr-2 text-2xl">⚡</span> Crear mi tienda YA
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shine" />
                    </Link>

                    <button
                        onClick={() => setShowVideo(true)}
                        className="group inline-flex h-14 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 text-lg"
                    >
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
                            <svg className="h-4 w-4 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        Ver Demo
                    </button>
                </div>

                {/* 4. Comparison Cards (Redesigned) */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {/* The "Others" Card */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm opacity-75 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3 mb-4 text-slate-400">
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">Otras Plataformas</span>
                        </div>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex gap-2"><span className="text-red-400">✖</span> Cobros mensuales ($29 USD+)</li>
                            <li className="flex gap-2"><span className="text-red-400">✖</span> Comisiones por venta</li>
                            <li className="flex gap-2"><span className="text-red-400">✖</span> Configuración compleja</li>
                        </ul>
                    </div>

                    {/* The "Creatiendas" Card */}
                    <div className="relative bg-gradient-to-b from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md transform md:-translate-y-4 shadow-2xl shadow-green-900/20">
                        <div className="absolute top-0 right-0 p-3">
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">RECOMENDADO</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <div className="p-2 bg-green-500 rounded-lg shadow-lg shadow-green-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">Creatiendas</span>
                        </div>
                        <ul className="space-y-4 text-white font-medium">
                            <li className="flex gap-3 items-center">
                                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 text-green-400 text-xs">✓</div>
                                <span>Totalmente <span className="text-green-400 font-bold text-lg">GRATIS</span></span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 text-green-400 text-xs">✓</div>
                                <span>0% Comisiones</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 text-green-400 text-xs">✓</div>
                                <span>Tienda lista en 2 minutos</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 5. Social Proof / Stats */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-12 text-center">
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">+500</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Tiendas Activas</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">100%</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Latinoamericano</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white mb-1">24/7</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest">Soporte Auto</div>
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
