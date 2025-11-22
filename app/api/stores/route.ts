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

    // Generar slug si no viene
    let slug = body.slug;
    if (!slug && body.name) {
        slug = body.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    const schema = z.object({
        name: z.string().min(2),
        slug: z.string().min(1),
        data: z.any(),
        products: z.any()
    });

    const payload = { ...body, slug };
    const result = schema.safeParse(payload);

    if (!result.success) {
        return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si el slug ya existe
    const existing = await prisma.store.findUnique({ where: { slug: result.data.slug } });
    if (existing) {
        // Si existe y es del mismo usuario, actualizamos
        if (existing.ownerId === user.id) {
            const updated = await prisma.store.update({
                where: { id: existing.id },
                data: {
                    name: result.data.name,
                    data: result.data.data,
                    products: result.data.products
                }
            });
            return NextResponse.json({ success: true, url: `https://creatiendasgit1.vercel.app/stores/${updated.slug}` });
        }
        return NextResponse.json({ error: 'El nombre de la tienda ya está en uso' }, { status: 400 });
    }

    const store = await prisma.store.create({
        data: {
            name: result.data.name,
            slug: result.data.slug,
            ownerId: user.id,
            data: result.data.data,
            products: result.data.products
        },
    });

    return NextResponse.json({ success: true, url: `https://creatiendasgit1.vercel.app/stores/${store.slug}` }, { status: 201 });
}
