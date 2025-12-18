import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUsers() {
    console.log('Creating test users...');

    // Create regular users
    const users = [
        {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            phone: '+573001234567',
            password: 'usuario123',
            role: 'USUARIO',
        },
        {
            name: 'María García',
            email: 'maria@example.com',
            phone: '+573001234568',
            password: 'usuario123',
            role: 'USUARIO',
        },
        {
            name: 'Carlos López',
            email: 'carlos@example.com',
            phone: '+573001234569',
            password: 'usuario123',
            role: 'USUARIO',
        },
    ];

    // Create admin users
    const admins = [
        {
            name: 'Admin Empresa',
            email: 'admin@example.com',
            phone: '+573009999999',
            password: 'admin123',
            role: 'ADMIN_EMPRESA',
        },
        {
            name: 'Super Admin',
            email: 'superadmin@example.com',
            phone: '+573009999998',
            password: 'super123',
            role: 'SUPERADMIN',
        },
    ];

    const allUsers = [...users, ...admins];

    for (const userData of allUsers) {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: userData.email },
                    { phone: userData.phone }
                ]
            }
        });

        if (existingUser) {
            console.log(`✓ User ${userData.email} already exists`);
            continue;
        }

        const passwordHash = await bcrypt.hash(userData.password, 10);

        await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                passwordHash,
                role: userData.role as any,
            },
        });

        console.log(`✓ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\nAll test users created successfully!');
    await prisma.$disconnect();
}

createTestUsers().catch((error) => {
    console.error('Error creating test users:', error);
    process.exit(1);
});
