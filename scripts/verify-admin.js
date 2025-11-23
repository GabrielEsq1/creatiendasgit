const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin1@creatiendas.com';

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
        include: { stores: true },
    });

    if (user) {
        console.log('✓ Admin user exists:');
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Plan: ${user.plan}`);
        console.log(`  Stores: ${user.stores.length}`);
        console.log(`  Has Password: ${!!user.passwordHash}`);

        // Update password to ensure it's correct
        const newPassword = 'password123';
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                role: 'ADMIN',
                plan: 'PRO'
            },
        });

        console.log('\n✓ Password reset to: password123');
        console.log('✓ Role set to: ADMIN');
        console.log('✓ Plan set to: PRO');
    } else {
        console.log('✗ Admin user does not exist. Creating...');

        const passwordHash = await bcrypt.hash('password123', 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name: 'Admin User',
                passwordHash,
                role: 'ADMIN',
                plan: 'PRO',
            },
        });

        console.log('✓ Admin user created:');
        console.log(`  Email: ${newUser.email}`);
        console.log(`  Password: password123`);
    }
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
