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
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No autenticado', message: 'Debes iniciar sesión para guardar tu tienda.' }, { status: 401 });
        }

        const body = await req.json();

        // Generar slug si no viene
        let slug = body.slug;
        if (!slug && body.name) {
            slug = body.name.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        const schema = z.object({
            name: z.string().min(2),
            slug: z.string().min(1),
            data: z.any().optional(),
            products: z.any().optional()
        });

        const payload = { ...body, slug };
        const result = schema.safeParse(payload);

        if (!result.success) {
            console.error('Validation error:', result.error);
            return NextResponse.json({
                error: 'Datos inválidos',
                message: 'Los datos de la tienda no son válidos.',
                details: result.error.issues
            }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado', message: 'Tu sesión no es válida.' }, { status: 404 });
        }

        // Get the host from the request
        const host = req.headers.get('host') || 'creatiendasgit1.vercel.app';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        // Verificar si el slug ya existe
        const existing = await prisma.store.findUnique({ where: { slug: result.data.slug } });
        if (existing) {
            // Si existe y es del mismo usuario, actualizamos
            if (existing.ownerId === user.id) {
                const updated = await prisma.store.update({
                    where: { id: existing.id },
                    data: {
                        name: result.data.name,
                        data: result.data.data || null,
                        products: result.data.products || null
                    }
                });
                return NextResponse.json({
                    success: true,
                    url: `${baseUrl}/stores/${updated.slug}`,
                    publicUrl: `${baseUrl}/stores/${updated.slug}`
                });
            }
            return NextResponse.json({
                error: 'El nombre de la tienda ya está en uso',
                message: 'Ese nombre de tienda ya existe. Por favor elige otro nombre.'
            }, { status: 400 });
        }

        const store = await prisma.store.create({
            data: {
                name: result.data.name,
                slug: result.data.slug,
                ownerId: user.id,
                data: result.data.data || null,
                products: result.data.products || null
            },
        });

        return NextResponse.json({
            success: true,
            url: `${baseUrl}/stores/${store.slug}`,
            publicUrl: `${baseUrl}/stores/${store.slug}`
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating store:', error);
        return NextResponse.json({
            error: 'Error interno del servidor',
            message: error.message || 'Ocurrió un error al guardar la tienda. Por favor intenta de nuevo.',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
