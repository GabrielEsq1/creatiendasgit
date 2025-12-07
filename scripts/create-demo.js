const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDemoStore() {
    try {
        // 1. Create a demo user if not exists
        const email = 'demo@creatiendas.com';
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: 'Demo User',
                    passwordHash: '$2a$10$abcdefg...', // Dummy hash
                    plan: 'PRO',
                }
            });
            console.log('Created demo user:', user.id);
        }

        // 2. Create demo store
        const slug = 'tienda-demo-oficial';

        // Delete if exists
        await prisma.store.deleteMany({ where: { slug } });

        const store = await prisma.store.create({
            data: {
                name: 'Tienda Demo Oficial',
                slug,
                ownerId: user.id,
                data: {
                    name: 'Tienda Demo Oficial',
                    title: 'La Mejor Tienda Demo',
                    desc: 'Esta es una tienda de demostración creada automáticamente.',
                    whatsapp: '573001234567',
                    color: '#3b82f6',
                    socials: { instagram: '', facebook: '', tiktok: '', email: '', phone: '' },
                    about: { heroTitle: '', heroSubtitle: '', mission: '', vision: '', values: [], timeline: [], diff: [], team: '', ctaText: '', gallery: [] },
                    careers: { title: '', desc: '', benefits: [], ctaText: '' }
                },
                products: [
                    { id: 1, name: 'Producto Demo 1', price: '50000', description: 'Descripción del producto 1', category: 'General', image: null },
                    { id: 2, name: 'Producto Demo 2', price: '75000', description: 'Descripción del producto 2', category: 'General', image: null }
                ]
            }
        });

        console.log('Created demo store:', store.slug);
        console.log('URL: https://creatiendasgit1.vercel.app/stores/' + store.slug);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createDemoStore();
