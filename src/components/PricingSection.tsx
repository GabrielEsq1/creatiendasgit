"use client";

import Link from "next/link";
import { Check, X, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        q: "¿Qué pasa después del mes gratis?",
        a: "Después de tu primer mes gratuito, el plan cuesta $60.000 COP por tienda al mes. Recibirás un aviso antes de que termine tu periodo de prueba para que puedas decidir con tranquilidad.",
    },
    {
        q: "¿Hay comisiones por ventas o pagos ocultos?",
        a: "No. Jamás. Pagas solo los $60.000 COP/mes por tienda. No cobramos ningún porcentaje sobre tus ventas ni hay cargos sorpresa de ningún tipo.",
    },
    {
        q: "¿Cuándo empieza a correr el cobro?",
        a: "El cobro empieza exactamente 30 días después de que creas tu primera tienda. Recibirás un recordatorio por correo 7 días antes del vencimiento.",
    },
    {
        q: "¿Qué incluye el plan?",
        a: "Todo. Catálogo ilimitado de productos, integración directa con WhatsApp, dominio personalizado, estadísticas de visitas, sección de 'Sobre nosotros' y 'Trabaja con nosotros', barra de búsqueda, filtros por categoría, paginación, y actualizaciones gratuitas.",
    },
    {
        q: "¿Puedo tener varias tiendas?",
        a: "Sí. Cada tienda es $60.000 COP/mes independientemente. Si tienes 2 tiendas, pagas $120.000/mes. El primer mes de cada nueva tienda que crees también es gratuito.",
    },
    {
        q: "¿Puedo cancelar cuando quiera?",
        a: "Absolutamente. No hay contratos, ni permanencias, ni penalizaciones. Cancelas en cualquier momento con un clic desde tu panel.",
    },
    {
        q: "¿Cómo se hace el pago?",
        a: "Por ahora coordinamos el pago directamente por WhatsApp o transferencia bancaria. Muy pronto habilitaremos pasarela de pagos automática (PSE, tarjetas, Nequi).",
    },
];

const included = [
    "Catálogo ilimitado de productos",
    "Integración directa con WhatsApp",
    "Link único de tu tienda",
    "Búsqueda y filtros por categoría",
    "Paginación de productos",
    "Sección Sobre nosotros & Trabaja con nosotros",
    "Estadísticas de visitas en tiempo real",
    "Actualizaciones de funciones gratuitas",
    "Soporte por WhatsApp",
    "Primer mes completamente GRATIS",
];

const notIncluded = [
    "Comisiones por ventas",
    "Pagos ocultos",
    "Contratos de permanencia",
];

export default function PricingSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section id="pricing" className="bg-white py-20 sm:py-28 scroll-mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                        Sin sorpresas. Sin letra pequeña.
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4">
                        Precios que{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                            tienen sentido
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Un mes gratis para que compruebes que vale la pena. Sin tarjeta de crédito, sin trampas.
                    </p>
                </div>

                {/* Pricing Card + Included */}
                <div className="grid lg:grid-cols-2 gap-10 mb-20 items-start">

                    {/* Main Pricing Card */}
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden">
                        {/* Glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Trial Badge */}
                        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-400 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-8">
                            ✦ Prueba gratuita 30 días
                        </div>

                        {/* Price */}
                        <div className="mb-2">
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-slate-400 text-sm font-bold line-through">$80.000</span>
                                <span className="text-green-400 text-xs font-black uppercase tracking-wide bg-green-400/10 px-2 py-0.5 rounded">Lanzamiento</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-white">$60K</span>
                                <div className="text-slate-400">
                                    <div className="text-sm font-bold">COP</div>
                                    <div className="text-xs">/mes por tienda</div>
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm mb-8">
                            Después de tu mes de prueba. Sin compromisos.
                        </p>

                        {/* CTA */}
                        <Link
                            href="/auth/register"
                            className="block w-full bg-green-500 hover:bg-green-400 text-white text-center font-black py-4 rounded-2xl text-base transition-all hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-green-500/30 mb-6"
                        >
                            Empezar gratis — 1 mes sin pagar
                        </Link>

                        <p className="text-center text-slate-500 text-xs font-medium">
                            Sin tarjeta de crédito · Cancela cuando quieras
                        </p>
                    </div>

                    {/* What's included / not included */}
                    <div>
                        <h3 className="text-xl font-black text-slate-900 mb-6">Todo esto incluido desde el día 1:</h3>
                        <ul className="space-y-3 mb-8">
                            {included.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-0.5 shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                                    </span>
                                    <span className={`text-sm font-medium ${i === included.length - 1 ? "text-green-700 font-black" : "text-slate-700"}`}>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Lo que NUNCA cobraremos:</h3>
                        <ul className="space-y-2">
                            {notIncluded.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="shrink-0 w-5 h-5 bg-red-50 rounded-full flex items-center justify-center">
                                        <X className="w-3 h-3 text-red-400" strokeWidth={3} />
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium line-through">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <HelpCircle className="w-6 h-6 text-green-500 shrink-0" />
                        <h3 className="text-2xl font-black text-slate-900">Preguntas frecuentes sobre precios</h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {faqs.map((faq, i) => (
                            <div key={i} className="py-5">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-start justify-between gap-4 text-left group"
                                >
                                    <span className="text-base font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-300 mt-0.5 ${openFaq === i ? "rotate-180 text-green-500" : ""}`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
                                >
                                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom trust row */}
                    <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                        {[
                            { emoji: "🛡️", label: "Sin riesgo", sub: "30 días gratis" },
                            { emoji: "🔓", label: "Sin contrato", sub: "Cancela siempre" },
                            { emoji: "💸", label: "Sin comisiones", sub: "Precio fijo" },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="text-2xl mb-1">{item.emoji}</div>
                                <div className="text-sm font-black text-slate-800">{item.label}</div>
                                <div className="text-xs text-slate-500 font-medium">{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
