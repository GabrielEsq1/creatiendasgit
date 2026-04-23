
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Analyzing User Origins ---');

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // 1. Get recent users
    const users = await prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: 'desc' },
        include: { stores: true }
    });

    console.log(`Total new users in last 30 days: ${users.length}`);

    // 2. Check for ANY events in last 30 days
    const events = await prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        take: 50,
        orderBy: { createdAt: 'desc' }
    });

    console.log(`\n--- Sample Analytics Events (Last 50) ---`);
    events.forEach(e => {
        console.log(`[${e.eventType}] Path: ${e.path} Meta: ${JSON.stringify(e.metadata)}`);
    });

    // 3. Summarize potential sources from all events if possible
    const allRecentEvents = await prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { metadata: true }
    });

    const referrers: Record<string, number> = {};
    allRecentEvents.forEach(e => {
        const meta = e.metadata as any;
        if (meta?.referrer) {
            try {
                const domain = new URL(meta.referrer).hostname;
                referrers[domain] = (referrers[domain] || 0) + 1;
            } catch {
                referrers[meta.referrer] = (referrers[meta.referrer] || 0) + 1;
            }
        }
    });

    console.log('\n--- Referrer Summary ---');
    console.log(referrers);

    // 4. Summarize by Email Domain (Gives hint about origin/country)
    const emailDomains: Record<string, number> = {};
    users.forEach(u => {
        const d = u.email.split('@')[1];
        emailDomains[d] = (emailDomains[d] || 0) + 1;
    });

    console.log('\n--- Email Domains ---');
    console.log(emailDomains);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
