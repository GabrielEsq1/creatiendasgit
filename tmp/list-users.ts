import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.CREATIENDAS_FINAL_DB
    }
  }
});

async function listSimilarUsers(partialEmail: string) {
    console.log(`🔍 Searching for users similar to: ${partialEmail}`);
    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: partialEmail,
                    mode: 'insensitive'
                }
            },
            select: { email: true, name: true, role: true, plan: true }
        });

        if (users.length === 0) {
            console.log('❌ No similar users found');
        } else {
            console.log(`✅ Found ${users.length} users:`);
            users.forEach(u => console.log(` - ${u.email} (${u.role}, ${u.plan})`));
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

listSimilarUsers('jeisson');
