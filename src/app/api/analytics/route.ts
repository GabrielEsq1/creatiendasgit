import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventType, eventName, path, metadata } = body;

        // Get user session if available
        const session = await getServerSession(authOptions);
        const userId = (session?.user as any)?.id || null;

        // Get IP and User Agent (basic anonymization)
        const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        // Create event
        await prisma.analyticsEvent.create({
            data: {
                eventType,
                eventName,
                userId,
                path,
                metadata: metadata || {},
                ipAddress: ip.split(',')[0], // Take first IP if multiple
                userAgent,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        // Don't fail the request if analytics fails
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
