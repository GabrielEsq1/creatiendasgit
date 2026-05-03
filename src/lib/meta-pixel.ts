/**
 * Meta Pixel Utility — src/lib/meta-pixel.ts
 *
 * Centralizes all Meta Pixel event tracking for Creatiendas.
 * The pixel base code is loaded in src/app/layout.tsx <head>.
 * Use these helpers from client components / page handlers.
 *
 * Pixel ID: 965002163089223
 */

// Extend Window so TypeScript doesn't complain about window.fbq
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
    | 'Subscribe';

/**
 * Fire a standard Meta Pixel event.
 * Safe to call server-side (no-op) and client-side.
 *
 * @param event  Standard Meta event name
 * @param params Optional event parameters (value, currency, content_name, etc.)
 */
export function trackMetaEvent(
    event: MetaStandardEvent,
    params?: Record<string, unknown>
): void {
    if (typeof window === 'undefined') return;
    if (typeof window.fbq !== 'function') {
        console.warn('[MetaPixel] fbq not loaded yet — event dropped:', event);
        return;
    }

    if (params) {
        window.fbq('track', event, params);
    } else {
        window.fbq('track', event);
    }
}

/**
 * Fire a Meta Pixel event and wait a brief moment so the beacon
 * is dispatched **before** any client-side navigation or redirect.
 *
 * Use this when you need to call router.push() right after tracking.
 *
 * @param event    Standard Meta event name
 * @param params   Optional event parameters
 * @param delayMs  How long to wait (default 300 ms — enough for fbevents.js beacon)
 */
export async function trackMetaEventBeforeNav(
    event: MetaStandardEvent,
    params?: Record<string, unknown>,
    delayMs = 300
): Promise<void> {
    trackMetaEvent(event, params);
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
}
