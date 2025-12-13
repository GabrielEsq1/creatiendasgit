import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying login logic...');

    const email = 'admin@example.com';
    const password = 'admin123';

    console.log(`Attempting login for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('❌ User not found in database');
        return;
    }

    console.log('✅ User found');
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Hash: ${user.passwordHash}`);

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (isValid) {
        console.log('✅ Password matches!');
    } else {
        console.log('❌ Password does NOT match');

        // Try to generate a new hash and see if it matches
        const newHash = await bcrypt.hash(password, 10);
        console.log(`   New hash would be: ${newHash}`);
        const matchNew = await bcrypt.compare(password, newHash);
        console.log(`   Compare with new hash: ${matchNew}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
