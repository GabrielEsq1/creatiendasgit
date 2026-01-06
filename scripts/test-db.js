
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    let log = 'Testing DB connection...\n';
    try {
        const count = await prisma.user.count();
        log += `Connection successful. User count: ${count}\n`;
    } catch (error) {
        log += `DB Connection Failed: ${error.message}\n`;
        log += `Full error: ${JSON.stringify(error, null, 2)}\n`;
    } finally {
        fs.writeFileSync('db-test-log.txt', log);
        await prisma.$disconnect();
        process.exit(0);
    }
}

main();
