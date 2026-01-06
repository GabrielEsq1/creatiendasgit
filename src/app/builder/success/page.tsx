'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import StoreQRCode from '@/components/StoreQRCode';
import { Link as LinkIcon, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

// Force dynamic to avoid static prerendering issues with searchParams
export const dynamic = "force-dynamic";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = searchParams?.get('slug');
    const [publicUrl, setPublicUrl] = useState('');

    useEffect(() => {
        try {
            console.log('[Success] Loading for slug:', slug);
            if (slug) {
                const origin = typeof window !== 'undefined' ? window.location.origin : 'https://creatiendas.co';
                const safeSlug = typeof slug === 'string' ? slug : String(slug);
                const finalUrl = `${origin}/stores/${encodeURIComponent(safeSlug)}`;
                setPublicUrl(finalUrl);
                console.log('[Success] Public URL:', finalUrl);

                // Fire confetti with safety
                if (typeof confetti === 'function') {
                    const duration = 3000;
                    const end = Date.now() + duration;

                    const frame = () => {
                        confetti({
                            particleCount: 2,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0, y: 0.6 },
                            colors: ['#2196F3', '#FFEB3B', '#4CAF50']
                        });
                        confetti({
                            particleCount: 2,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1, y: 0.6 },
                            colors: ['#2196F3', '#FFEB3B', '#4CAF50']
                        });

                        if (Date.now() < end) {
                            requestAnimationFrame(frame);
                        }
                    };
                    frame();
                }
            }
        } catch (err) {
            console.error('[Success] Error in effect:', err);
        }
    }, [slug]);

    if (!slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle floating elements for a premium feel */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-700 border border-slate-100 relative z-10">
                {/* Header Section */}
                <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-500/10 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40 animate-bounce">
                            <span className="text-5xl">🚀</span>
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">¡Tu Tienda está Lista!</h1>
                        <p className="text-slate-400 text-xl font-medium">Empieza a vender por WhatsApp ahora mismo.</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-10 space-y-10">

                    {/* QR Code Section */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 text-center border border-slate-100 transition-all hover:bg-slate-100/50">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Escanea para ver en tu móvil</p>
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-white rounded-[2rem] shadow-xl border border-slate-100">
                                {publicUrl ? (
                                    <StoreQRCode url={publicUrl} size={220} storeName={slug} />
                                ) : (
                                    <div className="w-[220px] h-[220px] bg-slate-50 animate-pulse rounded-xl" />
                                )}
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Tus clientes pueden acceder instantáneamente escaneando este código.</p>
                    </div>

                    {/* Social/Sharing Actions */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Enlace directo:</label>
                            <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                <input
                                    readOnly
                                    value={publicUrl}
                                    className="flex-1 bg-transparent border-none outline-none px-4 text-slate-600 font-bold"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(publicUrl);
                                        const btn = document.getElementById('copy-btn');
                                        if (btn) btn.innerText = '✅ Copiado';
                                        setTimeout(() => { if (btn) btn.innerText = '📋 Copiar'; }, 2000);
                                    }}
                                    id="copy-btn"
                                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    📋 Copiar
                                </button>
                            </div>
                        </div>

                        {/* High Impact Buttons */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => window.open(`https://wa.me/?text=¡Hola! Mira mi nueva tienda online: ${publicUrl}`, '_blank')}
                                className="w-full bg-[#25D366] hover:bg-[#1ebd5e] text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-green-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 group"
                            >
                                <Share2 className="w-7 h-7 transition-group-hover:scale-110" />
                                <span>Compartir en WhatsApp</span>
                            </button>

                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 no-underline group"
                            >
                                <ExternalLink className="w-7 h-7" />
                                <span>Visitar mi Tienda</span>
                            </a>
                        </div>

                        {/* Secondary Action */}
                        <div className="pt-8 border-t border-slate-100 text-center">
                            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-sm uppercase tracking-widest transition-all hover:gap-4">
                                <ArrowLeft className="w-5 h-5" />
                                Volver a mi Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-12 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] relative z-10">© 2026 Creatiendas · Hecho para vender</p>
        </div>
    );
}

export default function BuilderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
