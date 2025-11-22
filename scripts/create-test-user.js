const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        // Hash conocido para password: TestPassword123
        const passwordHash = '$2b$12$1QRr1xWOHO/tLUOqyFxn0uxpLazAbOIgYwbkgMXnr98XYtyVL1chW';

        const user = await prisma.user.upsert({
            where: { email: 'admin@creatiendas.com' },
            update: {
                passwordHash: passwordHash,
            },
            create: {
                email: 'admin@creatiendas.com',
                name: 'Admin Test',
                passwordHash: passwordHash,
            },
        });

        console.log('✅ Usuario de prueba creado/actualizado:');
        console.log('Email: admin@creatiendas.com');
        console.log('Password: TestPassword123');
        console.log('ID:', user.id);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
