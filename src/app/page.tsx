import React from 'react';
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
import FinalCTA from '@/components/FinalCTA';

import FestiveManager from '@/components/FestiveManager';
import SoftwareSchema from '@/components/SoftwareSchema';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-green-500/30">
            <SoftwareSchema />
            <FestiveManager />
            <main className="flex-1">
                <Hero />
                <WhatIs />
                <Benefits />
                <HowItWorks />
                <div id="demo">
                    <LiveDemo />
                </div>
                <Features />
                <BlogSection />
                <Testimonials />
                <FinalCTA />
            </main>
            <footer className="bg-slate-900 p-12 text-center border-t border-slate-800">
                <div className="flex justify-center gap-4 mb-4 text-2xl">
                    <span>🎄</span><span>❄️</span><span>🎁</span><span>✨</span>
                </div>
                <p className="text-slate-500 font-medium">
                    © {new Date().getFullYear()} Creatiendas. Hecho con ❤️ en LATAM 🎅
                </p>
            </footer>
        </div>
    );
}
