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
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
        const publicBaseUrl = process.env.NEXT_PUBLIC_PUBLIC_BASE_URL;
        let publicUrl = '';

        if (rootDomain) {
            publicUrl = `https://${store.slug}.${rootDomain}`;
        } else if (publicBaseUrl) {
            publicUrl = `${publicBaseUrl}/stores/${store.slug}`;
        } else {
            publicUrl = `http://localhost:3000/stores/${store.slug}`;
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
