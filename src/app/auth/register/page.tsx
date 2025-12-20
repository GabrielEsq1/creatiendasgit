"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAnalytics } from "@/components/Analytics";
import { SocialProofSection } from "@/components/SocialProofSection";
import FestiveManager from "@/components/FestiveManager";

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
                }
            });
        };

        return () => {
            delete (window as any).onYouTubeIframeAPIReady;
        };
    }, []);

    const onPlayerReady = (event: any) => {
        event.target.setPlaybackRate(2); // Set to 2x speed
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
                const data = await res.json();
                setError(data.message || "Error al registrarse");
            }
        } catch (err) {
            setError("Ocurrió un error al registrarse.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
            <FestiveManager />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

                    {/* LEFT COLUMN - Info + Video */}
                    <div className="space-y-8 order-2 lg:order-1">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/40 transform rotate-3">
                                <span className="text-2xl">🏪</span>
                            </div>
                            <span className="text-2xl font-black text-white">Creatiendas 🎄</span>
                        </div>

                        {/* Main Message */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                Crea tu tienda online en <span className="text-green-400">menos de 2 minutos</span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                En el siguiente paso tu tienda ya estará lista para compartir por WhatsApp. <strong className="text-white">No necesitas tarjeta. ❄️</strong>
                            </p>
                        </div>

                        {/* Benefits */}
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">⚡</span>
                                <div>
                                    <strong className="text-white text-lg font-bold">Publica productos en minutos</strong>
                                    <p className="text-slate-400">Sin configuraciones complicadas</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">📲</span>
                                <div>
                                    <strong className="text-white text-lg font-bold">Recibe pedidos por WhatsApp</strong>
                                    <p className="text-slate-400">Conecta directo con tus clientes</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">💰</span>
                                <div>
                                    <strong className="text-white text-lg font-bold">0% comisiones</strong>
                                    <p className="text-slate-400">Todo el dinero es tuyo</p>
                                </div>
                            </li>
                        </ul>

                        {/* Social Proof (Real-time activity) */}
                        <div className="pt-4 border-t border-white/5">
                            <SocialProofSection />
                        </div>

                        {/* Video Demo */}
                        <div>
                            <p className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Así de fácil 🍿
                            </p>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900/50 bg-slate-950" style={{ paddingBottom: '56.25%' }}>
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
                        {/* WhatsApp Help Button - Conversion Bottleneck Solution */}
                        <div className="mb-6 bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border-2 border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center">
                                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-black text-base sm:text-lg mb-1">¿Tienes alguna duda? 🎅</p>
                                    <p className="text-slate-400 text-xs sm:text-sm mb-3 font-medium">Escríbeme y te ayudo en menos de 1 minuto 👋</p>
                                    <a
                                        href="https://wa.me/573026687991?text=Hola!%20Tengo%20una%20duda%20sobre%20c%C3%B3mo%20crear%20mi%20tienda"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-green-500 text-white font-black px-5 py-3 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-green-900/40 text-sm sm:text-base min-h-[44px]"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        <span className="whitespace-nowrap">Chatear ahora</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/10 p-8 md:p-10 relative overflow-hidden group/form hover:border-green-500/30 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover/form:bg-green-500/10 transition-all"></div>
                            <h2 className="text-3xl font-black text-white mb-2 relative z-10">Crear cuenta <span className="text-green-400">gratis</span> 🎁</h2>
                            <p className="text-sm sm:text-base text-slate-400 mb-8 font-medium">Tu tienda estará lista en el siguiente paso ❄️</p>

                            <form onSubmit={handleRegister} className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-500 group-focus-within/input:text-green-400 transition-colors" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-lg shadow-inner"
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
                                        <label htmlFor="password" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                                            Contraseña
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-500 group-focus-within/input:text-green-400 transition-colors" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                autoComplete="new-password"
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-lg shadow-inner"
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
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-2xl shadow-green-900/40 hover:shadow-green-500/40 text-lg sm:text-xl min-h-[48px]"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            ¡Empezar mi Regalo! 🎅
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-sm text-gray-500 mt-4">
                                    Al continuar, tu tienda se crea automáticamente
                                </p>
                            </form>

                            {/* Divider */}
                            <div className="relative my-10">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-900 text-slate-500 font-bold uppercase tracking-widest">¿Ya tienes cuenta?</span>
                                </div>
                            </div>

                            <Link
                                href="/auth/login"
                                className="block w-full text-center py-4 px-4 border border-white/10 rounded-2xl font-black text-slate-300 hover:bg-white/5 hover:border-white/20 transition-all text-lg"
                            >
                                Iniciar Sesión 🏠
                            </Link>
                        </div>

                        <p className="text-center text-slate-500 mt-6 font-medium">
                            © 2024 Creatiendas. Todos los derechos reservados. 🎁
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
