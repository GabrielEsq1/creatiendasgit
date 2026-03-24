import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser(email: string, pass: string) {
    console.log(`🔍 Checking user: ${email}...`);
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('✅ User found. ID:', user.id);
        console.log('   Plan:', user.plan);
        console.log('   Role:', user.role);
        
        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (isMatch) {
            console.log('✅ Password matches!');
        } else {
            console.log('❌ Password DOES NOT match.');
        }

        // Just in case, let's output a bit of info for a manual check
        console.log('   Hash in DB prefix:', user.passwordHash.substring(0, 7));

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

const targetEmail = 'jeissondavidr50@gmail.com';
const targetPass = 'mayerli522023';

checkUser(targetEmail, targetPass);
