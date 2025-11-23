
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'free1@test.com';
    const passwordHash = '$2a$10$EpThp.e.v.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x.x'; // Dummy hash if needed, but we assume user exists or we create with known password if auth allows. 
    // actually, let's just update if exists, or create if not.
    // For simplicity, assuming the user 'free1@test.com' from previous steps exists. 
    // If not, we should create it properly via the app or a more complex seed, but let's try to find it first.

    let user = await prisma.user.findUnique({
        where: { email },
        include: { stores: true },
    });

    if (!user) {
        console.log('User not found, creating...');
        // We can't easily hash password here without bcrypt, so we rely on the user already existing from previous steps 
        // or we just set a dummy one and hope the auth provider works or we use the browser to register.
        // Let's assume the user exists from previous context.
        throw new Error('User free1@test.com does not exist. Please register it manually or use previous seed.');
    }

    console.log(`Found user: ${user.email}, Plan: ${user.plan}, Role: ${user.role}, Stores: ${user.stores.length}`);

    // 1. Enforce FREE plan and USER role
    if (user.plan !== 'FREE' || user.role !== 'USER') {
        console.log('Updating plan/role to FREE/USER...');
        user = await prisma.user.update({
            where: { id: user.id },
            data: { plan: 'FREE', role: 'USER' },
            include: { stores: true },
        });
    }

    // 2. Ensure exactly 1 store exists
    if (user.stores.length === 0) {
        console.log('Creating 1 store...');
        await prisma.store.create({
            data: {
                name: 'Tienda Free 1',
                slug: 'tienda-free-1',
                ownerId: user.id,
            },
        });
    } else if (user.stores.length > 1) {
        console.log(`User has ${user.stores.length} stores. Deleting extras...`);
        const storesToDelete = user.stores.slice(1);
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
