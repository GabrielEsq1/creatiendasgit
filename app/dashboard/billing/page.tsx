"use client";

import { Check } from "lucide-react";

export default function BillingPage() {
    const plans = [
        {
            name: "Trimestral",
            price: "$60.000",
            duration: "3 Meses",
            features: [
                "Tiendas ilimitadas",
                "Productos ilimitados",
                "Soporte prioritario",
                "Dominio personalizado",
            ],
            recommended: false,
        },
        {
            name: "Semestral",
            price: "$60.000",
            duration: "6 Meses",
            features: [
                "Tiendas ilimitadas",
                "Productos ilimitados",
                "Soporte prioritario",
                "Dominio personalizado",
                "Análisis de ventas",
            ],
            recommended: false,
        },
        {
            name: "Anual",
            price: "$60.000",
            duration: "1 Año",
            features: [
                "Tiendas ilimitadas",
                "Productos ilimitados",
                "Soporte VIP 24/7",
                "Dominio personalizado",
                "Análisis avanzado",
                "Sin marca de agua",
            ],
            recommended: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Planes de Suscripción
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Elige el plan que mejor se adapte a tu negocio.
                    </p>
                </div>

                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-lg shadow-lg divide-y divide-gray-200 bg-white flex flex-col ${plan.recommended
                                    ? "border-2 border-blue-500 relative transform scale-105 z-10"
                                    : "border border-gray-200"
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 -mt-3 mr-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white uppercase tracking-wide">
                                        Mejor Valor
                                    </span>
                                </div>
                            )}
                            <div className="p-6 flex-1">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {plan.name}
                                </h3>
                                <p className="mt-4 flex items-baseline text-gray-900">
                                    <span className="text-5xl font-extrabold tracking-tight">
                                        {plan.price}
                                    </span>
                                    <span className="ml-1 text-xl font-semibold text-gray-500">
                                        / {plan.duration}
                                    </span>
                                </p>
                                <ul className="mt-6 space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex">
                                            <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                                            <span className="ml-3 text-gray-500">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-b-lg">
                                <button
                                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white ${plan.recommended
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-800 hover:bg-gray-900"
                                        } md:py-3 md:text-lg transition-colors duration-200`}
                                    onClick={() => alert(`Has seleccionado el plan ${plan.name}`)}
                                >
                                    Suscribirse
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
