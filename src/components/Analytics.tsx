'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

// Define event types
export type AnalyticsEventType = 'page_view' | 'click' | 'signup' | 'login' | 'create_store' | 'view_content' | 'initiate_checkout' | 'purchase';

const PIXEL_ID = '1419499733092502'; // Píxel de Gabriel Esquivia

export const useAnalytics = () => {
    const trackEvent = async (eventType: AnalyticsEventType, data?: any) => {
        try {
            // 1. Send to internal API (fire and forget)
            fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType,
                    path: typeof window !== 'undefined' ? window.location.pathname : '',
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
        // Track page view on route change
        trackEvent('page_view', {
            path: pathname,
            search: searchParams?.toString(),
        });

        // Manually trigger Pixel PageView on route change
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'PageView');
        }
    }, [pathname, searchParams]);

    return null;
}

// Main exported component with Suspense boundary
export const AnalyticsTracker = () => {
    return (
        <>
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
