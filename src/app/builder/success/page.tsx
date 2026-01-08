'use client';
export const dynamic = "force-dynamic";

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Download, Share2, ArrowRight, Store, PartyPopper, CheckCircle2, Copy, QrCode, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    // Get store details from URL
    const storeName = searchParams.get('storeName') || 'Tu Tienda';
    const slug = searchParams.get('slug') || '';

    // IMPORTANT: Always use path-based URL format
    const hasValidSlug = slug && slug !== 'undefined' && slug !== 'null';
    const storeUrl = hasValidSlug
        ? `https://creatiendas.co/stores/${slug}`
        : 'https://creatiendas.co';

    useEffect(() => {
        // Simple confetti effect using dynamic import to avoid SSR issues
        import('canvas-confetti').then(confettiModule => {
            const confetti = confettiModule.default;
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }).catch(err => console.log('Confetti not available'));
    }, []);

    const handleDownloadQR = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (svg) {
            const xml = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([xml], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = `${storeName.replace(/\s+/g, '-').toLowerCase()}-qr.svg`;
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        }
    };


    const handleCopyLink = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    const t = {
        title: '🎉 ¡Tu tienda está lista!',
        subtitle: 'Ahora compártela con el mundo',
        descriptionPrefix: 'Tu tienda',
        descriptionSuffix: 'ya está en línea.',
        onlineStore: 'Tienda Online',
        downloadQR: 'Descargar QR',
        shareTitle: 'Comparte tu tienda',
        shareDescription: 'Envía tu tienda a tus clientes por WhatsApp.',
        whatsappButton: 'Compartir por WhatsApp',
        viewStore: 'Ver mi tienda',
        copyLink: 'Copiar enlace',
        copied: '¡Enlace copiado!',
        storeLinkLabel: 'Enlace de tu tienda:',
        nextSteps: 'Próximos pasos',
        step1: 'Agregar más productos',
        step2: 'Compartir en tus redes',
        trust: 'Más de 1,000 tiendas ya venden con Creatiendas 🚀'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center p-4 md:p-8">

            {/* Header / Success Message */}
            <div className="text-center mb-8">
                <div className="inline-block p-3 bg-green-500/20 rounded-full mb-4 backdrop-blur-sm border border-green-500/30">
                    <PartyPopper className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                    {t.title}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                        {t.subtitle}
                    </span>
                </h1>
                <p className="text-lg text-indigo-100 max-w-xl mx-auto font-medium">
                    {t.descriptionPrefix} <strong>{storeName}</strong> {t.descriptionSuffix}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-start justify-center">

                {/* Left Column: QR Card */}
                <div className="w-full lg:max-w-sm">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-indigo-600 p-6 text-white text-center">
                            <h3 className="font-bold text-xl mb-1">{storeName}</h3>
                            <p className="text-indigo-200 text-sm flex items-center justify-center gap-1">
                                <Store className="w-3 h-3" /> {t.onlineStore}
                            </p>
                        </div>
                        <div className="p-8 flex flex-col items-center justify-center bg-gray-50">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100" ref={qrRef}>
                                <QRCodeSVG
                                    value={storeUrl}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <p className="mt-4 text-gray-900 font-mono text-xs bg-gray-100 px-3 py-1 rounded-full">
                                creatiendas.co/stores/{slug}
                            </p>
                        </div>
                        <button
                            onClick={handleDownloadQR}
                            className="w-full bg-gray-900 text-white p-4 text-center text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            {t.downloadQR}
                        </button>
                    </div>
                </div>

                {/* Right Column: Share Actions */}
                <div className="w-full lg:max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.shareTitle}</h2>
                        <p className="text-gray-500 text-sm mb-6">{t.shareDescription}</p>

                        {/* WhatsApp Share - Primary Action */}
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`¡Ya tengo tienda online! Visítala aquí: ${storeUrl}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-lg font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-green-500/20 mb-4 no-underline"
                        >
                            <Share2 className="w-6 h-6" />
                            {t.whatsappButton}
                        </a>

                        {/* Visit Store */}
                        <a
                            href={storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mb-4 no-underline"
                        >
                            <ExternalLink className="w-5 h-5" />
                            {t.viewStore}
                        </a>

                        {/* Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            {copied ? t.copied : t.copyLink}
                        </button>

                        {/* URL Display */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">{t.storeLinkLabel}</p>
                            <p className="text-sm font-mono text-indigo-600 break-all">{storeUrl}</p>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            {t.nextSteps}
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    if (slug && slug !== 'undefined' && slug !== 'null') {
                                        window.location.href = `/builder?edit=${slug}`;
                                    } else {
                                        window.location.href = '/dashboard';
                                    }
                                }}
                                className="w-full text-left flex items-center gap-3 text-white cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all"
                            >
                                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-mono">1</span>
                                <span className="flex-1 font-bold">{t.step1}</span>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                            </button>
                            <button
                                onClick={() => {
                                    if (slug && slug !== 'undefined' && slug !== 'null') {
                                        window.location.href = `/builder?edit=${slug}`;
                                    } else {
                                        window.location.href = '/dashboard';
                                    }
                                }}
                                className="w-full text-left flex items-center gap-3 text-white cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all"
                            >
                                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-mono">2</span>
                                <span className="flex-1 font-bold">{t.step2}</span>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Strip */}
            <div className="mt-8 text-center">
                <p className="text-indigo-200 text-xs font-medium">
                    {t.trust}
                </p>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-indigo-900 text-white">Preparando tu tienda...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
