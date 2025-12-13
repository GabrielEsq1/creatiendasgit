import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { name, email, phone, password, companyName } = await request.json();

        // Validate required fields
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { success: false, error: "Todos los campos requeridos deben ser completados" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "El email o teléfono ya está registrado" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create company if provided
        let company = null;
        if (companyName) {
            company = await prisma.company.create({
                data: {
                    name: companyName,
                }
            });
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                passwordHash,
                role: "USUARIO",
                companyId: company?.id,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Usuario creado exitosamente",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { success: false, error: "Error al crear el usuario" },
            { status: 500 }
        );
    }
}
