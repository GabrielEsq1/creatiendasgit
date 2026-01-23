"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function StickyMobileCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 300px (past hero usually)
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50 md:hidden animate-in slide-in-from-bottom-full duration-300">
            <Link
                href="/auth/register"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
            >
                Crear Tienda Gratis
                <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
    );
}
