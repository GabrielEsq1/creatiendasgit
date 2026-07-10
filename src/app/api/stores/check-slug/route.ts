import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const storeId = searchParams.get('storeId');

        if (!slug) {
            return NextResponse.json(
                { error: 'El slug es requerido' },
                { status: 400 }
            );
        }

        // Check if slug exists in the database
        const existingStore = await prisma.store.findUnique({
            where: { slug }
        });

        // The slug is available if it doesn't exist, OR if it belongs to the store we're currently editing
        const isAvailable = !existingStore || (storeId && existingStore.id === storeId);

        return NextResponse.json({
            success: true,
            available: !!isAvailable
        });
    } catch (error) {
        console.error('Error checking slug availability:', error);
        return NextResponse.json(
            { error: 'Error interno al validar el slug' },
            { status: 500 }
        );
    }
}
