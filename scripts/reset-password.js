const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPassword() {
    try {
        const email = 'gabrielesquivia@gmail.com';
        // Hash para 'TestPassword123'
        const passwordHash = '$2b$12$1QRr1xWOHO/tLUOqyFxn0uxpLazAbOIgYwbkgMXnr98XYtyVL1chW';

        const user = await prisma.user.update({
            where: { email: email },
            data: { passwordHash: passwordHash },
        });

        console.log(`✅ Contraseña actualizada para: ${email}`);
        console.log('Nueva contraseña: TestPassword123');
    } catch (error) {
        if (error.code === 'P2025') {
            console.log('⚠️ El usuario no existe. Creándolo...');
            // Si no existe, lo creamos
            const passwordHash = '$2b$12$1QRr1xWOHO/tLUOqyFxn0uxpLazAbOIgYwbkgMXnr98XYtyVL1chW';
            await prisma.user.create({
                data: {
                    email: 'gabrielesquivia@gmail.com',
                    name: 'Gabriel Test',
                    passwordHash: passwordHash
                }
            });
            console.log('✅ Usuario creado con contraseña: TestPassword123');
        } else {
            console.error('❌ Error:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
