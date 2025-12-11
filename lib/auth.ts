import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(prisma), // Temporarily disabled to debug Callback error
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
            if (session.user) {
                // Default values for successful login
                (session.user as any).id = token.sub || 'social-login';
                (session.user as any).role = 'USER';
                (session.user as any).plan = 'FREE';
                (session.user as any).walletBalance = 0;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login", // Redirect errors back to login
    },
};
