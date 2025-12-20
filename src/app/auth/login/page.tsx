"use client";
export const dynamic = 'force-dynamic';

import { signIn, getSession } from "next-auth/react";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Github, Chrome, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SocialProofSection } from "@/components/SocialProofSection";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

    useEffect(() => {
        if (searchParams?.get("registered") === "true") {
            setSuccessMessage("Cuenta creada exitosamente. Ya puedes iniciar sesión.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Credenciales inválidas");
            } else {
                // Check role for redirection
                const session = await getSession();
                if (session?.user?.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push(callbackUrl);
                }
                router.refresh();
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">

                {/* LEFT COLUMN: Social Proof (Desktop: Left, Mobile: Bottom) */}
                <div className="order-2 lg:order-1 space-y-8 pr-0 lg:pr-8">
                    <div className="hidden lg:block space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Regresar al inicio
                        </Link>
                        <h2 className="text-4xl font-black text-slate-800 leading-tight">
                            Únete a la tracción real de <span className="text-blue-600">Creatiendas</span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            Más que una herramienta, somos una comunidad de emprendedores creciendo cada día.
                        </p>
                    </div>

                    {/* Check if user needs help (Mobile/Desktop) */}
                    <div className="lg:hidden mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-green-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800">¿Problemas para entrar?</p>
                                <p className="text-[10px] text-slate-500">Ayuda en vivo 24/7</p>
                            </div>
                        </div>
                        <a href="https://wa.me/573026687991?text=Ayuda%20login" target="_blank" className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Chatear
                        </a>
                    </div>

                    <SocialProofSection />
                </div>

                {/* RIGHT COLUMN: Login Form (Desktop: Right, Mobile: Top) */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end mb-8 lg:mb-0">
                    <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 sm:p-10 relative overflow-hidden">
                        {/* Decoration blob */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        {/* Mobile Logo / Header */}
                        <div className="text-center mb-10 relative z-10">
                            <Link href="/" className="lg:hidden inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/20 transform rotate-3">
                                <span className="text-2xl text-white">🏪</span>
                            </Link>
                            <div className="hidden lg:inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/20 transform rotate-3">
                                <span className="text-2xl text-white">🏪</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 mb-1">Bienvenido</h1>
                            <p className="text-slate-500 text-sm">Gestiona tu tienda de WhatsApp</p>
                        </div>

                        {/* Credentials Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 ml-1">Correo Electrónico</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="tu@correo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-semibold text-slate-500">Contraseña</label>
                                    <Link href="/auth/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs font-medium text-rose-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {successMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Entrar a mi Panel <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-sm text-slate-500">
                            ¿Aún no tienes cuenta?{' '}
                            <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                                Empieza gratis ahora
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center"><div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
