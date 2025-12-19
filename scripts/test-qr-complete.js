```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        // Clean up old test user if exists
        await prisma.user.deleteMany({
            where: { email: 'test-qr@creatiendas.com' }
        });

        // Create test user
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

        console.log('✅ Usuario de test creado:');
        console.log('   Email:', user.email);
        console.log('   Password: Test1234!');
        console.log('   ID:', user.id);

        return user;
    } catch (error) {
        console.error('❌ Error creando usuario:', error.message);
        throw error;
    }
}

async function createTestStore(userId) {
    try {
        const storeData = {
            title: 'Tienda QR Test',
            name: 'Tienda QR Test',
            desc: 'Tienda de prueba para validar código QR',
            whatsapp: '573001234567',
            color: '#22c55e',
            font: 'Inter',
            borderRadius: '16px',
            logo: null,
            heroBg: null,
            socials: {
                instagram: '@testqr',
                facebook: '',
                tiktok: '',
                email: 'test@qr.com',
                phone: '3001234567'
            },
            about: {
                heroTitle: 'Bienvenido a nuestra tienda',
                heroSubtitle: 'La mejor tienda de prueba',
                mission: 'Probar el QR code',
                vision: 'Un QR funcional',
                values: ['Calidad', 'Servicio'],
                timeline: ['2025 - Inicio'],
                diff: ['QR nativo'],
                team: 'Equipo Creatiendas',
                ctaText: 'Contactar',
                gallery: []
            },
            careers: {
                title: 'Trabaja con nosotros',
                desc: 'Únete al equipo',
                benefits: ['Buen ambiente'],
                ctaText: 'Aplicar'
            }
        };

        const products = [
            {
                name: 'Producto Test 1',
                description: 'Producto de prueba para QR',
                category: 'Test',
                price: '10000',
                image: null
            },
            {
                name: 'Producto Test 2',
                description: 'Otro producto de prueba',
                category: 'Test',
                price: '20000',
                image: null
            }
        ];

        // Generate slug
        const slug = `tienda - qr - test - ${ Date.now().toString(36) } `;

        // Create store in DB
        const store = await prisma.store.create({
            data: {
                ownerId: userId,
                name: storeData.name,
                slug: slug,
                data: storeData,
                products: products
            }
        });

        // Generate public URL
        const publicUrl = `${ process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' } /stores/${ slug } `;

        console.log('\n✅ Tienda creada en la base de datos:');
        console.log('   ID:', store.id);
        console.log('   Slug:', store.slug);
        console.log('   URL Pública:', publicUrl);
        console.log('   Productos:', products.length);

        return { store, publicUrl };
    } catch (error) {
        console.error('❌ Error creando tienda:', error.message);
        throw error;
    }
}

async function main() {
    console.log('🚀 Iniciando prueba completa de QR...\n');

    const user = await createTestUser();
    const { store, publicUrl } = await createTestStore(user.id);

    console.log('\n' + '='.repeat(60));
    console.log('📱 INFORMACIÓN PARA GENERAR QR');
    console.log('='.repeat(60));
    console.log('URL de la tienda:', publicUrl);
    console.log('Slug:', store.slug);
    console.log('\n💡 Ahora puedes:');
    console.log('1. Ir a /builder?edit=' + store.slug);
    console.log('2. Ver el QR generado con esta URL real');
    console.log('3. Escanear el QR y acceder a:', publicUrl);
    console.log('='.repeat(60));

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
