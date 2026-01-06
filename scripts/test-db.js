
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing DB connection...');
        const count = await prisma.user.count();
        console.log(`Connection successful. User count: ${count}`);

        const stores = await prisma.store.findMany({ take: 1 });
        console.log(`Store count check successful: ${stores.length}`);
    } catch (error) {
        console.error('DB Connection Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
