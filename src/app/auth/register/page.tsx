"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import Link from "next/link";
import { useAnalytics } from "@/components/Analytics";
import { SocialProofSection } from "@/components/SocialProofSection";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const playerRef = useRef<any>(null);

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

    // Original handler - NO CHANGES
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                trackEvent('signup', { method: 'email' });
                router.push("/auth/login?registered=true");
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
            }
        } catch (err) {
            setError("Ocurrió un error al registrarse.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-green-500/30 overflow-x-hidden pt-20">
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">

                    {/* Left Column: Info & Value Prop */}
                    <div className="space-y-10 lg:pr-12 order-2 lg:order-1">
                        {/* Title Section (Optimized for 2026) */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                                Crea tu tienda online en <span className="text-green-600">menos de 2 minutos</span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                En el siguiente paso tu tienda ya estará lista para compartir por WhatsApp. <strong className="text-slate-900">No necesitas tarjeta.</strong>
                            </p>
                        </div>

                        {/* Benefits */}
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

                        {/* Social Proof (Real-time activity) */}
                        <div className="pt-4 border-t border-slate-100">
                            <SocialProofSection />
                        </div>

                        {/* Video Demo */}
                        <div>
                            <p className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Así de fácil
                            </p>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-slate-100" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                    id="demoVideo"
                                    className="absolute top-0 left-0 w-full h-full"
                                    src="https://www.youtube.com/embed/XQQfQYZ0Phk?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=XQQfQYZ0Phk"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Register Form */}
                    <div className="order-1 lg:order-2">
                        {/* WhatsApp Help Button - Conversion Bottleneck Solution (Commented out for focus)
                        <div className="mb-6 bg-white rounded-[2rem] p-6 shadow-lg border border-slate-100 relative overflow-hidden group">
                           ... content ...
                        </div>
                        */}

                        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 sm:p-8 md:p-10 mx-auto w-full max-w-[480px] lg:max-w-none relative overflow-hidden group/form hover:border-green-500/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover/form:bg-green-500/10 transition-all"></div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 relative z-10">Crear cuenta <span className="text-green-600">gratis</span></h2>
                            <p className="text-sm sm:text-base text-slate-500 mb-8 font-medium">Tu tienda estará lista en el siguiente paso</p>


                            <form onSubmit={handleRegister} className="space-y-5">
                                {/* Social Login - Disabled for now */}
                                {/* <button
                                    type="button"
                                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                >
                                    <Chrome className="w-5 h-5 text-slate-900" />
                                    Continuar con Google
                                </button>

                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-100"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-wider">O usa tu correo</span>
                                    </div>
                                </div> */}
                                {/* Email Input */}
                                <div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-lg shadow-inner"
                                                placeholder="tu@negocio.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <div>
                                        <label htmlFor="password" className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">
                                            Contraseña
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-400 group-focus-within/input:text-green-600 transition-colors" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                autoComplete="new-password"
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-lg shadow-inner"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="text-center py-2 flex flex-col sm:block gap-1 max-w-full overflow-hidden">
                                    <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider truncate whitespace-normal">
                                        Sin tarjeta · Cancelable · Acceso inmediato
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative group/btn h-16 bg-green-500 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-green-200 disabled:opacity-70"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transition-opacity group-hover/btn:opacity-100 opacity-0" />
                                    <div className="relative flex items-center justify-center gap-3 text-white font-black text-lg">
                                        {loading ? (
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                ¡Empezar ahora!
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </div>
                                </button>
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    Al continuar, tu tienda se crea automáticamente
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 py-2 rounded-lg border border-slate-100/50">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    🔥 14 personas crearon su tienda en la última hora
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="relative my-10">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-500 font-bold uppercase tracking-widest">¿Ya tienes cuenta?</span>
                                </div>
                            </div>

                            <Link
                                href="/auth/login"
                                className="block w-full text-center py-4 px-4 border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-lg"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>

                        <p className="text-center text-slate-500 mt-6 font-medium">
                            © {new Date().getFullYear()} Creatiendas. Todos los derechos reservados.
                        </p>
                    </div>

                </div>
            </div>
        </div >
    );
}
