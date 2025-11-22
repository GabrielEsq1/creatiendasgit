import { PrismaClient } from '@prisma/client';

// Global variable to hold Prisma client in development to prevent hot-reload issues
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Ensure the client is connected early to surface connection errors
if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore - global augmentation
    global.prisma = prisma;
    prisma.$connect().catch((e) => {
        console.error('Failed to connect to the database:', e);
    });
}

export { prisma };
