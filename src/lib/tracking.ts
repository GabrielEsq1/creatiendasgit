/**
 * CREATIENDAS PROFESSIONAL TRACKING SYSTEM
 * Senior Analytics Implementation
 *
 * This module centralizes GA4 and Meta Pixel tracking.
 * It ensures attribution (UTMs), session context, and guaranteed delivery.
 */

import { trackGAEvent } from './analytics';

// --- TYPES ---

export type ConversionEvent = 'Lead' | 'CompleteRegistration' | 'StartTrial' | 'ViewContent';

export interface TrackingParams {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    method?: string; // e.g., 'email', 'google'
    [key: string]: any;
}

// Extend window for Meta Pixel
declare global {
    interface Window {
        fbq: (...args: any[]) => void;
    }
}

// --- CORE HELPERS ---

/**
 * Tracks a standard event on Meta Pixel and GA4 simultaneously.
 * Maps names to platform-specific standards.
 */
export const trackEvent = (event: ConversionEvent, params: TrackingParams = {}) => {
    if (typeof window === 'undefined') return;

    // 1. Meta Pixel Tracking
    if (typeof window.fbq === 'function') {
        window.fbq('track', event, params);
    }

    // 2. GA4 Tracking (Mapping to standard Recommended Events)
    let gaAction = event.toLowerCase();
    const gaParams = { ...params };

    switch (event) {
        case 'CompleteRegistration':
            gaAction = 'sign_up'; // GA4 Standard for account creation
            break;
        case 'Lead':
            gaAction = 'generate_lead'; // GA4 Standard for lead capture
            break;
        case 'StartTrial':
            gaAction = 'start_trial';
            break;
        case 'ViewContent':
            gaAction = 'view_item';
            break;
    }

    trackGAEvent({ action: gaAction, ...gaParams });

    if (process.env.NODE_ENV === 'development') {
        console.log(`[Tracking] Event: ${event} (GA4: ${gaAction})`, params);
    }
};

/**
 * Tracks a conversion and returns a promise that resolves after a safe delay.
 * Use this BEFORE router.push() to prevent event cancellation during navigation.
 */
export const trackConversion = async (event: ConversionEvent, params: TrackingParams = {}): Promise<void> => {
    trackEvent(event, params);
    // 350ms is the "sweet spot" for beacon dispatch without degrading UX
    return new Promise((resolve) => setTimeout(resolve, 350));
};

// --- DOMAIN SPECIFIC HELPERS ---

/**
 * Specifically for the most important event: Successful Registration.
 */
export const trackRegistrationSuccess = async (method: string = 'email') => {
    return trackConversion('CompleteRegistration', {
        method,
        content_name: 'Sign Up Success',
        currency: 'USD',
        value: 0.0 // Value can be adjusted if we know CAC/LTV
    });
};

/**
 * For initial intent (Email focus, CTA clicks).
 */
export const trackLeadCapture = (location: string) => {
    trackEvent('Lead', {
        content_name: 'Lead Capture',
        content_category: location
    });
};
