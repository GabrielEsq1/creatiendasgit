import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        // Block access if not ADMIN
        if (token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token // Must be logged in
        },
    }
);

export const config = {
    matcher: ['/admin/:path*']
};
