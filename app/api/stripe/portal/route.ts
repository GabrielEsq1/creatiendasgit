import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { subscription: true },
        });

        if (!user || !user.subscription?.stripeCustomerId) {
            return new NextResponse("No subscription found", { status: 404 });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.subscription.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error("Stripe Portal Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
