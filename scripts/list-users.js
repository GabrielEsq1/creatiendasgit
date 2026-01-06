const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true
        }
    });

    console.log('--- USUARIOS EN EL SISTEMA ---');
    users.forEach(u => {
        console.log(`- Email: ${u.email} | Rol: ${u.role} | ID: ${u.id}`);
    });
    console.log('------------------------------');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
