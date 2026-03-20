"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface Props {
    storeSlug: string;
    styleColor?: string;
}

export default function FloatingCartButton({ storeSlug, styleColor = '#000000' }: Props) {
    const { items, setCartOpen } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const storeItems = items.filter(item => item.storeSlug === storeSlug);
    const totalQuantity = storeItems.reduce((acc, item) => acc + item.quantity, 0);

    if (totalQuantity === 0) return null;

    return (
        <button
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-6 z-[1010] flex items-center justify-center p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all animate-in slide-in-from-bottom hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            style={{ backgroundColor: styleColor, color: '#fff' }}
        >
            <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                    {totalQuantity}
                </span>
            </div>
        </button>
    );
}
