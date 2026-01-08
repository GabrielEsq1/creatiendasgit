"use client";

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function InstallAppButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        // Capture install prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else if (isIOS) {
            alert("Para instalar en iOS:\n1. Toca el botón 'Compartir' ⎋\n2. Selecciona 'Agregar a Inicio' ➕");
        } else {
            alert("Para instalar:\nBusca la opción 'Agregar a Inicio' o 'Instalar App' en el menú de tu navegador.");
        }
    };

    if (isStandalone) return null;

    if (!deferredPrompt && !isIOS) return null;

    return (
        <button
            onClick={handleInstallClick}
            className="group inline-flex min-h-[48px] sm:min-h-[56px] w-full sm:w-auto items-center justify-center rounded-xl bg-indigo-600 px-6 font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30"
        >
            <Download className="mr-2 h-5 w-5" />
            <span>Instalar App</span>
        </button>
    );
}
