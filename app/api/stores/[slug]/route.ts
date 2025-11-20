import { NextResponse } from 'next/server';
import { StoreService } from '@/lib/store-service';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const store = await StoreService.getStore(params.slug);
        if (!store) {
            return NextResponse.json(
                { success: false, message: 'Tienda no encontrada' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, store });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error interno' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const body = await request.json();
        const { data, products } = body;

        const updatedStore = await StoreService.updateStore(params.slug, data, products);

        if (!updatedStore) {
            return NextResponse.json(
                { success: false, message: 'Tienda no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, store: updatedStore });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error interno' },
            { status: 500 }
        );
    }
}
