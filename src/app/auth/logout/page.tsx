"use client";

import { signOut } from "next-auth/react";
import { LogOut, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-green-500/30">
            {/* BRAND LOGO */}
            <div className="mb-12">
                <Link href="/">
                    <img src="/logo.png" alt="Creatiendas Logo" className="h-12 object-contain" />
                </Link>
            </div>

            {/* LOGOUT CARD */}
            <div className="w-full max-w-[400px] bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                    <LogOut size={40} strokeWidth={2.5} />
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">¿Cerrar sesión?</h1>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium px-4">
                    ¿Estás seguro de que quieres salir de tu cuenta? Tendrás que volver a ingresar para gestionar tu tienda.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className={`w-full py-4 px-6 bg-[#22c55e] hover:bg-[#1eb054] text-white rounded-2xl font-black text-base shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>Cerrar Sesión</>
                        )}
                    </button>

                    <button
                        onClick={() => router.back()}
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-base transition-all active:scale-95"
                    >
                        Volver atrás
                    </button>
                </div>
            </div>

            {/* FOOTER LINK */}
            <div className="mt-12">
                <Link href="/" className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
                    <Home size={18} />
                    Ir al inicio
                </Link>
            </div>

            <p className="mt-8 text-[11px] text-slate-300 font-bold uppercase tracking-widest">
                Creatiendas S.A.S &copy; {new Date().getFullYear()}
            </p>
        </div>
    );
}
