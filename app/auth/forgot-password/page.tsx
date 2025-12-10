"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [debugLink, setDebugLink] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");
        setDebugLink("");

        try {
            const res = await fetch("/api/auth/reset-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message);
                if (data.debugLink) {
                    setDebugLink(data.debugLink);
                }
            } else {
                setStatus("error");
                setMessage(data.error || "Ocurrió un error");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Error de conexión");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 p-8 sm:p-10 relative overflow-hidden">
                {/* Decoration blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                {/* Back Link */}
                <div className="relative z-10 mb-6">
                    <Link href="/auth/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Volver a inicio de sesión
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4 shadow-inner text-2xl">
                        🔐
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Recuperar Contraseña</h2>
                    <p className="text-slate-500 text-sm">
                        Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold text-slate-500 ml-1">
                            Correo Electrónico
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="tu@empresa.com"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${status === "success"
                                ? "bg-emerald-50 border border-emerald-100 text-emerald-600"
                                : "bg-rose-50 border border-rose-100 text-rose-600"
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${status === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {message}
                        </div>
                    )}

                    {debugLink && (
                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800 break-all animate-in fade-in">
                            <p className="font-bold mb-1">Modo Desarrollo (Debug):</p>
                            <Link href={debugLink} className="text-blue-600 underline hover:text-blue-800 transition-colors">
                                Click aquí para resetear
                            </Link>
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
                                Enviar enlace <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
