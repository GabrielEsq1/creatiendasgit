
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const storeCount = await prisma.store.count();
        console.log(`Current Store Count: ${storeCount}`);

        // Also get a brief idea of features enabled by checking if there are products or orders if schemas exist
        // Based on previous schema view, Store has 'products' as Json? or relation?
        // Let's check the schema again with the tool to be sure, but strict counting first.
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
