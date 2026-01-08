"use client";

// External link to main domain - no next/link import needed
import { Sparkles } from 'lucide-react';

export default function StoreViralFooter() {
    return (
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-12 px-4 mt-16">
            <div className="max-w-4xl mx-auto text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>

                {/* Headline */}
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                    ¿Quieres tu propia tienda online?
                </h2>

                {/* Subheadline */}
                <p className="text-xl text-white/90 mb-8 font-medium">
                    Crea tu tienda GRATIS en 2 minutos y empieza a vender por WhatsApp
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 text-white">
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <span className="text-green-300 font-bold">✓</span>
                        <span className="font-semibold">Sin comisiones</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <span className="text-green-300 font-bold">✓</span>
                        <span className="font-semibold">30 días gratis</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <span className="text-green-300 font-bold">✓</span>
                        <span className="font-semibold">Vende por WhatsApp</span>
                    </div>
                </div>

                {/* CTA Button */}
                <a
                    href="https://creatiendas.co/crear-tienda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-black text-lg shadow-2xl hover:scale-105 transition-transform active:scale-95"
                >
                    Crear Mi Tienda Gratis
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>

                {/* Powered by */}
                <p className="mt-8 text-white/60 text-sm font-medium">
                    Powered by <span className="font-bold text-white">Creatiendas</span>
                </p>
            </div>
        </div>
    );
}
