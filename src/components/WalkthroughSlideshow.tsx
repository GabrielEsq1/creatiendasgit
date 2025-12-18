'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
    { src: '/walkthrough/step1_dashboard.png', alt: 'Dashboard Unificado - Vista Principal' },
    { src: '/walkthrough/step2_b2bchat.png', alt: 'Integración B2BChat - Mensajería Empresarial' },
    { src: '/walkthrough/step3_creatiendas.png', alt: 'Integración Creatiendas - Constructor de Tiendas' },
    { src: '/walkthrough/step4_wallet.png', alt: 'Billetera Digital - Gestión de Pagos y Saldo' },
];

export default function WalkthroughSlideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setCurrentSlide((curr) => (curr + 1) % slides.length);
                        return 0;
                    }
                    return prev + 2; // Update every 100ms, so 2% * 50 = 100% in 5 seconds
                });
            }, 100); // 100ms interval
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setProgress(0);
    };

    const handleDotClick = (index: number) => {
        setCurrentSlide(index);
        setProgress(0);
        setIsPlaying(false);
    };

    return (
        <section className="py-16 bg-slate-900 text-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                        Tour Virtual de la Plataforma
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Descubre cómo Enterprise Hub unifica todas tus herramientas en un solo lugar.
                    </p>
                </div>

                <div className="relative bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-2xl max-w-4xl mx-auto">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700 rounded-t-2xl overflow-hidden z-10">
                        <div
                            className="h-full bg-blue-500 transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Slides */}
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    className="object-contain"
                                />
                                {/* Caption Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                                    <p className="text-white text-lg font-medium text-center">
                                        {slide.alt}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full z-20">
                        <button
                            onClick={handlePrev}
                            className="text-white/70 hover:text-white transition-colors"
                            aria-label="Anterior"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:text-blue-400 transition-colors"
                            aria-label={isPlaying ? "Pausar" : "Reproducir"}
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>
                        <button
                            onClick={handleNext}
                            className="text-white/70 hover:text-white transition-colors"
                            aria-label="Siguiente"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* Thumbnails / Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
                    {slides.map((slide, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`p-3 rounded-xl border transition-all duration-300 text-left ${index === currentSlide
                                    ? 'bg-slate-800 border-blue-500 ring-1 ring-blue-500/50'
                                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${index === currentSlide ? 'text-blue-400' : 'text-slate-500'
                                }`}>
                                Paso {index + 1}
                            </span>
                            <span className={`text-sm font-medium block truncate ${index === currentSlide ? 'text-white' : 'text-slate-400'
                                }`}>
                                {slide.alt.split(' - ')[0]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
