
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testRegistrationSimulation() {
    console.log("Starting registration SIMULATION (No Transaction Mode)...");
    const email = "testuser_sim_" + Date.now() + "@example.com";
    const password = "password123";
    const name = "Test Simulation User";

    try {
        console.log(`[1] Checking if user exists: ${email}`);
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log("User already exists.");
            return;
        }

        console.log("[2] Hashing password...");
        const passwordHash = await bcrypt.hash(password, 10);

        const verificationToken = Date.now().toString(36) + Math.random().toString(36).substring(2);

        console.log("[3] Creating User (Stand-alone operation)...");
        let user;
        try {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    verificationToken,
                    emailVerified: new Date(),
                },
            });
            console.log(`✅ User created successfully! ID: ${user.id}`);
        } catch (e) {
            console.error("❌ Failed to create user:", e);
            return;
        }

        console.log("[4] Creating Wallet (Separate operation)...");
        try {
            const wallet = await prisma.walletAccount.create({
                data: {
                    userId: user.id,
                    balance: 0,
                    currency: "COP",
                },
            });
            console.log(`✅ Wallet created successfully! ID: ${wallet.id}`);
        } catch (e) {
            console.error("❌ Failed to create wallet (Non-critical):", e);
        }

        console.log("✅✅ FULL BLOWN TEST COMPLETED SUCCESSFULLY");

    } catch (e) {
        console.error("❌ General Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testRegistrationSimulation();
