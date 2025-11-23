import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'grandtourlive@test.com';

    const user = await prisma.user.findUnique({
        where: { email },
        include: { stores: true },
    });

    if (!user) {
        throw new Error(`User ${email} not found`);
    }

    console.log(`Current state: Email: ${user.email}, Plan: ${user.plan}, Role: ${user.role}, Stores: ${user.stores.length}`);

    // Upgrade to PRO
    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { plan: 'PRO' },
        include: { stores: true },
    });

    console.log(`Updated state: Email: ${updated.email}, Plan: ${updated.plan}, Role: ${updated.role}, Stores: ${updated.stores.length}`);
    console.log('User upgraded to PRO successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
