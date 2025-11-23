const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createLocalAdmin() {
    try {
        // Check if admin already exists
        const existing = await prisma.user.findUnique({
            where: { email: 'localadmin@test.com' }
        });

        if (existing) {
            console.log('✅ Local admin already exists:', existing.email);
            console.log('   Role:', existing.role);
            console.log('   Plan:', existing.plan);
            return;
        }

        // Create admin user
        const passwordHash = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.create({
            data: {
                email: 'localadmin@test.com',
                name: 'Local Admin',
                passwordHash,
                role: 'ADMIN',
                plan: 'PRO'
            }
        });

        console.log('✅ Local admin created successfully!');
        console.log('   Email:', admin.email);
        console.log('   Password: admin123');
        console.log('   Role:', admin.role);
        console.log('   Plan:', admin.plan);

    } catch (error) {
        console.error('❌ Error creating local admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createLocalAdmin();
