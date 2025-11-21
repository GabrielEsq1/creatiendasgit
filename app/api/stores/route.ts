import { NextResponse } from 'next/server';
import { StoreService } from '@/lib/store-service';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: 'No autorizado. Debes iniciar sesión.' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { subscription: true, stores: true }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
        }

        const body = await request.json();
        const { name, data, products } = body;

        if (!name || !data || !products) {
            return NextResponse.json(
                { success: false, message: 'Datos incompletos' },
                { status: 400 }
            );
        }

        const currentStoreCount = user.stores.length;
        const maxStores = user.subscription?.maxStores || 1;

        // Check if updating existing store (by name match)
        const existingStore = user.stores.find(s => s.name === name);

        if (!existingStore && currentStoreCount >= maxStores) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Has alcanzado el límite de tiendas (${maxStores}). Actualiza tu plan para crear más.`
                },
                { status: 403 }
            );
        }

        const store = await StoreService.createStore(name, data, products);

        // Upsert store in DB
        await prisma.store.upsert({
            where: { slug: store.slug },
            update: {
                name: name,
                updatedAt: new Date(),
            },
            create: {
                name: name,
                slug: store.slug,
                userId: user.id,
                blobKey: `stores/${store.slug}.json`
            }
        });

        // Generate public URL
        const origin =
            process.env.NEXT_PUBLIC_SITE_URL ||
            request.headers.get("origin") ||
            "https://creatiendasgit1.vercel.app";

        const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
        const storeUrl = `${cleanOrigin}/stores/${store.slug}`;

        return NextResponse.json({
            success: true,
            url: storeUrl,
            publicUrl: storeUrl,
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
