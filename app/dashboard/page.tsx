import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const session = await auth();
    const user = session?.user;

    if (!user?.email) return null;

    const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { subscription: true, stores: true },
    });

    const storeCount = dbUser?.stores.length || 0;
    const maxStores = dbUser?.subscription?.maxStores || 1;
    const planName = dbUser?.subscription?.planType || "Free";

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Hola, {user.name || "Usuario"} 👋</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Tiendas */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Tiendas Creadas</h3>
                    <p className="text-4xl font-bold mt-2">{storeCount} <span className="text-lg text-gray-400 font-normal">/ {maxStores}</span></p>
                </div>

                {/* Card 2: Plan */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Plan Actual</h3>
                    <p className="text-4xl font-bold mt-2 capitalize">{planName}</p>
                </div>

                {/* Card 3: Estado */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Estado</h3>
                    <p className="text-4xl font-bold mt-2 text-green-600">Activo</p>
                </div>
            </div>
        </div>
    );
}
