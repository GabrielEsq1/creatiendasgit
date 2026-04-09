"use client";

import { Check, ShieldCheck, Zap } from "lucide-react";

interface Plan {
    id: string;
    name: string;
    price: string;
    description: string;
    duration: string;
    features: string[];
    recommended: boolean;
}

const plansData = {
    es: [
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
        },
    ],
    en: [
        {
            id: "entrepreneur",
            name: "Entrepreneur",
            price: "$60,000",
            description: "For small businesses just starting out.",
            duration: "Month",
            features: [
                "1 Online Store",
                "Up to 100 products",
                "Unlimited WhatsApp orders",
                "Search and filters",
                "Basic support",
            ],
            recommended: false,
        },
        {
            id: "business",
            name: "Business",
            price: "$99,000",
            description: "Best for growing brands.",
            duration: "Month",
            features: [
                "Up to 3 Stores",
                "Up to 1,000 products",
                "Unlimited orders",
                "About Us/Jobs sections",
                "Priority support",
            ],
            recommended: true,
        },
        {
            id: "pro",
            name: "Pro",
            price: "$180,000",
            description: "Design for agencies or large inventories.",
            duration: "Month",
            features: [
                "Up to 10 Stores",
                "Up to 5,000 products",
                "Everything in Business",
                "Early access updates",
                "24/7 Dedicated support",
            ],
            recommended: false,
        },
    ]
};

interface PricingCardsProps {
    lang?: 'es' | 'en';
}

export default function PricingCards({ lang = 'es' }: PricingCardsProps) {
    const currentPlans = plansData[lang];
    
    const handleNequiPayment = (planName: string) => {
        const message = lang === 'es' 
            ? `Hola, quiero activar mi plan ${planName} en Creatiendas. ¿Me pueden dar los datos para el pago?`
            : `Hello, I want to activate my ${planName} plan on Creatiendas. Can you provide payment details?`;
        const whatsappUrl = `https://wa.me/573026687991?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPlans.map((plan) => (
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
                            {lang === 'es' ? 'La mejor opción' : 'The Best Choice'}
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
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                            {lang === 'es' ? `por ${plan.duration} / tienda` : `per ${plan.duration} / store`}
                        </p>
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
                        {lang === 'es' ? 'Activar Plan Ahora' : 'Activate Plan Now'}
                    </button>
                    <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-tighter mt-4 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> {lang === 'es' ? 'Activación Inmediata' : 'Immediate Activation'}
                    </p>
                </div>
            ))}
        </div>
    );
}
