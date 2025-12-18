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
            <div className="text-center p-6 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-rose-800 mb-1">Enlace inválido</h3>
                <p className="text-sm text-rose-600 mb-4">El enlace de recuperación es inválido o ha expirado.</p>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-rose-700 hover:text-rose-900 underline">
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in spin-in-12">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">¡Contraseña Actualizada!</h3>
                <p className="text-slate-500 mb-6">Tu contraseña ha sido cambiada correctamente.</p>
                <div className="animate-pulse text-sm text-blue-600 font-medium">
                    Redirigiendo al login...
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">Nueva Contraseña</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Mínimo 8 caracteres"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 ml-1">Confirmar Contraseña</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Repite la contraseña"
                    />
                </div>
            </div>

            {message && status === "error" && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs font-medium text-rose-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
                {status === "loading" ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        Actualizar Contraseña <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 p-8 sm:p-10 relative overflow-hidden">
                {/* Decoration blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4 shadow-inner text-2xl">
                        🔐
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Nueva Contraseña</h2>
                    <p className="text-slate-500 text-sm">
                        Ingresa tu nueva contraseña segura a continuación.
                    </p>
                </div>

                <Suspense fallback={<div className="grid place-items-center h-48"><div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="text-center mt-6 relative z-10">
                    <Link href="/auth/login" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                        Cancelar y volver al login
                    </Link>
                </div>
            </div>
        </div>
    );
}
