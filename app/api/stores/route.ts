import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// GET: lista de tiendas del usuario autenticado
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { stores: true },
    });

    return NextResponse.json(user?.stores ?? []);
}

// POST: crear nueva tienda
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const schema = z.object({
        name: z.string().min(2),
        slug: z.string().regex(/^[a-z0-9-]+$/),
    });
    const result = schema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const store = await prisma.store.create({
        data: {
            name: result.data.name,
            slug: result.data.slug,
            ownerId: user.id,
        },
    });

    return NextResponse.json(store, { status: 201 });
}
