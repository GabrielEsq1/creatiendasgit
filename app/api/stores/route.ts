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
        const origin = request.headers.get('origin') || request.headers.get('host');
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (origin ? `${protocol}://${origin}` : null);

        let publicUrl = '';

        if (baseUrl) {
            // Remove trailing slash if present
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            publicUrl = `${cleanBaseUrl}/stores/${store.slug}`;
        } else {
            // Fallback if we really can't determine origin (unlikely in browser fetch)
            publicUrl = `/stores/${store.slug}`;
        }

        return NextResponse.json({ success: true, store, publicUrl });
    } catch (error) {
        console.error('Error creating store:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
