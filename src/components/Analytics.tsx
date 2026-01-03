'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { trackGAEvent, storeUTMs, GA_MEASUREMENT_ID, getStoredUTMs } from '@/lib/analytics';

// Define event types
export type AnalyticsEventType =
    | 'page_view'
    | 'click'
    | 'signup'
    | 'login'
    | 'create_store'
    | 'view_content'
    | 'initiate_checkout'
    | 'purchase'
    | 'landing_view'
    | 'scroll_50'
    | 'feature_enabled'
    | 'primary_cta_click'
    | 'store_created'
    | 'whatsapp_connected'
    | 'activation_completed';

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

            // 2. Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Analytics] ${eventType}:`, data);
            }

            // 3. Send to Meta Pixel
            if (typeof window !== 'undefined' && (window as any).fbq) {
                const fbEvent = mapToPixelEvent(eventType);
                (window as any).fbq('track', fbEvent, data);
            }

            // 4. Send to GA4
            trackGAEvent({ action: eventType, ...data });

        } catch (error) {
            // Silent fail - don't break user experience
        }
    };

    return { trackEvent };
};

// Map internal events to Meta Pixel standard events
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

// Inner tracker component that uses searchParams
function AnalyticsTrackerInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        // 1. Detect and Store UTMs automatically
        if (searchParams && searchParams.toString().includes('utm_')) {
            storeUTMs(searchParams);
        }

        // 2. Auto-trigger landing_view if coming from a campaign
        const stored = getStoredUTMs();
        const isLandingVisit = !sessionStorage.getItem('ct_landing_tracked');

        if (isLandingVisit && (stored.utm_source || (searchParams && searchParams.get('utm_source')))) {
            trackEvent('landing_view', {
                path: pathname,
                source: stored.utm_source || searchParams?.get('utm_source'),
            });
            sessionStorage.setItem('ct_landing_tracked', 'true');
        }

        // 3. Track page view on route change
        trackEvent('page_view', {
            path: pathname,
            search: searchParams?.toString(),
        });

        // 4. Manually trigger Pixel PageView on route change
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'PageView');
        }

    }, [pathname, searchParams, trackEvent]);

    useEffect(() => {
        // 5. Scroll Tracking (50%)
        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
            if (scrollPercent >= 50 && !sessionStorage.getItem('ct_scroll_50_tracked')) {
                trackEvent('scroll_50', {
                    path: pathname,
                    scroll_depth: 50
                });
                sessionStorage.setItem('ct_scroll_50_tracked', 'true');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname, trackEvent]);

    return null;
}

// Main exported component with Suspense boundary
export const AnalyticsTracker = () => {
    return (
        <>
            {/* GA4 Code */}
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
                        send_page_view: false // We handle it manually via trackEvent
                    });
                `}
            </Script>

            {/* Meta Pixel Code */}
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
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
            {/* Wrap searchParams usage in Suspense */}
            <Suspense fallback={null}>
                <AnalyticsTrackerInner />
            </Suspense>
        </>
    );
};

