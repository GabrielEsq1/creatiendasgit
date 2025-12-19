const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getLatestTestStore() {
    const store = await prisma.store.findFirst({
        where: { name: 'Tienda QR Test' },
        orderBy: { createdAt: 'desc' }
    });

    if (store) {
        const builderUrl = `http://localhost:3000/builder?edit=${store.slug}`;
        const storeUrl = `http://localhost:3000/stores/${store.slug}`;

        console.log('Slug:', store.slug);
        console.log('Ver QR en:', builderUrl);
        console.log('Tienda pública:', storeUrl);
        console.log('Abre el builder para ver el QR real!');
    } else {
        console.log('No se encontró la tienda');
    }

    await prisma.$disconnect();
}

getLatestTestStore();
