import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Update all users to have their email verified
    const result = await prisma.user.updateMany({
        where: {
            emailVerified: null
        },
        data: {
            emailVerified: new Date()
        }
    });

    console.log(`Updated ${result.count} users to have verified emails`);

    // List all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            plan: true,
            emailVerified: true,
            _count: {
                select: { stores: true }
            }
        }
    });

    console.log('\nAll users:');
    users.forEach(u => {
        console.log(`- ${u.email} | ${u.name || 'N/A'} | Role: ${u.role} | Plan: ${u.plan} | Verified: ${u.emailVerified ? 'Yes' : 'No'} | Stores: ${u._count.stores}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
