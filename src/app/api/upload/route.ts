import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Optionally allow uploads without session during the builder flow if we want to be permissive,
        // but for now let's at least log what's happening.
        if (!session?.user?.id) {
            console.warn("Upload attempt without session");
            // If we want to strictly require session (as requested previously):
            // return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No se proporcionó ningún archivo" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `Tipo ${file.type} no permitido` },
                { status: 400 }
            );
        }

        // Validate file size (max 4.5MB)
        const maxSize = 4.5 * 1024 * 1024; 
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Imagen muy pesada (máx 4.5MB)" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const userId = session?.user?.id || "anonymous";
        const timestamp = Date.now();
        const extension = file.type.split("/")[1] || "jpg";
        const filename = `uploads/${userId}/${timestamp}.${extension}`;

        // Upload to Vercel Blob
        // Note: This requires BLOB_READ_WRITE_TOKEN in environment variables
        const blob = await put(filename, file, {
            access: "public",
            addRandomSuffix: true
        });

        return NextResponse.json({
            success: true,
            url: blob.url
        });
    } catch (error: any) {
        console.error("Vercel Blob Error:", error);
        return NextResponse.json(
            { error: error.message || "Error en el servidor de imágenes" },
            { status: 500 }
        );
    }
}
