const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Verificando usuarios de prueba en la base de datos de producción...\n');

    const testUsers = [
        'free1@test.com',
        'pro1@test.com',
        'admin1@creatiendas.com',
        'grandtourlive@test.com'
    ];

    for (const email of testUsers) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { stores: true },
        });

        if (user) {
            console.log(`✓ ${email}`);
            console.log(`  Nombre: ${user.name}`);
            console.log(`  Plan: ${user.plan}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Tiendas: ${user.stores.length}`);
            console.log('');
        } else {
            console.log(`✗ ${email} - NO EXISTE`);
            console.log('');
        }
    }

    // Get total user count
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();

    console.log('='.repeat(50));
    console.log(`Total de usuarios en producción: ${totalUsers}`);
    console.log(`Total de tiendas en producción: ${totalStores}`);
    console.log('='.repeat(50));
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
