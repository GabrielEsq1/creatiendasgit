const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'demo@creatiendas.com';
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password AND role
    const user = await prisma.user.update({
        where: { email },
        data: {
            passwordHash,
            role: 'ADMIN' // Force admin role
        }
    });

    console.log('User updated:', user.email);
    console.log('Role:', user.role);
    console.log('Password reset successful');
}

resetPassword()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
