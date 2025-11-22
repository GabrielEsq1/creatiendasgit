import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    console.log("Middleware Debug:");
    console.log("Path:", request.nextUrl.pathname);
    console.log("Token found:", !!token);
    console.log("Secret available:", !!process.env.NEXTAUTH_SECRET);

    const protectedRoutes = ['/dashboard', '/app/api/stores', '/app/api/stripe'];
    const isProtected = protectedRoutes.some((p) => request.nextUrl.pathname.startsWith(p));

    if (isProtected && !token) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/app/api/:path*'],
};
