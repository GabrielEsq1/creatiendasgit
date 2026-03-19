const { PrismaClient } = require('@prisma/client');

process.env.CREATIENDAS_FINAL_DB = "postgresql://neondb_owner:npg_lD5ypmT6MWHb@ep-solitary-thunder-adjq6xeu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({ log: ['error', 'warn'] });

async function main() {
  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: ['ADMIN', 'SUPERADMIN']
      }
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  console.log('=== ADMIN USERS IN PRODUCTION ===');
  console.log(`Total admins: ${admins.length}\n`);

  for (const admin of admins) {
    console.log(`- ID: ${admin.id}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Nombre: ${admin.name || 'N/A'}`);
    console.log(`  Rol: ${admin.role}`);
    console.log(`  Creado: ${admin.createdAt}`);
    console.log('--------------------------------------------------');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
