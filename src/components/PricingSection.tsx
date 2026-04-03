"use client";

import Link from "next/link";
import { Check, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

interface PricingSectionProps {
    locale?: "es" | "en";
}

const plans = {
    es: [
        {
            name: "Emprendedor",
            price: "$60.000",
            description: "Para pequeños negocios que están empezando.",
            features: [
                "1 Tienda Online",
                "Hasta 100 productos",
                "Pedidos ilimitados por WhatsApp",
                "Buscador y filtros",
                "Soporte básico",
            ],
            cta: "Empezar prueba gratis",
            popular: false
        },
        {
            name: "Negocio",
            price: "$99.000",
            description: "La mejor opción para marcas en crecimiento.",
            features: [
                "Hasta 3 Tiendas",
                "Hasta 1.000 productos",
                "Pedidos ilimitados",
                "Secciones Sobre Nosotros/Trabajo",
                "Soporte prioritario",
            ],
            cta: "Empezar prueba gratis",
            popular: true
        },
        {
            name: "Pro",
            price: "$180.000",
            description: "Diseñado para agencias o grandes inventarios.",
            features: [
                "Hasta 10 Tiendas",
                "Hasta 5.000 productos",
                "Todo el Plan Negocio",
                "Actualizaciones anticipadas",
                "Soporte 24/7 dedicado",
            ],
            cta: "Empezar prueba gratis",
            popular: false
        }
    ],
    en: [
        {
            name: "Entrepreneur",
            price: "$60,000",
            description: "For small businesses just starting out.",
            features: [
                "1 Online Store",
                "Up to 100 products",
                "Unlimited WhatsApp orders",
                "Search and filters",
                "Basic support",
            ],
            cta: "Start free trial",
            popular: false
        },
        {
            name: "Business",
            price: "$99,000",
            description: "Best for growing brands.",
            features: [
                "Up to 3 Stores",
                "Up to 1,000 products",
                "Unlimited orders",
                "About Us/Jobs sections",
                "Priority support",
            ],
            cta: "Start free trial",
            popular: true
        },
        {
            name: "Pro",
            price: "$180,000",
            description: "Design for agencies or large inventories.",
            features: [
                "Up to 10 Stores",
                "Up to 5,000 products",
                "Everything in Business",
                "Early access updates",
                "24/7 Dedicated support",
            ],
            cta: "Start free trial",
            popular: false
        }
    ]
};

const t = {
    es: {
        badge: "Planes para cada etapa",
        heading: "Elige el plan ideal para tu",
        headingGradient: "crecimiento",
        subheading: "Prueba cualquier plan GRATIS por 30 días. Sin tarjeta de crédito, sin compromisos.",
        priceLabel: "/mes por tienda",
        ctaNote: "Cancela cuando quieras",
        faqTitle: "Preguntas frecuentes",
    },
    en: {
        badge: "Plans for every stage",
        heading: "Choose the ideal plan for your",
        headingGradient: "growth",
        subheading: "Try any plan FREE for 30 days. No credit card, no commitments.",
        priceLabel: "/month per store",
        ctaNote: "Cancel anytime",
        faqTitle: "Frequently asked questions",
    }
};

const faqsEs = [
    { q: "¿Qué pasa después de los 30 días gratis?", a: "Recibirás un aviso antes de que termine tu periodo de prueba. Podrás elegir el nivel que mejor se adapte a tu volumen actual para seguir operando." },
    { q: "¿Puedo cambiar de plan después?", a: "Sí, puedes subir o bajar de nivel en cualquier momento desde tu panel de administración según lo necesites." },
    { q: "¿Hay comisiones por ventas?", a: "No. Solo pagas la mensualidad fija de tu plan. El 100% de tus ventas te pertenece." },
    { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos transferencias bancarias, Nequi, y muy pronto PSE y tarjetas de crédito de forma automática." },
];

const faqsEn = [
    { q: "What happens after the 30 free days?", a: "You'll receive a notice before your trial ends. You can choose the level that best suits your current volume to continue operating." },
    { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade at any time from your admin dashboard as needed." },
    { q: "Are there any sales commissions?", a: "No. You only pay the fixed monthly fee for your plan. 100% of your sales belong to you." },
    { q: "What payment methods do you accept?", a: "We accept bank transfers, local digital wallets, and soon credit cards automatically." },
];

export default function PricingSection({ locale = "es" }: PricingSectionProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const tx = t[locale];
    const currentPlans = plans[locale];
    const faqs = locale === "en" ? faqsEn : faqsEs;

    return (
        <section id="pricing" className="bg-slate-50/50 py-24 sm:py-32 scroll-mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
                        {tx.badge}
                    </span>
                    <h2 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
                        {tx.heading}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            {tx.headingGradient}
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">{tx.subheading}</p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {currentPlans.map((plan, i) => (
                        <div 
                            key={i} 
                            className={`relative bg-white rounded-[2.5rem] p-8 sm:p-10 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                                plan.popular ? 'border-green-500 shadow-xl' : 'border-slate-200 shadow-lg'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                    Más Popular
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
                                <p className="text-slate-400 text-xs font-medium mt-1">{tx.priceLabel}</p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-3">
                                        <div className="shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-green-600" strokeWidth={4} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                href="/auth/register"
                                className={`block w-full py-4 rounded-2xl text-center font-black text-sm tracking-tight transition-all active:scale-95 ${
                                    plan.popular 
                                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-xl shadow-green-500/30' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'
                                }`}
                            >
                                {plan.cta}
                            </Link>
                            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-tighter mt-4">{tx.ctaNote}</p>
                        </div>
                    ))}
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <HelpCircle className="w-6 h-6 text-green-500" />
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{tx.faqTitle}</h3>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left group"
                                >
                                    <span className="text-base font-black text-slate-800 group-hover:text-green-600 transition-colors">
                                        {faq.q}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-green-500" : ""}`} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
