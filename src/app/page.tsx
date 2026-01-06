"use client";

import React, { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Crea tu Tienda Online por WhatsApp Gratis en Minutos",
    description: "La plataforma líder en LATAM para vender por WhatsApp. Crea tu catálogo digital sin comisiones y empieza a recibir pedidos hoy mismo.",
};

export const dynamic = 'force-dynamic';

import Hero from '@/components/Hero';
import WhatIs from '@/components/WhatIs';
import Benefits from '@/components/Benefits';
import HowItWorks from '@/components/HowItWorks';
import LiveDemo from '@/components/LiveDemo';
import Features from '@/components/Features';
import BlogSection from '@/components/BlogSection';
import Testimonials from '@/components/Testimonials';
import HubPromoBanner from '@/components/HubPromoBanner';
import FinalCTA from '@/components/FinalCTA';

import SoftwareSchema from '@/components/SoftwareSchema';

import { SocialProofSection } from '@/components/SocialProofSection';
import { useSearchParams } from 'next/navigation';
import StoreQRCode from '@/components/StoreQRCode';

function SuccessBanner() {
    const searchParams = useSearchParams();
    const isReady = searchParams.get('store_ready');
    const slug = searchParams.get('slug');

    if (!isReady || !slug) return null;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const storeUrl = `${origin}/stores/${encodeURIComponent(slug)}`;

    return (
        <div className="bg-green-50 border-b border-green-100 py-12 px-4 shadow-inner">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full mb-6 shadow-xl shadow-green-500/20 animate-bounce">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4">¡Tu tienda está lista!</h2>
                <p className="text-xl text-slate-600 mb-8">Ya puedes empezar a recibir pedidos por WhatsApp.</p>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-green-100 mb-8 max-w-xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enlace de tu tienda:</label>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={storeUrl}
                                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(storeUrl);
                                        alert('¡Copiado!');
                                    }}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black hover:bg-slate-800 transition-colors"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Código QR para compartir:</p>
                            <div className="flex justify-center">
                                <StoreQRCode url={storeUrl} size={180} />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            <a
                                href={storeUrl}
                                target="_blank"
                                className="text-green-600 font-bold hover:underline"
                            >
                                👁️ Visitar tienda →
                            </a>
                            <button
                                onClick={() => {
                                    const text = `¡Hola! Mira mi nueva tienda online: ${storeUrl}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="text-slate-900 font-bold hover:underline"
                            >
                                📱 Compartir por WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                    Ir a mi panel de administración →
                </button>
            </div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-green-500/30">
            <SoftwareSchema />
            <main className="flex-1">
                <Suspense fallback={null}>
                    <SuccessBanner />
                </Suspense>
                <Hero />
                <WhatIs />

                {/* VALIDATION: Real metrics (Psychological Step 3) */}
                <div className="py-8 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <SocialProofSection />
                    </div>
                </div>

                <div id="demo">
                    <LiveDemo />
                </div>
                <HowItWorks />
                <Features />

                {/* RISK REVERSAL: Why it's safe (Psychological Step 5) */}
                <Benefits />

                <BlogSection />
                <Testimonials />
                <HubPromoBanner />
                <FinalCTA />
            </main>
            <footer className="bg-slate-900 p-12 text-center border-t border-slate-800">
                <p className="text-slate-500 font-medium">
                    © {new Date().getFullYear()} Creatiendas. Hecho con ❤️ en LATAM
                </p>
            </footer>
        </div>
    );
}
