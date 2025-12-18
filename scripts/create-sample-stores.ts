import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleStores() {
    console.log('Creating sample stores...');

    // Get first user
    const user = await prisma.user.findFirst();

    if (!user) {
        console.error('No users found. Please create a user first.');
        return;
    }

    const stores = [
        {
            name: 'Tech Solutions Colombia',
            slug: 'tech-solutions-colombia',
            ownerUserId: user.id,
            description: 'Soluciones tecnológicas empresariales. Software, hardware y consultoría IT.',
            category: 'Tecnología',
            isFeatured: true,
            products: [
                {
                    name: 'Licencia Microsoft 365 Business',
                    description: 'Licencia anual de Microsoft 365 para empresas',
                    price: 450000,
                    currency: 'COP',
                    isActive: true,
                },
                {
                    name: 'Servidor Dell PowerEdge',
                    description: 'Servidor empresarial de alto rendimiento',
                    price: 15000000,
                    currency: 'COP',
                    isActive: true,
                },
            ],
        },
        {
            name: 'Marketing Digital Pro',
            slug: 'marketing-digital-pro',
            ownerUserId: user.id,
            description: 'Agencia de marketing digital especializada en B2B',
            category: 'Servicios',
            isFeatured: true,
            products: [
                {
                    name: 'Plan Marketing Básico',
                    description: 'Gestión de redes sociales y contenido mensual',
                    price: 2500000,
                    currency: 'COP',
                    isActive: true,
                },
                {
                    name: 'Campaña Google Ads',
                    description: 'Configuración y gestión de campaña publicitaria',
                    price: 3500000,
                    currency: 'COP',
                    isActive: true,
                },
            ],
        },
        {
            name: 'Consultoría Empresarial',
            slug: 'consultoria-empresarial',
            ownerUserId: user.id,
            description: 'Asesoría estratégica para el crecimiento de tu empresa',
            category: 'Consultoría',
            isFeatured: false,
            products: [
                {
                    name: 'Sesión de Consultoría',
                    description: 'Sesión individual de 2 horas',
                    price: 800000,
                    currency: 'COP',
                    isActive: true,
                },
            ],
        },
        {
            name: 'Suministros Oficina Plus',
            slug: 'suministros-oficina-plus',
            ownerUserId: user.id,
            description: 'Todo lo que necesitas para tu oficina',
            category: 'Productos',
            isFeatured: false,
            products: [
                {
                    name: 'Paquete Papelería Completo',
                    description: 'Kit completo de suministros de oficina',
                    price: 350000,
                    currency: 'COP',
                    isActive: true,
                },
                {
                    name: 'Silla Ergonómica Ejecutiva',
                    description: 'Silla de oficina con soporte lumbar',
                    price: 1200000,
                    currency: 'COP',
                    isActive: true,
                },
            ],
        },
    ];

    for (const storeData of stores) {
        const { products, ownerUserId, ...store } = storeData;

        const existingStore = await prisma.store.findUnique({
            where: { slug: store.slug },
        });

        if (existingStore) {
            console.log(`✓ Store ${store.slug} already exists`);
            continue;
        }

        const createdStore = await prisma.store.create({
            data: {
                ...store,
                owner: {
                    connect: { id: ownerUserId }
                },
                ownerUserId, // Keep this if schema allows redundancy, but usually connect sets it. 
                // Wait, if I use connect, I shouldn't pass ownerUserId manually in strict inputs unless unchecked.
                // Safest is to rely on 'owner: { connect }'.
                // Let's remove ownerUserId from data object to be safe from 'unknown argument' errors if strict.
                products: {
                    create: products,
                },
            },
        });

        console.log(`✓ Created store: ${createdStore.name} with ${products.length} products`);
    }

    console.log('\nSample stores created successfully!');
    await prisma.$disconnect();
}

createSampleStores().catch((error) => {
    console.error('Error creating sample stores:', error);
    process.exit(1);
});
