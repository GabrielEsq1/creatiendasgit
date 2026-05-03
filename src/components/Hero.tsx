"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import VideoModal from './VideoModal';
import { useAnalytics } from './Analytics';
import { useSession } from 'next-auth/react';
import { trackLeadCapture } from '@/lib/tracking';

export default function Hero() {
    const { data: session } = useSession();
    const { trackEvent } = useAnalytics();
    const [showVideo, setShowVideo] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch for interactive elements if needed, 
    // though purely visual generic rendering is usually fine.

    return (
        <section className="relative overflow-hidden bg-white pt-8 pb-24 lg:pt-12 lg:pb-32 px-4 md:px-8">
            {/* Minimal Background (Professional subtle glow) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-20" />

            <div className="max-w-7xl mx-auto relative z-10">



                {/* 2. Main Headline */}
                <div className="text-center max-w-5xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-slate-900">
                        Crea una tienda en línea con solo llenar un <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 underline decoration-green-600/30 decoration-8 underline-offset-8">formulario.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        Sin comisiones · Sin tarjeta de crédito · Todo automático. <br className="hidden md:block" />
                        El primer mes corre por nuestra cuenta. Únete a miles de emprendedores hoy.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-24 px-4">
                    <Link
                        href={mounted && session ? "/dashboard" : "/auth/register"}
                        data-cta="primary"
                        onClick={() => {
                            trackEvent('primary_cta_click', { location: 'hero_main' });
                            trackLeadCapture('hero');
                        }}
                        className="group relative inline-flex min-h-[48px] sm:min-h-[56px] md:h-16 w-full sm:w-auto items-center justify-center rounded-xl sm:rounded-2xl bg-green-500 px-6 sm:px-8 md:px-10 font-black text-white shadow-2xl shadow-green-500/30 transition-all hover:bg-green-600 hover:scale-105 active:scale-95 text-base sm:text-lg md:text-xl tracking-tight"
                    >
                        <span>{mounted && session ? "Vuelve a tu Tienda" : "Crea tu Tienda Ahora"}</span>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shine" />
                    </Link>

                    <button
                        onClick={() => setShowVideo(true)}
                        className="group inline-flex min-h-[48px] sm:min-h-[56px] md:h-16 w-full sm:w-auto items-center justify-center rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white px-6 sm:px-8 md:px-10 font-bold text-slate-600 transition-all hover:border-green-500 hover:text-green-600 hover:shadow-lg text-base sm:text-lg md:text-xl"
                    >
                        <div className="mr-2 sm:mr-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 group-hover:bg-green-500/10 group-hover:text-green-600 transition-colors">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        Ver Demo
                    </button>
                </div>


                {/* 4. Comparison Table */}
                <div className="max-w-4xl mx-auto mb-20">
                    {/* Mobile scroll hint */}
                    <div className="text-center mb-2 sm:hidden">
                        <p className="text-xs text-slate-400 font-medium">← Desliza para ver más →</p>
                    </div>

                    {/* Horizontal scroll wrapper for mobile */}
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="px-4 sm:px-0 min-w-max sm:min-w-0">
                            <div className="overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-slate-200 bg-white shadow-xl">
                                <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider">Característica</th>
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Otros</th>
                                            <th className="p-3 sm:p-4 md:p-6 lg:p-8 text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider text-center bg-green-500 sticky right-0 z-20 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)] sm:shadow-none">Creatiendas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-700">Precio mensual</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-rose-500 font-extrabold text-xs sm:text-sm md:text-base">$29+ USD</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-600 font-black bg-green-50 text-xs sm:text-sm md:text-base sticky right-0 z-20 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)] sm:shadow-none">$60.000 COP (1er mes GRATIS)</td>
                                        </tr>
                                        <tr className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-700">Tiempo de setup</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-slate-400 font-semibold text-xs sm:text-sm md:text-base">Horas / Días</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-600 font-black bg-green-50 text-xs sm:text-sm md:text-base sticky right-0 z-20 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)] sm:shadow-none">2 minutos</td>
                                        </tr>
                                        <tr className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 font-bold text-xs sm:text-sm md:text-base text-slate-700">WhatsApp nativo</td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-rose-500 font-bold">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base">
                                                    ❌ Plugins extra
                                                </div>
                                            </td>
                                            <td className="p-3 sm:p-4 md:p-6 lg:p-8 text-center text-green-600 font-black bg-green-50 sticky right-0 z-20 shadow-[-5px_0_10px_-5px_rgba(0,0,0,0.1)] sm:shadow-none">
                                                <div className="flex items-center justify-center gap-1 sm:gap-2 font-black text-xs sm:text-sm md:text-base">
                                                    ✅ Integrado
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
                <div className="flex flex-wrap justify-center gap-16 text-center border-t border-slate-100 pt-12">
                    <div>
                        <div className="text-4xl font-black text-slate-900 mb-1">+2,500</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Tiendas Creadas</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-900 mb-1">2m</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Tiempo de Setup</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-900 mb-1">LATAM</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Hecho para nosotros</div>
                    </div>
                </div>
            </div>

            {/* Video Modal Component */}
            <VideoModal
                isOpen={showVideo}
                onClose={() => setShowVideo(false)}
                videoSrc="https://youtu.be/XQQfQYZ0Phk"
            />
        </section >
    );
}
