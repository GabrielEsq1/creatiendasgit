/**
 * Cloudflare Turnstile Verification Utility
 */

export async function verifyTurnstileToken(token: string) {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
        console.warn('⚠️ TURNSTILE_SECRET_KEY not set. Skipping verification (NOT RECOMMENDED FOR PRODUCTION)');
        return true;
    }

    if (!token) {
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('secret', secretKey);
        formData.append('response', token);

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        return outcome.success;
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return false;
    }
}
