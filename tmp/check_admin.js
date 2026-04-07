const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { email: true, name: true, role: true }
    });
    console.log('ADMIN USER:', admin);
}

main().finally(() => prisma.$disconnect());
