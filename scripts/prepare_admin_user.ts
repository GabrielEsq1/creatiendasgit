
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin1@creatiendas.com';

    // 1. Find or create user
    let user = await prisma.user.findUnique({
        where: { email },
        include: { stores: true },
    });

    if (!user) {
        console.log('User not found, creating...');
        user = await prisma.user.create({
            data: {
                email,
                name: 'Admin User Test',
                passwordHash: '$2a$10$EpThp.e.v.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x',
                role: 'ADMIN',
                plan: 'PRO', // Admins usually have PRO features or better
            },
            include: { stores: true },
        });
    }

    console.log(`Found user: ${user.email}, Plan: ${user.plan}, Role: ${user.role}, Stores: ${user.stores.length}`);

    // 2. Enforce ADMIN role
    if (user.role !== 'ADMIN') {
        console.log('Updating role to ADMIN...');
        user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' },
            include: { stores: true },
        });
    }

    // 3. Ensure at least 6 stores exist (to prove unlimited beyond Pro limit)
    const currentStores = user.stores.length;
    const targetStores = 6;

    if (currentStores < targetStores) {
        const needed = targetStores - currentStores;
        console.log(`Creating ${needed} more stores...`);
        for (let i = 0; i < needed; i++) {
            await prisma.store.create({
                data: {
                    name: `Tienda Admin ${currentStores + i + 1}`,
                    slug: `tienda-admin-${user.id.substring(0, 5)}-${currentStores + i + 1}`,
                    ownerId: user.id,
                },
            });
        }
    }

    console.log('User preparation complete. Ready for testing.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
