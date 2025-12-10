const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                // name: true, // removed to avoid encoding issues just in case
                role: true,
                stores: {
                    select: { name: true }
                }
            }
        });

        let report = "USER REPORT:\n";
        users.forEach(u => {
            report += `ID: ${u.id}\nEmail: ${u.email}\nRole: ${u.role}\nStores: ${u.stores.map(s => s.name).join(', ')}\n----------------\n`;
        });

        fs.writeFileSync('user_report_safe.log', report, 'utf8');
        console.log("Report written.");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
