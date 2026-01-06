import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
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
                        return null;
                    }

                    // Check if password exists
                    if (!user.passwordHash) {
                        return null;
                    }

                    // Email verification check removed as per user request for simple login
                    // if (!user.emailVerified) {
                    //    throw new Error("Email not verified");
                    // }

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
    session: {
        strategy: "jwt",
        maxAge: 365 * 24 * 60 * 60, // 365 days (Facebook-like persistence)
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 365 * 24 * 60 * 60,
    },
    callbacks: {
        async session({ session, token }) {
            if (token?.sub && session.user) {
                (session.user as any).id = token.sub;

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
        error: "/auth/login",
    },
};
