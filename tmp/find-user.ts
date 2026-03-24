import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function findSpecificUser(targetEmail: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: targetEmail,
                    mode: 'insensitive'
                }
            }
        });

        if (user) {
            console.log(`✅ User found: ${user.email} (ID: ${user.id})`);
        } else {
            console.log(`❌ User NOT found: ${targetEmail}`);
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

findSpecificUser('jeissondavidr50@gmail.com');
