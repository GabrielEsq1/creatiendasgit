import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: List all users (ADMIN only)
export async function GET() {
    const session = await getServerSession(authOptions);

    // 1. Authentication Check
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Authorization Check (Role = ADMIN)
    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // 3. Fetch Users
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
            createdAt: true,
            _count: {
                select: { stores: true }
            }
        }
    });

    return NextResponse.json(users);
}

// PATCH: Update user plan (ADMIN only)
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);

    // 1. Authentication Check
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Authorization Check (Role = ADMIN)
    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (currentUser?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, plan } = body;

    if (!userId || !['FREE', 'PRO'].includes(plan)) {
        return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // 3. Update User
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { plan },
        select: { id: true, email: true, plan: true }
    });

    return NextResponse.json(updatedUser);
}
