'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Share2, Download, ExternalLink, Copy, ArrowLeft, Sparkles } from 'lucide-react';

function SuccessPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [storeUrl, setStoreUrl] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [copied, setCopied] = useState(false);

    const slug = searchParams?.get('slug') || '';

    useEffect(() => {
        if (!slug) {
            router.push('/dashboard');
            return;
        }

        // Construir URL de la tienda
        const url = `https://${slug}.creatiendas.co`;
        setStoreUrl(url);

        // Generar QR usando API pública de alta calidad
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=059669&margin=20`;
        setQrCode(qrUrl);

        // Confeti celebration
        triggerConfetti();
    }, [slug, router]);

    const triggerConfetti = () => {
        // Crear confeti con JavaScript puro
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Crear partículas desde diferentes posiciones
            createConfettiParticles(particleCount, {
                ...defaults,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            createConfettiParticles(particleCount, {
                ...defaults,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    const createConfettiParticles = (count: number, options: any) => {
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${(options.origin.x * 100)}%;
                top: ${(options.origin.y * 100 + 50)}%;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
                animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 4000);
        }
    };

    if (!slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = () => {
        const text = `🎉 ¡Mira mi nueva tienda online! ${storeUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const downloadQR = () => {
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `${slug}-qr-code.png`;
        link.click();
    };

    return (
        <>
            <style jsx global>{`
                @keyframes confetti-fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
                    50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8); }
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Success Header */}
                    <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl" style={{ animation: 'float 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite' }}>
                            <Sparkles className="w-12 h-12 text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                            ¡Tu Tienda Está Lista!
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 font-medium">
                            Empieza a recibir pedidos por WhatsApp 🚀
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/50 p-8 md:p-12 mb-8 animate-in fade-in slide-in-from-bottom duration-700">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column - QR Code */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="mb-6">
                                    <p className="text-sm font-black uppercase tracking-widest text-gray-500 text-center mb-4">
                                        Escanea para visitar
                                    </p>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative bg-white p-6 rounded-3xl shadow-xl border-4 border-green-100">
                                            {qrCode && (
                                                <img
                                                    src={qrCode}
                                                    alt="QR Code de tu tienda"
                                                    className="w-64 h-64 md:w-72 md:h-72"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={downloadQR}
                                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                >
                                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                                    Descargar QR
                                </button>
                            </div>

                            {/* Right Column - Actions */}
                            <div className="flex flex-col justify-center space-y-6">
                                {/* URL Input */}
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-wider text-gray-700 mb-3">
                                        🔗 Enlace de tu tienda
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={storeUrl}
                                            readOnly
                                            className="flex-1 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-mono text-sm focus:outline-none focus:border-green-500 transition-colors"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold transition-all hover:scale-105 flex items-center gap-2"
                                        >
                                            {copied ? (
                                                <>✓ Copiado</>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copiar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <a
                                        href={storeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-center gap-3 w-full px-6 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        <ExternalLink className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        Ver mi Tienda Online
                                    </a>

                                    <button
                                        onClick={shareWhatsApp}
                                        className="group flex items-center justify-center gap-3 w-full px-6 py-5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        Compartir en WhatsApp
                                    </button>
                                </div>

                                {/* Tips */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 mt-4">
                                    <p className="text-sm font-bold text-purple-900 mb-2">💡 Consejo Pro:</p>
                                    <p className="text-sm text-purple-800">
                                        Comparte el QR en tus redes sociales, imprime stickers, o agrégalo a tu tarjeta de presentación para que más clientes te encuentren.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-bold transition-all hover:gap-3"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver a mi Panel
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Preparando tu página de éxito...</p>
                </div>
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}
