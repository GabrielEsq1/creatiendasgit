import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/stores/[storeId]/view - Increment store views
export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        // Find store by slug or ID
        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { slug: params.storeId },
                    { id: params.storeId }
                ]
            }
        });

        if (!store) {
            return NextResponse.json(
                { success: false, message: 'Tienda no encontrada' },
                { status: 404 }
            );
        }

        // Increment view count
        await prisma.store.update({
            where: { id: store.id },
            data: { views: { increment: 1 } }
        });

        return NextResponse.json({ success: true, views: store.views + 1 });
    } catch (error) {
        console.error('Error incrementing view:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno' },
            { status: 500 }
        );
    }
}
