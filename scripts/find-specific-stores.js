const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findSpecificStores() {
    try {
        // Find stores with these slugs from the screenshot
        const stores = await prisma.store.findMany({
            where: {
                OR: [
                    { slug: 'new-wife-in-china-mktwtyxg' },
                    { slug: 'my-new-store-mktwt330' }
                ]
            },
            include: {
                owner: true
            }
        });

        if (stores.length === 0) {
            console.log('❌ Stores not found. Searching for stores with similar names...\n');

            const similarStores = await prisma.store.findMany({
                where: {
                    OR: [
                        { name: { contains: 'wife' } },
                        { name: { contains: 'china' } },
                        { name: { contains: 'My New Store' } }
                    ]
                },
                include: {
                    owner: true
                }
            });

            similarStores.forEach(store => {
                console.log(`🏪 Store: ${store.name}`);
                console.log(`   Slug: ${store.slug}`);
                console.log(`   Owner: ${store.owner.name || store.owner.email}`);
                console.log(`   Owner Plan: ${store.owner.plan}`);
                console.log(`   Owner Role: ${store.owner.role}`);
                console.log(`   Created: ${store.createdAt}\n`);
            });

            return;
        }

        console.log(`✅ Found ${stores.length} stores\n`);

        stores.forEach(store => {
            console.log(`🏪 Store: ${store.name}`);
            console.log(`   Slug: ${store.slug}`);
            console.log(`   Owner: ${store.owner.name || store.owner.email}`);
            console.log(`   Owner ID: ${store.owner.id}`);
            console.log(`   Owner Email: ${store.owner.email}`);
            console.log(`   Owner Plan: ${store.owner.plan}`);
            console.log(`   Owner Role: ${store.owner.role}`);
            console.log(`   Created: ${store.createdAt}\n`);
        });

        if (stores.length > 0) {
            const ownerId = stores[0].ownerId;

            // Get all stores for this owner
            const allOwnerStores = await prisma.store.findMany({
                where: { ownerId }
            });

            const owner = stores[0].owner;
            const limit = owner.plan === 'PRO' ? 5 : 1;

            console.log(`\n📊 Owner Analysis:`);
            console.log(`   Total Stores: ${allOwnerStores.length}`);
            console.log(`   Plan: ${owner.plan}`);
            console.log(`   Store Limit: ${limit}`);
            console.log(`   Over Limit: ${allOwnerStores.length > limit ? '❌ YES - Should block new stores!' : '✅ NO'}`);

            console.log(`\n📝 All stores owned by this user:`);
            allOwnerStores.forEach((s, i) => {
                console.log(`   ${i + 1}. ${s.name} (${s.slug}) - ${s.createdAt}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

findSpecificStores();
