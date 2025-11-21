import fs from 'fs';
import path from 'path';

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
    slug: string;
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

// Mock DB setup
const DB_FILE = path.join(process.cwd(), 'data', 'stores.json');
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read DB
function readDB(): Store[] {
    if (!fs.existsSync(DB_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper to write DB
function writeDB(stores: Store[]) {
    fs.writeFileSync(DB_FILE, JSON.stringify(stores, null, 2));
}

export const StoreService = {
    createStore: async (name: string, data: StoreData, products: Product[]) => {
        const stores = readDB();

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

        stores.push(newStore);
        writeDB(stores);

        return newStore;
    },

    getStore: async (slug: string) => {
        const stores = readDB();
        return stores.find(s => s.slug === slug) || null;
    },

    updateStore: async (slug: string, data: StoreData, products: Product[]) => {
        const stores = readDB();
        const index = stores.findIndex(s => s.slug === slug);

        if (index === -1) return null;

        stores[index] = {
            ...stores[index],
            data,
            products,
        };

        writeDB(stores);
        return stores[index];
    }
};
