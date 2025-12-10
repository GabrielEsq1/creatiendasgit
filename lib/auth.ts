import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Force NEXTAUTH_URL from NEXTAUTH_URL1
import '../nextauth.config';

// Debug logging (remove after fixing)
if (typeof window === 'undefined') {
    console.log('[AUTH DEBUG] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('[AUTH DEBUG] NEXTAUTH_URL1:', process.env.NEXTAUTH_URL1);
    console.log('[AUTH DEBUG] GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
    console.log('[AUTH DEBUG] GITHUB_ID:', process.env.GITHUB_ID ? 'Set' : 'Missing');
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
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
    secret: process.env.NEXTAUTH_SECRET1 || process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    jwt: { secret: process.env.NEXTAUTH_SECRET1 || process.env.NEXTAUTH_SECRET },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log('[SIGNIN] Provider:', account?.provider, 'User:', user.email);

            // Create wallet for new users from social login (Google/GitHub)
            if (account?.provider === 'google' || account?.provider === 'github') {
                try {
                    console.log('[WALLET] Checking for existing wallet for user:', user.id);

                    // Check if user already has a wallet
                    const existingWallet = await prisma.walletAccount.findUnique({
                        where: { userId: user.id }
                    });

                    if (existingWallet) {
                        console.log('[WALLET] Wallet already exists');
                    } else {
                        console.log('[WALLET] Creating new wallet...');
                        await prisma.walletAccount.create({
                            data: {
                                userId: user.id,
                                balance: 0,
                                currency: 'COP'
                            }
                        });
                        console.log('[WALLET] ✅ Wallet created successfully');
                    }
                } catch (error) {
                    console.error('[WALLET] ⚠️ Error creating wallet (allowing login anyway):', error);
                    // Don't block login if wallet creation fails - user can create it later
                }
            }

            console.log('[SIGNIN] Returning true - allowing login');
            return true;
        },
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

