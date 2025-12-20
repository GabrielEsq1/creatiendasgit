const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const users = await prisma.user.count();
        const stores = await prisma.store.count();
        console.log(`JSON_OUTPUT:{"users":${users},"stores":${stores}}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
