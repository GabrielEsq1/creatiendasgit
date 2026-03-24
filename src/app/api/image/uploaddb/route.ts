import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const body = await req.json();
        const { storeId, type, content, mimeType } = body;

        if (!content || !storeId) {
            return NextResponse.json({ error: "Datos faltantes" }, { status: 400 });
        }

        // Verify store ownership
        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { id: storeId, ownerId: session.user.id },
                    { slug: storeId, ownerId: session.user.id }
                ]
            }
        });

        if (!store) {
            return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
        }

        const storedImage = await prisma.storedImage.create({
            data: {
                storeId: store.id,
                type: type || "unknown",
                mimeType: mimeType || "image/jpeg",
                content: content // The Base64 string
            }
        });

        return NextResponse.json({
            success: true,
            url: `/api/image/${storedImage.id}`
        });

    } catch (error) {
        console.error("Error storing image in DB:", error);
        return NextResponse.json({ error: "Error al guardar imagen en DB" }, { status: 500 });
    }
}
