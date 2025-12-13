"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

export default function InternalAdsPanel() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch('/api/ads/marketplace');
                const data = await res.json();
                if (data.ads) {
                    setAds(data.ads);
                }
            } catch (error) {
                console.error('Error fetching ads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    if (loading) {
        return (
            <div className="hidden w-80 flex-col border-l border-gray-200 bg-white lg:flex">
                <div className="border-b border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900">Novedades y Ofertas</h3>
                </div>
                <div className="p-4 text-center text-gray-500">Cargando ofertas...</div>
            </div>
        );
    }

    return (
        <div className="hidden w-80 flex-col border-l border-gray-200 bg-white lg:flex">
            <div className="border-b border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Novedades y Ofertas</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {ads.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        <p>No hay ofertas disponibles por el momento.</p>
                    </div>
                ) : (
                    ads.map((ad) => (
                        <div key={ad.id} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                            <div className="relative h-40 w-full bg-gray-100">
                                {ad.image && ad.image !== "/placeholder.png" ? (
                                    <img
                                        src={ad.image}
                                        alt={ad.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <span className="text-sm">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="mb-1 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                    {ad.companyName}
                                </div>
                                <h4 className="mb-1 font-medium text-gray-900">{ad.title}</h4>
                                <p className="mb-3 text-sm text-gray-600 line-clamp-2">{ad.description}</p>
                                <a
                                    href={ad.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                                >
                                    {ad.cta}
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    ))
                )}

                <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
                    <h4 className="mb-2 font-bold">¿Quieres anunciarte aquí?</h4>
                    <p className="mb-3 text-sm opacity-90">
                        Llega a miles de empresas B2B directamente en su chat.
                    </p>
                    <a
                        href="/ads-manager"
                        className="block w-full rounded-md bg-white px-4 py-2 text-center text-sm font-bold text-indigo-600 hover:bg-gray-50"
                    >
                        Crear Campaña
                    </a>
                </div>
            </div>
        </div>
    );
}
