import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Esquema de validación
const registerSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validación de datos
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        // Verificar existencia previa (opcional, Prisma también lo valida, pero esto da mejor UX)
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "El correo electrónico ya está registrado" },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // Crear usuario y suscripción en una transacción implícita
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                subscription: {
                    create: {
                        planType: "free",
                        maxStores: 1
                    }
                }
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.error("Error en registro:", error);

        // Manejo específico del error de unicidad de Prisma (P2002)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json(
                    { error: "El correo electrónico ya está registrado" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
