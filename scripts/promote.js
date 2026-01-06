const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promote(email, role = 'ADMIN') {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            console.error(`Error: Usuario ${email} no encontrado.`);
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { role: role }
        });

        console.log(`✅ ¡Éxito! Usuario ${updatedUser.email} ahora tiene el rol: ${updatedUser.role}`);
    } catch (error) {
        console.error('Error durante la promoción:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Get email from command line arg
const targetEmail = process.argv[2];
if (!targetEmail) {
    console.log('Uso: node promote.js [email]');
    process.exit(1);
}

promote(targetEmail, 'ADMIN');
