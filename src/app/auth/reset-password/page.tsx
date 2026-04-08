"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 8) {
            setStatus("error");
            setMessage("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("Contraseña actualizada exitosamente");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 2000);
            } else {
                setStatus("error");
                setMessage(data.error || "Ocurrió un error");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Error de conexión");
        }
    };

    if (!token) {
        return (
            <div className="text-center p-8 bg-rose-50 rounded-[2rem] border border-rose-100 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner text-2xl">
                    ⚠️
                </div>
                <h3 className="text-xl font-black text-rose-800 mb-2">Enlace Inválido</h3>
                <p className="text-sm text-rose-600 mb-6 leading-relaxed">El enlace de recuperación ha expirado o ya fue utilizado anteriormente.</p>
                <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-rose-700 font-bold hover:gap-3 transition-all">
                    Solicitar nuevo enlace <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="text-center p-10 animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">¡Listo!</h3>
                <p className="text-slate-500 mb-8 font-medium">Tu contraseña ha sido actualizada correctamente.</p>
                <div className="inline-flex items-center gap-3 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
                    Accediendo al sistema...
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Nueva Contraseña</label>
                <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-600/30 transition-all shadow-inner"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Confirmar Contraseña</label>
                <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-600/30 transition-all shadow-inner"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {message && status === "error" && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
            >
                {status === "loading" ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Restablecer Contraseña 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center p-6 selection:bg-green-500/30 font-sans">
            <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-12 relative overflow-hidden">
                {/* Decoration blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-6 shadow-inner text-3xl">
                        🛡️
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">Nueva Contraseña</h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Crea una nueva contraseña segura para recuperar el acceso a tu tienda.
                    </p>
                </div>

                <Suspense fallback={<div className="grid place-items-center h-48"><div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" /></div>}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-loose">
                        ¿Recordaste tu contraseña?<br/>
                        <Link href="/auth/login" className="text-green-600 underline text-[11px]">Volver al inicio de sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
