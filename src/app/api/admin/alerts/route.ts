import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only admins can view alerts/stats
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            );
        }

        // Get real-time stats
        const [
            totalUsers,
            totalStores,
            recentUsers,
            recentStores,
            recentEvents,
            todayUsers,
            todayStores,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.store.count(),
            prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    plan: true,
                    createdAt: true,
                },
            }),
            prisma.store.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    views: true,
                    createdAt: true,
                    owner: {
                        select: { email: true },
                    },
                },
            }),
            prisma.analyticsEvent.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    eventType: true,
                    path: true,
                    createdAt: true,
                },
            }).catch(() => []),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
            prisma.store.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
            }),
        ]);

        // Calculate growth
        const yesterdayStart = new Date();
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date();
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999);

        const yesterdayUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: yesterdayStart,
                    lte: yesterdayEnd,
                },
            },
        });

        const growth = yesterdayUsers > 0
            ? ((todayUsers - yesterdayUsers) / yesterdayUsers * 100).toFixed(1)
            : todayUsers > 0 ? '100' : '0';

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            stats: {
                totalUsers,
                totalStores,
                todayUsers,
                todayStores,
                growthPercent: growth,
            },
            recentUsers,
            recentStores,
            recentEvents,
            alerts: generateAlerts(totalUsers, totalStores, todayUsers),
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Error interno' },
            { status: 500 }
        );
    }
}

function generateAlerts(totalUsers: number, totalStores: number, todayUsers: number): any[] {
    const alerts = [];

    // Milestone alerts
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    for (const milestone of milestones) {
        if (totalUsers >= milestone && totalUsers < milestone + 5) {
            alerts.push({
                type: 'milestone',
                priority: 'high',
                title: `🏆 ¡${milestone} Usuarios Alcanzados!`,
                message: `Creatiendas ha superado los ${milestone} usuarios registrados.`,
            });
        }
    }

    // High traffic alert
    if (todayUsers > 50) {
        alerts.push({
            type: 'high_traffic',
            priority: 'medium',
            title: '📈 Alto Tráfico Hoy',
            message: `${todayUsers} nuevos usuarios hoy. ¡Excelente!`,
        });
    }

    // Low activity warning
    if (todayUsers === 0 && new Date().getHours() > 12) {
        alerts.push({
            type: 'warning',
            priority: 'low',
            title: '⚠️ Sin Registros Hoy',
            message: 'No se han registrado usuarios hoy. Revisa las campañas.',
        });
    }

    return alerts;
}
