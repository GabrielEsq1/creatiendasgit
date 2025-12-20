import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StorePreviewEN from '@/components/en/StorePreviewEN';
import { StoreService } from '@/lib/store-service';
import '@/app/styles/builder.css'; // Reuse styles
import ViewTracker from '@/components/ViewTracker';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const store = await StoreService.getStore(params.slug);
    if (!store || !store.data) return { title: 'Store not found' };

    return {
        title: store.data.name || 'Store',
        description: store.data.desc || '',
    };
}

export default async function StorePageEN({ params }: Props) {
    const store = await StoreService.getStore(params.slug);

    if (!store || !store.data) {
        notFound();
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f4f4f9',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <StorePreviewEN
                data={store.data}
                products={store.products}
                viewMode="desktop"
                readOnly={true}
            />
            {/* ViewTracker handles logic for view counting, can be shared or needs simple localization if it displays text */}
            <ViewTracker slug={params.slug} />
        </div>
    );
}
