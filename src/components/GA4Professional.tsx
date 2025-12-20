'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, trackGAEvent, trackFeatureOnce } from '../lib/analytics';

export default function GA4Professional() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const engagementTimer = useRef<number | null>(null);
    const lastInteraction = useRef<number>(Date.now());
    const scrollTracked = useRef<{ [key: number]: boolean }>({ 50: false, 75: false });

    useEffect(() => {
        // 1. Initial Config
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', GA_MEASUREMENT_ID, {
                page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
                send_page_view: true,
            });

            // Track Navidad feature mode once
            trackFeatureOnce('navidad_mode', true);
        }
    }, [pathname, searchParams]);

    useEffect(() => {
        // 2. Human Interaction Monitor
        const handleInteraction = () => {
            lastInteraction.current = Date.now();
        };

        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;
            const percentage = (scrollPos / totalHeight) * 100;

            [50, 75].forEach(thresh => {
                if (percentage >= thresh && !scrollTracked.current[thresh]) {
                    trackGAEvent({ action: `scroll_${thresh}`, category: 'intent' });
                    scrollTracked.current[thresh] = true;
                }
            });
            handleInteraction();
        };

        // 3. Professional Engagement Time (Real Human Time)
        // Only counts if: Tab is visible AND user has interacted in the last 30 seconds
        const checkEngagement = () => {
            const now = Date.now();
            const isActive = !document.hidden && (now - lastInteraction.current < 30000);

            if (isActive) {
                // We don't send heartbeat events to avoid noise, 
                // GA4 handles engagement time if session is kept 'active' via signals.
                // But we ensure we are ready to send specific human actions.
            }
        };

        window.addEventListener('mousedown', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('visibilitychange', checkEngagement);

        engagementTimer.current = window.setInterval(checkEngagement, 5000) as unknown as number;

        return () => {
            window.removeEventListener('mousedown', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('visibilitychange', checkEngagement);
            if (engagementTimer.current) clearInterval(engagementTimer.current);
        };
    }, []);

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga4-pro-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false, // Managed by component
            enhanced_measurement: false // We control it manually for purity
          });
        `}
            </Script>
        </>
    );
}
