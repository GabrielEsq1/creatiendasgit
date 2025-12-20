import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayoutEN({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/en/auth/login");
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-gray-900 text-white p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">CreaTiendas</h1>
                    <p className="text-sm text-gray-400">Dashboard</p>
                </div>
                <nav className="space-y-4">
                    <Link href="/en/dashboard" className="block py-2 px-4 rounded hover:bg-gray-800">
                        🏠 Home
                    </Link>
                    <Link href="/en/dashboard/stores" className="block py-2 px-4 rounded hover:bg-gray-800">
                        🏪 My Stores
                    </Link>
                    <Link href="/en/dashboard/billing" className="block py-2 px-4 rounded hover:bg-gray-800">
                        💳 Billing
                    </Link>
                    {(session.user as any).role === 'ADMIN' && (
                        <Link href="/admin" className="block py-2 px-4 rounded hover:bg-gray-800 text-yellow-400 font-semibold">
                            ⚡ Admin Panel
                        </Link>
                    )}
                    <form
                        action={async () => {
                            "use server";
                        }}
                    >
                        <Link href="/api/auth/signout?callbackUrl=/en" className="block py-2 px-4 rounded hover:bg-gray-800 text-red-400">
                            🚪 Sign Out
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
