import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function BillingPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/auth/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { subscription: true, stores: true }
    });

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    const isPro = user.subscription?.planType === 'pro' && user.subscription?.status === 'active';
    const storeCount = user.stores.length;
    const maxStores = user.subscription?.maxStores || 1;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Mi Plan y Facturación
                    </h2>
                </div>
            </div>

            {searchParams.success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i className="fas fa-check-circle text-green-400"></i>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                ¡Gracias por suscribirte! Tu plan ha sido actualizado.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {searchParams.canceled && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <i className="fas fa-exclamation-circle text-yellow-400"></i>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                El proceso de pago fue cancelado. No se te ha cobrado nada.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Estado de la Suscripción
                    </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div>
                            <div className="flex items-center mb-4">
                                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${isPro ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {isPro ? 'Plan PRO' : 'Plan Gratuito'}
                                </span>
                                {isPro && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        Renueva el {user.subscription?.currentPeriodEnd?.toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-4">
                                {isPro
                                    ? 'Disfruta de todas las funciones premium y crea hasta 10 tiendas.'
                                    : 'Estás en el plan básico. Actualiza para crear más tiendas y desbloquear funciones.'}
                            </p>

                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Uso de Tiendas</h4>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                    <div
                                        className={`h-2.5 rounded-full ${storeCount >= maxStores ? 'bg-red-600' : 'bg-blue-600'}`}
                                        style={{ width: `${Math.min((storeCount / maxStores) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Has creado {storeCount} de {maxStores} tiendas permitidas.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center lg:justify-end">
                            {isPro ? (
                                <form action="/api/stripe/portal" method="POST">
                                    <ManageButton />
                                </form>
                            ) : (
                                <form action="/api/stripe/checkout" method="POST">
                                    <UpgradeButton />
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {!isPro && (
                <div className="mt-8">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Planes Disponibles
                    </h3>
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-blue-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Plan PRO</h3>
                                    <p className="mt-1 text-gray-500">Todo lo que necesitas para escalar tu negocio.</p>
                                    <ul className="mt-4 space-y-2">
                                        <li className="flex items-center text-sm text-gray-600">
                                            <i className="fas fa-check text-green-500 mr-2"></i>
                                            Hasta 10 tiendas
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <i className="fas fa-check text-green-500 mr-2"></i>
                                            Personalización avanzada
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <i className="fas fa-check text-green-500 mr-2"></i>
                                            Soporte prioritario
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-4 sm:mt-0 text-center">
                                    <p className="text-3xl font-bold text-gray-900">$9.99<span className="text-base font-normal text-gray-500">/mes</span></p>
                                    <form action="/api/stripe/checkout" method="POST" className="mt-4">
                                        <UpgradeButton />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function UpgradeButton() {
    return (
        <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Actualizar a PRO
        </button>
    );
}

function ManageButton() {
    "use client";
    // Client component wrapper for the button if needed for interactivity, 
    // but for simple form submission server action works or simple fetch.
    // Since we are in a server component, we can use a simple button inside a form that posts to the API route.
    // However, the API route returns JSON with a URL, so we need a client-side handler or a server action that redirects.
    // Let's make this a client component to handle the JSON response and redirect.

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error opening portal:', error);
            alert('Error al abrir el portal de facturación.');
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            Gestionar Suscripción
        </button>
    );
}
