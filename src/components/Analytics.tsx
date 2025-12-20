'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

// Define event types
export type AnalyticsEventType = 'page_view' | 'click' | 'signup' | 'login' | 'create_store' | 'view_content' | 'initiate_checkout' | 'purchase';

const PIXEL_ID = '1419499733092502'; // Píxel de Gabriel Esquivia
const GA_MEASUREMENT_ID = 'G-H0S47Z9N8J';

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
            if (typeof window !== 'undefined' && (window as any).gtag) {
                if (eventType === 'page_view') {
                    (window as any).gtag('event', 'page_view', {
                        page_path: currentPath,
                        ...data
                    });
                } else if (eventType === 'signup') {
                    (window as any).gtag('event', 'sign_up', {
                        method: data?.method || 'email',
                        page_path: currentPath,
                        ...data
                    });
                } else {
                    // Default GA4 mapping for other events
                    (window as any).gtag('event', eventType, {
                        page_path: currentPath,
                        ...data
                    });
                }
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

        // GA4 automatically tracks page_view on config,
        // but for SPA transitions in Next.js, we send it manually via trackEvent above.
    }, [pathname, searchParams]);

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
