import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { alertNewUser, alertMilestone } from "@/lib/alerts";

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

        // Create user and wallet in a transaction
        const user = await prisma.$transaction(async (tx) => {
            // 1. Create User
            const newUser = await tx.user.create({
                data: {
                    name: name || "",
                    email,
                    passwordHash,
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

        // Send alerts (fire and forget - don't block response)
        try {
            alertNewUser({ email, name, plan: 'FREE' }).catch(() => { });
        } catch {
            // Ignore alert errors
        }

        // Check for milestones
        try {
            const totalUsers = await prisma.user.count();
            alertMilestone('users', totalUsers).catch(() => { });
        } catch {
            // Ignore milestone errors
        }

        return NextResponse.json(
            { message: "Usuario creado exitosamente", userId: user.id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);

        // Return more specific error message
        const errorMessage = error?.message || "Error desconocido";
        const errorCode = error?.code || "UNKNOWN";
        const errorMeta = JSON.stringify(error?.meta || {});

        return NextResponse.json(
            {
                message: `Error DB: ${errorCode} - ${errorMessage} - ${errorMeta}`,
                debug: { errorMessage, errorCode }
            },
            { status: 500 }
        );
    }
}
