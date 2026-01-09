"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import StoreQRCode from '@/components/StoreQRCode';

export default function SuccessBanner() {
    const searchParams = useSearchParams();
    const pathname = window.location.pathname;
    const isReady = searchParams.get('store_ready');
    const slug = searchParams.get('slug');

    if (!isReady || !slug) return null;

    const isEn = pathname.startsWith('/en');

    const t = {
        title: isEn ? "Your store is ready!" : "¡Tu tienda está lista!",
        subtitle: isEn ? "You can now start receiving orders via WhatsApp." : "Ya puedes empezar a recibir pedidos por WhatsApp.",
        linkLabel: isEn ? "Your store link:" : "Enlace de tu tienda:",
        copy: isEn ? "Copy" : "Copiar",
        copied: isEn ? "Copied!" : "¡Copiado!",
        qrLabel: isEn ? "QR code to share:" : "Código QR para compartir:",
        viewStore: isEn ? "View my Store" : "Ver mi Tienda",
        shareWhatsApp: isEn ? "Share on WhatsApp" : "Compartir por WhatsApp",
        goDashboard: isEn ? "Go to my admin panel →" : "Ir a mi panel de administración →",
        shareText: isEn ? "Hello! Check out my new online store:" : "¡Hola! Mira mi nueva tienda online:"
    };

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const storeUrl = `${origin}/stores/${encodeURIComponent(slug)}`;

    return (
        <div className="bg-green-50 border-b border-green-100 py-12 px-4 shadow-inner">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 text-white rounded-full mb-6 shadow-xl shadow-green-500/20 animate-bounce">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4">{t.title}</h2>
                <p className="text-xl text-slate-600 mb-8">{t.subtitle}</p>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-green-100 mb-8 max-w-xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.linkLabel}</label>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={storeUrl}
                                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(storeUrl);
                                        alert(t.copied);
                                    }}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black hover:bg-slate-800 transition-colors"
                                >
                                    {t.copy}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">{t.qrLabel}</p>
                            <div className="flex justify-center">
                                <StoreQRCode url={storeUrl} size={180} />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                            <a
                                href={storeUrl}
                                target="_blank"
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-center shadow-lg shadow-green-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">👁️</span>
                                <span>{t.viewStore}</span>
                            </a>
                            <button
                                onClick={() => {
                                    const text = `${t.shareText} ${storeUrl}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-center shadow-lg shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">📱</span>
                                <span>{t.shareWhatsApp}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <a
                    href={isEn ? '/en/dashboard' : '/dashboard'}
                    className="text-slate-400 font-bold hover:text-slate-600 transition-colors no-underline block mt-4"
                >
                    {t.goDashboard}
                </a>
            </div>
        </div>
    );
}
