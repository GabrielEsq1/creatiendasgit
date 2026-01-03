'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, trackGAEvent, trackFeatureOnce, incrementIntentScore } from '../lib/analytics';

export default function GA4Professional() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const engagementTimer = useRef<number | null>(null);
    const lastInteraction = useRef<number>(Date.now());
    const scrollTracked = useRef<{ [key: number]: boolean }>({ 25: false, 50: false, 75: false, 100: false });
    const hasBeenQualified = useRef<boolean>(false);
    const startTime = useRef<number>(Date.now());

    useEffect(() => {
        // 1. Initial Config
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', GA_MEASUREMENT_ID, {
                page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
                send_page_view: true,
            });

            // Reset scroll tracking on path change
            scrollTracked.current = { 25: false, 50: false, 75: false, 100: false };
            hasBeenQualified.current = false;
            startTime.current = Date.now();
        }
    }, [pathname, searchParams]);

    useEffect(() => {
        // 2. Human Interaction Monitor
        const handleInteraction = () => {
            lastInteraction.current = Date.now();

            // Qualify view after 10 seconds + 1 interaction
            if (!hasBeenQualified.current && (Date.now() - startTime.current > 10000)) {
                trackGAEvent({ action: 'qualified_page_view', category: 'engagement' });
                hasBeenQualified.current = true;
                incrementIntentScore(1);
            }
        };

        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;
            const percentage = Math.round((scrollPos / totalHeight) * 100);

            [25, 50, 75, 100].forEach(thresh => {
                if (percentage >= thresh && !scrollTracked.current[thresh]) {
                    trackGAEvent({ action: `scroll_${thresh}`, category: 'intent' });
                    scrollTracked.current[thresh] = true;
                    sessionStorage.setItem('ga4_max_scroll', thresh.toString());
                    if (thresh >= 50) incrementIntentScore(1);
                }
            });
            handleInteraction();
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const cta = target.closest('[data-cta="primary"]');
            if (cta) {
                trackGAEvent({
                    action: 'click_cta_primary',
                    label: cta.textContent || 'unknown',
                    category: 'conversion'
                });
                incrementIntentScore(3);
            }
            handleInteraction();
        };

        // 3. Form Abandonment Logic
        const handleBeforeUnload = () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, select, textarea');
                let hasInput = false;
                inputs.forEach(input => {
                    if ((input as HTMLInputElement).value) hasInput = true;
                });

                if (hasInput && !form.dataset.submitted) {
                    trackGAEvent({
                        action: 'form_abandonment',
                        form_id: form.id || 'unknown_form',
                        category: 'friction'
                    });
                }
            });
        };

        // 4. Time on page (Non-bot)
        const checkEngagement = () => {
            const now = Date.now();
            const isActive = !document.hidden && (now - lastInteraction.current < 30000);

            if (isActive) {
                // GA4 handles engagement time if we keep interaction signals.
            }
        };

        window.addEventListener('mousedown', handleClick);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', checkEngagement);

        engagementTimer.current = window.setInterval(checkEngagement, 5000) as unknown as number;

        return () => {
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', checkEngagement);
            if (engagementTimer.current) clearInterval(engagementTimer.current);
        };
    }, [pathname]);

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
