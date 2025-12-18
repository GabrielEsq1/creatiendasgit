import { NextResponse } from 'next/server';
import { getPayPalClient } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

/**
 * POST /api/paypal/create-order
 * Body: { amount: string, currency: string, returnPath?: string }
 * Returns: { approvalUrl: string, orderId: string }
 */
export async function POST(request: Request) {
    try {
        const { amount, currency, returnPath } = await request.json();
        if (!amount || !currency) {
            return NextResponse.json({ error: 'amount and currency are required' }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        // Append returnPath to the capture URL if provided
        // PayPal will redirect to this URL with token and PayerID appended
        // We encode returnPath to ensure it survives the round trip
        const returnUrl = returnPath
            ? `${baseUrl}/api/paypal/capture-order?returnPath=${encodeURIComponent(returnPath)}`
            : `${baseUrl}/api/paypal/capture-order`;

        const requestBody = new paypal.orders.OrdersCreateRequest();
        requestBody.prefer('return=representation');
        requestBody.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                },
            ],
            application_context: {
                brand_name: 'Creatiendas',
                landing_page: 'LOGIN',
                user_action: 'PAY_NOW',
                return_url: returnUrl,
                cancel_url: `${baseUrl}/paypal-cancel`,
            },
        });

        const client = getPayPalClient();
        const response = await client.execute(requestBody);
        const approvalUrl = response.result.links?.find((l: any) => l.rel === 'approve')?.href;
        const orderId = response.result.id;

        return NextResponse.json({ approvalUrl, orderId });
    } catch (error: any) {
        console.error('PayPal create order error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
