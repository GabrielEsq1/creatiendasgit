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
        const stores = await storage.getStores();

        // Generate slug
        let slug = slugify(name);
        if (stores.some(s => s.slug === slug)) {
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
        const stores = await storage.getStores();
        const store = stores.find(s => s.slug === slug);
        return (store as Store) || null;
    },

    updateStore: async (slug: string, data: StoreData, products: Product[]) => {
        const stores = await storage.getStores();
        const index = stores.findIndex(s => s.slug === slug);

        if (index === -1) return null;

        const updatedStore: Store = {
            ...stores[index] as Store,
            data,
            products,
        };

        await storage.updateStore(slug, updatedStore);
        return updatedStore;
    }
};
