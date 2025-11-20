import { NextResponse } from 'next/server';
import { StoreService } from '@/lib/store-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, data, products } = body;

        if (!name || !data || !products) {
            return NextResponse.json(
                { success: false, message: 'Datos incompletos' },
                { status: 400 }
            );
        }

        const store = await StoreService.createStore(name, data, products);
        return NextResponse.json({ success: true, store });
    } catch (error) {
        console.error('Error creating store:', error);
        return NextResponse.json(
            { success: false, message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
