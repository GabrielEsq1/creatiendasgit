import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Product } from '@/lib/store-service';

export async function POST(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { product } = body as { product: Product };

        if (!product || !product.id) {
            return NextResponse.json(
                { error: 'Producto inválido' },
                { status: 400 }
            );
        }

        // Find store
        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { id: params.storeId, ownerId: session.user.id },
                    { slug: params.storeId, ownerId: session.user.id }
                ]
            }
        });

        if (!store) {
            return NextResponse.json(
                { error: 'Tienda no encontrada o no autorizada' },
                { status: 404 }
            );
        }

        const currentProducts = (store.products as unknown as Product[]) || [];
        
        // Find if product exists
        const index = currentProducts.findIndex(p => p.id === product.id);
        let updatedProducts: Product[];

        if (index >= 0) {
            // Update existing
            updatedProducts = [...currentProducts];
            updatedProducts[index] = product;
        } else {
            // Add new
            if (currentProducts.length >= 1000) {
                return NextResponse.json(
                    { error: 'Límite de 1000 productos alcanzado' },
                    { status: 400 }
                );
            }
            updatedProducts = [...currentProducts, product];
        }

        // Save back to DB
        await prisma.store.update({
            where: { id: store.id },
            data: { products: updatedProducts as any }
        });

        return NextResponse.json({ 
            success: true, 
            message: index >= 0 ? 'Producto actualizado' : 'Producto agregado',
            productId: product.id 
        });

    } catch (error) {
        console.error('Error saving single product:', error);
        return NextResponse.json(
            { error: 'Error interno al guardar el producto' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const productId = parseInt(searchParams.get('id') || '');

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'ID de producto inválido' }, { status: 400 });
        }

        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { id: params.storeId, ownerId: session.user.id },
                    { slug: params.storeId, ownerId: session.user.id }
                ]
            }
        });

        if (!store) {
            return NextResponse.json({ error: 'Tienda no encontrada' }, { status: 404 });
        }

        const currentProducts = (store.products as unknown as Product[]) || [];
        const updatedProducts = currentProducts.filter(p => p.id !== productId);

        await prisma.store.update({
            where: { id: store.id },
            data: { products: updatedProducts as any }
        });

        return NextResponse.json({ success: true, message: 'Producto eliminado' });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
    }
}
