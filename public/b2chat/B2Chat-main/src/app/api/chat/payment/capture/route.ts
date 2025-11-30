import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPayPalClient } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';
import { db } from '@/lib/db';

/**
 * GET /api/chat/payment/capture
 * Captures PayPal payment and creates payment message in chat
 */
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
        }

        const { searchParams } = new URL(request.url);
        const paymentId = searchParams.get('token'); // PayPal sends order ID as 'token'
        const conversationId = searchParams.get('conversationId');

        if (!paymentId || !conversationId) {
            return NextResponse.redirect(new URL('/chat?error=missing_params', request.url));
        }

        // Capture the PayPal order
        const requestBody = new paypal.orders.OrdersCaptureRequest(paymentId);
        // @ts-ignore
        requestBody.requestBody({});

        const client = getPayPalClient();
        const response = await client.execute(requestBody);

        const captureStatus = response.result.status;

        if (captureStatus !== 'COMPLETED') {
            return NextResponse.redirect(
                new URL(`/chat?error=payment_failed&conversationId=${conversationId}`, request.url)
            );
        }

        // Extract metadata from the order
        const customId = response.result.purchase_units?.[0]?.custom_id;
        if (!customId) {
            console.error('No custom_id found in PayPal response');
            return NextResponse.redirect(
                new URL(`/chat?error=metadata_missing&conversationId=${conversationId}`, request.url)
            );
        }

        const metadata = JSON.parse(customId);
        const { senderId, recipientId, note } = metadata;
        const amount = response.result.purchase_units?.[0]?.amount?.value;
        const currency = response.result.purchase_units?.[0]?.amount?.currency_code;

        // Verify the sender matches the session
        if (senderId !== session.user.id) {
            return NextResponse.redirect(
                new URL(`/chat?error=sender_mismatch&conversationId=${conversationId}`, request.url)
            );
        }

        // Create payment message in database
        await db.message.create({
            data: {
                conversationId,
                senderId,
                text: `Payment of $${amount} ${currency}${note ? ` - ${note}` : ''}`,
                type: 'payment',
                paymentData: {
                    paymentId,
                    amount: parseFloat(amount),
                    currency,
                    status: 'completed',
                    recipientId,
                    senderId,
                    note: note || '',
                    capturedAt: new Date().toISOString(),
                },
            },
        });

        // TODO: Emit socket event for real-time update
        // socket.to(conversationId).emit('payment:message', { ... });

        return NextResponse.redirect(
            new URL(`/chat?payment_success=true&conversationId=${conversationId}`, request.url)
        );
    } catch (error: any) {
        console.error('PayPal capture payment error:', error);
        const conversationId = new URL(request.url).searchParams.get('conversationId');
        const redirectUrl = conversationId
            ? `/chat?error=${encodeURIComponent(error.message)}&conversationId=${conversationId}`
            : `/chat?error=${encodeURIComponent(error.message)}`;
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
}
