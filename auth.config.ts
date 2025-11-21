import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnBuilder = nextUrl.pathname.startsWith('/builder'); // Assuming builder is protected or we want to protect it

            if (isOnDashboard || isOnBuilder) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Optional: Redirect logged-in users away from login/register pages
                // if (nextUrl.pathname.startsWith('/auth')) {
                //   return Response.redirect(new URL('/dashboard', nextUrl));
                // }
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
