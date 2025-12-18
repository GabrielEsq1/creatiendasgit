const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    console.log("🧹 Starting cleanup of test users...");

    try {
        // 1. Identify non-admin users
        const nonAdmins = await prisma.user.findMany({
            where: {
                role: { not: 'ADMIN' },
                // Double safety: ensure we don't accidentally get localadmin if role wasn't set correctly (though it should be)
                email: { not: 'localadmin@test.com' }
            },
            select: { id: true, email: true }
        });

        console.log(`Found ${nonAdmins.length} test users to delete.`);

        if (nonAdmins.length === 0) {
            console.log("✅ No test users found. System is clean.");
            return;
        }

        const idsToDelete = nonAdmins.map(u => u.id);

        // 2. Delete related data first (to satisfy Foreign Key constraints)
        console.log("   - Deleting associated Password Reset Tokens...");
        await prisma.passwordResetToken.deleteMany({
            where: { userId: { in: idsToDelete } }
        });

        console.log("   - Deleting associated Contacts...");
        await prisma.contact.deleteMany({
            where: {
                OR: [
                    { userId: { in: idsToDelete } },
                    { contactId: { in: idsToDelete } }
                ]
            }
        });

        console.log("   - Deleting associated Messages...");
        await prisma.message.deleteMany({
            where: { senderId: { in: idsToDelete } }
        });

        console.log("   - Deleting Conversation Participants...");
        await prisma.conversationParticipant.deleteMany({
            where: { userId: { in: idsToDelete } }
        });

        console.log("   - Deleting Conversations...");
        await prisma.conversation.deleteMany({
            where: { userId: { in: idsToDelete } }
        });

        console.log("   - Deleting associated Stores...");
        const stores = await prisma.store.deleteMany({
            where: { ownerId: { in: idsToDelete } }
        });
        console.log(`     Deleted ${stores.count} stores.`);

        console.log("   - Deleting associated Wallet Accounts...");
        await prisma.walletAccount.deleteMany({
            where: { userId: { in: idsToDelete } }
        });

        console.log("   - Deleting Stripe Customers...");
        await prisma.stripeCustomer.deleteMany({
            where: { userId: { in: idsToDelete } }
        });

        // 3. Delete the users
        console.log("   - Deleting Users...");
        const users = await prisma.user.deleteMany({
            where: { id: { in: idsToDelete } }
        });

        console.log(`✅ Successfully deleted ${users.count} test users.`);

    } catch (e) {
        console.error("❌ Cleanup failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
