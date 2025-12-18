import { NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

/**
 * POST /api/paypal/capture-order
 * Body: { orderId: string }
 * Returns: { status: string, details: object }
 */
export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();
        if (!orderId) {
            return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
        }

        const requestBody = new paypal.orders.OrdersCaptureRequest(orderId);
        // @ts-ignore - The type definition might be strict but empty body is valid for simple capture
        requestBody.requestBody({});

        const client = getPayPalClient();
        const response = await client.execute(requestBody);

        // Check for successful capture
        const captureStatus = response.result.status;

        if (captureStatus === 'COMPLETED') {
            return NextResponse.json({
                status: captureStatus,
                details: response.result
            });
        } else {
            return NextResponse.json({
                status: captureStatus,
                details: response.result
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error('PayPal capture order error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('token'); // PayPal sends order ID as 'token'
        const returnPath = searchParams.get('returnPath');

        if (!orderId) {
            return NextResponse.redirect(new URL('/wallet?error=missing_token', request.url));
        }

        const requestBody = new paypal.orders.OrdersCaptureRequest(orderId);
        // @ts-ignore
        requestBody.requestBody({});

        const client = getPayPalClient();
        const response = await client.execute(requestBody);

        // Check for successful capture
        const captureStatus = response.result.status;

        if (captureStatus === 'COMPLETED') {
            // Redirect to the specified return path or default to wallet
            const redirectUrl = returnPath
                ? new URL(`${returnPath}?payment_success=true`, request.url)
                : new URL('/wallet?payment_success=true', request.url);

            return NextResponse.redirect(redirectUrl);
        } else {
            const redirectUrl = returnPath
                ? new URL(`${returnPath}?error=capture_failed`, request.url)
                : new URL('/wallet?error=capture_failed', request.url);
            return NextResponse.redirect(redirectUrl);
        }

    } catch (error: any) {
        console.error('PayPal capture order error:', error);
        const returnPath = new URL(request.url).searchParams.get('returnPath');
        const redirectUrl = returnPath
            ? new URL(`${returnPath}?error=${encodeURIComponent(error.message)}`, request.url)
            : new URL(`/wallet?error=${encodeURIComponent(error.message)}`, request.url);
        return NextResponse.redirect(redirectUrl);
    }
}
