const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@creatiendas.co';
    const password = 'AdminCreatiendas2026!';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
            passwordHash: passwordHash
        },
        create: {
            email,
            name: 'Administrador Principal',
            passwordHash: passwordHash,
            role: 'ADMIN',
            plan: 'PRO'
        }
    });

    console.log('✅ Admin Created/Updated Successfully');
    console.log('Email:', email);
    console.log('Password:', password);
}

main().finally(() => prisma.$disconnect());
