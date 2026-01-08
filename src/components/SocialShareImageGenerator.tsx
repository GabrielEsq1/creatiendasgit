'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas'; // Assuming installed
import { Download, Instagram, Loader2 } from 'lucide-react';

interface SocialShareImageGeneratorProps {
    storeName: string;
    slug: string;
    host?: string;
}

export default function SocialShareImageGenerator({ storeName, slug, host = 'creatiendas.co' }: SocialShareImageGeneratorProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const generateImage = async () => {
        if (!cardRef.current) return;
        setGenerating(true);

        try {
            // Wait a bit for fonts/images
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Retina quality
                backgroundColor: null, // Transparent/gradient handling
                useCORS: true,
                logging: false,
            });

            const image = canvas.toDataURL('image/png');

            // Trigger download
            const link = document.createElement('a');
            link.href = image;
            link.download = `story-${slug}.png`;
            link.click();
        } catch (err) {
            console.error('Error generating image:', err);
            alert('No se pudo generar la imagen. Intenta de nuevo.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Hidden capture area (but rendered to be captured) */}
            <div className="sr-only">
                {/* Use a fixed portal or off-screen div if needed, but for simplicity we render it hidden 
                   and temporary show it or use a technique. 
                   Actually, html2canvas needs the element to be visible or at least in the DOM.
                   We will render it in a "preview" wrapper that might be visible or position absolute out of view.
               */}
            </div>

            {/* Visible Preview & Capture Target */}
            {/* We render it visibly so the user sees what they get, scaled down if needed */}
            <div className="relative group cursor-pointer mb-4" onClick={generateImage}>
                <div
                    ref={cardRef}
                    className="w-[270px] h-[480px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col"
                    style={{ aspectRatio: '9/16' }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 shadow-lg">
                            <span className="text-4xl">🛍️</span>
                        </div>

                        <h2 className="text-2xl font-black mb-2 leading-tight">
                            ¡Nueva Tienda!
                        </h2>

                        <div className="bg-white/95 text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-lg transform rotate-2 my-4">
                            {storeName}
                        </div>

                        <p className="text-indigo-100 text-sm font-medium mb-8">
                            Compra tus productos favoritos online
                        </p>

                        {/* Dummy "Link" Sticker */}
                        <div className="mt-auto mb-12 bg-white text-black px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transform -rotate-2 shadow-xl">
                            🔗 {host}/{slug}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-0 w-full p-4 text-center">
                        <p className="text-[10px] text-white/60 uppercase tracking-widest">
                            Powered by Creatiendas
                        </p>
                    </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold flex items-center gap-2">
                        <Download className="w-5 h-5" /> Descargar
                    </span>
                </div>
            </div>

            <button
                onClick={generateImage}
                disabled={generating}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-pink-500/25 active:scale-95"
            >
                {generating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <Instagram className="w-5 h-5" />
                        Descargar para Stories
                    </>
                )}
            </button>
            <p className="text-xs text-gray-400 mt-2 max-w-xs text-center">
                Sube esta imagen a tus historias y usa el sticker de "Enlace" con la URL de tu tienda.
            </p>
        </div>
    );
}
