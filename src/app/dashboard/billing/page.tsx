"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PricingCards from "@/components/PricingCards";

export default function BillingPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-green-500/30">
            {/* Header / Sub Nav */}
            <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pago Seguro vía WhatsApp</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                        Actualiza tu Plan
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Elige el plan ideal para tu{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            crecimiento
                        </span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Escala tu negocio de WhatsApp con herramientas potentes y soporte dedicado.
                    </p>
                </div>

                {/* Pricing Grid */}
                <PricingCards lang="es" />

                {/* Info Card */}
                <div className="mt-20 bg-white rounded-[3rem] p-10 sm:p-16 shadow-xl border border-slate-100 max-w-5xl mx-auto relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-green-500/10 transition-all"></div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                Transparencia <span className="text-green-600">Total</span>
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                No cobramos comisiones por tus ventas. Todo el dinero que recibas por tus tiendas es 100% tuyo. Nuestro modelo es simple: pagas por la herramienta, no por tu éxito.
                            </p>
                        </div>
                        
                        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                                💬
                            </div>
                            <h3 className="text-xl font-black text-slate-900">¿Necesitas ayuda?</h3>
                            <p className="text-sm text-slate-500 font-medium">Estamos en WhatsApp para guiarte en la configuración o resolver tus dudas antes de pagar.</p>
                            <a 
                                href="https://wa.me/573026687991" 
                                target="_blank"
                                className="inline-flex items-center gap-2 text-green-600 font-black hover:underline"
                            >
                                Hablar con un asesor <ArrowLeft className="w-4 h-4 rotate-180" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
