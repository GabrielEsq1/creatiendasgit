"use client";

import { Check } from "lucide-react";
import Link from "next/link";

export default function BillingPageEN() {
    const plans = [
        {
            id: "trimestral",
            name: "Quarterly",
            price: "$60.000",
            duration: "3 Months",
            permanency: 3,
            features: [
                "Unlimited Stores",
                "Unlimited Products",
                "Priority Support",
                "Custom Domain",
            ],
            recommended: false,
        },
        {
            id: "semestral",
            name: "Semiannual",
            price: "$60.000",
            duration: "6 Months",
            permanency: 6,
            features: [
                "Unlimited Stores",
                "Unlimited Products",
                "Priority Support",
                "Custom Domain",
                "Sales Analytics",
            ],
            recommended: false,
        },
        {
            id: "anual",
            name: "Annual",
            price: "$60.000",
            duration: "1 Year",
            permanency: 12,
            features: [
                "Unlimited Stores",
                "Unlimited Products",
                "VIP Support 24/7",
                "Custom Domain",
                "Advanced Analytics",
                "No Watermark",
            ],
            recommended: true,
        },
    ];

    const handleNequiPayment = (planName: string) => {
        const message = `Hello, I want to pay my plan via Nequi. My plan is: ${planName}`;
        const whatsappUrl = `https://wa.me/573026687991?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back to Dashboard */}
                    <div className="mb-8">
                        <Link
                            href="/en/dashboard"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            Subscription Plans
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            Unlock the full potential of Creatiendas. Unlimited stores, unlimited products, and more.
                        </p>
                    </div>

                    <div className="mt-16 space-y-6 sm:space-y-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:max-w-7xl lg:mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`rounded-2xl shadow-xl bg-white flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl ${plan.recommended
                                    ? "ring-2 ring-blue-500 transform lg:scale-105"
                                    : "ring-1 ring-gray-200"
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                                        <span className="block text-center text-sm font-semibold text-white uppercase tracking-wide">
                                            ⭐ Best Value
                                        </span>
                                    </div>
                                )}

                                <div className="p-8 flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="mt-4 flex items-baseline text-gray-900">
                                        <span className="text-5xl font-extrabold tracking-tight">
                                            {plan.price}
                                        </span>
                                        <span className="ml-2 text-xl font-medium text-gray-500">
                                            COP
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">per {plan.duration}</p>

                                    <ul className="mt-8 space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <Check className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
                                                <span className="ml-3 text-base text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="px-8 pb-8 space-y-4">
                                    {/* WhatsApp Payment Option */}
                                    <button
                                        className="w-full flex items-center justify-center px-6 py-3 border-2 border-green-600 text-base font-semibold rounded-lg text-green-700 bg-white hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                        onClick={() => handleNequiPayment(plan.name)}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        Request Plan via WhatsApp
                                    </button>

                                    <p className="text-xs text-center text-gray-500 pt-2">
                                        Minimum permanency of {plan.permanency} months
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Information Section */}
                    <div className="mt-20 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Payment Methods
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-50 rounded-lg p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        <h4 className="font-semibold text-gray-900">Personalized Assistance</h4>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        Manual payment coordinated via WhatsApp. Our team will guide you through the process and activate your plan immediately.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-600">
                                    Questions? Contact us via{" "}
                                    <a
                                        href="https://wa.me/573026687991"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                                    >
                                        WhatsApp: +57 302 668 7991
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
