const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        await prisma.user.deleteMany({
            where: { email: 'test-qr@creatiendas.com' }
        });

        const hashedPassword = await bcrypt.hash('Test1234!', 10);

        const user = await prisma.user.create({
            data: {
                name: 'Usuario Test QR',
                email: 'test-qr@creatiendas.com',
                passwordHash: hashedPassword,
                emailVerified: new Date(),
                role: 'USER',
                plan: 'FREE'
            }
        });

        console.log('✅ Usuario creado:');
        console.log('   Email:', user.email);
        console.log('   ID:', user.id);

        return user;
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

async function createTestStore(userId) {
    try {
        const slug = `tienda-qr-test-${Date.now().toString(36)}`;

        const store = await prisma.store.create({
            data: {
                ownerId: userId,
                name: 'Tienda QR Test',
                slug: slug,
                data: {
                    title: 'Tienda QR Test',
                    name: 'Tienda QR Test',
                    desc: 'Prueba de QR code',
                    whatsapp: '573001234567',
                    color: '#22c55e',
                    font: 'Inter'
                },
                products: [
                    {
                        name: 'Producto Test',
                        description: 'Producto de prueba',
                        category: 'Test',
                        price: '10000'
                    }
                ]
            }
        });

        const publicUrl = `http://localhost:3000/stores/${slug}`;

        console.log('\\n✅ Tienda creada:');
        console.log('   Slug:', store.slug);
        console.log('   URL:', publicUrl);
        console.log('\\n📱 URL PARA EL QR:', publicUrl);
        console.log('\\n💡 Prueba el QR en:', `http://localhost:3000/builder?edit=${store.slug}`);

        return { store, publicUrl };
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

async function main() {
    console.log('🚀 Creando tienda de prueba...\\n');

    const user = await createTestUser();
    const { store, publicUrl } = await createTestStore(user.id);

    await prisma.$disconnect();

    console.log('\\n' + '='.repeat(60));
    console.log('✅ PRUEBA COMPLETA');
    console.log('='.repeat(60));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
