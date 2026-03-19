const { PrismaClient } = require('@prisma/client');

// Try with production DB
process.env.CREATIENDAS_FINAL_DB = "postgres://a9abdfcdcae7ea5a2f55d4dae4b229e7c8cbd737459e15c515bee70ccf5cd9ac:sk_0d5owjlUZGi-HXDWMG2fx@db.prisma.io:5432/postgres?sslmode=require";

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
