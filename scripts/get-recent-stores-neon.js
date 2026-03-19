const { PrismaClient } = require('@prisma/client');

process.env.CREATIENDAS_FINAL_DB = "postgresql://neondb_owner:npg_lD5ypmT6MWHb@ep-solitary-thunder-adjq6xeu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({ log: ['error', 'warn'] });

async function main() {
  const stores = await prisma.store.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { email: true, name: true } }
    }
  });

  console.log('=== TIENDAS CREADAS EN PRODUCCION ===');
  console.log(`Total: ${stores.length}\n`);

  for (const store of stores) {
    if (store.slug.includes("magis")) {
        console.log(`FOUND MAGIS!`);
    }
    console.log(`- ID: ${store.id}`);
    console.log(`  Nombre: ${store.name}`);
    console.log(`  Url: /${store.slug}`);
    console.log(`  Dueño: ${store.owner.name || 'N/A'} (${store.owner.email})`);
    console.log(`  Creada: ${store.createdAt}`);
    console.log('--------------------------------------------------');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
