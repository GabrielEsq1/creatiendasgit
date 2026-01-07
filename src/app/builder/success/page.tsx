'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const [storeUrl, setStoreUrl] = useState('');
    const [qrCode, setQrCode] = useState('');

    const slug = searchParams?.get('slug') || '';

    useEffect(() => {
        setMounted(true);

        if (!slug) {
            router.push('/dashboard');
            return;
        }

        // Construir URL de la tienda
        const url = `https://${slug}.creatiendas.co`;
        setStoreUrl(url);

        // Generar QR usando API pública
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
        setQrCode(qrUrl);

    }, [slug, router]);

    if (!mounted || !slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(storeUrl);
        alert('¡Enlace copiado!');
    };

    const shareWhatsApp = () => {
        const text = `¡Mira mi tienda online! ${storeUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const downloadQR = () => {
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `${slug}-qr.png`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header de éxito */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ¡Tu Tienda Está Lista! 🎉
                    </h1>
                    <p className="text-xl text-gray-600">
                        Empieza a recibir pedidos por WhatsApp ahora mismo
                    </p>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                    {/* URL de la tienda */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Enlace de tu tienda:
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={storeUrl}
                                readOnly
                                className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-sm"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                Copiar
                            </button>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="mb-8 text-center">
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                            Código QR:
                        </label>
                        <div className="inline-block p-6 bg-white border-4 border-gray-100 rounded-2xl shadow-lg">
                            <img
                                src={qrCode}
                                alt="QR Code"
                                className="w-64 h-64"
                            />
                        </div>
                        <button
                            onClick={downloadQR}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Descargar QR
                        </button>
                    </div>

                    {/* Botones de acción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href={storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Ver mi Tienda
                        </a>
                        <button
                            onClick={shareWhatsApp}
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1ebd5e] transition-all shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Compartir en WhatsApp
                        </button>
                    </div>
                </div>

                {/* Botón volver */}
                <div className="text-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al Panel
                    </Link>
                </div>
            </div>
        </div>
    );
}
