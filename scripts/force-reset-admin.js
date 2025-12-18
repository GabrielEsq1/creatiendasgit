const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function forceResetAdmin() {
    try {
        const email = 'localadmin@test.com';
        const password = 'admin123';

        console.log(`🔒 Resetting password for ${email}...`);

        // 1. Generate hash
        const passwordHash = await bcrypt.hash(password, 10);

        // 2. Upsert user (Update if exists, Create if not)
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                passwordHash: passwordHash,
                role: 'ADMIN',
                plan: 'PRO',
                emailVerified: new Date() // Verify email just in case
            },
            create: {
                email: email,
                name: 'Local Admin',
                passwordHash: passwordHash,
                role: 'ADMIN',
                plan: 'PRO',
                emailVerified: new Date()
            }
        });

        console.log(`✅ Password successfully updated for ${user.email}`);
        console.log(`   New Password: ${password}`);
        console.log(`   Role: ${user.role}`);

        // Verify hash immediately
        const verify = await bcrypt.compare(password, user.passwordHash);
        console.log(`   Hash Verification: ${verify ? 'PASS' : 'FAIL'}`);

    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

forceResetAdmin();
