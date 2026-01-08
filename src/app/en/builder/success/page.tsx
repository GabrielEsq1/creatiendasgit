'use client';
export const dynamic = "force-dynamic";

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Download, Share2, ArrowRight, Store, PartyPopper, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

function SuccessContentEN() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    // Get store details from URL
    const storeName = searchParams.get('storeName') || 'Your Store';
    const slug = searchParams.get('slug') || '';

    // IMPORTANT: Path-based URL format
    const storeUrl = slug
        ? `https://creatiendas.co/stores/${slug}`
        : 'https://creatiendas.co';

    useEffect(() => {
        setMounted(true);
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

    const handleWhatsAppShare = () => {
        const message = `🚀 My online store is ready!\nVisit it here 👉 ${storeUrl}\nContact me if you need anything!`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-900 text-white font-sans">
                <p>Preparing your store...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-green-500/30">

            <div className="text-center mb-8">
                <div className="inline-block p-4 bg-green-500/20 rounded-full mb-6 backdrop-blur-md border border-green-500/30 animate-bounce">
                    <PartyPopper className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-none">
                    YOUR STORE IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">READY</span>
                </h1>
                <p className="text-xl text-indigo-100 max-w-xl mx-auto font-medium opacity-90">
                    <strong>{storeName}</strong> is now live and waiting for orders.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl items-stretch justify-center">

                <div className="w-full lg:max-w-sm flex flex-col">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex-1 flex flex-col border border-white/20">
                        <div className="bg-indigo-600 p-8 text-white text-center">
                            <h3 className="font-bold text-2xl mb-1 tracking-tight">{storeName}</h3>
                            <p className="text-indigo-200 text-sm flex items-center justify-center gap-2 uppercase tracking-widest font-bold">
                                <Store className="w-4 h-4" /> Online Store
                            </p>
                        </div>
                        <div className="p-10 flex flex-col items-center justify-center bg-gray-50 flex-1">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group" ref={qrRef}>
                                <QRCodeSVG
                                    value={storeUrl}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <p className="mt-6 text-gray-400 font-mono text-xs bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
                                creatiendas.co/stores/{slug}
                            </p>
                        </div>
                        <button
                            onClick={handleDownloadQR}
                            className="w-full bg-gray-900 text-white py-5 px-4 text-center text-xs uppercase tracking-[0.2em] font-black hover:bg-black transition-all flex items-center justify-center gap-3 border-t border-white/5"
                        >
                            <Download className="w-5 h-5" />
                            Download QR
                        </button>
                    </div>
                </div>

                <div className="w-full lg:max-w-md flex flex-col gap-6">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 flex-1 flex flex-col border border-white/10">
                        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Share it!</h2>
                        <p className="text-gray-500 text-base mb-8 font-medium">Get your first customers by sharing your link on WhatsApp.</p>

                        <button
                            onClick={handleWhatsAppShare}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-xl font-black py-5 px-8 rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-green-500/20 mb-6"
                        >
                            <Share2 className="w-7 h-7" />
                            Share on WhatsApp
                        </button>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => window.open(storeUrl, '_blank')}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all"
                            >
                                <ExternalLink className="w-5 h-5" />
                                View my store
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="w-full py-4 px-6 rounded-2xl border-2 border-gray-100 text-gray-700 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Link Copied!' : 'Copy Link'}
                            </button>
                        </div>

                        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Store Link</p>
                            <p className="text-sm font-mono text-indigo-500 break-all font-bold">{storeUrl}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-600/30 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10">
                        <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            Next Steps
                        </h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/en/dashboard')}
                                className="w-full text-left flex items-center gap-4 text-white bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all border border-white/5 group"
                            >
                                <span className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-sm font-black shadow-lg">1</span>
                                <span className="flex-1 font-bold">Go to Dashboard</span>
                                <ArrowRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button
                                onClick={() => router.push(`/en/builder?edit=${slug}`)}
                                className="w-full text-left flex items-center gap-4 text-white bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all border border-white/5 group"
                            >
                                <span className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center text-sm font-black shadow-lg">2</span>
                                <span className="flex-1 font-bold">Edit Products</span>
                                <ArrowRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center opacity-50">
                <p className="text-white text-xs font-black uppercase tracking-[0.2em]">
                    Join more than 1,000 active merchants 🚀
                </p>
            </div>
        </div>
    );
}

export default function SuccessPageEN() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-indigo-900 text-white">Loading...</div>}>
            <SuccessContentEN />
        </Suspense>
    );
}
