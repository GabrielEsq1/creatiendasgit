"use client";

import { Check, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
    const plans = [
        {
            id: "emprendedor",
            name: "Emprendedor",
            price: "$60.000",
            description: "Para pequeños negocios que están empezando.",
            duration: "Mes",
            features: [
                "1 Tienda Online",
                "Hasta 100 productos",
                "Pedidos ilimitados por WhatsApp",
                "Buscador y filtros",
                "Soporte básico",
            ],
            recommended: false,
            color: "slate",
        },
        {
            id: "negocio",
            name: "Negocio",
            price: "$99.000",
            description: "La mejor opción para marcas en crecimiento.",
            duration: "Mes",
            features: [
                "Hasta 3 Tiendas",
                "Hasta 1.000 productos",
                "Pedidos ilimitados",
                "Secciones Sobre Nosotros/Trabajo",
                "Soporte prioritario",
            ],
            recommended: true,
            color: "green",
        },
        {
            id: "pro",
            name: "Pro",
            price: "$180.000",
            description: "Diseñado para agencias o grandes inventarios.",
            duration: "Mes",
            features: [
                "Hasta 10 Tiendas",
                "Hasta 5.000 productos",
                "Todo el Plan Negocio",
                "Actualizaciones anticipadas",
                "Soporte 24/7 dedicado",
            ],
            recommended: false,
            color: "slate",
        },
    ];

    const handleNequiPayment = (planName: string) => {
        const message = `Hola, quiero activar mi plan ${planName} en Creatiendas. ¿Me pueden dar los datos para el pago?`;
        const whatsappUrl = `https://wa.me/573026687991?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

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
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pago Seguro via WhatsApp</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-[2.5rem] p-8 sm:p-10 border transition-all duration-300 hover:shadow-2xl flex flex-col ${
                                plan.recommended 
                                ? 'border-green-500 shadow-xl lg:scale-105 z-10' 
                                : 'border-slate-100 shadow-lg'
                            }`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
                                    <Zap className="w-3 h-3" fill="currentColor" />
                                    La mejor opción
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">COP</span>
                                </div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">por {plan.duration} / tienda</p>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-3">
                                        <div className="shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-green-600" strokeWidth={4} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleNequiPayment(plan.name)}
                                className={`block w-full py-5 rounded-2xl text-center font-black text-sm tracking-tight transition-all active:scale-[0.98] ${
                                    plan.recommended 
                                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-xl shadow-green-500/30' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'
                                }`}
                            >
                                Activar Plan Ahora
                            </button>
                            <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-tighter mt-4 flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> Activación Inmediata
                            </p>
                        </div>
                    ))}
                </div>

                {/* Info Card */}
                <div className="mt-20 bg-white rounded-[3rem] p-10 sm:p-16 shadow-xl border border-slate-100 max-w-5xl mx-auto relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-green-500/10 transition-all"></div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                Transparencia <span className="text-green-600">Total</span>
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                No cobramos comisiones por tus ventas. Todo el dinero que recibes por tus tiendas es 100% tuyo. Nuestro modelo es simple: pagas por la herramienta, no por tu éxito.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Check className="w-4 h-4 text-green-500" /> Sin cargos ocultos
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Check className="w-4 h-4 text-green-500" /> Cancela en cualquier momento
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Check className="w-4 h-4 text-green-500" /> Soporte humano en español
                                </li>
                            </ul>
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
