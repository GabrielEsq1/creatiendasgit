const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createTestUser() {
    try {
        // Hash the password
        const passwordHash = await bcrypt.hash('Test123!', 10);

        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email: 'testauth@creatiendas.com' }
        });

        if (existing) {
            console.log('Test user already exists. Updating password...');
            await prisma.user.update({
                where: { email: 'testauth@creatiendas.com' },
                data: { passwordHash }
            });
            console.log('Password updated successfully!');
        } else {
            console.log('Creating new test user...');
            const user = await prisma.user.create({
                data: {
                    email: 'testauth@creatiendas.com',
                    name: 'Test User',
                    passwordHash,
                    emailVerified: new Date(),
                    role: 'USER',
                    plan: 'FREE'
                }
            });

            // Create wallet for the user
            await prisma.walletAccount.create({
                data: {
                    userId: user.id,
                    balance: 0,
                    currency: 'COP'
                }
            });

            console.log('Test user created successfully!');
        }

        console.log('\nTest credentials:');
        console.log('Email: testauth@creatiendas.com');
        console.log('Password: Test123!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
