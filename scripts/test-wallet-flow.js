const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting Wallet Flow Test...");

    // 1. Setup Users
    const passwordHash = await bcrypt.hash('demo123', 10);

    // Sender
    const sender = await prisma.user.upsert({
        where: { email: 'demo@monedera.com' },
        update: {},
        create: {
            email: 'demo@monedera.com',
            name: 'Demo Sender',
            passwordHash,
            role: 'USER',
            walletAccount: {
                create: { balance: 0 }
            }
        },
        include: { walletAccount: true }
    });

    // Recipient
    const recipient = await prisma.user.upsert({
        where: { email: 'recipient@monedera.com' },
        update: {},
        create: {
            email: 'recipient@monedera.com',
            name: 'Demo Recipient',
            passwordHash,
            role: 'USER',
            walletAccount: {
                create: { balance: 0 }
            }
        },
        include: { walletAccount: true }
    });

    console.log(`✅ Users ready: ${sender.email} -> ${recipient.email}`);

    // Ensure wallets exist (in case users existed but wallets didn't)
    let senderWallet = sender.walletAccount;
    if (!senderWallet) {
        senderWallet = await prisma.walletAccount.create({
            data: { userId: sender.id, balance: 0 }
        });
    }

    let recipientWallet = recipient.walletAccount;
    if (!recipientWallet) {
        recipientWallet = await prisma.walletAccount.create({
            data: { userId: recipient.id, balance: 0 }
        });
    }

    // 2. Fake Balance (Top-up Sender)
    const FAKE_BALANCE = 1000000;
    await prisma.walletAccount.update({
        where: { id: senderWallet.id },
        data: { balance: FAKE_BALANCE }
    });
    console.log(`💰 Faked Balance for ${sender.email}: $${FAKE_BALANCE}`);

    // 3. Internal Transaction (Transfer)
    const TRANSFER_AMOUNT = 50000;
    console.log(`💸 Attempting transfer of $${TRANSFER_AMOUNT} from ${sender.email} to ${recipient.email}...`);

    const result = await prisma.$transaction(async (tx) => {
        // Debit Sender
        const updatedSenderWallet = await tx.walletAccount.update({
            where: { id: senderWallet.id },
            data: { balance: { decrement: TRANSFER_AMOUNT } }
        });

        await tx.transaction.create({
            data: {
                accountId: senderWallet.id,
                type: 'debit',
                amount: TRANSFER_AMOUNT,
                description: `Transfer to ${recipient.email}`,
                metadata: { to: recipient.email },
                status: 'completed'
            }
        });

        // Credit Recipient
        const updatedRecipientWallet = await tx.walletAccount.update({
            where: { id: recipientWallet.id },
            data: { balance: { increment: TRANSFER_AMOUNT } }
        });

        await tx.transaction.create({
            data: {
                accountId: recipientWallet.id,
                type: 'credit',
                amount: TRANSFER_AMOUNT,
                description: `Received from ${sender.email}`,
                metadata: { from: sender.email },
                status: 'completed'
            }
        });

        return { senderBalance: updatedSenderWallet.balance, recipientBalance: updatedRecipientWallet.balance };
    });

    console.log("✅ Transaction Successful!");
    console.log(`   - Sender New Balance: $${result.senderBalance}`);
    console.log(`   - Recipient New Balance: $${result.recipientBalance}`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
