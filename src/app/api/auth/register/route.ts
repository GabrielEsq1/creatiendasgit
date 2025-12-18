import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { alertNewUser } from "@/lib/alerts";
import { sendVerificationEmail } from "@/lib/email";

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
            // Attempt creation inside transaction
            user = await prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        name: name || "",
                        email,
                        passwordHash,
                        verificationToken,
                        emailVerified: new Date(), // Auto-verify as per user request
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
            // If token collision (very rare), retry once with a new token
            if (e.code === "P2002" && e.meta?.target?.includes("verificationToken")) {
                verificationToken = generateVerificationToken();
                user = await prisma.$transaction(async (tx) => {
                    const newUser = await tx.user.create({
                        data: {
                            name: name || "",
                            email,
                            passwordHash,
                            verificationToken,
                            emailVerified: new Date(),
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

        // Verification email disabled as per user request
        // try {
        //     console.log("Sending verification email to:", email);
        //     await sendVerificationEmail(email, verificationToken);
        //     console.log("Verification email sent.");
        // } catch (emailError) {
        //     console.error("Failed to send verification email:", emailError);
        //     // We continue, but the user might need to request a resend later
        // }

        return NextResponse.json(
            { message: "Cuenta creada exitosamente. Ya puedes iniciar sesión.", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error FULL:", error);
        return NextResponse.json(
            {
                message: "Error al crear la cuenta. Por favor intenta de nuevo.",
                debugError: error.message
            },
            { status: 500 }
        );
    }
}
