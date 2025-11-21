import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StoresPage() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { stores: true, subscription: true },
    });

    if (!user) return null;

    const stores = user.stores;
    const maxStores = user.subscription?.maxStores || 1;
    const canCreate = stores.length < maxStores;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mis Tiendas</h2>
                {canCreate ? (
                    <Link
                        href="/builder"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        + Crear Nueva Tienda
                    </Link>
                ) : (
                    <div className="text-sm text-red-500 border border-red-200 bg-red-50 px-3 py-2 rounded">
                        Límite de tiendas alcanzado ({stores.length}/{maxStores})
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                    <div key={store.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{store.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">/{store.slug}</p>

                            <div className="flex gap-2 mt-4">
                                <a
                                    href={`/stores/${store.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center text-sm border border-gray-300 py-2 rounded hover:bg-gray-50"
                                >
                                    Ver Tienda
                                </a>
                                <Link
                                    href={`/builder?slug=${store.slug}`}
                                    className="flex-1 text-center text-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                >
                                    Editar
                                </Link>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 border-t">
                            Creada: {new Date(store.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}

                {stores.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
                        <p className="text-gray-500 mb-4">No tienes ninguna tienda creada aún.</p>
                        <Link
                            href="/builder"
                            className="text-green-600 font-medium hover:underline"
                        >
                            ¡Crea tu primera tienda ahora!
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
