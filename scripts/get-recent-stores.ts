import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function getRecentStores(limit = 50) {
  try {
    console.log('Fetching recent stores...');
    
    const recentStores = await prisma.store.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            email: true,
            name: true,
            createdAt: true
          }
        }
      }
    });

    console.log('\n=== TIENDAS RECIENTEMENTE CREADAS ===');
    console.log(`Total encontradas: ${recentStores.length}\n`);
    
    // Format the output as a table
    console.table(
      recentStores.map(store => ({
        'ID Tienda': store.id,
        'Nombre Tienda': store.name,
        'Slug': store.slug,
        'Email Dueño': store.owner.email,
        'Nombre Dueño': store.owner.name || 'No especificado',
        'Fecha Creación': store.createdAt.toLocaleString(),
        'Vistas': store.views
      })),
      ['ID Tienda', 'Nombre Tienda', 'Slug', 'Email Dueño', 'Nombre Dueño', 'Fecha Creación', 'Vistas']
    );

    // Also save to a file for easier sharing
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, 'recent-stores.json');
    
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        recentStores.map(store => ({
          storeId: store.id,
          storeName: store.name,
          storeSlug: store.slug,
          ownerEmail: store.owner.email,
          ownerName: store.owner.name,
          createdAt: store.createdAt,
          views: store.views
        })),
        null,
        2
      )
    );
    
    console.log(`\nDatos guardados en: ${outputPath}`);
    
  } catch (error) {
    console.error('Error fetching recent stores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get the limit from command line argument or use default (50)
const limit = process.argv[2] ? parseInt(process.argv[2]) : 50;
getRecentStores(limit);
