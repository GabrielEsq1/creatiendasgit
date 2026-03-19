'use client';

import { useEffect, Suspense, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { trackGAEvent, storeUTMs, GA_MEASUREMENT_ID, getStoredUTMs } from '@/lib/analytics';

// Define event types
export type AnalyticsEventType =
    | 'page_view'
    | 'click'
    | 'signup'
    | 'signup_start'
    | 'login'
    | 'login_click'
    | 'create_store'
    | 'view_content'
    | 'initiate_checkout'
    | 'purchase'
    | 'landing_view'
    | 'scroll_25'
    | 'scroll_50'
    | 'scroll_75'
    | 'scroll_90'
    | 'qualified_view'
    | 'qualified_page_view'
    | 'feature_enabled'
    | 'primary_cta_click'
    | 'explore_click'
    | 'store_created'
    | 'whatsapp_connected'
    | 'whatsapp_open'
    | 'activation_completed'
    | 'demo_step_view'
    | 'demo_interaction'
    | 'demo_cta_click'
    | 'video_start'
    | 'video_complete'
    | 'social_proof_view'
    | 'form_abandonment'
    | 'store_publish_success'
    | 'add_to_cart'
    | 'whatsapp_checkout_clicked';

const PIXEL_ID = '1419499733092502'; // Píxel de Gabriel Esquivia

export const useAnalytics = () => {
    const trackEvent = async (eventType: AnalyticsEventType, data?: any) => {
        try {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

            // 1. Send to internal API (fire and forget)
            fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType,
                    path: currentPath,
                    metadata: data,
                }),
            }).catch(() => { }); // Silent fail

            // 2. Send to Meta Pixel
            if (typeof window !== 'undefined' && (window as any).fbq) {
                const fbEvent = mapToPixelEvent(eventType);
                (window as any).fbq('track', fbEvent, data);
            }

            // 3. Send to GA4
            trackGAEvent({ action: eventType, ...data });

            if (process.env.NODE_ENV === 'development') {
                console.log(`[Analytics] ${eventType}:`, data);
            }
        } catch (error) {
            // Silent fail
        }
    };

    return { trackEvent };
};

function mapToPixelEvent(eventType: AnalyticsEventType): string {
    switch (eventType) {
        case 'page_view': return 'PageView';
        case 'signup': return 'CompleteRegistration';
        case 'create_store': return 'StartTrial';
        case 'initiate_checkout': return 'InitiateCheckout';
        case 'purchase': return 'Purchase';
        case 'view_content': return 'ViewContent';
        default: return 'CustomEvent';
    }
}

function AnalyticsTrackerInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { trackEvent } = useAnalytics();

    // Tracking refs
    const startTime = useRef(Date.now());
    const hasScrolled50 = useRef(false);
    const scrollTracked = useRef<Record<number, boolean>>({});

    useEffect(() => {
        if (!pathname) return;

        // 1. Store UTMs
        if (searchParams && searchParams.toString().includes('utm_')) {
            storeUTMs(searchParams);
        }

        // 2. Page View (GA4 & Meta)
        trackGAEvent({
            action: 'page_view',
            page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
        });

        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'PageView');
        }

        // Reset trackers
        startTime.current = Date.now();
        hasScrolled50.current = false;
        scrollTracked.current = {};

    }, [pathname, searchParams]);

    useEffect(() => {
        const handleScroll = () => {
            if (!window || !document) return;

            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
            const milestones = [25, 50, 75, 90];

            milestones.forEach(m => {
                if (scrollPercent >= m && !scrollTracked.current[m]) {
                    trackEvent(`scroll_${m}` as AnalyticsEventType, { scroll_depth: m });
                    scrollTracked.current[m] = true;
                    if (m === 50 && !hasScrolled50.current) {
                        hasScrolled50.current = true;
                        if (Date.now() - startTime.current > 10000) {
                            trackEvent('qualified_page_view', { milestone: '50_percent_scroll' });
                        }
                    }
                }
            });
        };

        const handleInteraction = () => {
            // Qualify view after 30s
            if (Date.now() - startTime.current > 30000) {
                const key = `ct_qualified_${pathname}`;
                try {
                    if (!sessionStorage.getItem(key)) {
                        trackEvent('qualified_view', { path: pathname });
                        sessionStorage.setItem(key, 'true');
                    }
                } catch (e) { }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('click', handleInteraction, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleInteraction);
        };
    }, [pathname, trackEvent]);

    return null;
}

export const AnalyticsTracker = () => {
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                        page_path: window.location.pathname,
                        send_page_view: false
                    });
                `}
            </Script>

            <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${PIXEL_ID}');
                        fbq('track', 'PageView');
                    `,
                }}
            />
            <Suspense fallback={null}>
                <AnalyticsTrackerInner />
            </Suspense>
        </>
    );
};
