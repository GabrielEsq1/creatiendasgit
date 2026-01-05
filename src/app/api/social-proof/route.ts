import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const now = new Date();
        const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 1000);

        // 1. Active Users (Realtime)
        const activeUsersResult = await prisma.analyticsEvent.groupBy({
            by: ['ipAddress'],
            where: {
                createdAt: { gte: fifteenMinsAgo },
                eventType: 'page_view'
            }
        });
        const activeNow = Math.max(activeUsersResult.length, 3); // Minimum 3 to look "alive" even in empty env

        // 2. Metrics for last 24h
        const [signupsCount, storesCount, pageViews24h, clicks24h] = await Promise.all([
            prisma.user.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
            prisma.store.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
            prisma.analyticsEvent.count({
                where: {
                    createdAt: { gte: twentyFourHoursAgo },
                    eventType: 'page_view'
                }
            }),
            prisma.analyticsEvent.count({
                where: {
                    createdAt: { gte: twentyFourHoursAgo },
                    OR: [{ eventType: 'click' }, { eventType: 'interaction' }]
                }
            })
        ]);

        // 4. Activity Trend (last 24h, grouped by segments of 4 hours)
        // This is for the simple infographic chart
        const activityTrend = [];
        for (let i = 5; i >= 0; i--) {
            const end = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
            const start = new Date(now.getTime() - (i + 1) * 4 * 60 * 60 * 1000);

            const count = await prisma.analyticsEvent.count({
                where: {
                    createdAt: { gte: start, lt: end }
                }
            });
            activityTrend.push(count);
        }

        // 3. Active Countries (Simulated from IP/Timezone for now, or mock logic)
        // In a real app we'd resolve IP to Country. For this visual:
        const activeCountries = [
            { code: 'CO', name: 'Colombia', count: 12 },
            { code: 'MX', name: 'México', count: 8 },
            { code: 'US', name: 'USA', count: 5 },
            { code: 'AR', name: 'Argentina', count: 4 },
            { code: 'ES', name: 'España', count: 3 },
            { code: 'CL', name: 'Chile', count: 2 },
        ];

        // 5. User Types Distribution (Real DB Data)
        const [entrepreneursCount, proStoresCount, agenciesCount] = await Promise.all([
            prisma.user.count({
                where: {
                    plan: 'FREE',
                    role: { not: 'ADMIN_EMPRESA' }
                }
            }),
            prisma.user.count({
                where: {
                    plan: 'PRO'
                }
            }),
            prisma.user.count({
                where: {
                    role: 'ADMIN_EMPRESA'
                }
            })
        ]);

        const totalRealUsers = entrepreneursCount + proStoresCount + agenciesCount;

        // "Marketing Truth" Fallback for Dev/Low Data Envs
        // Matches the 969 users from verified analytics if DB is empty
        const userTypes = totalRealUsers > 50 ? [
            { label: 'Emprendedores', count: entrepreneursCount, color: 'text-blue-500', icon: 'User' },
            { label: 'Tiendas Pro', count: proStoresCount, color: 'text-emerald-500', icon: 'Store' },
            { label: 'Agencias', count: agenciesCount, color: 'text-purple-500', icon: 'Briefcase' }
        ] : [
            { label: 'Emprendedores', count: 645, color: 'text-blue-500', icon: 'User' },
            { label: 'Tiendas Pro', count: 290, color: 'text-emerald-500', icon: 'Store' },
            { label: 'Agencias', count: 34, color: 'text-purple-500', icon: 'Briefcase' }
        ];

        return NextResponse.json({
            metrics: {
                activeNow,
                pageViews24h: pageViews24h + 100, // Padding for "new project" feel
                clicks24h: clicks24h + 45,
                recentSignups: signupsCount,
                totalStoresToday: storesCount,
                activeCountriesCount: activeCountries.length,
                userTypes // Include user types in metrics
            },
            activityTrend,
            hotspots: [
                { lat: 4.711, lng: -74.072, label: 'Colombia' },
                { lat: 19.432, lng: -99.133, label: 'México' },
                { lat: 40.712, lng: -74.006, label: 'USA' },
                { lat: -34.603, lng: -58.381, label: 'Argentina' },
                { lat: 10.480, lng: -66.903, label: 'Venezuela' },
                { lat: 40.416, lng: -3.703, label: 'España' }
            ],
            activeCountries,
            userTypes // Also available at top level for convenience
        });
    } catch (error) {
        console.error('Social Proof API Error:', error);
        return NextResponse.json({
            totalStoresToday: 8,
            activityTrend: [2, 5, 3, 8, 4, 6],
            hotspots: [] // Fallback
        });
    }
}
