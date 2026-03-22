const { PrismaClient } = require('@prisma/client');

const DB_URL = 'postgres://a9abdfcdcae7ea5a2f55d4dae4b229e7c8cbd737459e15c515bee70ccf5cd9ac:sk_K8lBcgJJ5f8mol6X-xLAr@db.prisma.io:5432/postgres?sslmode=require';

const prisma = new PrismaClient({
  datasources: { db: { url: DB_URL } }
});

async function main() {
  const email = 'gabrielesquivia@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('Usuario no encontrado:', email);
    return;
  }
  console.log('Encontrado:', user.id, user.email);

  try { await prisma.walletAccount.deleteMany({ where: { userId: user.id } }); console.log('Wallet eliminada'); } catch(e) { console.log('No wallet'); }
  try { await prisma.store.deleteMany({ where: { userId: user.id } }); console.log('Tiendas eliminadas'); } catch(e) { console.log('No stores'); }
  try { await prisma.session.deleteMany({ where: { userId: user.id } }); console.log('Sesiones eliminadas'); } catch(e) { console.log('No sessions'); }
  try { await prisma.account.deleteMany({ where: { userId: user.id } }); console.log('Accounts eliminados'); } catch(e) { console.log('No accounts'); }
  await prisma.user.delete({ where: { id: user.id } });
  console.log('✅ Usuario eliminado:', email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
