import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function resetAdmin() {
    console.log('🛡️ Setting up admin access...');
    const email = 'admin@creatiendas.co';
    const pass = 'admin123';
    const hash = await bcrypt.hash(pass, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: { 
                passwordHash: hash,
                role: 'ADMIN',
                plan: 'PRO'
            },
            create: {
                email,
                name: 'Admin Global',
                passwordHash: hash,
                role: 'ADMIN',
                plan: 'PRO'
            }
        });

        console.log(`✅ Admin updated successfully:`);
        console.log(`   Email: ${email}`);
        console.log(`   Pass: ${pass}`);
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
