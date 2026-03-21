const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const store = await prisma.store.findUnique({where: {slug: 'magis-store-mmvdns55'}}); 
  console.log(JSON.parse(store.data).heroBg); 
  await prisma.$disconnect(); 
} 
main().catch(console.error);
