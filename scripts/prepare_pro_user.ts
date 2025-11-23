
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'pro1@test.com';

    // 1. Find or create user
    let user = await prisma.user.findUnique({
        where: { email },
        include: { stores: true },
    });

    if (!user) {
        console.log('User not found, creating...');
        // Creating a new user if not exists. Password hash is dummy.
        user = await prisma.user.create({
            data: {
                email,
                name: 'Pro User Test',
                passwordHash: '$2a$10$EpThp.e.v.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x',
                role: 'USER',
                plan: 'PRO',
            },
            include: { stores: true },
        });
    }

    console.log(`Found user: ${user.email}, Plan: ${user.plan}, Role: ${user.role}, Stores: ${user.stores.length}`);

    // 2. Enforce PRO plan and USER role
    if (user.plan !== 'PRO' || user.role !== 'USER') {
        console.log('Updating plan/role to PRO/USER...');
        user = await prisma.user.update({
            where: { id: user.id },
            data: { plan: 'PRO', role: 'USER' },
            include: { stores: true },
        });
    }

    // 3. Ensure exactly 5 stores exist
    const currentStores = user.stores.length;
    const targetStores = 5;

    if (currentStores < targetStores) {
        const needed = targetStores - currentStores;
        console.log(`Creating ${needed} more stores...`);
        for (let i = 0; i < needed; i++) {
            await prisma.store.create({
                data: {
                    name: `Tienda Pro ${currentStores + i + 1}`,
                    slug: `tienda-pro-${user.id.substring(0, 5)}-${currentStores + i + 1}`,
                    ownerId: user.id,
                },
            });
        }
    } else if (currentStores > targetStores) {
        console.log(`User has ${currentStores} stores. Deleting extras...`);
        const storesToDelete = user.stores.slice(targetStores);
        for (const store of storesToDelete) {
            await prisma.store.delete({ where: { id: store.id } });
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
