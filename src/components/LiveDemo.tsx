"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAnalytics } from '@/components/Analytics';

const demoSteps = [
    // ... items (keep existing)
    {
        id: 1,
        title: "1. Regístrate en segundos",
        description: "Crea tu cuenta gratis con solo tu email. Sin tarjeta de crédito, sin compromisos.",
        image: "/tutorial/2_register.png",
        highlight: "⚡ Solo 30 segundos"
    },
    {
        id: 2,
        title: "2. Inicia sesión",
        description: "Accede a tu panel de control con el branding de Creatiendas - simple y profesional.",
        image: "/tutorial/3_login.png",
        highlight: "🔐 Acceso seguro"
    },
    {
        id: 3,
        title: "3. Construye tu tienda",
        description: "Usa nuestro constructor visual. Agrega nombre, descripción, WhatsApp, productos e imágenes.",
        image: "/tutorial/4_builder.png",
        highlight: "🛠️ Constructor drag & drop"
    },
    {
        id: 4,
        title: "4. Administra tus tiendas",
        description: "Ve todas tus tiendas en un solo lugar. Edita, actualiza y gestiona desde tu dashboard.",
        image: "/tutorial/5_dashboard.png",
        highlight: "📊 Panel de control"
    },
    {
        id: 5,
        title: "5. ¡Tu tienda está lista!",
        description: "Comparte el link con tus clientes. Recibe pedidos directo a tu WhatsApp.",
        image: "/tutorial/6_store.png",
        highlight: "🚀 ¡En vivo en 2 minutos!"
    }
];

export default function LiveDemo() {
    const [activeStep, setActiveStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        // Track step view on change
        trackEvent('demo_step_view', {
            step_id: demoSteps[activeStep].id,
            step_title: demoSteps[activeStep].title,
            mode: isAutoPlaying ? 'autoplay' : 'manual'
        });
    }, [activeStep]); // Track when step changes

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % demoSteps.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const handleManualStepValues = (idx: number) => {
        setActiveStep(idx);
        setIsAutoPlaying(false);
        trackEvent('demo_interaction', { type: 'manual_nav_click', step_target: idx + 1 });
    };

    return (
        <section id="demo" className="py-24 px-4 md:px-8 lg:px-16 bg-black">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-green-100 text-green-700 text-[10px] font-black px-4 py-1 rounded-full mb-4 uppercase tracking-[0.2em] border border-green-200">
                        🎬 DEMO RÁPIDA
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Mira cómo funciona la <span className="text-green-500">magia</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                        Desde el registro hasta tu tienda en vivo. Sin configuraciones complejas, sin código.
                    </p>
                </div>

                {/* Demo Container */}
                <div className="bg-zinc-900 rounded-[2.5rem] p-4 md:p-10 border border-zinc-800 shadow-2xl shadow-green-900/10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Steps Navigation */}
                        <div className="lg:col-span-1 space-y-4">
                            {demoSteps.map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => handleManualStepValues(idx)}
                                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${activeStep === idx
                                        ? 'bg-green-500 text-white shadow-xl shadow-green-900/20 translate-x-2'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${activeStep === idx ? 'bg-white/20' : 'bg-zinc-700'
                                            }`}>
                                            {step.id}
                                        </span>
                                        <div>
                                            <div className="font-black text-sm uppercase tracking-tight">{step.title.split('. ')[1]}</div>
                                            <div className={`text-xs font-bold ${activeStep === idx ? 'text-green-100' : 'text-gray-500'}`}>
                                                {step.highlight}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {/* Auto-play toggle */}
                            <div className="pt-6 flex items-center justify-center lg:justify-start gap-3 border-t border-gray-100 mt-4">
                                <button
                                    onClick={() => {
                                        setIsAutoPlaying(!isAutoPlaying);
                                        trackEvent('demo_interaction', { type: 'autoplay_toggle', state: !isAutoPlaying ? 'on' : 'off' });
                                    }}
                                    className={`w-12 h-7 rounded-full transition-all ${isAutoPlaying ? 'bg-green-500' : 'bg-zinc-700'
                                        } relative shadow-inner`}
                                >
                                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${isAutoPlaying ? 'left-6' : 'left-1'
                                        }`} />
                                </button>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Reproducción automática</span>
                            </div>
                        </div>

                        {/* Screenshot Display */}
                        <div className="lg:col-span-2">
                            <div className="relative group overflow-hidden rounded-[2rem] border-4 border-gray-800 shadow-2xl">
                                {/* Browser Frame Header */}
                                <div className="bg-gray-800 p-4 flex items-center gap-2">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 bg-gray-700/50 rounded-lg px-4 py-1.5 text-gray-400 text-[10px] font-mono text-center mx-4">
                                        https://creatiendas.com/mi-tienda
                                    </div>
                                </div>

                                {/* Screenshot with stretch to fill */}
                                <div className="bg-white h-[450px] md:h-[550px] relative overflow-hidden">
                                    <Image
                                        src={demoSteps[activeStep].image}
                                        alt={`Demostración de Creatiendas: ${demoSteps[activeStep].title}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-w-7xl) 100vw, 800px"
                                    />

                                    {/* Info Overlay (Over image as requested) */}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 md:p-8">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <div className="bg-green-500 text-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl shrink-0">
                                                <span className="text-lg md:text-xl font-bold">{demoSteps[activeStep].highlight.split(' ')[0]}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white text-lg md:text-xl font-black mb-1">{demoSteps[activeStep].title}</h3>
                                                <p className="text-gray-200 font-medium text-xs md:text-sm leading-relaxed max-w-lg">
                                                    {demoSteps[activeStep].description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Dots */}
                            <div className="mt-8 flex justify-center gap-3">
                                {demoSteps.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setActiveStep(idx); setIsAutoPlaying(false); }}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === activeStep
                                            ? 'w-10 bg-green-500'
                                            : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA after demo */}
                <div className="text-center mt-16 animate-bounce">
                    <Link
                        href="/auth/register"
                        onClick={() => trackEvent('demo_cta_click', { location: 'live_demo_footer' })}
                        className="inline-flex items-center gap-3 bg-green-500 text-black font-black px-10 py-5 rounded-2xl hover:bg-green-400 transition-all shadow-2xl hover:-translate-y-1 uppercase tracking-widest text-sm"
                    >
                        Comienza ahora gratis
                        <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
