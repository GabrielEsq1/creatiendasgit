import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credenciales",
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "tucorreo@ejemplo.com" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                // Validate input
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Find user in database
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email.toLowerCase().trim() }
                    });

                    if (!user) {
                        // Don't reveal if user exists or not
                        return null;
                    }

                    // Block login if email not verified
                    if (!user.emailVerified) {
                        // Optionally, you could return a specific error, but NextAuth expects null for failure
                        return null;
                    }

                    // Verify password
                    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

                    if (!isValid) {
                        return null;
                    }

                    // Return user data
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name ?? ""
                    };
                } catch (e) {
                    console.error("Authentication error:", e);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    jwt: { secret: process.env.NEXTAUTH_SECRET },
    callbacks: {
        async session({ session, token }) {
            if (token?.sub && session.user) {
                (session.user as any).id = token.sub;

                // Handle Test User
                if (token.sub === '1') {
                    (session.user as any).role = 'ADMIN';
                    (session.user as any).plan = 'PRO';

                    // Fetch wallet balance from file-based DB
                    try {
                        // Dynamic import to avoid build issues if file doesn't exist yet
                        const { getAccount } = require('./wallet-db');
                        const account = getAccount('1');
                        (session.user as any).walletBalance = account.balance;
                    } catch (e) {
                        (session.user as any).walletBalance = 0;
                    }
                    return session;
                }

                // Fetch user role, plan, and wallet balance from database
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: {
                            role: true,
                            plan: true,
                            walletAccount: {
                                select: { balance: true }
                            }
                        }
                    });

                    if (user) {
                        (session.user as any).role = user.role;
                        (session.user as any).plan = user.plan;
                        (session.user as any).walletBalance = user.walletAccount?.balance || 0;
                    }
                } catch (e) {
                    console.error("DB Session Error:", e);
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
};

