"use client";

import React, { useState, useEffect } from 'react';

const demoSteps = [
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

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % demoSteps.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    return (
        <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                        🎬 DEMO EN VIVO
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Mira lo fácil que es crear tu tienda
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        De cero a tienda funcionando en menos de 2 minutos. Sin complicaciones, sin código, sin conocimientos técnicos.
                    </p>
                </div>

                {/* Demo Container */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Steps Navigation */}
                        <div className="lg:col-span-1 space-y-3">
                            {demoSteps.map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => {
                                        setActiveStep(idx);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${activeStep === idx
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep === idx ? 'bg-white/20' : 'bg-white/10'
                                            }`}>
                                            {step.id}
                                        </span>
                                        <div>
                                            <div className="font-semibold text-sm">{step.title}</div>
                                            <div className={`text-xs ${activeStep === idx ? 'text-green-100' : 'text-gray-500'}`}>
                                                {step.highlight}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {/* Auto-play toggle */}
                            <div className="pt-4 flex items-center gap-2 text-gray-400 text-sm">
                                <button
                                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                    className={`w-10 h-6 rounded-full transition-all ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-600'
                                        } relative`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoPlaying ? 'left-5' : 'left-1'
                                        }`} />
                                </button>
                                <span>Reproducción automática</span>
                            </div>
                        </div>

                        {/* Screenshot Display */}
                        <div className="lg:col-span-2">
                            <div className="relative">
                                {/* Browser Frame */}
                                <div className="bg-gray-800 rounded-t-xl p-3 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="flex-1 bg-gray-700 rounded-md px-3 py-1 text-gray-400 text-xs text-center">
                                        creatiendas.com
                                    </div>
                                </div>

                                {/* Screenshot */}
                                <div className="bg-gray-900 rounded-b-xl overflow-hidden">
                                    <img
                                        src={demoSteps[activeStep].image}
                                        alt={demoSteps[activeStep].title}
                                        className="w-full h-auto transition-opacity duration-500"
                                        style={{ minHeight: '300px', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Step Info Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{demoSteps[activeStep].highlight.split(' ')[0]}</span>
                                        <div>
                                            <h3 className="text-white font-semibold">{demoSteps[activeStep].title}</h3>
                                            <p className="text-gray-300 text-sm">{demoSteps[activeStep].description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4 flex gap-1">
                                {demoSteps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx === activeStep
                                                ? 'bg-green-500'
                                                : idx < activeStep
                                                    ? 'bg-green-500/50'
                                                    : 'bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA after demo */}
                <div className="text-center mt-10">
                    <p className="text-gray-400 mb-4">¿Listo para crear tu propia tienda?</p>
                    <a
                        href="/auth/register"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                    >
                        Crear mi tienda gratis
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
