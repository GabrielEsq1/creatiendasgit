"use client";

import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { buildCartMessage, getWhatsAppUrl, formatPriceConfig } from '@/lib/whatsappUtils';
import { useAnalytics } from '@/components/Analytics';

interface Props {
    storeSlug: string;
    storeName: string;
    whatsapp: string;
    styleColor?: string;
    lang?: 'es' | 'en';
    storeCurrency?: 'COP' | 'USD';
}

export default function CartDrawer({ storeSlug, storeName, whatsapp, styleColor = '#25D366', lang = 'es', storeCurrency = 'COP' }: Props) {
    const { items, isCartOpen, setCartOpen, removeItem, updateQuantity } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        setMounted(true);
    }, []);

    const storeItems = items.filter(item => item.storeSlug === storeSlug);
    const total = storeItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    if (!mounted || !isCartOpen) return null;

    const handleCheckout = () => {
        const message = buildCartMessage(storeItems, lang, storeCurrency);
        const url = getWhatsAppUrl(whatsapp || '', message);
        
        trackEvent('whatsapp_checkout_clicked', {
            store_name: storeName,
            total_value: total,
            items_count: storeItems.length
        });

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const t = {
        title: lang === 'en' ? 'Your Order' : 'Tu Pedido',
        empty: lang === 'en' ? 'Your cart is empty' : 'Tu carrito está vacío',
        continue: lang === 'en' ? 'Keep shopping' : 'Seguir comprando',
        remove: lang === 'en' ? 'Remove' : 'Quitar',
        total: lang === 'en' ? 'Estimated Total' : 'Total Estimado',
        checkout: lang === 'en' ? 'Complete order via WhatsApp' : 'Finalizar pedido por WhatsApp',
    };

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[20001] transition-opacity"
                onClick={() => setCartOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[20002] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" style={{ color: styleColor }} />
                        <h2 className="text-lg font-bold text-gray-800">{t.title}</h2>
                    </div>
                    <button 
                        onClick={() => setCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {storeItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 opacity-60">
                            <ShoppingBag className="w-12 h-12 mb-3" />
                            <p>{t.empty}</p>
                            <button 
                                onClick={() => setCartOpen(false)}
                                className="mt-4 text-sm font-semibold hover:underline"
                                style={{ color: styleColor }}
                            >
                                {t.continue}
                            </button>
                        </div>
                    ) : (
                        storeItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                {item.image ? (
                                    <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{item.name}</h3>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900 mt-1">
                                        {lang === 'es' && '$'}{formatPriceConfig(item.price, lang, storeCurrency)}
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                            <button 
                                                onClick={() => updateQuantity(item.id, storeSlug, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold text-gray-700 bg-gray-50 h-8 flex items-center justify-center border-x border-gray-200">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, storeSlug, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        
                                        <button 
                                            onClick={() => removeItem(item.id, storeSlug)}
                                            className="text-xs text-red-500 font-medium hover:text-red-600 px-2"
                                        >
                                            {t.remove}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {storeItems.length > 0 && (
                    <div className="border-t border-gray-100 bg-white p-4 pb-8 sm:pb-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-gray-500 font-medium">{t.total}</span>
                            <div className="text-2xl font-black text-gray-900 leading-none">
                                {lang === 'es' && '$'}{formatPriceConfig(total, lang, storeCurrency)}
                            </div>
                        </div>
                        
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
                            style={{ backgroundColor: '#25D366' }} // WhatsApp Green
                        >
                            <span>📱</span> {t.checkout}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
