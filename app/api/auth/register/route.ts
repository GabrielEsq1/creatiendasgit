import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { alertNewUser, alertMilestone } from "@/lib/alerts";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

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
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "El usuario ya existe" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user and wallet in a transaction
        const user = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const newUser = await tx.user.create({
                data: {
                    name: name || "",
                    email,
                    passwordHash,
                    verificationToken,
                },
            });

            // 2. Create Wallet
            await tx.walletAccount.create({
                data: {
                    userId: newUser.id,
                    balance: 0,
                    currency: "COP",
                },
            });

            return newUser;
        });

        // Send alerts (fire and forget)
        try {
            alertNewUser({ email, name, plan: 'FREE' }).catch(() => { });
        } catch { }

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (error) {
            console.error("Failed to send verification email:", error);
        }

        return NextResponse.json(
            { message: "Cuenta creada. Por favor verifica tu correo.", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);

        return NextResponse.json(
            { message: "Error al crear la cuenta. Por favor intenta de nuevo." },
            { status: 500 }
        );
    }
}
