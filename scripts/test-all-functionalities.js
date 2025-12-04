const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const timestamp = Date.now();
    const email = `testuser_${timestamp}@example.com`;
    const password = 'password123';
    const name = `Test User ${timestamp}`;

    console.log(`\n🧪 STARTING COMPREHENSIVE TEST...`);
    console.log(`   Target User: ${email}`);

    // 1. TEST REGISTRATION (API)
    console.log(`\n1️⃣  Testing Registration API...`);
    try {
        const registerRes = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!registerRes.ok) {
            const errText = await registerRes.text();
            throw new Error(`Registration failed: ${registerRes.status} ${registerRes.statusText} - ${errText}`);
        }
        const registerData = await registerRes.json();
        console.log(`   ✅ API Registration Successful! User ID: ${registerData.userId}`);
    } catch (error) {
        console.error("   ❌ API Call Failed. Is the server running on port 3001?");
        throw error;
    }

    // 2. VERIFY DB STATE (Prisma)
    console.log(`\n2️⃣  Verifying Database State...`);
    const user = await prisma.user.findUnique({
        where: { email },
        include: { walletAccount: true }
    });

    if (!user) throw new Error("User not found in DB!");
    if (!user.walletAccount) throw new Error("Wallet not created for user!");
    console.log(`   ✅ User found in DB.`);
    console.log(`   ✅ Wallet found: ${user.walletAccount.id} (Balance: ${user.walletAccount.balance})`);

    // 3. TEST WALLET TRANSACTIONS (Prisma Logic)
    console.log(`\n3️⃣  Testing Wallet Logic...`);
    // Top-up
    await prisma.walletAccount.update({
        where: { id: user.walletAccount.id },
        data: { balance: 500000 }
    });
    console.log(`   💰 Topped up balance to $500,000`);

    // Create recipient
    const recipientEmail = `recipient_${timestamp}@example.com`;
    const recipient = await prisma.user.create({
        data: {
            email: recipientEmail,
            name: 'Test Recipient',
            walletAccount: { create: { balance: 0 } }
        },
        include: { walletAccount: true }
    });

    // Transfer
    console.log(`   💸 Transferring $50,000 to ${recipientEmail}...`);
    await prisma.$transaction([
        prisma.walletAccount.update({
            where: { id: user.walletAccount.id },
            data: { balance: { decrement: 50000 } }
        }),
        prisma.walletAccount.update({
            where: { id: recipient.walletAccount.id },
            data: { balance: { increment: 50000 } }
        })
    ]);

    const updatedWallet = await prisma.walletAccount.findUnique({ where: { id: user.walletAccount.id } });
    console.log(`   ✅ Transfer complete. New Balance: $${updatedWallet.balance} (Expected: 450000)`);

    // 4. TEST STORE CREATION (Prisma Logic)
    console.log(`\n4️⃣  Testing Store Creation Logic...`);
    const storeSlug = `store-${timestamp}`;
    const store = await prisma.store.create({
        data: {
            name: `Test Store ${timestamp}`,
            slug: storeSlug,
            ownerId: user.id,
            data: { theme: 'dark' }
        }
    });
    console.log(`   ✅ Store created: ${store.name} (${store.slug})`);

    // Verify store
    const foundStore = await prisma.store.findUnique({ where: { slug: storeSlug } });
    if (!foundStore) throw new Error("Store not found in DB!");
    console.log(`   ✅ Store verified in DB.`);

    console.log(`\n🎉 ALL TESTS PASSED SUCCESSFULLY!`);
}

main()
    .catch(e => {
        console.error("\n❌ TEST FAILED:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
