import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const subscriptionId = session.subscription as string;
                const customerId = session.customer as string;

                // Retrieve the subscription details from Stripe
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                // Find user by customer ID or metadata
                // Ideally we use the userId from metadata if available
                const userId = session.metadata?.userId;

                if (userId) {
                    await prisma.subscription.update({
                        where: { userId },
                        data: {
                            stripeSubscriptionId: subscriptionId,
                            stripeCustomerId: customerId,
                            status: subscription.status,
                            planType: "pro",
                            maxStores: 10, // PRO plan limit
                            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                        }
                    });
                }
                break;
            }
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;

                await prisma.subscription.update({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: subscription.status,
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                    }
                });
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                await prisma.subscription.update({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: "canceled",
                        planType: "free",
                        maxStores: 1, // Revert to free limit
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                    }
                });
                break;
            }
        }
    } catch (error) {
        console.error("Error handling webhook:", error);
        return new NextResponse("Webhook handler failed", { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
