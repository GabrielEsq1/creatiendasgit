import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { subscription: true },
    });

    const plan = user?.subscription?.planType || "free";
    const isPro = plan === "pro";

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Facturación y Planes</h2>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-medium">Plan Actual</h3>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold capitalize">{plan}</span>
                        <span className="ml-2 text-gray-500">/ mes</span>
                    </div>
                </div>

                <div className="p-6 bg-gray-50">
                    <h4 className="font-medium mb-4">Detalles del plan:</h4>
                    <ul className="space-y-2 mb-6 text-sm text-gray-600">
                        <li className="flex items-center">
                            <span className="mr-2">✅</span>
                            {isPro ? "Hasta 10 tiendas" : "1 Tienda"}
                        </li>
                        <li className="flex items-center">
                            <span className="mr-2">✅</span>
                            Soporte básico
                        </li>
                        {isPro && (
                            <li className="flex items-center">
                                <span className="mr-2">✅</span>
                                Dominio personalizado (próximamente)
                            </li>
                        )}
                    </ul>

                    {!isPro ? (
                        <form action="/api/stripe/checkout" method="POST">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-4 rounded hover:opacity-90 transition"
                            >
                                Actualizar a PRO ($9/mes)
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-2">
                                Pago seguro vía Stripe
                            </p>
                        </form>
                    ) : (
                        <button
                            disabled
                            className="w-full bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded cursor-not-allowed"
                        >
                            Ya eres PRO 🎉
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
