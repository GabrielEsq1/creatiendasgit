export const dynamic = "force-dynamic";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StorePreview from '@/components/StorePreview';
import { StoreService } from '@/lib/store-service';
import '@/app/styles/builder.css'; // Reuse styles

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const store = await StoreService.getStore(params.slug);
    if (!store || !store.data) return { title: 'Tienda no encontrada' };

    return {
        title: store.data.name || 'Tienda',
        description: store.data.desc || '',
    };
}

export default async function StorePage({ params }: Props) {
    const store = await StoreService.getStore(params.slug);

    if (!store || !store.data) {
        notFound();
    }

    const createdDate = new Date(store.createdAt);
    const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const ownerPlan = store.ownerPlan || 'FREE';
    const ownerRole = store.ownerRole || 'USER';
    const isAdmin = ownerRole === 'ADMIN' || ownerRole === 'SUPERADMIN';
    const isProOrPaid = store.isPaid || ownerPlan === 'PRO' || ownerPlan === 'NEGOCIO' || isAdmin;
    const isBlocked = !isProOrPaid && daysDiff > 30;

    if (isBlocked) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Esta tienda no está disponible temporalmente</h1>
                    <p className="text-slate-600 mb-8">El período de prueba de esta tienda ha finalizado. Si eres el propietario, por favor comunícate con soporte.</p>
                    <a
                        href="https://wa.me/573026687991?text=Hola,%20mi%20tienda%20está%20suspendida%20y%20me%20gustaría%20realizar%20el%20pago%20para%20reactivarla."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all items-center gap-2"
                    >
                        Contactar Soporte
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="public-store-wrapper">
            <StorePreview
                data={store.data}
                products={store.products}
                readOnly={true}
            />
            <ViewTracker slug={params.slug} />
        </div>
    );
}

import ViewTracker from '@/components/ViewTracker';
