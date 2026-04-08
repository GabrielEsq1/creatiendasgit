/**
 * Cloudflare Turnstile Verification Utility
 */

export async function verifyTurnstileToken(token: string) {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
        console.warn('⚠️ TURNSTILE_SECRET_KEY not set. Skipping verification.');
        return true;
    }

    if (!token) {
        console.error('❌ No Turnstile token provided');
        return false;
    }

    try {
        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        
        // Using URLSearchParams for application/x-www-form-urlencoded (standard for Turnstile)
        const params = new URLSearchParams();
        params.append('secret', secretKey);
        params.append('response', token);

        const result = await fetch(url, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const outcome = await result.json();
        
        if (!outcome.success) {
            console.error('❌ Turnstile verification failed:', outcome['error-codes']);
        }

        return outcome.success;
    } catch (error) {
        console.error('❌ Turnstile verification error:', error);
        return false;
    }
}
