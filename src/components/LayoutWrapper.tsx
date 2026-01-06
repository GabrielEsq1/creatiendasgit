"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Logic matches Navbar's internal hiding logic
    const isStorePage = pathname?.includes('/stores/');
    const isSuccessPage = pathname?.includes('/builder/success');
    const hidePadding = isStorePage || isSuccessPage;

    return (
        <>
            <Navbar />
            <main className={hidePadding ? "" : "pt-16"}>
                {children}
            </main>
        </>
    );
}
