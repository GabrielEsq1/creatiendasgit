'use client';
export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

// We import QRCodeSVG but we won't render it until mounted
import { QRCodeSVG } from 'qrcode.react';

// Separate component for content to use Suspense
function ShareContent() {
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const storeName = searchParams.get('storeName') || 'Tu Tienda';
    const slug = searchParams.get('slug');
    const storeUrl = slug ? `https://creatiendas.co/stores/${slug}` : 'https://creatiendas.co';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200">
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-900 mb-2">¡Felicitaciones!</h1>
                    <p className="text-slate-600">
                        La tienda <strong>{storeName}</strong> está lista.
                    </p>
                </div>

                <div className="bg-slate-100 p-6 rounded-xl mb-6 flex justify-center">
                    <QRCodeSVG
                        value={storeUrl}
                        size={180}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                <div className="space-y-3">
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Mira mi tienda online: ${storeUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors no-underline"
                    >
                        Compartir en WhatsApp
                    </a>

                    <a
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors no-underline"
                    >
                        <ExternalLink size={18} /> Ver Tienda
                    </a>

                    <button
                        onClick={copyToClipboard}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        {copied ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} />}
                        {copied ? 'Copiado' : 'Copiar Enlace'}
                    </button>

                    <a
                        href="/dashboard"
                        className="w-full text-slate-400 hover:text-slate-600 text-sm font-medium py-2 px-4 flex items-center justify-center gap-2 transition-colors no-underline mt-4 block"
                    >
                        ← Volver al Panel
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function SharePage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
            <ShareContent />
        </Suspense>
    );
}
