import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)',
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host');

    // Get the root domain from env, default to localhost:3000 for dev if not set
    // In production, this should be set to your domain, e.g. "creatiendas.com"
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

    // If no root domain is configured, we can't do subdomain rewriting
    if (!rootDomain) {
        return NextResponse.next();
    }

    // Check if the current hostname ends with the root domain
    // e.g. "store.creatiendas.com" ends with "creatiendas.com"
    const isSubdomain = hostname?.endsWith(rootDomain) && hostname !== rootDomain && hostname !== `www.${rootDomain}`;

    if (isSubdomain && hostname) {
        // Extract the subdomain
        // e.g. "store.creatiendas.com" -> "store"
        const subdomain = hostname.replace(`.${rootDomain}`, '');

        // Rewrite to the dynamic store route
        // e.g. / -> /stores/store
        // e.g. /about -> /stores/store/about (if you had sub-pages)
        return NextResponse.rewrite(new URL(`/stores/${subdomain}${url.pathname}`, req.url));
    }

    return NextResponse.next();
}
