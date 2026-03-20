import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StoreService } from '@/lib/store-service';
import { prisma } from '@/lib/prisma';

// GET store by ID or slug
export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: 'No autenticado' },
                { status: 401 }
            );
        }

        // Try to find by slug first, then by ID
        let store = await StoreService.getStore(params.storeId);

        if (!store) {
            // Try by ID
            const storeRecord = await prisma.store.findUnique({
                where: { id: params.storeId }
            });
            if (storeRecord) {
                store = await StoreService.getStore(storeRecord.slug);
            }
        }

        if (!store) {
            return NextResponse.json(
                { success: false, message: 'Tienda no encontrada' },
                { status: 404 }
            );
        }

        // Verify ownership
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        const storeRecord = await prisma.store.findFirst({
            where: {
                OR: [
                    { slug: params.storeId },
                    { id: params.storeId }
                ]
            }
        });

        // Allow Admins to bypass ownership check
        if (storeRecord?.ownerId !== user?.id && user?.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, message: 'No autorizado' },
                { status: 403 }
            );
        }

        return NextResponse.json({ success: true, store });
    } catch (error) {
        console.error('Error getting store:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno' },
            { status: 500 }
        );
    }
}

// UPDATE store
export async function PUT(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: 'No autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, data, products } = body;

        // Find store by ID or slug
        const storeRecord = await prisma.store.findFirst({
            where: {
                OR: [
                    { slug: params.storeId },
                    { id: params.storeId }
                ]
            }
        });

        if (!storeRecord) {
            return NextResponse.json(
                { success: false, message: 'Tienda no encontrada' },
                { status: 404 }
            );
        }

        // Verify ownership
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (storeRecord.ownerId !== user?.id && user?.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, message: 'No autorizado para editar esta tienda' },
                { status: 403 }
            );
        }

        // ── Limit: max 1000 products per store ──────────────────────────────
        if (Array.isArray(products) && products.length > 1000) {
            return NextResponse.json(
                { success: false, message: `Tu tienda no puede tener más de 1000 productos. Tienes ${products.length}.` },
                { status: 400 }
            );
        }
        // ────────────────────────────────────────────────────────────────────

        const updatedStore = await prisma.store.update({
            where: { id: storeRecord.id },
            data: {
                name: name || storeRecord.name,
                data: data,
                products: products
            }
        });

        // Get the base URL for constructing the public store URL
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = request.headers.get('host') || 'localhost:3000';
        // Handle subdomain vs path based on host
        const publicUrl = `${protocol}://${host}/stores/${updatedStore.slug}`;

        return NextResponse.json({
            success: true,
            store: updatedStore,
            id: updatedStore.id,
            url: publicUrl,
            publicUrl
        });
    } catch (error) {
        console.error('Error updating store:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno o datos demasiado grandes' },
            { status: 500 }
        );
    }
}

// DELETE store
export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        // Find store by ID or slug
        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { id: params.storeId, ownerId: userId },
                    { slug: params.storeId, ownerId: userId }
                ]
            }
        });

        if (!store) {
            return NextResponse.json(
                { error: 'Tienda no encontrada' },
                { status: 404 }
            );
        }

        await prisma.store.delete({
            where: { id: store.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting store:', error);
        return NextResponse.json(
            { error: 'Error al eliminar la tienda' },
            { status: 500 }
        );
    }
}
