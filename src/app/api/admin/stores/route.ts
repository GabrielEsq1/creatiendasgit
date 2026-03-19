import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const stores = await prisma.store.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                slug: true,
                views: true,
                createdAt: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        plan: true
                    }
                }
            }
        });

        return NextResponse.json({ success: true, stores });
    } catch (error) {
        console.error('Error fetching stores:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
