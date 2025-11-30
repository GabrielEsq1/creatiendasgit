import paypal from '@paypal/checkout-server-sdk';

/**
 * Returns a configured PayPalHttpClient instance.
 * Reads credentials from environment variables:
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV ("sandbox" or "live").
 */
export function getPayPalClient() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const env = process.env.PAYPAL_ENV ?? 'sandbox';

    if (!clientId || !clientSecret) {
        throw new Error('PayPal client ID and secret must be set in environment variables');
    }

    const environment =
        env === 'live'
            ? new paypal.core.LiveEnvironment(clientId, clientSecret)
            : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    return new paypal.core.PayPalHttpClient(environment);
}
