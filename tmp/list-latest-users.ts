import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function listAllUsers() {
    try {
        const users = await prisma.user.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            select: { email: true, role: true, plan: true }
        });

        console.log(`✅ Latest 20 users:`);
        users.forEach(u => console.log(` - ${u.email} (${u.role}, ${u.plan})`));
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

listAllUsers();
