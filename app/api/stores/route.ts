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

        return NextResponse.json({
            success: true,
            store,
            id: store.id,
            url: publicUrl,
            publicUrl
        });
    } catch (error) {
        console.error('Error creating store:', error);
        return NextResponse.json(
            { error: 'Error al crear la tienda' },
            { status: 500 }
        );
    }
}
