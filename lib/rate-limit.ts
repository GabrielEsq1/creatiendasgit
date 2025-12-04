import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from './security';

/**
 * Rate limiting middleware for API routes
 */

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
    // Authentication endpoints - strict limits
    '/api/auth/signin': { maxRequests: 5, windowMs: 60000 }, // 5 attempts per minute
    '/api/auth/register': { maxRequests: 3, windowMs: 300000 }, // 3 attempts per 5 minutes
    '/api/auth/forgot-password': { maxRequests: 3, windowMs: 600000 }, // 3 attempts per 10 minutes

    // API endpoints - moderate limits
    '/api/stores': { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute
    '/api/products': { maxRequests: 30, windowMs: 60000 },
    '/api/wallet': { maxRequests: 20, windowMs: 60000 },

    // Default for all other API routes
    default: { maxRequests: 60, windowMs: 60000 }, // 60 requests per minute
};

/**
 * Get client identifier (IP address)
 */
function getClientIdentifier(request: NextRequest): string {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback to connection IP
    return request.ip || 'unknown';
}

/**
 * Get rate limit config for a path
 */
function getRateLimitConfig(pathname: string): RateLimitConfig {
    // Check for exact match
    if (RATE_LIMIT_CONFIGS[pathname]) {
        return RATE_LIMIT_CONFIGS[pathname];
    }

    // Check for prefix match
    for (const [path, config] of Object.entries(RATE_LIMIT_CONFIGS)) {
        if (pathname.startsWith(path)) {
            return config;
        }
    }

    // Return default
    return RATE_LIMIT_CONFIGS.default;
}

/**
 * Rate limit middleware
 */
export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
    const pathname = request.nextUrl.pathname;

    // Only apply to API routes
    if (!pathname.startsWith('/api/')) {
        return null;
    }

    const identifier = getClientIdentifier(request);
    const config = getRateLimitConfig(pathname);

    // Create unique key for this endpoint + identifier
    const key = `${pathname}:${identifier}`;

    if (isRateLimited(key, config.maxRequests, config.windowMs)) {
        return NextResponse.json(
            {
                error: 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.',
                retryAfter: Math.ceil(config.windowMs / 1000)
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil(config.windowMs / 1000)),
                    'X-RateLimit-Limit': String(config.maxRequests),
                    'X-RateLimit-Remaining': '0',
                }
            }
        );
    }

    return null; // Allow request to proceed
}
