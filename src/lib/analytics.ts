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
 * Detects if the current user agent is likely a bot or crawler.
 */
const isBot = () => {
    if (typeof window === 'undefined') return true;

    const botPatterns = [
        /bot/i, /spider/i, /crawl/i, /lighthouse/i, /chrome-lighthouse/i,
        /googlebot/i, /bingbot/i, /yandexbot/i, /baiduspider/i,
        /facebookexternalhit/i, /twitterbot/i, /rogerbot/i, /linkedinbot/i,
        /embedly/i, /quora\ link\ preview/i, /showyoubot/i, /outbrain/i,
        /pinterest\/0\./i, /slackbot/i, /vkShare/i, /W3C_Validator/i,
        /redditbot/i, /Applebot/i, /WhatsApp/i, /TelegramBot/i, /Discordbot/i
    ];

    const userAgent = window.navigator.userAgent;
    const isWebDriver = window.navigator.webdriver;

    return isWebDriver || botPatterns.some(pattern => pattern.test(userAgent));
};

/**
 * Labels the user based on behavior stored in session/local storage.
 */
const getUserLabel = () => {
    if (typeof window === 'undefined') return 'technical';

    const isTechnical = isBot();
    if (isTechnical) return 'technical';

    const intentScore = parseInt(sessionStorage.getItem('ga4_intent_score') || '0', 10);
    const scrollDepth = parseInt(sessionStorage.getItem('ga4_max_scroll') || '0', 10);

    if (intentScore >= 5) return 'high_intent';
    if (intentScore >= 2 || scrollDepth >= 50) return 'explorer';
    return 'curious';
};

/**
 * Core tracking function that avoids triggering during background/animation phases.
 */
export const trackGAEvent = (event: AnalyticsEvent) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    // Don't track if page is hidden
    if (document.hidden) return;

    const trafficType = isBot() ? 'technical' : 'human';
    const userLabel = getUserLabel();

    const { action, ...params } = event;

    (window as any).gtag('event', action, {
        ...params,
        traffic_type: trafficType,
        user_label: userLabel,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        session_id: getSessionId(),
        user_type: getUserType(),
    });

    if (process.env.NODE_ENV === 'development') {
        console.log(`[GA4-PRO] [${trafficType.toUpperCase()}] [${userLabel.toUpperCase()}] ${action}:`, params);
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

/**
 * Increases intent score based on specific actions.
 */
export const incrementIntentScore = (points: number = 1) => {
    if (typeof window === 'undefined') return;
    const current = parseInt(sessionStorage.getItem('ga4_intent_score') || '0', 10);
    sessionStorage.setItem('ga4_intent_score', (current + points).toString());
};
