'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, Download, ExternalLink, Share2, Sparkles } from 'lucide-react';

function SuccessPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const [storeUrl, setStoreUrl] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [copied, setCopied] = useState(false);

    const slug = searchParams?.get('slug');

    useEffect(() => {
        setMounted(true);
        if (!slug) return;

        // Construir URL limpia
        const url = `https://${slug}.creatiendas.co`;
        setStoreUrl(url);

        // Generar QR de alta resolución
        // Usamos una API externa confiable para evitar problemas de renderizado en cliente
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&margin=10`);

        // Efecto visual simple al cargar
        const hasConfetti = typeof window !== 'undefined' && (window as any).confetti;
        if (hasConfetti) {
            try {
                (window as any).confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } catch (e) {
                // Ignorar error si falla el confetti, no es crítico
            }
        }
    }, [slug]);

    if (!mounted) return null;

    if (!slug) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-xl font-bold text-red-500">Error: No se encontró la tienda</h1>
                <Link href="/dashboard" className="text-blue-500 underline mt-4">Volver al Dashboard</Link>
            </div>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const text = `¡Hola! Te invito a visitar mi nueva tienda online: ${storeUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleDownloadQR = async () => {
        try {
            const response = await fetch(qrCode);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-${slug}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            window.open(qrCode, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar simple */}
            <header className="bg-white border-b border-slate-200 py-4 px-6 fixed top-0 w-full z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Link>
                    <span className="font-bold text-slate-900">Creatiendas</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-12">
                <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-green-500 p-8 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg animate-bounce-slow">
                                <Sparkles className="w-8 h-8 text-green-500" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                                ¡Tu tienda está lista!
                            </h1>
                            <p className="text-green-100 text-lg font-medium">
                                Ya puedes empezar a vender por WhatsApp
                            </p>
                        </div>
                        {/* Círculos decorativos */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Columna Izquierda: QR */}
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-slate-100 mb-6 group hover:border-green-500 transition-colors duration-300">
                                    <img
                                        src={qrCode}
                                        alt="Código QR de tu tienda"
                                        className="w-48 h-48 md:w-56 md:h-56 object-contain"
                                    />
                                </div>
                                <button
                                    onClick={handleDownloadQR}
                                    className="flex items-center gap-2 text-slate-600 hover:text-green-600 font-bold transition-colors bg-slate-50 px-4 py-2 rounded-lg hover:bg-green-50"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar QR
                                </button>
                            </div>

                            {/* Columna Derecha: Acciones */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Enlace de tu tienda
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-mono text-sm truncate flex items-center">
                                            {storeUrl}
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center min-w-[3.5rem] ${copied
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-green-500 hover:text-green-500'
                                                }`}
                                        >
                                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href={storeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg border-b-4 border-slate-950"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Visitar Tienda
                                    </a>

                                    <button
                                        onClick={handleWhatsApp}
                                        className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-green-500/20 border-b-4 border-[#128c7e]"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Compartir por WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Cargando...</div>}>
            <SuccessPageContent />
        </Suspense>
    );
}
