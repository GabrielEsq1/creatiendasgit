import fs from 'fs';
import path from 'path';

// Re-export types from here or import them if they are shared. 
// For simplicity, I'll define the shape here or import from store-service if I can, 
// but to avoid circular deps, I'll define a generic interface or move types here.
// Let's move types to a separate file or keep them in store-service and import them here?
// Circular dependency risk if store-service imports storage and storage imports store-service types.
// I will define the types here and update store-service to import them, OR just use 'any' for the data blob 
// and keep strict types in the service. 
// Actually, let's just copy the interface for now or make it generic.

export interface Store {
    id: string;
    slug: string;
    data: any; // StoreData
    products: any[]; // Product[]
    createdAt: string;
}

interface IStorage {
    getStores(): Promise<Store[]>;
    saveStore(store: Store): Promise<void>;
    updateStore(slug: string, store: Store): Promise<void>;
}

// --- In-Memory Storage (For Vercel/Production Demo) ---
// NOTE: Data will be lost when the serverless function freezes or redeploys.
// For permanent storage, use Vercel KV, Vercel Blob, or a database like Supabase/Postgres.
class InMemoryStorage implements IStorage {
    private stores: Store[] = [];

    async getStores(): Promise<Store[]> {
        return this.stores;
    }

    async saveStore(store: Store): Promise<void> {
        const index = this.stores.findIndex(s => s.slug === store.slug);
        if (index >= 0) {
            this.stores[index] = store;
        } else {
            this.stores.push(store);
        }
    }

    async updateStore(slug: string, store: Store): Promise<void> {
        await this.saveStore(store);
    }
}

// --- File System Storage (For Local Development) ---
class FileStorage implements IStorage {
    private dbFile = path.join(process.cwd(), 'data', 'stores.json');
    private dataDir = path.join(process.cwd(), 'data');

    constructor() {
        // Ensure data directory exists
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    private readDB(): Store[] {
        if (!fs.existsSync(this.dbFile)) {
            return [];
        }
        try {
            const data = fs.readFileSync(this.dbFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading DB:", error);
            return [];
        }
    }

    private writeDB(stores: Store[]) {
        fs.writeFileSync(this.dbFile, JSON.stringify(stores, null, 2));
    }

    async getStores(): Promise<Store[]> {
        return this.readDB();
    }

    async saveStore(store: Store): Promise<void> {
        const stores = this.readDB();
        const index = stores.findIndex(s => s.slug === store.slug);
        if (index >= 0) {
            stores[index] = store;
        } else {
            stores.push(store);
        }
        this.writeDB(stores);
    }

    async updateStore(slug: string, store: Store): Promise<void> {
        await this.saveStore(store);
    }
}

// Select storage based on environment
// In Vercel, NODE_ENV is 'production'.
// We can also check for specific Vercel env vars if needed, but NODE_ENV is standard.
const isProduction = process.env.NODE_ENV === 'production';

export const storage = isProduction
    ? new InMemoryStorage()
    : new FileStorage();

// Global variable to persist in-memory data across hot-reloads in dev if we were using it,
// or across lambda invocations if the container is reused in prod.
// For prod, we might want to attach it to globalThis to survive some re-renders if possible,
// but for a simple demo, the class instance above (module level singleton) is fine.
