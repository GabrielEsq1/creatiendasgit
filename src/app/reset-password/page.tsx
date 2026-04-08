"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("ERROR");
            setMessage("El enlace de recuperación no es válido o está incompleto.");
        }
    }, [token]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus("ERROR");
            setMessage("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 8) {
            setStatus("ERROR");
            setMessage("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        setLoading(true);
        setStatus("IDLE");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("SUCCESS");
                setMessage("¡Tu contraseña ha sido actualizada con éxito!");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setStatus("ERROR");
                setMessage(data.error || "Algo salió mal. El enlace puede haber expirado.");
            }
        } catch (error) {
            setStatus("ERROR");
            setMessage("Error de conexión. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "SUCCESS") {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-slate-900">Contraseña Actualizada</h1>
                    <p className="text-slate-500">Ya puedes iniciar sesión con tu nueva contraseña. Redirigiendo...</p>
                </div>
                <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all"
                >
                    Ir al Inicio de Sesión <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Nueva Contraseña</h1>
                <p className="text-slate-500">Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.</p>
            </div>

            {status === "ERROR" && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                    <p className="text-sm font-bold text-rose-600">{message}</p>
                </div>
            )}

            {!token ? (
                <div className="text-center pt-4">
                    <Link href="/forgot-password" size="sm" className="text-green-600 font-black uppercase text-xs tracking-widest hover:underline">
                        Solicitar nuevo enlace
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Nueva Contraseña</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input 
                                type="password" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" 
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Confirmar Contraseña</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input 
                                type="password" 
                                required 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" 
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Actualizar Contraseña"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-green-500/30">
            <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" /></div>}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-green-600 transition-colors">
                        ¿Recordaste tu contraseña? Entra aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
