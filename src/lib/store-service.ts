import { prisma } from './prisma';

export interface StoreData {
    id?: string;
    title: string;
    name: string;
    desc: string;
    whatsapp: string;
    color: string;
    font: string;
    borderRadius: string;
    logo: string | null;
    heroBg: string | null;
    slug: string;
    socials: {
        instagram: string;
        facebook: string;
        tiktok: string;
        email: string;
        phone: string;
    };
    about: {
        heroTitle: string;
        heroSubtitle: string;
        mission: string;
        vision: string;
        values: string[];
        timeline: string[];
        diff: string[];
        team: string;
        ctaText: string;
        gallery: string[];
    };
    careers: {
        title: string;
        desc: string;
        benefits: string[];
        ctaText: string;
    };
}

export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: string;
    image: string | null;
}

export class StoreService {
    /**
     * Get a store by its unique slug
     */
    static async getStore(slug: string) {
        try {
            const store = await prisma.store.findUnique({
                where: { slug }
            });

            if (!store) return null;

            return {
                ...store,
                data: store.data as unknown as StoreData,
                products: store.products as unknown as Product[]
            };
        } catch (error) {
            console.error('Error in StoreService.getStore:', error);
            return null;
        }
    }

    /**
     * Get a store by its unique ID
     */
    static async getStoreById(id: string) {
        try {
            const store = await prisma.store.findUnique({
                where: { id }
            });

            if (!store) return null;

            return {
                ...store,
                data: store.data as unknown as StoreData,
                products: store.products as unknown as Product[]
            };
        } catch (error) {
            console.error('Error in StoreService.getStoreById:', error);
            return null;
        }
    }

    /**
     * Increment view count for a store
     */
    static async incrementViews(slug: string) {
        try {
            await prisma.store.update({
                where: { slug },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    }
}
