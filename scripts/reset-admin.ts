import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    let adminUser = await prisma.user.findUnique({
        where: { email: 'admin@b2bchat.com' }
    });

    if (!adminUser) {
        console.log("Admin user does not exist. Creating it...");
        const passwordHash = await bcrypt.hash('admin1234', 10);
        adminUser = await prisma.user.create({
            data: {
                email: 'admin@b2bchat.com',
                name: 'System Admin',
                passwordHash: passwordHash,
                role: 'ADMIN'
            }
        });
        console.log("Created admin user with password: admin1234");
    } else {
        console.log("Admin user already exists. Overwriting password to admin1234...");
        const passwordHash = await bcrypt.hash('admin1234', 10);
        await prisma.user.update({
            where: { email: 'admin@b2bchat.com' },
            data: { passwordHash: passwordHash, role: 'ADMIN' }
        });
        console.log("Updated admin password to: admin1234");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
