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
        const body = await req.json().catch(() => null);

        if (!body) {
            return NextResponse.json(
                { message: "Datos enviados inválidos" },
                { status: 400 }
            );
        }

        const { name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        console.log(`[Register] Attempting to register user: ${email}`);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log(`[Register] User already exists: ${email}`);
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

        // Create User (Without Interactive Transaction to support Connection Pooling)
        try {
            user = await prisma.user.create({
                data: {
                    name: name || "",
                    email,
                    passwordHash,
                    verificationToken,
                    emailVerified: new Date(), // Auto-verify as per user request
                },
            });
            console.log(`[Register] User created with ID: ${user.id}`);
        } catch (e: any) {
            // Handle unique constraint on verificationToken collision (rare)
            if (e.code === "P2002" && e.meta?.target?.includes("verificationToken")) {
                console.log("[Register] Token collision, retrying...");
                verificationToken = generateVerificationToken();
                user = await prisma.user.create({
                    data: {
                        name: name || "",
                        email,
                        passwordHash,
                        verificationToken,
                        emailVerified: new Date(),
                    },
                });
            } else {
                throw e;
            }
        }

        // Create Wallet Account (Separate Step)
        try {
            await prisma.walletAccount.create({
                data: {
                    userId: user.id,
                    balance: 0,
                    currency: "COP",
                },
            });
            console.log(`[Register] Wallet created for user: ${user.id}`);
        } catch (walletError) {
            console.error(`[Register] CRITICAL: Failed to create wallet for user ${user.id}`, walletError);
            // We do NOT rollback user creation here to avoid confusing the user.
            // The wallet can be created lazily at login (auth options handles this).
        }

        // Send alerts (fire and forget)
        try {
            alertNewUser({ email, name, plan: "FREE" }).catch((e) => console.error("Alert error:", e));
        } catch (e) {
            console.error("Alert dispatch error:", e);
        }

        return NextResponse.json(
            { message: "Cuenta creada exitosamente. Ya puedes iniciar sesión.", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error FULL:", error);
        return NextResponse.json(
            {
                message: "Error interno al crear la cuenta.",
                debugError: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}
