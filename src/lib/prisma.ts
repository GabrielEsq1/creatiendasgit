import { PrismaClient } from '@prisma/client';

declare global {
    // Allows TypeScript to recognize the global prisma variable
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ||
    new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

if (!process.env.CREATIENDAS_FINAL_DB) {
    console.error('❌ FATAL: CREATIENDAS_FINAL_DB is not set in environment variables!');
} else {
    // Log the connection string (masked) for debugging
    const dbUrl = process.env.CREATIENDAS_FINAL_DB;
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
    console.log(`[Prisma] Initializing with DB URL: ${maskedUrl}`);
}
