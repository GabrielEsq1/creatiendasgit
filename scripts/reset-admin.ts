import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
    console.log('Resetting admin password...');

    const email = 'admin@example.com';
    const phone = '+573009999999';
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Find existing user by email or phone
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { phone }
            ]
        }
    });

    if (existingUser) {
        console.log(`Found user: ${existingUser.email} / ${existingUser.phone}`);
        await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                passwordHash,
                role: 'SUPERADMIN',
                email: email, // Ensure email is set
            }
        });
        console.log(`✓ Updated user ${existingUser.id} password and role`);
    } else {
        console.log('User not found, creating...');
        await prisma.user.create({
            data: {
                name: 'Admin Empresa',
                email,
                phone,
                passwordHash,
                role: 'SUPERADMIN',
            },
        });
        console.log(`✓ Created admin user`);
    }

    await prisma.$disconnect();
}

resetAdmin().catch((error) => {
    console.error('Error resetting admin:', error);
    process.exit(1);
});
