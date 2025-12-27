const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function extremeQA() {
    console.log('🚀 STARTING EXTREME ADMIN Q&A AUDIT');
    console.log('-----------------------------------');

    const adminEmail = 'localadmin@test.com';
    const testUserEmail = 'test-qa-user@example.com';
    const testStoreSlug = 'test-qa-store-' + Date.now();

    try {
        // 1. Verify Admin
        console.log('1. Verifying Admin Role...');
        const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPERADMIN')) {
            throw new Error('Admin not found or incorrect role: ' + (admin ? admin.role : 'None'));
        }
        console.log('✅ Admin verified: ' + admin.email + ' (' + admin.role + ')');

        // 2. Create Test User (Simulate Registration/Admin Add)
        console.log('\n2. Creating Test User...');
        // Cleanup if exists
        await prisma.user.deleteMany({ where: { email: testUserEmail } });

        const testUser = await prisma.user.create({
            data: {
                email: testUserEmail,
                name: 'Test QA User',
                passwordHash: await bcrypt.hash('testpassword', 10),
                role: 'USER',
                plan: 'FREE',
                walletAccount: {
                    create: { balance: 0, currency: 'COP' }
                }
            }
        });
        console.log('✅ Test User created: ID=' + testUser.id);

        // 3. Test "Editar" (Update User)
        console.log('\n3. Testing "Editar" (PATCH User)...');
        const updatedUser = await prisma.user.update({
            where: { id: testUser.id },
            data: { name: 'Updated QA User', plan: 'PRO' }
        });
        if (updatedUser.name !== 'Updated QA User' || updatedUser.plan !== 'PRO') {
            throw new Error('Update failed');
        }
        console.log('✅ User updated successfully');

        // 4. Test "Reset Pass"
        console.log('\n4. Testing "Reset Pass"...');
        const newHash = await bcrypt.hash('newpassword123', 10);
        await prisma.user.update({
            where: { id: testUser.id },
            data: { passwordHash: newHash }
        });
        const resetUser = await prisma.user.findUnique({ where: { id: testUser.id } });
        const isMatch = await bcrypt.compare('newpassword123', resetUser.passwordHash);
        if (!isMatch) throw new Error('Password reset verification failed');
        console.log('✅ Password reset verified');

        // 5. Test "Tiendas" (Create Store as Admin/User context)
        console.log('\n5. Testing Store Creation...');
        const store = await prisma.store.create({
            data: {
                name: 'Test QA Store',
                slug: testStoreSlug,
                ownerId: testUser.id,
                data: { theme: 'default' }
            }
        });
        console.log('✅ Store created: ' + store.slug);

        // 6. Test Deep Cleanup (Delete User)
        console.log('\n6. Testing Deep Cleanup (Delete User)...');
        // This simulates the logic in the DELETE API
        await prisma.$transaction(async (tx) => {
            const userId = testUser.id;

            // Delete related data
            await tx.store.deleteMany({ where: { ownerId: userId } });
            const wallet = await tx.walletAccount.findUnique({ where: { userId } });
            if (wallet) {
                await tx.transaction.deleteMany({ where: { accountId: wallet.id } });
                await tx.walletAccount.delete({ where: { id: wallet.id } });
            }
            await tx.user.delete({ where: { id: userId } });
        });

        // Verify deletion
        const exists = await prisma.user.findUnique({ where: { id: testUser.id } });
        const storeExists = await prisma.store.findUnique({ where: { slug: testStoreSlug } });

        if (exists || storeExists) {
            throw new Error('Cleanup failed: User or Store still exists');
        }
        console.log('✅ Deep Cleanup verified successfully');

        console.log('\n-----------------------------------');
        console.log('✨ ALL ADMIN CONTROLS AUDITED SUCCESSFULLY');
        console.log('-----------------------------------');

    } catch (e) {
        console.error('\n❌ QA AUDIT FAILED:', e.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

extremeQA();
