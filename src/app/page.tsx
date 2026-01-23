import React, { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Crea tu Tienda Online por WhatsApp Gratis en Minutos",
    description: "La plataforma líder en LATAM para vender por WhatsApp. Crea tu catálogo digital sin comisiones y empieza a recibir pedidos hoy mismo.",
    alternates: {
        canonical: 'https://creatiendas.co',
    },
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
import StickyMobileCTA from '@/components/StickyMobileCTA';
import FAQSchema from '@/components/FAQSchema';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-green-500/30">
            <SoftwareSchema />
            <FAQSchema />
            <LocalBusinessSchema />
            <StickyMobileCTA />
            <main className="flex-1">
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
