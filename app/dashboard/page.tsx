import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/auth/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { stores: true }
    });

    if (!user) {
        return <div>Usuario no encontrado</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Hola, {user.name || 'Usuario'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Bienvenido a tu panel de control.
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <Link
                        href="/builder"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Crear Nueva Tienda
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Resumen de tus tiendas
                    </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    {user.stores.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {user.stores.slice(0, 3).map((store: { id: string; name: string; slug: string; views: number }) => (
                                <div key={store.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/stores/${store.slug}`} className="focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            <p className="text-sm font-medium text-gray-900">
                                                {store.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                /stores/{store.slug}
                                            </p>
                                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                                <i className="fas fa-eye mr-1"></i>
                                                {store.views} vistas
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <i className="fas fa-store text-4xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500">Aún no tienes tiendas creadas.</p>
                            <Link href="/builder" className="text-blue-600 hover:text-blue-500 font-medium mt-2 inline-block">
                                ¡Crea tu primera tienda ahora!
                            </Link>
                        </div>
                    )}
                    {user.stores.length > 3 && (
                        <div className="mt-4 text-right">
                            <Link href="/dashboard/stores" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Ver todas mis tiendas &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
                    <div className="space-y-4">
                        <Link href="/dashboard/stores" className="block p-4 border rounded-lg hover:bg-gray-50 transition">
                            <div className="font-medium text-gray-900">Gestionar Tiendas</div>
                            <div className="text-sm text-gray-500">Ver, editar o eliminar tus tiendas existentes.</div>
                        </Link>
                        <Link href="/dashboard/billing" className="block p-4 border rounded-lg hover:bg-gray-50 transition">
                            <div className="font-medium text-gray-900">Mi Plan</div>
                            <div className="text-sm text-gray-500">Revisar tu suscripción y facturación.</div>
                        </Link>
                    </div>
                </div>

                {/* Placeholder for stats or other info */}
                <div className="bg-blue-50 shadow sm:rounded-lg p-6 border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-900 mb-4">Consejo Pro</h3>
                    <p className="text-blue-700">
                        Comparte el enlace de tu tienda en tus redes sociales y estado de WhatsApp para conseguir más clientes.
                    </p>
                </div>
            </div>
        </div>
    );
}
