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

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // If user already has a stripe customer ID, use it
        let customerId = user.subscription?.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
            });
            customerId = customer.id;

            // Update subscription with customer ID
            if (user.subscription) {
                await prisma.subscription.update({
                    where: { userId: user.id },
                    data: { stripeCustomerId: customerId }
                });
            } else {
                await prisma.subscription.create({
                    data: {
                        userId: user.id,
                        stripeCustomerId: customerId,
                        planType: "free"
                    }
                });
            }
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID_PRO,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?canceled=true`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.redirect(checkoutSession.url!);
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
