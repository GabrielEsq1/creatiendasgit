"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function StickyMobileCTA({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const { data: session } = useSession();
    const [isVisible, setIsVisible] = useState(false);
    const isEn = lang === 'en';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible || session) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50 md:hidden animate-in slide-in-from-bottom-full duration-300">
            <Link
                href={isEn ? "/en/auth/register" : "/auth/register"}
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
            >
                {isEn ? 'Create Free Store' : 'Crear Tienda Gratis'}
                <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
    );
}
