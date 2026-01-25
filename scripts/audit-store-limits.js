const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function auditStoreLimits() {
    try {
        console.log('🔍 Auditing store limits across all users...\n');

        const allUsers = await prisma.user.findMany({
            include: {
                stores: true
            }
        });

        const issues = [];

        for (const user of allUsers) {
            const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';
            const isPro = user.plan === 'PRO';
            const limit = isAdmin ? 999 : (isPro ? 5 : 1);
            const actualStores = user.stores.length;

            if (actualStores > 0) {
                const status = actualStores > limit ? '❌ OVER LIMIT' : '✅ OK';

                console.log(`${status} | ${user.name || user.email}`);
                console.log(`   Plan: ${user.plan} | Role: ${user.role}`);
                console.log(`   Limit: ${limit} | Actual: ${actualStores}`);
                console.log(`   Email: ${user.email}`);

                if (actualStores > limit) {
                    console.log(`   ⚠️  This user has ${actualStores - limit} stores over the limit!`);
                    console.log(`   Stores:`);
                    user.stores.forEach((store, idx) => {
                        const mark = idx < limit ? '✓' : '✗';
                        console.log(`      ${mark} ${idx + 1}. ${store.name} (${store.slug})`);
                    });

                    issues.push({
                        user: user.email,
                        plan: user.plan,
                        limit,
                        actual: actualStores,
                        excess: actualStores - limit,
                        stores: user.stores.map(s => ({ name: s.name, slug: s.slug, created: s.createdAt }))
                    });
                }
                console.log('');
            }
        }

        if (issues.length > 0) {
            console.log('\n⚠️  SUMMARY OF ISSUES:\n');
            console.log(`Found ${issues.length} user(s) exceeding their store limit:\n`);

            issues.forEach((issue, idx) => {
                console.log(`${idx + 1}. ${issue.user}`);
                console.log(`   Plan: ${issue.plan} | Allowed: ${issue.limit} | Has: ${issue.actual} (${issue.excess} over)`);
                console.log(`   Oldest stores (kept):`);
                issue.stores.slice(0, issue.limit).forEach(s => {
                    console.log(`      ✓ ${s.name} - ${s.created}`);
                });
                console.log(`   Newer stores (should be reviewed):`);
                issue.stores.slice(issue.limit).forEach(s => {
                    console.log(`      ⚠️  ${s.name} - ${s.created}`);
                });
                console.log('');
            });

            console.log('📝 RECOMMENDATION:');
            console.log('   Option 1: Keep all stores but upgrade these users to PRO');
            console.log('   Option 2: Contact users to remove excess stores');
            console.log('   Option 3: Automatically keep only the oldest stores (not recommended)');
            console.log('');
            console.log('💡 The new API validation will prevent this from happening again.');

        } else {
            console.log('✅ All users are within their store limits!');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

auditStoreLimits();
