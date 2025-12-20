/**
 * Analytics Utility for Professional GA4 Implementation
 * Focuses on human interaction and clean metrics for investors.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-H0S47Z9N8J';

export interface AnalyticsEvent {
    action: string;
    category?: string;
    label?: string;
    value?: number;
    non_interaction?: boolean;
    [key: string]: any;
}

/**
 * Core tracking function that avoids triggering during background/animation phases.
 */
export const trackGAEvent = (event: AnalyticsEvent) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    // Don't track if page is hidden
    if (document.hidden) return;

    const { action, ...params } = event;

    (window as any).gtag('event', action, {
        ...params,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        session_id: getSessionId(),
        user_type: getUserType(),
    });

    if (process.env.NODE_ENV === 'development') {
        console.log(`[GA4-PRO] ${action}:`, params);
    }
};

/**
 * Determines if the user is 'new' or 'returning' based on persistent storage.
 */
const getUserType = () => {
    if (typeof window === 'undefined') return 'unknown';
    const hasBeenHere = localStorage.getItem('ga4_returning_user');
    if (!hasBeenHere) {
        localStorage.setItem('ga4_returning_user', 'true');
        return 'new';
    }
    return 'returning';
};

/**
 * Generates or retrieves a persistent session ID for the current tab session.
 */
const getSessionId = () => {
    if (typeof window === 'undefined') return '';
    let sessionId = sessionStorage.getItem('ga4_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('ga4_session_id', sessionId);
    }
    return sessionId;
};

/**
 * Tracks feature flags strictly once per session.
 */
export const trackFeatureOnce = (featureName: string, active: boolean) => {
    const key = `feature_tracked_${featureName}`;
    if (sessionStorage.getItem(key)) return;

    trackGAEvent({
        action: active ? 'feature_enabled' : 'feature_disabled',
        feature_name: featureName,
        non_interaction: true, // Specific GA4 param to avoid inflating engagement
    });

    sessionStorage.setItem(key, 'true');
};
