import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [
            totalUsers,
            totalCompanies,
            totalCampaigns,
            totalConversations,
            totalMessages,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.company.count(),
            prisma.adCampaign.count(),
            prisma.conversation.count(),
            prisma.message.count(),
        ]);

        const stats = {
            totalUsers,
            totalCompanies,
            totalCampaigns,
            totalConversations,
            totalMessages,
            totalRevenue: 0, // TODO: Implement when subscriptions are active
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
