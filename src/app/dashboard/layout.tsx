import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-gray-900 text-white p-6">
                <div className="mb-8">
                    <Link href="/dashboard">
                        <img src="/logo.png" alt="CreaTiendas" className="h-8 w-auto mb-2" />
                    </Link>
                    <p className="text-sm text-gray-400">Dashboard</p>
                </div>
                <nav className="space-y-4">
                    <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-800">
                        🏠 Inicio
                    </Link>
                    <Link href="/dashboard/stores" className="block py-2 px-4 rounded hover:bg-gray-800">
                        🏪 Mis Tiendas
                    </Link>
                    <Link href="/dashboard/billing" className="block py-2 px-4 rounded hover:bg-gray-800">
                        💳 Facturación
                    </Link>
                    {(session.user as any).role === 'ADMIN' && (
                        <Link href="/admin" className="block py-2 px-4 rounded hover:bg-gray-800 text-yellow-400 font-semibold">
                            ⚡ Panel Admin
                        </Link>
                    )}
                    <form
                        action={async () => {
                            "use server";
                            // In a real app, import signOut from auth and call it
                            // await signOut();
                            // For now, we'll just redirect to a signout route or handle it client side
                        }}
                    >
                        <Link href="/api/auth/signout" className="block py-2 px-4 rounded hover:bg-gray-800 text-red-400">
                            🚪 Cerrar Sesión
                        </Link>
                    </form>
                </nav>
            </aside>
            <main className="flex-1 p-6 bg-gray-50">
                {children}
            </main>
        </div>
    );
}
