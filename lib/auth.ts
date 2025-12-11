import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
            checks: ['none'], // Bypass state check to avoid Vercel proxy issues
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            allowDangerousEmailAccountLinking: true,
            checks: ['none'], // Bypass state check
        }),
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
                        return null;
                    }

                    // Check if password exists (social login users might not have one)
                    if (!user.passwordHash) {
                        return null;
                    }

                    // Block login if email not verified
                    if (!user.emailVerified) {
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
        error: "/auth/login", // Redirect errors back to login
    },
};
