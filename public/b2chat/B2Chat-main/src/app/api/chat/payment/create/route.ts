import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPayPalClient } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

/**
 * POST /api/chat/payment/create
 * Body: { recipientId: string, amount: string, conversationId: string, note?: string }
 * Returns: { approvalUrl: string, paymentId: string }
 */
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { recipientId, amount, conversationId, note } = await request.json();

        // Validation
        if (!recipientId || !amount || !conversationId) {
            return NextResponse.json(
                { error: 'recipientId, amount, and conversationId are required' },
                { status: 400 }
            );
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Create PayPal order
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        const metadata = JSON.stringify({
            type: 'chat_payment',
            conversationId,
            senderId: session.user.id,
            recipientId,
            note: note || '',
        });

        const requestBody = new paypal.orders.OrdersCreateRequest();
        requestBody.prefer('return=representation');
        requestBody.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: amountNum.toFixed(2),
                    },
                    description: note || `Payment from ${session.user.name || 'User'}`,
                    custom_id: metadata, // Store metadata here
                },
            ],
            application_context: {
                brand_name: 'B2B Chat',
                landing_page: 'LOGIN',
                user_action: 'PAY_NOW',
                return_url: `${baseUrl}/api/chat/payment/capture?conversationId=${conversationId}`,
                cancel_url: `${baseUrl}/chat?cancelled=true`,
            },
        });

        const client = getPayPalClient();
        const response = await client.execute(requestBody);
        const approvalUrl = response.result.links?.find((l: any) => l.rel === 'approve')?.href;
        const paymentId = response.result.id;

        return NextResponse.json({ approvalUrl, paymentId });
    } catch (error: any) {
        console.error('PayPal create payment error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
