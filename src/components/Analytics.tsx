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
    | 'social_proof_view';

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

    // Refs for qualified view logic
    const startTime = useRef(Date.now());
    const hasScrolled50 = useRef(false);

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

        // Reset/Update start time on path change
        startTime.current = Date.now();
        hasScrolled50.current = false;

    }, [pathname, searchParams, trackEvent]);

    // 5. Advanced Scroll & Engagement Tracking
    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;
        let qualifiedTimer: NodeJS.Timeout;
        const trackedMilestones = new Set<number>();

        const checkQualifiedView = () => {
            const timeSpent = Date.now() - startTime.current;
            const qualifiedStorageKey = `ct_qualified_${pathname}`;

            // Check for Time + Scroll qualification (if 30s passed)
            const scroll50StorageKey = `ct_scroll_50_${pathname}`;
            if (sessionStorage.getItem(scroll50StorageKey) && !sessionStorage.getItem(qualifiedStorageKey)) {
                trackEvent('qualified_view', { path: pathname, trigger: 'time_and_scroll_met' });
                sessionStorage.setItem(qualifiedStorageKey, 'true');
            }
        };

        const handleScroll = () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
                const milestones = [25, 50, 75, 90];

                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                        const storageKey = `ct_scroll_${milestone}_${pathname}`;
                        if (!sessionStorage.getItem(storageKey)) {
                            trackEvent(`scroll_${milestone}` as AnalyticsEventType, {
                                path: pathname,
                                scroll_depth: milestone
                            });
                            sessionStorage.setItem(storageKey, 'true');
                            trackedMilestones.add(milestone);

                            // Mark 50% for qualified view
                            if (milestone === 50) {
                                hasScrolled50.current = true;
                                checkQualifiedView(); // Check immediately
                            }
                        }
                    }
                });
            }, 100);
        };

        // Timer to check qualification after 30s
        qualifiedTimer = setTimeout(checkQualifiedView, 30000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout) clearTimeout(scrollTimeout);
            clearTimeout(qualifiedTimer);
        };
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

