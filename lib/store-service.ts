import { storage } from './storage';

// Types
export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: string;
    image: string | null;
}

export interface StoreData {
    title: string;
    name: string;
    desc: string;
    whatsapp: string;
    color: string;
    font?: string;
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

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
        .replace(/^-+|-+$/g, '') // Trim - from start and end
        .replace(/-+/g, '-'); // Replace multiple - with single -
}

export interface Store {
    id: string;
    slug: string;
    data: StoreData;
    products: Product[];
    createdAt: string;
}

export const StoreService = {
    createStore: async (name: string, data: StoreData, products: Product[]) => {
        // Generate slug
        let slug = slugify(name);

        // Check if slug exists
        let existing = await storage.getStore(slug);
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        // Ensure slug is in data
        data.slug = slug;

        const newStore: Store = {
            id: Date.now().toString(),
            slug,
            data,
            products,
            createdAt: new Date().toISOString(),
        };

        await storage.saveStore(newStore);

        return newStore;
    },

    getStore: async (slug: string) => {
        return await storage.getStore(slug);
    },

    updateStore: async (slug: string, data: StoreData, products: Product[]) => {
        const existingStore = await storage.getStore(slug);

        if (!existingStore) return null;

        const updatedStore: Store = {
            ...existingStore,
            data,
            products,
        };

        await storage.updateStore(slug, updatedStore);
        return updatedStore;
    }
};
