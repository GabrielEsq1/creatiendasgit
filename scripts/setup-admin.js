const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function setupAdmin(email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email: email.toLowerCase().trim() },
            update: {
                role: 'ADMIN',
                passwordHash: hashedPassword
            },
            create: {
                email: email.toLowerCase().trim(),
                name: 'Gabriel Esquiria',
                role: 'ADMIN',
                passwordHash: hashedPassword,
                plan: 'PRO'
            }
        });

        console.log(`✅ ¡Éxito! Usuario ${user.email} configurado como ADMIN.`);
    } catch (error) {
        console.error('Error durante la configuración de admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.log('Uso: node setup-admin.js [email] [password]');
    process.exit(1);
}

setupAdmin(email, password);
