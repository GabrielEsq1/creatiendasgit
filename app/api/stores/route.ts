import { NextResponse } from 'next/server';
import { StoreService } from '@/lib/store-service';

export async function POST(request: Request) {
    // Uses StoreService which switches between In-Memory (Vercel) and FileSystem (Local)
    // to avoid "Read-only filesystem" errors in production.
    try {
        const body = await request.json();
        const { name, data, products } = body;

        if (!name || !data || !products) {
            return NextResponse.json(
                { success: false, message: 'Datos incompletos' },
                { status: 400 }
            );
        }

        const store = await StoreService.createStore(name, data, products);

        // Generate public URL
        const origin =
            process.env.NEXT_PUBLIC_SITE_URL ||
            request.headers.get("origin") ||
            "https://creatiendasgit1.vercel.app";

        // Ensure origin doesn't have a trailing slash before appending
        const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
        const storeUrl = `${cleanOrigin}/stores/${store.slug}`;

        return NextResponse.json({
            success: true,
            url: storeUrl,
            publicUrl: storeUrl, // Keep for backward compatibility if needed elsewhere
            message: "¡Tienda guardada con éxito!"
        });
    } catch (error) {
        console.error('Error creating store:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
