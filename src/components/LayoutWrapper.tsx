"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

import InstallPrompt from "./InstallPrompt";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Logic matches Navbar's internal hiding logic
    const isStorePage = pathname?.includes('/stores/');
    const isSuccessPage = pathname?.includes('/builder/success') || pathname?.includes('/builder/share');
    const hidePadding = isStorePage || isSuccessPage;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const preferredLang = localStorage.getItem('ct_lang');
        const isEnRoute = pathname?.startsWith('/en');

        if (preferredLang === 'en' && !isEnRoute) {
            // Redirect to English version if on Spanish route
            const targetPath = `/en${pathname === '/' ? '' : pathname}`;
            window.location.href = targetPath;
        } else if (preferredLang === 'es' && isEnRoute) {
            // Redirect to Spanish version if on English route
            const targetPath = pathname?.replace(/^\/en/, '') || '/';
            window.location.href = targetPath;
        }
    }, [pathname]);

    return (
        <>
            <Navbar />
            <InstallPrompt />
            <main className={hidePadding ? "" : "pt-16"}>
                {children}
            </main>
        </>
    );
}
