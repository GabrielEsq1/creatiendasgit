import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        const stores = await prisma.store.findMany({
            where: {
                ownerId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                views: true,
                createdAt: true,
                products: true,
                isPaid: true,
            }
        });

        return NextResponse.json({ stores });
    } catch (error) {
        console.error('Error fetching stores:', error);
        return NextResponse.json(
            { error: 'Error al obtener tiendas' },
            { status: 500 }
        );
    }
}
