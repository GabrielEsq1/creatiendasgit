"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import StoreQRCode from '@/components/StoreQRCode';

export default function SuccessBanner() {
    const searchParams = useSearchParams();
    const isReady = searchParams.get('store_ready');
    const slug = searchParams.get('slug');

    if (!isReady || !slug) return null;

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
                <h2 className="text-4xl font-black text-slate-900 mb-4">¡Tu tienda está lista!</h2>
                <p className="text-xl text-slate-600 mb-8">Ya puedes empezar a recibir pedidos por WhatsApp.</p>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-green-100 mb-8 max-w-xl mx-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enlace de tu tienda:</label>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={storeUrl}
                                    className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(storeUrl);
                                        alert('¡Copiado!');
                                    }}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black hover:bg-slate-800 transition-colors"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Código QR para compartir:</p>
                            <div className="flex justify-center">
                                <StoreQRCode url={storeUrl} size={180} />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            <a
                                href={storeUrl}
                                target="_blank"
                                className="text-green-600 font-bold hover:underline"
                            >
                                👁️ Visitar tienda →
                            </a>
                            <button
                                onClick={() => {
                                    const text = `¡Hola! Mira mi nueva tienda online: ${storeUrl}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="text-slate-900 font-bold hover:underline"
                            >
                                📱 Compartir por WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                    Ir a mi panel de administración →
                </button>
            </div>
        </div>
    );
}
