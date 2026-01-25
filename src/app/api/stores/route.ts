import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;
        const body = await request.json();
        const { name, slug, data, products } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Nombre y slug son requeridos' },
                { status: 400 }
            );
        }

        // SECURITY: Validate store limit based on user plan
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { stores: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Determine store limit based on plan and role
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';
        const isPro = user.plan === 'PRO';
        const storeLimit = isAdmin ? 999 : (isPro ? 5 : 1); // FREE = 1 store, PRO = 5 stores, ADMIN = unlimited

        if (user.stores.length >= storeLimit) {
            const planMessage = isPro
                ? `Has alcanzado el límite de ${storeLimit} tiendas de tu plan PRO. Contacta con soporte para más información.`
                : `Tu plan gratuito permite solo ${storeLimit} tienda. Actualiza a PRO para crear hasta 5 tiendas.`;

            return NextResponse.json(
                {
                    error: 'Límite de tiendas alcanzado',
                    message: planMessage,
                    currentStores: user.stores.length,
                    limit: storeLimit,
                    plan: user.plan
                },
                { status: 403 } // 403 Forbidden
            );
        }

        // Check if slug is already taken
        const existingStore = await prisma.store.findUnique({
            where: { slug }
        });

        if (existingStore) {
            return NextResponse.json(
                { error: 'Este nombre de tienda ya está en uso' },
                { status: 400 }
            );
        }

        const store = await prisma.store.create({
            data: {
                name,
                slug,
                ownerId: userId,
                data: data || {},
                products: products || [],
            }
        });

        // Get the base URL for constructing the public store URL
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = request.headers.get('host') || 'localhost:3000';
        const publicUrl = `${protocol}://${host}/stores/${slug}`;

        console.log('API Create Store Response - Slug:', store.slug);
        console.log('API Create Store Response - ID:', store.id);

        return NextResponse.json({
            success: true, // CRITICAL: Builder checks for this flag
            store,
            id: store.id,
            slug: store.slug,
            url: publicUrl,
            publicUrl,
            version: '1.0.2' // Track API version
        });
    } catch (error) {
        console.error('Error creating store:', error);
        return NextResponse.json(
            { error: 'Error al crear la tienda' },
            { status: 500 }
        );
    }
}
