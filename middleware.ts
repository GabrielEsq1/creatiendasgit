import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimitMiddleware } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
    /* 
    // Apply rate limiting first
    const rateLimitResponse = rateLimitMiddleware(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }
    */

    const hostname = request.headers.get('host') || '';
    const url = request.nextUrl;

    // Extract subdomain from hostname
    const parts = hostname.split('.');
    let subdomain: string | null = null;

    // Check for subdomains
    if (hostname.includes('creatiendas.co')) {
        // Production: tienda.creatiendas.co
        if (parts.length >= 3 && parts[0] !== 'www') {
            subdomain = parts[0];
        }
    } else if (hostname.includes('creatiendasgit1.vercel.app')) {
        // Vercel Preview: tienda.creatiendasgit1.vercel.app
        if (parts.length >= 4 && parts[0] !== 'www' && parts[0] !== 'creatiendasgit1') {
            subdomain = parts[0];
        }
    } else if (hostname.includes('localhost')) {
        // Local development: tienda.localhost:3000
        if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== 'www') {
            subdomain = parts[0];
        }
    }

    // If we detected a subdomain, rewrite to the store page
    if (subdomain && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
        return NextResponse.rewrite(new URL(`/stores/${subdomain}${url.pathname}${url.search}`, request.url));
    }

    // Authentication check for protected routes
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const protectedRoutes = ['/dashboard', '/api/stores', '/api/stripe', '/enterprise', '/admin'];
    const isProtected = protectedRoutes.some((p) => request.nextUrl.pathname.startsWith(p));

    if (isProtected && !token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Add security headers to response
    const response = NextResponse.next();

    // Security headers (Relaxed for debugging)
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (Temporary relaxed)
    // response.headers.set(
    //     'Content-Security-Policy',
    //     "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://api.whatsapp.com;"
    // );

    return response;
}

export const config = {
    // Match all routes except static files and API routes that don't need subdomain handling
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
