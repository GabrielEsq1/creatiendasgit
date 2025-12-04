/**
 * KPI Report Generator - Creatiendas
 * Generates real-time metrics from the production database
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 REPORTE DE KPIs - CREATIENDAS');
    console.log('📅 Fecha: ' + new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }));
    console.log('='.repeat(70));

    try {
        // 1. Total Users
        const totalUsers = await prisma.user.count();
        console.log('\n👥 USUARIOS');
        console.log('-'.repeat(40));
        console.log(`   Total de usuarios: ${totalUsers}`);

        // Users by plan
        const usersByPlan = await prisma.user.groupBy({
            by: ['plan'],
            _count: { plan: true }
        });
        console.log('\n   Por Plan:');
        usersByPlan.forEach(p => {
            console.log(`   - ${p.plan}: ${p._count.plan} usuarios`);
        });

        // Users by role
        const usersByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: { role: true }
        });
        console.log('\n   Por Rol:');
        usersByRole.forEach(r => {
            console.log(`   - ${r.role}: ${r._count.role} usuarios`);
        });

        // Recent users (last 10)
        const recentUsers = await prisma.user.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                plan: true,
                role: true,
                createdAt: true
            }
        });
        console.log('\n   Últimos 10 usuarios registrados:');
        recentUsers.forEach((u, i) => {
            const date = new Date(u.createdAt).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
            console.log(`   ${i + 1}. ${u.email} (${u.plan}) - ${date}`);
        });

        // 2. Total Stores
        console.log('\n\n🏪 TIENDAS');
        console.log('-'.repeat(40));
        const totalStores = await prisma.store.count();
        console.log(`   Total de tiendas: ${totalStores}`);

        // Stores with most views
        const topStores = await prisma.store.findMany({
            take: 10,
            orderBy: { views: 'desc' },
            select: {
                id: true,
                name: true,
                slug: true,
                views: true,
                createdAt: true,
                owner: {
                    select: { email: true }
                }
            }
        });

        if (topStores.length > 0) {
            console.log('\n   Top 10 tiendas por visitas:');
            topStores.forEach((s, i) => {
                console.log(`   ${i + 1}. ${s.name} (/${s.slug}) - ${s.views} visitas`);
                console.log(`      Propietario: ${s.owner?.email || 'N/A'}`);
            });

            // Total views
            const totalViews = topStores.reduce((sum, s) => sum + s.views, 0);
            console.log(`\n   Total de visitas a tiendas: ${totalViews}`);
        } else {
            console.log('   No hay tiendas creadas aún.');
        }

        // Recent stores
        const recentStores = await prisma.store.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                name: true,
                slug: true,
                createdAt: true
            }
        });
        if (recentStores.length > 0) {
            console.log('\n   Últimas 5 tiendas creadas:');
            recentStores.forEach((s, i) => {
                const date = new Date(s.createdAt).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
                console.log(`   ${i + 1}. ${s.name} - ${date}`);
                console.log(`      URL: https://creatiendasgit1.vercel.app/stores/${s.slug}`);
            });
        }

        // 3. Analytics Events (if table exists)
        console.log('\n\n📈 ANALYTICS');
        console.log('-'.repeat(40));
        try {
            const totalEvents = await prisma.analyticsEvent.count();
            console.log(`   Total de eventos registrados: ${totalEvents}`);

            const eventsByType = await prisma.analyticsEvent.groupBy({
                by: ['eventType'],
                _count: { eventType: true }
            });
            console.log('\n   Eventos por tipo:');
            eventsByType.forEach(e => {
                console.log(`   - ${e.eventType}: ${e._count.eventType}`);
            });

            // Recent events
            const recentEvents = await prisma.analyticsEvent.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    eventType: true,
                    path: true,
                    createdAt: true
                }
            });
            if (recentEvents.length > 0) {
                console.log('\n   Últimos 10 eventos:');
                recentEvents.forEach((e, i) => {
                    const date = new Date(e.createdAt).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
                    console.log(`   ${i + 1}. ${e.eventType} - ${e.path || '/'} - ${date}`);
                });
            }
        } catch (e) {
            console.log('   Tabla de analytics no disponible aún.');
        }

        // 4. Wallet/Transactions (if applicable)
        console.log('\n\n💰 WALLET (Monedera)');
        console.log('-'.repeat(40));
        try {
            const totalAccounts = await prisma.walletAccount.count();
            console.log(`   Cuentas de wallet: ${totalAccounts}`);

            const totalBalance = await prisma.walletAccount.aggregate({
                _sum: { balance: true }
            });
            console.log(`   Balance total en sistema: $${totalBalance._sum.balance || 0} COP`);

            const totalTransactions = await prisma.transaction.count();
            console.log(`   Total transacciones: ${totalTransactions}`);
        } catch (e) {
            console.log('   Módulo de wallet no activo.');
        }

        // 5. Summary
        console.log('\n\n' + '='.repeat(70));
        console.log('📋 RESUMEN EJECUTIVO');
        console.log('='.repeat(70));
        console.log(`
   👥 Usuarios totales: ${totalUsers}
   🏪 Tiendas creadas: ${totalStores}
   📊 Ratio tiendas/usuario: ${totalUsers > 0 ? (totalStores / totalUsers).toFixed(2) : 0}
   
   🚀 Estado: ${totalUsers > 0 ? 'ACTIVO - Recibiendo tráfico' : 'ESPERANDO USUARIOS'}
`);

        console.log('='.repeat(70));
        console.log('Reporte generado exitosamente.');
        console.log('='.repeat(70) + '\n');

    } catch (error) {
        console.error('Error generando reporte:', error);
    } finally {
        await prisma.$disconnect();
    }
}

generateReport();
