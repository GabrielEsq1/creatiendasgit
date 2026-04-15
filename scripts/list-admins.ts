import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.user.findMany({
        where: {
            role: {
                in: ['ADMIN', 'SUPERADMIN', 'ADMIN_EMPRESA']
            }
        },
        select: {
            email: true,
            name: true,
            role: true
        }
    });

    console.log("Admins found:");
    console.table(admins);

    const normalUsers = await prisma.user.findMany({
        take: 10,
        select: {
            email: true,
            role: true
        }
    });

    console.log("Some other users:");
    console.table(normalUsers);
}

main().catch(console.error).finally(() => prisma.$disconnect());
