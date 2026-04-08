"use client";

import { Check, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function BillingPageEN() {
    const plans = [
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
            color: "slate",
        },
        {
            id: "business",
            name: "Business",
            price: "$99,000",
            description: "The best choice for growing brands.",
            duration: "Month",
            features: [
                "Up to 3 Stores",
                "Up to 1,000 products",
                "Unlimited orders",
                "About Us/Jobs sections",
                "Priority support",
            ],
            recommended: true,
            color: "green",
        },
        {
            id: "pro",
            name: "Pro",
            price: "$180,000",
            description: "Designed for agencies or large inventories.",
            duration: "Month",
            features: [
                "Up to 10 Stores",
                "Up to 5,000 products",
                "Everything in Business",
                "Early access updates",
                "24/7 Dedicated support",
            ],
            recommended: false,
            color: "slate",
        },
    ];

    const handleNequiPayment = (planName: string) => {
        const message = `Hello, I want to activate my ${planName} plan on Creatiendas. Can you provide payment details?`;
        const whatsappUrl = `https://wa.me/573026687991?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-green-500/30">
            {/* Header / Sub Nav */}
            <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/en/dashboard"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secure WhatsApp Payment</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                        Upgrade Your Plan
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Choose the ideal plan for your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            growth
                        </span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                        Scale your WhatsApp business with powerful tools and dedicated support.
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
                                    The Best Choice
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
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">per {plan.duration} / store</p>
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
                                Activate Plan Now
                            </button>
                            <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-tighter mt-4 flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3 h-3" /> Immediate Activation
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
                                Total <span className="text-green-600">Transparency</span>
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                We don't charge commissions on your sales. All the money you receive through your stores is 100% yours. Our model is simple: you pay for the tool, not for your success.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Check className="w-4 h-4 text-green-500" /> No hidden fees
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Check className="w-4 h-4 text-green-500" /> Cancel anytime
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Check className="w-4 h-4 text-green-500" /> Human support in English & Spanish
                                </li>
                            </ul>
                        </div>
                        
                        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                                💬
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Need help?</h3>
                            <p className="text-sm text-slate-500 font-medium">We're on WhatsApp to guide you through the setup or answer your questions before paying.</p>
                            <a 
                                href="https://wa.me/573026687991" 
                                target="_blank"
                                className="inline-flex items-center gap-2 text-green-600 font-black hover:underline"
                            >
                                Talk to an advisor <ArrowLeft className="w-4 h-4 rotate-180" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
