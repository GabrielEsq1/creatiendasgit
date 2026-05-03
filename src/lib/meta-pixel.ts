import { trackGAEvent } from './analytics';

/**
 * Universal Conversion Utility — src/lib/meta-pixel.ts
 *
 * Centralizes all high-value conversion tracking for Creatiendas (Meta Pixel + GA4).
 * The pixel base code is loaded in src/app/layout.tsx <head>.
 * GA4 is loaded via AnalyticsTracker.
 */

// Extend Window so TypeScript doesn't complain
declare global {
    interface Window {
        fbq: (...args: unknown[]) => void;
    }
}

/** Standard Meta Pixel events used in Creatiendas */
export type MetaStandardEvent =
    | 'PageView'
    | 'ViewContent'
    | 'Lead'
    | 'CompleteRegistration'
    | 'InitiateCheckout'
    | 'Purchase'
    | 'AddToCart'
    | 'StartTrial'
    | 'Subscribe';

/**
 * Fire a conversion event on both Meta Pixel and GA4.
 * Safe to call server-side (no-op) and client-side.
 *
 * @param event  Standard Meta event name
 * @param params Optional event parameters
 */
export function trackMetaEvent(
    event: MetaStandardEvent,
    params?: Record<string, unknown>
): void {
    if (typeof window === 'undefined') return;

    // 1. Meta Pixel Tracking
    if (typeof window.fbq === 'function') {
        if (params) {
            window.fbq('track', event, params);
        } else {
            window.fbq('track', event);
        }
    } else {
        console.warn('[Analytics] Meta Pixel (fbq) not loaded yet — event dropped:', event);
    }

    // 2. GA4 Tracking (Mapping Meta names to GA4 standard events)
    let gaEventName = event.toLowerCase();
    
    // Manual mapping for standard events
    if (event === 'CompleteRegistration') gaEventName = 'complete_registration';
    if (event === 'StartTrial') gaEventName = 'start_trial';
    if (event === 'InitiateCheckout') gaEventName = 'begin_checkout';
    if (event === 'AddToCart') gaEventName = 'add_to_cart';
    
    trackGAEvent({
        action: gaEventName,
        ...params
    });
}


/**
 * Fire a conversion event and wait a brief moment so the beacons
 * are dispatched **before** any client-side navigation or redirect.
 *
 * Use this when you need to call router.push() right after tracking.
 *
 * @param event    Standard Meta event name
 * @param params   Optional event parameters
 * @param delayMs  How long to wait (default 300 ms)
 */
export async function trackMetaEventBeforeNav(
    event: MetaStandardEvent,
    params?: Record<string, unknown>,
    delayMs = 300
): Promise<void> {
    trackMetaEvent(event, params);
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
}
