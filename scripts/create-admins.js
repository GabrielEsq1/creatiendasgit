const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    const admins = [
        { email: 'admin1@creatiendas.com', name: 'Super Admin 1' },
        { email: 'admin2@creatiendas.com', name: 'Super Admin 2' },
        { email: 'admin3@creatiendas.com', name: 'Super Admin 3' },
    ];

    console.log('Creating admins...');

    for (const admin of admins) {
        const user = await prisma.user.upsert({
            where: { email: admin.email },
            update: {
                role: 'ADMIN',
                passwordHash,
                plan: 'PRO' // Admins get PRO by default just in case
            },
            create: {
                email: admin.email,
                name: admin.name,
                passwordHash,
                role: 'ADMIN',
                plan: 'PRO'
            },
        });
        console.log(`Created/Updated admin: ${user.email}`);
    }

    // Create a regular user for testing plan toggle
    const testUser = await prisma.user.upsert({
        where: { email: 'client@test.com' },
        update: {
            role: 'USER',
            passwordHash,
            plan: 'FREE' // Ensure starts as FREE
        },
        create: {
            email: 'client@test.com',
            name: 'Test Client',
            passwordHash,
            role: 'USER',
            plan: 'FREE'
        },
    });
    console.log(`Created/Updated test user: ${testUser.email}`);

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
