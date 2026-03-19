const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

process.env.CREATIENDAS_FINAL_DB = "postgresql://neondb_owner:npg_lD5ypmT6MWHb@ep-solitary-thunder-adjq6xeu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({ log: ['error', 'warn'] });

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  // Reset for gabrielesquivffia@gmail.com
  let user1;
  try {
     user1 = await prisma.user.update({
      where: { email: 'gabrielesquivffia@gmail.com' },
      data: { passwordHash: passwordHash }
    });
    console.log(`Password reset for ${user1.email}`);
  } catch(e) { console.error('Error with user1'); }

  // Reset for localadmin@test.com
  let user2;
  try {
     user2 = await prisma.user.update({
      where: { email: 'localadmin@test.com' },
      data: { passwordHash: passwordHash }
    });
    console.log(`Password reset for ${user2.email}`);
  } catch(e) { console.error('Error with user2'); }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
