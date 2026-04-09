"use client";
export const dynamic = 'force-dynamic';

import { signIn, getSession } from "next-auth/react";
import { useState, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { SocialProofSection } from "@/components/SocialProofSection";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileMobileRef = useRef<HTMLDivElement>(null);
    const turnstileDesktopRef = useRef<HTMLDivElement>(null);
    const widgetMobileIdRef = useRef<string | null>(null);
    const widgetDesktopIdRef = useRef<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

    // Explicitly render Turnstile for better reliability in Next.js
    useEffect(() => {
        const renderTurnstile = () => {
            if (typeof window !== 'undefined' && (window as any).turnstile) {
                const isDesktopVisible = window.innerWidth >= 1024;

                if (!isDesktopVisible && turnstileMobileRef.current && !widgetMobileIdRef.current) {
                    try {
                        widgetMobileIdRef.current = (window as any).turnstile.render(turnstileMobileRef.current, {
                            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAC2WsMUGbzyb_NSX",
                            callback: (token: string) => {
                                setTurnstileToken(token);
                                setError("");
                            },
                            theme: 'light',
                        });
                    } catch (e) {
                        console.error("Turnstile mobile render error:", e);
                    }
                }
                
                if (isDesktopVisible && turnstileDesktopRef.current && !widgetDesktopIdRef.current) {
                    try {
                        widgetDesktopIdRef.current = (window as any).turnstile.render(turnstileDesktopRef.current, {
                            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAC2WsMUGbzyb_NSX",
                            callback: (token: string) => {
                                setTurnstileToken(token);
                                setError("");
                            },
                            theme: 'light',
                        });
                    } catch (e) {
                        console.error("Turnstile desktop render error:", e);
                    }
                }
            }
        };

        renderTurnstile();
        (window as any).onTurnstileLoad = renderTurnstile;

        window.addEventListener('resize', renderTurnstile);

        return () => {
            window.removeEventListener('resize', renderTurnstile);
            if ((window as any).turnstile) {
                if (widgetMobileIdRef.current) {
                    (window as any).turnstile.remove(widgetMobileIdRef.current);
                    widgetMobileIdRef.current = null;
                }
                if (widgetDesktopIdRef.current) {
                    (window as any).turnstile.remove(widgetDesktopIdRef.current);
                    widgetDesktopIdRef.current = null;
                }
            }
        };
    }, []);

    useEffect(() => {
        const verified = searchParams?.get("verified");
        const errorParam = searchParams?.get("error");

        if (verified === "true") {
            setSuccessMessage("¡Correo verificado! Ya puedes iniciar sesión.");
        } else if (verified === "already") {
            setSuccessMessage("Tu correo ya estaba verificado. Inicia sesión.");
        } else if (searchParams?.get("registered") === "true") {
            setSuccessMessage("Cuenta creada exitosamente. Ya puedes iniciar sesión.");
        }

        if (errorParam === "invalid_token") {
            setError("El enlace de verificación no es válido o ya fue usado.");
        } else if (errorParam === "token_missing") {
            setError("El enlace de verificación es incorrecto.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Login is actually handled by NextAuth, but we should STILL require Turnstile if it's there
        if (!turnstileToken) {
            setError("Por favor, completa la verificación anti-spam.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                turnstileToken, // Pass it to NextAuth authorize
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "EMAIL_NOT_VERIFIED") {
                    setError("¡Primero verifica tu correo! Revisa tu bandeja de entrada y haz clic en el enlace que te enviamos.");
                } else if (result.error === "SPAM_DETECTED") {
                    setError("Fallo en la verificación anti-spam.");
                } else {
                    setError("Credenciales inválidas");
                }
                // Reset Turnstile on error
                if ((window as any).turnstile) {
                    if (widgetMobileIdRef.current) (window as any).turnstile.reset(widgetMobileIdRef.current);
                    if (widgetDesktopIdRef.current) (window as any).turnstile.reset(widgetDesktopIdRef.current);
                    setTurnstileToken(null);
                }
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
        <div className="min-h-screen bg-white md:bg-slate-50 text-slate-900 selection:bg-green-500/30 overflow-x-hidden pt-20 flex flex-col items-center">
            
            {/* MOBILE LAYOUT */}
            <div className="w-full max-w-[400px] mx-auto flex flex-col lg:hidden px-6 pt-6 pb-12 bg-white relative z-20 font-sans">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Bienvenido</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-wide">Gestiona tu tienda de WhatsApp</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="tu@correo.com" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
                            <Link href="/auth/forgot-password" title="¿Olvidaste tu contraseña?" className="text-[11px] font-bold text-green-600 hover:text-green-500 transition-colors">¿Olvidaste tu contraseña?</Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="••••••••" />
                        </div>
                    </div>

                    {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-600" />{error}</div>}
                    {successMessage && <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />{successMessage}</div>}

                    {/* Turnstile Container (Mobile) */}
                    <div className="flex justify-center my-4 min-h-[65px]">
                        <div ref={turnstileMobileRef}></div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Entrar a mi Panel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                    ¿Aún no tienes cuenta?{' '}
                    <Link href="/auth/register" className="font-black text-green-600">Empieza gratis ahora</Link>
                </p>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden lg:grid max-w-6xl w-full mx-auto grid-cols-2 gap-12 items-center relative z-10 py-12 font-sans">
                <div className="space-y-8 pr-0 lg:pr-8">
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Regresar al inicio
                        </Link>
                        <h2 className="text-4xl font-black text-slate-900 leading-tight">
                            Únete a la tracción real de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Creatiendas</span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            Más que una herramienta, somos una comunidad de emprendedores creciendo cada día.
                        </p>
                    </div>
                    <SocialProofSection />
                </div>

                <div className="flex justify-end">
                    <div className="w-full max-w-[440px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-green-500/10 transition-all"></div>
                        <div className="text-center mb-10 relative z-10">
                            <h1 className="text-2xl font-black text-slate-900 mb-1">Bienvenido</h1>
                            <p className="text-slate-500 text-sm font-medium">Gestiona tu tienda de WhatsApp</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="tu@correo.com" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
                                    <Link href="/auth/forgot-password" title="¿Olvidaste tu contraseña?" className="text-xs font-bold text-green-600 hover:text-green-500 transition-colors">¿Olvidaste tu contraseña?</Link>
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="••••••••" />
                                </div>
                            </div>
                            {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-600" />{error}</div>}
                            {successMessage && <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />{successMessage}</div>}
                            
                            {/* Turnstile Container (Desktop) */}
                            <div className="flex justify-center my-4 min-h-[65px]">
                                <div ref={turnstileDesktopRef}></div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 hover:shadow-green-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn">
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Entrar a mi Panel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                        <p className="text-center mt-8 text-sm text-slate-500 font-medium">¿Aún no tienes cuenta?{' '}<Link href="/auth/register" className="font-black text-green-600 hover:text-green-500 transition-colors">Empieza gratis ahora</Link></p>
                    </div>
                </div>
            </div>

            <Script 
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad" 
                strategy="afterInteractive"
            />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen grid place-items-center bg-white font-sans"><div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
