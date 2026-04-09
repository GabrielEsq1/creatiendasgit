const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'gabrielesqmaq@gmail.com';
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        stores: true,
        walletAccount: true,
        passwordResetTokens: true,
        accounts: true,
        sessions: true,
      }
    });

    if (user) {
      console.log(`Found user ${email}. Deleting related records...`);

      // Delete related records
      if (user.walletAccount) {
        await prisma.walletAccount.delete({ where: { userId: user.id } });
      }
      
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      
      for (const store of user.stores) {
        // Delete images first if any
        await prisma.storedImage.deleteMany({ where: { storeId: store.id } });
        await prisma.store.delete({ where: { id: store.id } });
      }

      await prisma.account.deleteMany({ where: { userId: user.id } });
      await prisma.session.deleteMany({ where: { userId: user.id } });
      
      // Finally delete the user
      await prisma.user.delete({
        where: { email }
      });
      console.log(`User ${email} and all related data deleted successfully.`);
    } else {
      console.log(`User ${email} not found.`);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
