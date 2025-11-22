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
            const isOnBuilder = nextUrl.pathname.startsWith('/builder');

            if (isOnDashboard || isOnBuilder) {
                if (isLoggedIn) return true;
                return false; // Redirige a login
            } else if (isLoggedIn) {
                // Opcional: Redirigir si ya está logueado e intenta entrar a login
                if (nextUrl.pathname.startsWith('/auth')) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }
            return true;
        },
    },
    providers: [], // Se llenan en auth.ts
} satisfies NextAuthConfig;
