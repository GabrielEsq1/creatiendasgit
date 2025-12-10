const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Starting DB Audit...");

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                plan: true,
                emailVerified: true,
                createdAt: true,
                stores: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        console.log(`\nFound ${users.length} Users:`);
        console.log("---------------------------------------------------");
        users.forEach(u => {
            console.log(`[USER] ID: ${u.id} | Email: ${u.email} | Name: ${u.name} | Role: ${u.role} | Verified: ${u.emailVerified}`);
            if (u.stores.length > 0) {
                console.log(`       Stores: ${u.stores.map(s => `${s.name} (${s.slug})`).join(', ')}`);
            } else {
                console.log(`       Stores: None`);
            }
            console.log("---------------------------------------------------");
        });

    } catch (e) {
        console.error("Error auditing DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
