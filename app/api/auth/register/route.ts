import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { alertNewUser, alertMilestone } from "@/lib/alerts";
// import { sendVerificationEmail } from "@/lib/email"; // Email sending handled internally
import crypto from "crypto";

// Helper to generate a token that is virtually guaranteed to be unique
function generateVerificationToken(): string {
    // timestamp (base36) + random part (base36)
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { message: "El usuario ya existe" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate verification token
        let verificationToken = generateVerificationToken();
        let user;
        try {
            user = await prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        name: name || "",
                        email,
                        passwordHash,
                        verificationToken,
                        emailVerified: new Date(), // Auto-verify for immediate login
                    },
                });
                await tx.walletAccount.create({
                    data: {
                        userId: newUser.id,
                        balance: 0,
                        currency: "COP",
                    },
                });
                return newUser;
            });
        } catch (e: any) {
            // If token collision, retry once with a new token
            if (e.code === "P2002" && e.meta?.target?.includes("verificationToken")) {
                verificationToken = generateVerificationToken();
                user = await prisma.$transaction(async (tx) => {
                    const newUser = await tx.user.create({
                        data: {
                            name: name || "",
                            email,
                            passwordHash,
                            verificationToken,
                            emailVerified: new Date(), // Auto-verify for immediate login
                        },
                    });
                    await tx.walletAccount.create({
                        data: {
                            userId: newUser.id,
                            balance: 0,
                            currency: "COP",
                        },
                    });
                    return newUser;
                });
            } else {
                throw e;
            }
        }

        // Send alerts (fire and forget)
        try {
            alertNewUser({ email, name, plan: "FREE" }).catch(() => { });
        } catch { }

        // Email sending is handled internally – token is stored; actual dispatch should be implemented elsewhere.

        return NextResponse.json(
            { message: "Cuenta creada. Por favor verifica tu correo.", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error FULL:", error, error.message, error.stack);
        return NextResponse.json(
            {
                message: "Error al crear la cuenta. Por favor intenta de nuevo.",
                debugError: error.message,
                debugStack: error.stack
            },
            { status: 500 }
        );
    }
}


