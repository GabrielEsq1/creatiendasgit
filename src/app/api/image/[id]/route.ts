import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const image = await prisma.storedImage.findUnique({
            where: { id: params.id }
        });

        if (!image) {
            return new Response("Imagen no encontrada", { status: 404 });
        }

        // Check if the content is a full data: URL or just raw base64
        let base64Data = image.content;
        let mimeType = image.mimeType || "image/jpeg";

        if (base64Data.startsWith('data:')) {
            const parts = base64Data.split(',');
            base64Data = parts[1];
        }

        const buffer = Buffer.from(base64Data, 'base64');

        return new Response(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });

    } catch (error) {
        console.error("Error fetching image from DB:", error);
        return new Response("Error del servidor", { status: 500 });
    }
}
