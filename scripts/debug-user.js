const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function debugUser(email, passwordToTest) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            console.log(`❌ USUARIO NO ENCONTRADO: ${email}`);
            return;
        }

        console.log(`✅ USUARIO ENCONTRADO:`);
        console.log(`- ID: ${user.id}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Rol: ${user.role}`);
        console.log(`- Hash en DB: ${user.passwordHash ? 'Presente' : 'AUSENTE'}`);

        if (user.passwordHash && passwordToTest) {
            const isValid = await bcrypt.compare(passwordToTest, user.passwordHash);
            console.log(`- ¿Contraseña coincide con "${passwordToTest}"?: ${isValid ? 'SÍ ✅' : 'NO ❌'}`);
        }
    } catch (error) {
        console.error('Error debugging user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

const email = "GABRIELESQUIVIA@GMAIL.COM";
const pass = "CT-Gabriel#2026!Admin";

debugUser(email, pass);
