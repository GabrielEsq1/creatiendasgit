"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useAnalytics } from "@/components/Analytics";
import { trackConversionEvent } from "@/lib/analytics";
import { SocialProofSection } from "@/components/SocialProofSection";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [hasTrackedLead, setHasTrackedLead] = useState(false);
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const playerRef = useRef<any>(null);
    
    // Separate refs and widgets for mobile/desktop
    const turnstileMobileRef = useRef<HTMLDivElement>(null);
    const turnstileDesktopRef = useRef<HTMLDivElement>(null);
    const widgetMobileIdRef = useRef<string | null>(null);
    const widgetDesktopIdRef = useRef<string | null>(null);

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
                        console.error("Turnstile mobile render error Register:", e);
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
                        console.error("Turnstile desktop render error Register:", e);
                    }
                }
            }
        };

        // Try to render if script is already there
        renderTurnstile();

        // Also set up a listener just in case it loads later
        (window as any).onTurnstileLoad = renderTurnstile;

        // Handle resize events to render the appropriate widget if crossing breakpoints
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

    // Auto-populate name from email (hidden field for backend compatibility)
    useEffect(() => {
        if (email) {
            const emailLocal = email.split('@')[0];
            const generatedName = emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1);
            setName(generatedName);
        }
    }, [email]);

    // Load YouTube IFrame API and set playback speed
    useEffect(() => {
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        // Set up player when API is ready
        (window as any).onYouTubeIframeAPIReady = () => {
            playerRef.current = new (window as any).YT.Player('demoVideo', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                }
            });
        };

        return () => {
            delete (window as any).onYouTubeIframeAPIReady;
        };
    }, []);

    const onPlayerReady = (event: any) => {
        event.target.setPlaybackRate(2); // Set to 2x speed
        // Autoplay is handled by iframe param, but we can track start here if it autoplays?
        // Actually, onStateChange is better for PLAYING status.
    };

    const onPlayerStateChange = (event: any) => {
        // YT.PlayerState.PLAYING = 1
        // YT.PlayerState.ENDED = 0
        if (event.data === 1) {
            trackEvent('video_start', { video_id: 'XQQfQYZ0Phk', location: 'register_page' });
        }
        if (event.data === 0) {
            trackEvent('video_complete', { video_id: 'XQQfQYZ0Phk', location: 'register_page' });
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!turnstileToken) {
            setError("Por favor, completa la verificación anti-spam.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, turnstileToken }),
            });

            if (res.ok) {
                const data = await res.json();
                trackEvent('signup', { method: 'email' });
                trackConversionEvent('CompleteRegistration');
                if (data.requiresVerification) {
                    setRegisteredEmail(email);
                    setEmailSent(true);
                } else {
                    router.push("/auth/login?registered=true");
                }
            } else {
                const contentType = res.headers.get("content-type");
                let errorMessage = "Error al registrarse";

                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    errorMessage = data.message || errorMessage;
                } else {
                    const text = await res.text();
                    console.error("Non-JSON error response:", text);
                    errorMessage = "Error de conexión con el servidor (500).";
                }

                setError(errorMessage);
                // Reset Turnstile on error so they can try again if it failed
                if ((window as any).turnstile) {
                    if (widgetMobileIdRef.current) (window as any).turnstile.reset(widgetMobileIdRef.current);
                    if (widgetDesktopIdRef.current) (window as any).turnstile.reset(widgetDesktopIdRef.current);
                    setTurnstileToken(null);
                }
            }
        } catch (err) {
            setError("Ocurrió un error al registrarse.");
            // Reset Turnstile on error
            if ((window as any).turnstile) {
                if (widgetMobileIdRef.current) (window as any).turnstile.reset(widgetMobileIdRef.current);
                if (widgetDesktopIdRef.current) (window as any).turnstile.reset(widgetDesktopIdRef.current);
                setTurnstileToken(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- EMAIL SENT SCREEN ---
    if (emailSent) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 pt-20 pb-12">
                <div className="w-full max-w-[400px] text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-3">¡Revisa tu correo!</h1>
                    <p className="text-slate-500 text-sm mb-2">
                        Enviamos un enlace de verificación a:
                    </p>
                    <p className="font-bold text-slate-900 text-base mb-6 break-all">{registeredEmail}</p>
                    <p className="text-slate-400 text-xs mb-8">
                        Haz clic en el enlace del correo para activar tu cuenta.<br />
                        Si no lo ves, revisa tu carpeta de spam.
                    </p>
                    <Link href="/auth/login" className="block w-full text-center py-3.5 px-4 border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all text-sm shadow-sm">
                        Volver al Login
                    </Link>
                    <a
                        href={`https://wa.me/573026687991?text=No%20recib%C3%AD%20el%20correo%20de%20verificaci%C3%B3n%20en%20${encodeURIComponent(registeredEmail)}`}
                        target="_blank"
                        className="block mt-4 text-xs text-green-600 font-bold hover:underline"
                    >
                        ¿No recibiste el correo? Escríbenos
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white md:bg-slate-50 text-slate-900 selection:bg-green-500/30 overflow-x-hidden pt-20 flex flex-col items-center">
            
            {/* --- MOBILE LAYOUT (FROM SCRATCH) --- */}
            <div className="w-full max-w-[400px] mx-auto flex flex-col lg:hidden px-6 pt-6 pb-12 bg-white relative z-20">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Crear cuenta <span className="text-green-600">gratis</span></h1>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">Tu tienda estará lista en el siguiente paso</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                onFocus={() => {
                                    if (!hasTrackedLead) {
                                        trackConversionEvent('Lead');
                                        setHasTrackedLead(true);
                                    }
                                }}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" 
                                placeholder="tu@negocio.com" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Contraseña</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="••••••••" />
                        </div>
                    </div>

                    {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-600" />{error}</div>}

                    {/* Cloudflare Turnstile (Mobile) */}
                    <div className="flex justify-center my-4 overflow-hidden min-h-[65px]">
                        <div ref={turnstileMobileRef}></div>
                    </div>

                    <div className="text-center py-1 mt-2">
                        <p className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Sin tarjeta · Cancelable · Acceso inmediato</p>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>¡Empezar ahora! <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    
                    <p className="text-center text-xs text-slate-500 mt-4 opacity-80">Al continuar, tu tienda se crea automáticamente</p>
                </form>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500 font-bold uppercase tracking-widest text-[10px]">¿Ya tienes cuenta?</span>
                    </div>
                </div>

                <Link href="/auth/login" className="block w-full text-center py-3.5 px-4 border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all text-base mb-6 shadow-sm active:scale-95">
                    Iniciar Sesión
                </Link>

                <p className="text-center text-slate-400 text-[10px] font-medium mt-auto">
                    © {new Date().getFullYear()} Creatiendas. Todos los derechos reservados.
                </p>
            </div>

            {/* --- DESKTOP LAYOUT --- */}
            <div className="hidden lg:grid container mx-auto px-4 py-8 relative z-10 max-w-7xl grid-cols-2 gap-12 items-center">
                <div className="space-y-10 lg:pr-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                            Crea tu tienda online en <span className="text-green-600">menos de 2 minutos</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            En el siguiente paso tu tienda ya estará lista para compartir por WhatsApp. <strong className="text-slate-900">No necesitas tarjeta.</strong>
                        </p>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <strong className="text-slate-900 text-lg font-bold">Publica productos en minutos</strong>
                                <p className="text-slate-600">Sin configuraciones complicadas</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">📲</span>
                            <div>
                                <strong className="text-slate-900 text-lg font-bold">Recibe pedidos por WhatsApp</strong>
                                <p className="text-slate-600">Conecta directo con tus clientes</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">💰</span>
                            <div>
                                <strong className="text-slate-900 text-lg font-bold">0% comisiones</strong>
                                <p className="text-slate-600">Todo el dinero es tuyo</p>
                            </div>
                        </li>
                    </ul>
                    <div className="pt-4 border-t border-slate-100">
                        <SocialProofSection />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Así de fácil
                        </p>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-slate-100" style={{ paddingBottom: '56.25%' }}>
                            <iframe id="demoVideo" className="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/XQQfQYZ0Phk?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=XQQfQYZ0Phk" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 max-w-[480px] w-full relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-green-500/10 transition-all"></div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 relative z-10">Crear cuenta <span className="text-green-600">gratis</span></h2>
                        <p className="text-base text-slate-500 mb-8 font-medium">Tu tienda estará lista en el siguiente paso</p>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input 
                                        type="email" 
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        onFocus={() => {
                                            if (!hasTrackedLead) {
                                                trackConversionEvent('Lead');
                                                setHasTrackedLead(true);
                                            }
                                        }}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" 
                                        placeholder="tu@negocio.com" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Contraseña</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600/50 transition-all shadow-inner" placeholder="••••••••" />
                                </div>
                            </div>
                            {error && <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-600" />{error}</div>}
                            
                            {/* Cloudflare Turnstile (Desktop) */}
                            <div className="flex justify-center my-4 min-h-[65px]">
                                <div ref={turnstileDesktopRef}></div>
                            </div>

                            <div className="text-center py-2"><p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sin tarjeta · Cancelable · Acceso inmediato</p></div>
                            <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>¡Empezar ahora! <ArrowRight className="w-4 h-4" /></>}
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">Al continuar, tu tienda se crea automáticamente</p>
                        </form>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500 font-bold uppercase tracking-widest">¿Ya tienes cuenta?</span></div>
                        </div>

                        <Link href="/auth/login" className="block w-full text-center py-4 px-4 border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all text-lg">
                            Iniciar Sesión
                        </Link>
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
