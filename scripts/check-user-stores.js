const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserStores() {
    try {
        // Find user by the name visible in the screenshot
        const user = await prisma.user.findFirst({
            where: {
                name: {
                    contains: 'Newteea'
                }
            },
            include: {
                stores: true
            }
        });

        if (!user) {
            console.log('❌ User not found');
            // Let's try to find all users with stores
            const allUsersWithStores = await prisma.user.findMany({
                where: {
                    stores: {
                        some: {}
                    }
                },
                include: {
                    stores: true
                }
            });

            console.log('\n📊 All users with stores:');
            allUsersWithStores.forEach(u => {
                console.log(`\n👤 ${u.name || u.email}`);
                console.log(`   Email: ${u.email}`);
                console.log(`   Plan: ${u.plan}`);
                console.log(`   Role: ${u.role}`);
                console.log(`   Stores (${u.stores.length}):`);
                u.stores.forEach(s => {
                    console.log(`      - ${s.name} (${s.slug}) - Created: ${s.createdAt}`);
                });
            });
            return;
        }

        console.log('👤 User Found:');
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Plan: ${user.plan}`);
        console.log(`   Role: ${user.role}`);
        console.log(`\n🏪 Stores (${user.stores.length}):`);

        user.stores.forEach(store => {
            console.log(`\n   📦 ${store.name}`);
            console.log(`      ID: ${store.id}`);
            console.log(`      Slug: ${store.slug}`);
            console.log(`      Created: ${store.createdAt}`);
            console.log(`      Updated: ${store.updatedAt}`);
            console.log(`      Views: ${store.views}`);
        });

        // Check if limit is being enforced correctly
        const limit = user.plan === 'PRO' ? 5 : 1;
        console.log(`\n📊 Plan Analysis:`);
        console.log(`   Current Plan: ${user.plan}`);
        console.log(`   Store Limit: ${limit}`);
        console.log(`   Current Stores: ${user.stores.length}`);
        console.log(`   Over Limit: ${user.stores.length > limit ? '❌ YES' : '✅ NO'}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUserStores();
