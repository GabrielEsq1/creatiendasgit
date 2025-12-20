const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Fetching users...');
        const users = await prisma.user.findMany({
            include: {
                stores: true,
                walletAccount: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Heuristic to filter "Real" vs "Test/Bot"
        const likelyReal = [];
        const likelyTest = [];

        users.forEach(u => {
            const email = u.email.toLowerCase();
            const name = (u.name || '').toLowerCase();

            const isTestEmail = email.includes('test') || email.includes('example') || email.includes('admin') || email.includes('user');
            const hasStores = u.stores.length > 0;
            const hasWalletBalance = u.walletAccount && u.walletAccount.balance > 0;
            const recent = new Date(u.createdAt) > new Date('2025-12-01');

            const score = (hasStores ? 5 : 0) + (hasWalletBalance ? 2 : 0) + (!isTestEmail ? 3 : 0);

            const userObj = {
                id: u.id,
                name: u.name || 'Sin Nombre',
                email: u.email,
                stores: u.stores.map(s => s.name).join(', '),
                storeCount: u.stores.length,
                createdAt: u.createdAt.toLocaleString('es-CO'),
                score
            };

            if (score >= 3 || hasStores) {
                likelyReal.push(userObj);
            } else {
                likelyTest.push(userObj);
            }
        });

        // Generate Report
        let report = `REPORTE DE USUARIOS REALES (Total DB: ${users.length})\n`;
        report += `Fecha: ${new Date().toLocaleString()}\n`;
        report += `===========================================\n\n`;

        report += `🟢 USUARIOS CONFIRMADOS / ALTA PROBABILIDAD (${likelyReal.length})\n`;
        report += `(Criterio: Tiene tienda creada O email legítimo reciente)\n`;
        report += `------------------------------------------------------------------------------------------------\n`;
        report += `| ${'Nombre'.padEnd(25)} | ${'Email'.padEnd(35)} | ${'Tiendas'.padEnd(20)} | ${'Fecha Registro'}\n`;
        report += `------------------------------------------------------------------------------------------------\n`;

        likelyReal.forEach(u => {
            report += `| ${u.name.substring(0, 24).padEnd(25)} | ${u.email.substring(0, 34).padEnd(35)} | ${(u.storeCount + ' tiendas').padEnd(20)} | ${u.createdAt}\n`;
            if (u.storeCount > 0) report += `| -> Tiendas: ${u.stores}\n`;
        });

        report += `\n\n🟡 POSIBLES PRUEBAS / BOTS (${likelyTest.length})\n`;
        report += `(Criterio: Emails tipo "test", "admin", "example" sin tiendas)\n`;
        report += `------------------------------------------------------------------------------------------------\n`;
        likelyTest.slice(0, 15).forEach(u => { // Limit display of junk
            report += `| ${u.name.substring(0, 24).padEnd(25)} | ${u.email.substring(0, 34).padEnd(35)} | \n`;
        });
        if (likelyTest.length > 15) report += `| ... y ${likelyTest.length - 15} más.\n`;

        fs.writeFileSync('users_dump.txt', report);
        console.log('Report saved to users_dump.txt');

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
