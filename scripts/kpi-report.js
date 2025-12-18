/**
 * KPI Report Generator - Creatiendas (Enhanced)
 * Generates comprehensive real-time metrics
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 REPORTE INTEGRAL DE SISTEMA - CREATIENDAS');
    console.log('📅 Fecha: ' + new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }));
    console.log('='.repeat(80));

    try {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // --- 1. USERS & SESSIONS ---
        console.log('\n👥 USUARIOS Y SESIONES');
        console.log('-'.repeat(40));

        const totalUsers = await prisma.user.count();
        const newUsers24h = await prisma.user.count({
            where: { createdAt: { gte: yesterday } }
        });

        // Proxy for "Active Sessions": Users active in last 24h (updatedAt)
        const activeUsers24h = await prisma.user.count({
            where: { updatedAt: { gte: yesterday } }
        });

        console.log(`   Total Usuarios:      ${totalUsers}`);
        console.log(`   Nuevos (24h):        ${newUsers24h}`);
        console.log(`   Activos (24h):       ${activeUsers24h} (Basado en actividad reciente)`);

        // Users by Plan
        const usersByPlan = await prisma.user.groupBy({
            by: ['plan'],
            _count: { plan: true }
        });
        console.log('\n   Desglose por Plan:');
        usersByPlan.forEach(p => {
            console.log(`   - ${p.plan.padEnd(10)}: ${p._count.plan}`);
        });

        // --- 2. STORES (Detailed) ---
        console.log('\n\n🏪 TIENDAS Y COMERCIO');
        console.log('-'.repeat(40));

        const totalStores = await prisma.store.count();
        const newStores24h = await prisma.store.count({
            where: { createdAt: { gte: yesterday } }
        });
        const newStores7d = await prisma.store.count({
            where: { createdAt: { gte: sevenDaysAgo } }
        });

        console.log(`   Total Tiendas:       ${totalStores}`);
        console.log(`   Creadas (24h):       ${newStores24h}`);
        console.log(`   Creadas (7d):        ${newStores7d}`);

        // List Recent Stores
        const recentStores = await prisma.store.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { owner: { select: { email: true, name: true } } }
        });

        if (recentStores.length > 0) {
            console.log('\n   📋 Detalle: Últimas 10 Tiendas Creadas');
            console.log(`   ${'NOMBRE'.padEnd(25)} | ${'SLUG'.padEnd(20)} | ${'OWNER'.padEnd(30)} | ${'FECHA'}`);
            console.log('   ' + '-'.repeat(95));
            recentStores.forEach(s => {
                const date = new Date(s.createdAt).toLocaleDateString('es-CO');
                console.log(`   ${s.name.substring(0, 24).padEnd(25)} | ${s.slug.substring(0, 19).padEnd(20)} | ${s.owner.email.substring(0, 29).padEnd(30)} | ${date}`);
            });
        }

        // --- 3. ANALYTICS & EVENTS ---
        console.log('\n\n📈 ACTIVIDAD DE SISTEMA (All Data Summary)');
        console.log('-'.repeat(40));

        try {
            const totalEvents = await prisma.analyticsEvent.count();
            const events24h = await prisma.analyticsEvent.count({
                where: { createdAt: { gte: yesterday } }
            });

            console.log(`   Eventos Totales:     ${totalEvents}`);
            console.log(`   Eventos (24h):       ${events24h}`);

            if (events24h > 0) {
                const topEvents = await prisma.analyticsEvent.groupBy({
                    by: ['eventType'],
                    _count: { eventType: true },
                    orderBy: { _count: { eventType: 'desc' } },
                    take: 5
                });
                console.log('\n   Top Eventos:');
                topEvents.forEach(e => console.log(`   - ${e.eventType}: ${e._count.eventType}`));
            }
        } catch (e) {
            console.log('   (Módulo de analytics no inicializado o vacío)');
        }

        console.log('\n' + '='.repeat(80));
        console.log('FIN DEL REPORTE');
        console.log('='.repeat(80) + '\n');

    } catch (error) {
        console.error('❌ Error generando reporte:', error);
    } finally {
        await prisma.$disconnect();
    }
}

generateReport();
