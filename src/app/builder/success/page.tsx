'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Share2, ArrowRight, Store, PartyPopper, CheckCircle2, Copy, Instagram, Facebook, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import SocialShareImageGenerator from '@/components/SocialShareImageGenerator';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'whatsapp' | 'instagram' | 'facebook'>('whatsapp');
    const [copied, setCopied] = useState(false);

    // Get store details from URL or local storage
    const storeName = searchParams.get('storeName') || 'Tu Tienda';
    const slug = searchParams.get('slug');
    const host = typeof window !== 'undefined' ? window.location.host : 'creatiendas.co';
    const storeUrl = slug
        ? `${window.location.protocol}//${host}/${slug}`
        : 'https://creatiendas.co';

    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        // Trigger celebration confetti pointed at the share button
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            // Left side confetti
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 }, // Lower origin
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
            });
            // Right side confetti
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 }, // Lower origin
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
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

    const whatsappMessages = {
        launch: `🚀 ¡Ya tengo tienda online!\nVisítala aquí 👉 ${storeUrl}\nEscríbeme por WhatsApp si te interesa algo.`,
        promo: `🔥 ¡Nuevos productos en mi tienda!\nMira el catálogo completo aquí 👉 ${storeUrl}`,
        catalog: `📦 Te comparto mi catálogo digital.\nHaz tu pedido fácil y rápido aquí 👉 ${storeUrl}`
    };

    const [wsMessage, setWsMessage] = useState(whatsappMessages.launch);

    const handleWhatsAppShare = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(wsMessage)}`, '_blank');
        // Simple analytics log
        console.log('Share: WhatsApp Clicked');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        console.log('Share: Link Copied');
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center p-4 md:p-8 font-sans">

            {/* Header / Success Message */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top-10 duration-700">
                <div className="inline-block p-3 bg-green-500/20 rounded-full mb-4 backdrop-blur-sm border border-green-500/30">
                    <PartyPopper className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                    🎉 Tu tienda ya está en internet.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                        Ahora haz que todos la vean.
                    </span>
                </h1>
                <p className="text-lg text-indigo-100 max-w-xl mx-auto font-medium">
                    Comparte tu tienda hoy y consigue tus primeros visitantes gratis en minutos.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl items-start justify-center">

                {/* Left Column: Share Card & Actions */}
                <div className="w-full lg:max-w-md space-y-6">

                    {/* Share Card Visualization */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 relative group">
                        <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-xl mb-1">{storeName}</h3>
                                <p className="text-indigo-200 text-sm flex items-center justify-center gap-1">
                                    <Store className="w-3 h-3" /> Compra online
                                </p>
                            </div>
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
                            <p className="mt-4 text-gray-900 font-mono text-sm bg-gray-100 px-3 py-1 rounded-full">
                                {host}/{slug}
                            </p>
                        </div>
                        <div className="bg-gray-900 text-white p-4 text-center text-xs uppercase tracking-widest font-semibold cursor-pointer hover:bg-black transition-colors" onClick={handleDownloadQR}>
                            <Download className="w-4 h-4 inline mr-2" />
                            Descargar Tarjeta (QR)
                        </div>
                    </div>

                    {/* Sales Accelerator Checklist */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Empieza a vender hoy mismo
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-indigo-100 bg-indigo-900/50 p-3 rounded-xl border border-indigo-500/30">
                                <span className="bg-green-500 text-black p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></span>
                                <span className="flex-1 font-medium">Crea tu tienda</span>
                            </div>
                            <div className="flex items-center gap-3 text-white cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors" onClick={() => document.getElementById('share-section')?.scrollIntoView({ behavior: 'smooth' })}>
                                <span className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-xs font-mono text-gray-400">2</span>
                                <span className="flex-1">Comparte en WhatsApp</span>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                            </div>
                            <button onClick={() => router.push('/dashboard')} className="w-full text-left flex items-center gap-3 text-white cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors">
                                <span className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-xs font-mono text-gray-400">3</span>
                                <span className="flex-1">Agrega tu primer producto</span>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Distribution Hub */}
                <div className="w-full lg:max-w-md" id="share-section">
                    <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparte donde vendes</h2>
                        <p className="text-gray-500 text-sm mb-6">Elige un mensaje y envíalo a tus clientes.</p>

                        {/* Platform Tabs */}
                        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                            {['whatsapp', 'instagram', 'facebook'].map((platform) => (
                                <button
                                    key={platform}
                                    onClick={() => setActiveTab(platform as any)}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all capitalize flex items-center justify-center gap-2
                                    ${activeTab === platform ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {platform === 'whatsapp' && <Share2 className="w-4 h-4" />}
                                    {platform === 'instagram' && <Instagram className="w-4 h-4" />}
                                    {platform === 'facebook' && <Facebook className="w-4 h-4" />}
                                    <span className="hidden sm:inline">{platform}</span>
                                </button>
                            ))}
                        </div>

                        {activeTab === 'whatsapp' && (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                {/* Message Variants */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Elige tu mensaje:</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'launch', label: '🚀 Lanzamiento' },
                                            { id: 'promo', label: '🔥 Promoción' },
                                            { id: 'catalog', label: '📦 Catálogo' }
                                        ].map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setWsMessage(whatsappMessages[variant.id as keyof typeof whatsappMessages])}
                                                className={`text-xs py-2 px-2 rounded-lg border font-medium transition-all
                                                ${wsMessage === whatsappMessages[variant.id as keyof typeof whatsappMessages]
                                                        ? 'bg-green-50 border-green-500 text-green-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                            >
                                                {variant.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{wsMessage}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleWhatsAppShare}
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-lg font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-green-500/20"
                                >
                                    <Share2 className="w-6 h-6" />
                                    Enviar por WhatsApp
                                </button>
                                <p className="text-center text-xs text-gray-400">Es gratis y toma 10 segundos</p>
                            </div>
                        )}

                        {activeTab === 'instagram' && (
                            <div className="animate-in fade-in zoom-in duration-300 text-center py-8">
                                <SocialShareImageGenerator storeName={storeName} slug={slug || ''} />
                            </div>
                        )}

                        {activeTab === 'facebook' && (
                            <div className="animate-in fade-in zoom-in duration-300 text-center py-8">
                                <div className="bg-blue-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/30">
                                    <Facebook className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Publicar en Facebook</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Publica el enlace de tu tienda directamente en tu muro.
                                </p>
                                <button
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storeUrl)}`, '_blank')}
                                    className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-6 rounded-xl transition-colors"
                                >
                                    Compartir en Facebook
                                </button>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={handleCopyLink}
                                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                {copied ? '¡Enlace copiado!' : 'Copiar enlace de la tienda'}
                            </button>
                        </div>

                    </div>

                    {/* Trust Strip */}
                    <div className="mt-8 text-center">
                        <p className="text-indigo-200 text-xs font-medium">
                            Más de 1,000 tiendas ya venden con Creatiendas 🚀
                            <br />
                            Hecho para emprendedores en Latinoamérica 🇨🇴🇲🇽🇦🇷
                        </p>
                    </div>
                </div>
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
