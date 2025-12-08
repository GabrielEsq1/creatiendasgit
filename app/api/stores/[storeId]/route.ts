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
{ success: false, message: 'Error interno' },
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
