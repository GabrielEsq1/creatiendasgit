const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    console.log("🔍 Testing Connection to Official DB...");
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'localadmin@test.com' }
        });

        if (user) {
            console.log("✅ Admin User Found!");
            console.log(`   ID: ${user.id}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Plan: ${user.plan}`);
            console.log(`   Updated: ${user.updatedAt}`);
            console.log("🚀 READY FOR LIVE LOGIN");
        } else {
            console.error("❌ Admin User NOT FOUND in this DB.");
        }
    } catch (e) {
        console.error("❌ Connection Failed:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
