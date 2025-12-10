const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                passwordHash: true, // Checking if hash exists (boolean)
                stores: {
                    select: { name: true, slug: true }
                }
            }
        });

        // Simplify for display
        const minimal = users.map(u => ({
            id: u.id,
            email: u.email,
            role: u.role,
            hasPassword: !!u.passwordHash,
            stores: u.stores.map(s => s.name)
        }));

        console.log(JSON.stringify(minimal, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
