"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare, Download } from "lucide-react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // basic standalone check
        setIsStandalone(
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true
        );

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setDeferredPrompt(null);
            }
        } else if (isIOS) {
            setShowIOSPrompt(true);
        }
    };

    if (!mounted || isStandalone) return null;

    // If we have a prompt event (Android/Desktop) or it's iOS (manual instructions)
    // We can show a small banner or button.
    // We don't want to show it if we have neither, unless we want to force instructions which is annoying.
    // But for iOS, we always "can" install, so we show it if isIOS checks out.

    if (!deferredPrompt && !isIOS) return null;

    return (
        <>
            {/* Floating Action Button or Bottom Banner */}
            <div className="fixed bottom-4 left-4 z-50 animate-in fade-in slide-in-from-bottom-4">
                <button
                    onClick={handleInstallClick}
                    className="bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    <Download className="w-4 h-4" />
                    <span>Instalar App</span>
                </button>
            </div>

            {/* iOS Instructions Modal */}
            {showIOSPrompt && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowIOSPrompt(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="text-center space-y-4">
                            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600">
                                <PlusSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Instalar Creatiendas
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Para instalar la app en tu iPhone/iPad y acceder más rápido:
                            </p>

                            <div className="space-y-3 pt-2 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                                    <span>Toca el botón <Share className="w-4 h-4 inline mx-1" /> <strong>Compartir</strong> abajo.</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <span className="flex-none w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                                    <span>Baja y selecciona <strong>"Agregar al inicio"</strong>.</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowIOSPrompt(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-xl transition-colors"
                            >
                                Entendido
                            </button>
                        </div>

                        {/* Arrow pointing to share button for standard Safari helper visual */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 transform sm:hidden"></div>
                    </div>
                </div>
            )}
        </>
    );
}
