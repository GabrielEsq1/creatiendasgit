const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    const users = [
        { email: 'free1@test.com', name: 'Usuario Free 1', plan: 'FREE' },
        { email: 'free2@test.com', name: 'Usuario Free 2', plan: 'FREE' },
        { email: 'free3@test.com', name: 'Usuario Free 3', plan: 'FREE' },
        { email: 'pro1@test.com', name: 'Usuario Pro 1', plan: 'PRO' },
        { email: 'pro2@test.com', name: 'Usuario Pro 2', plan: 'PRO' },
    ];

    console.log('Creating test users...');

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                role: 'USER',
                passwordHash,
                plan: u.plan,
                name: u.name
            },
            create: {
                email: u.email,
                name: u.name,
                passwordHash,
                role: 'USER',
                plan: u.plan
            },
        });
        console.log(`Created/Updated user: ${user.email} (${user.plan})`);
    }

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
