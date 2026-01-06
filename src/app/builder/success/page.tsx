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
        if (slug) {
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://creatiendas.com';
            setPublicUrl(`${origin}/stores/${encodeURIComponent(slug)}`);
            // Fire confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#2196F3', '#FFEB3B', '#4CAF50']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#2196F3', '#FFEB3B', '#4CAF50']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="bg-green-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2">¡Tu Tienda está Lista!</h1>
                        <p className="text-green-100 font-medium">Ya puedes recibir pedidos en WhatsApp.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* QR Code */}
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl relative">
                            <StoreQRCode url={publicUrl} size={200} storeName={slug} />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
                                Escanéame
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                readOnly
                                value={publicUrl}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 text-sm text-gray-600 font-medium"
                            />
                            <button
                                onClick={() => { navigator.clipboard.writeText(publicUrl); alert('Copiado!'); }}
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                            >
                                <LinkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <button
                            onClick={() => window.open(`https://wa.me/?text=¡Hola! Mira mi nueva tienda online: ${publicUrl}`, '_blank')}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <Share2 className="w-6 h-6" />
                            Compartir en WhatsApp
                        </button>

                        <a
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 no-underline"
                        >
                            <ExternalLink className="w-6 h-6" />
                            Visitar Tienda
                        </a>

                        <div className="pt-4 mt-6 border-t border-gray-100 text-center">
                            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 font-medium flex items-center justify-center gap-2 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Volver al Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
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
