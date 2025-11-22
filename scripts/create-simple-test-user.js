const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        // Hash para 'test123456'
        const passwordHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVpLzMfxue6';

        const user = await prisma.user.upsert({
            where: { email: 'test@creatiendas.com' },
            update: {
                passwordHash: passwordHash,
            },
            create: {
                email: 'test@creatiendas.com',
                name: 'Usuario de Prueba',
                passwordHash: passwordHash,
            },
        });

        console.log('✅ Usuario de prueba creado/actualizado:');
        console.log('Email: test@creatiendas.com');
        console.log('Password: test123456');
        console.log('ID:', user.id);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
