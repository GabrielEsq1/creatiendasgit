"use client";

import React, { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';

export default function InstallAppButton({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const isEn = lang === 'en';

    useEffect(() => {
        // Check if already installed as PWA
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
                setIsStandalone(true);
            }

            const userAgent = window.navigator.userAgent.toLowerCase();

            // Detect iOS
            const ios = /iphone|ipad|ipod/.test(userAgent);
            setIsIOS(ios);

            // Detect Android
            const android = /android/.test(userAgent);
            setIsAndroid(android);

            // Detect any mobile device
            const mobile = ios || android || /mobile|tablet/.test(userAgent) ||
                ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0);
            setIsMobile(mobile);

            // Capture install prompt
            const handler = (e: any) => {
                e.preventDefault();
                setDeferredPrompt(e);
            };

            window.addEventListener('beforeinstallprompt', handler);
            return () => window.removeEventListener('beforeinstallprompt', handler);
        }
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            setShowModal(true);
        }
    };

    if (isStandalone) return null;

    return (
        <>
            <button
                onClick={handleInstallClick}
                className="group inline-flex min-h-[48px] sm:min-h-[56px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30"
            >
                <Smartphone className="h-5 w-5" />
                <span>{isEn ? 'Install Free App' : 'Instalar App Gratis'}</span>
                <Download className="h-4 w-4 opacity-70" />
            </button>

            {/* Instructions Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                {isEn ? 'Install Creatiendas' : 'Instala Creatiendas'}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                {isEn ? 'Quick access from your home screen' : 'Accede más rápido desde tu pantalla de inicio'}
                            </p>
                        </div>

                        {isIOS ? (
                            <div className="space-y-4 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold">1</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Tap the Share button' : 'Toca el botón Compartir'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'The icon ⎋ in Safari toolbar' : 'El ícono ⎋ en la barra de Safari'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold">2</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Select "Add to Home Screen"' : 'Selecciona "Agregar a Inicio"'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'Scroll down to find it' : 'Desliza hacia abajo para encontrarlo'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-green-700">✓</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Ready!' : '¡Listo!'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'The app is on your screen' : 'Tendrás la app en tu inicio'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : isMobile ? (
                            <div className="space-y-4 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold">1</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Open browser menu' : 'Abre el menú del navegador'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'The 3 dots ⋮ in Chrome or Edge' : 'Los 3 puntos ⋮ en Chrome o Edge'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold">2</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Find "Install app"' : 'Busca "Instalar app"'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'Or "Add to home screen"' : 'O "Añadir a pantalla de inicio"'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-green-700">✓</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Done!' : '¡Listo!'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'Creatiendas on your screen' : 'Creatiendas en tu pantalla'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold">1</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Use Chrome or Edge' : 'Usa Chrome o Edge'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'You need one of these browsers' : 'Necesitas uno de estos navegadores'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold">2</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Look for install icon' : 'Busca el ícono de instalar'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'In address bar or ⋮ menu' : 'En la barra de direcciones o menú ⋮'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-green-700">✓</div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{isEn ? 'Installed!' : '¡Instalada!'}</p>
                                        <p className="text-xs text-slate-500">{isEn ? 'Direct access on desktop' : 'Acceso directo en tu escritorio'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full mt-8 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg active:scale-95"
                        >
                            {isEn ? 'Got it' : 'Entendido'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
