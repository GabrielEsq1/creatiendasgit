const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.user.count();
        console.log(`COUNT: ${count}`);

        const users = await prisma.user.findMany({
            select: { id: true, email: true }
        });
        console.log(`FIND_MANY: ${users.length}`);

        console.log('--- SAMPLE IDS ---');
        users.slice(0, 5).forEach(u => console.log(`${u.id}: ${u.email}`));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
