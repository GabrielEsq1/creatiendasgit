import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/crypto';
import { z } from 'zod';
import { authConfig } from './auth.config';

// Ensure the secret is defined; NextAuth will also read NEXTAUTH_SECRET automatically
const authSecret = process.env.NEXTAUTH_SECRET;
if (!authSecret) {
    // Fail fast in development/production so the missing secret is obvious
    throw new Error('NEXTAUTH_SECRET environment variable is required for authentication');
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' }, // session config already in authConfig, but keep for clarity
    secret: authSecret,
    trustHost: true, // Required for Vercel deployments
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsed = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (!parsed.success) return null;
                const { email, password } = parsed.data;
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.password) return null;
                const passwordsMatch = await verifyPassword(password, user.password);
                if (passwordsMatch) return user;
                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.sub = user.id;
            return token;
        },
    },
});
