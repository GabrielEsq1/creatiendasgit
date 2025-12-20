"use client";
export const dynamic = 'force-dynamic';

import { signIn, getSession } from "next-auth/react";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Github, Chrome, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SocialProofSection } from "@/components/SocialProofSection";

import FestiveManager from "@/components/FestiveManager";

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
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 selection:bg-green-500/30">
            <FestiveManager />
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT COLUMN: Social Proof */}
                <div className="order-2 lg:order-1 space-y-8 pr-0 lg:pr-8">
                    <div className="hidden lg:block space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Regresar al inicio 🏠
                        </Link>
                        <h2 className="text-4xl font-black text-white leading-tight">
                            Únete a la tracción real de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Creatiendas</span> 🎄
                        </h2>
                        <p className="text-lg text-slate-400">
                            Más que una herramienta, somos una comunidad de emprendedores creciendo cada día. ❄️
                        </p>
                    </div>

                    {/* WhatsApp Help */}
                    <div className="lg:hidden mb-6 bg-slate-900/50 rounded-2xl p-4 border border-white/5 flex items-center justify-between gap-3 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0 shadow-inner text-green-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">¿Problemas para entrar?</p>
                                <p className="text-[10px] text-slate-400">Ayuda en vivo 24/7</p>
                            </div>
                        </div>
                        <a href="https://wa.me/573026687991?text=Ayuda%20login" target="_blank" className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Chatear 🎁
                        </a>
                    </div>

                    <SocialProofSection />
                </div>

                {/* RIGHT COLUMN: Login Form */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end mb-8 lg:mb-0">
                    <div className="w-full max-w-[420px] bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 p-8 sm:p-10 relative overflow-hidden group hover:border-green-500/30 transition-all duration-500">
                        {/* Decoration blob */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-green-500/10 transition-all"></div>

                        {/* Mobile Logo / Header */}
                        <div className="text-center mb-10 relative z-10">
                            <Link href="/" className="mb-6 group">
                                <img src="/logo.png" alt="CreaTiendas" className="h-12 w-auto object-contain transform rotate-3 group-hover:rotate-0 transition-transform duration-500" />
                            </Link>
                            <h1 className="text-2xl font-black text-white mb-1">Bienvenido 🎅</h1>
                            <p className="text-slate-400 text-sm font-medium">Gestiona tu tienda de WhatsApp</p>
                        </div>

                        {/* Credentials Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-green-400 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-base text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all shadow-inner"
                                        placeholder="tu@correo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
                                    <Link href="/auth/forgot-password" className="text-xs font-bold text-green-400 hover:text-green-300 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-400 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-base text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all shadow-inner"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {successMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-900/40 hover:shadow-green-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Entrar a mi Panel ❄️ <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-sm text-slate-400 font-medium">
                            ¿Aún no tienes cuenta?{' '}
                            <Link href="/auth/register" className="font-black text-green-400 hover:text-green-300 transition-colors">
                                Empieza gratis ahora 🚀
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
        <Suspense fallback={<div className="min-h-screen grid place-items-center bg-black"><div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
