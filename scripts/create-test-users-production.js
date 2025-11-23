/**
 * Script to create test users in the production database
 * Run this with: node scripts/create-test-users-production.js
 * 
 * This creates:
 * - free1@test.com (FREE plan, USER role)
 * - pro1@test.com (PRO plan, USER role)
 * - admin1@creatiendas.com (PRO plan, ADMIN role)
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Creating test users in production database...\n');

    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Test users to create
    const testUsers = [
        {
            email: 'free1@test.com',
            name: 'Free User Test',
            plan: 'FREE',
            role: 'USER',
        },
        {
            email: 'pro1@test.com',
            name: 'Pro User Test',
            plan: 'PRO',
            role: 'USER',
        },
        {
            email: 'admin1@creatiendas.com',
            name: 'Admin User Test',
            plan: 'PRO',
            role: 'ADMIN',
        },
    ];

    for (const userData of testUsers) {
        try {
            // Check if user already exists
            const existing = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existing) {
                console.log(`✓ User ${userData.email} already exists (Plan: ${existing.plan}, Role: ${existing.role})`);

                // Update if needed
                if (existing.plan !== userData.plan || existing.role !== userData.role) {
                    await prisma.user.update({
                        where: { email: userData.email },
                        data: {
                            plan: userData.plan,
                            role: userData.role,
                        },
                    });
                    console.log(`  → Updated to Plan: ${userData.plan}, Role: ${userData.role}`);
                }
            } else {
                // Create new user
                const user = await prisma.user.create({
                    data: {
                        email: userData.email,
                        name: userData.name,
                        passwordHash,
                        plan: userData.plan,
                        role: userData.role,
                    },
                });
                console.log(`✓ Created user ${user.email} (Plan: ${user.plan}, Role: ${user.role})`);
            }
        } catch (error) {
            console.error(`✗ Error processing ${userData.email}:`, error.message);
        }
    }

    console.log('\n✅ Test users setup complete!');
    console.log('\nTest credentials:');
    console.log('- free1@test.com / password123 (FREE plan, 1 store limit)');
    console.log('- pro1@test.com / password123 (PRO plan, 5 store limit)');
    console.log('- admin1@creatiendas.com / password123 (ADMIN role, unlimited stores)');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
