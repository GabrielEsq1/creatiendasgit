import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch active campaigns with ALL their active creatives
        const campaigns = await prisma.adCampaign.findMany({
            where: {
                status: "ACTIVE",
                creatives: {
                    some: {
                        isActive: true,
                        approvalStatus: "APPROVED", // Only show approved ads
                    },
                },
            },
            include: {
                creatives: {
                    where: {
                        isActive: true,
                        approvalStatus: "APPROVED", // Only show approved ads
                    },
                    orderBy: {
                        displayOrder: 'asc',
                    },
                },
                company: {
                    select: {
                        name: true,
                    },
                },
            },
            take: 5, // Limit to 5 campaigns
            orderBy: {
                createdAt: "desc",
            },
        });

        // Transform data for the frontend with rotation logic
        const ads = campaigns.map((campaign) => {
            const creatives = campaign.creatives;
            if (creatives.length === 0) return null;

            // Rotation Logic:
            // Rotate every hour (or configurable interval)
            // For testing/demo purposes, we can rotate every minute or use a fixed rotation based on hour
            const rotationHours = 1;
            const currentHour = new Date().getHours();

            // Simple rotation: (currentHour / rotationHours) % totalCreatives
            // This ensures the same creative is shown for the duration of 'rotationHours'
            const creativeIndex = Math.floor(currentHour / rotationHours) % creatives.length;
            const activeCreative = creatives[creativeIndex] || creatives[0];

            return {
                id: campaign.id,
                title: activeCreative.title || campaign.name,
                image: activeCreative.imageUrl || "/placeholder.png",
                description: activeCreative.description || "Oferta especial",
                link: activeCreative.destinationUrl || "#",
                cta: "Ver Más",
                companyName: campaign.company.name,
            };
        }).filter(Boolean); // Remove nulls if any campaign had no creatives

        return NextResponse.json({ ads });
    } catch (error) {
        console.error("Error fetching marketplace ads:", error);
        return NextResponse.json(
            { error: "Error fetching ads" },
            { status: 500 }
        );
    }
}
