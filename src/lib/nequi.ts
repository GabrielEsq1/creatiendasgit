
export interface NequiTokenResponse {
    access_token: string;
    expires_in: string;
    token_type: string;
}

export async function getNequiToken(): Promise<NequiTokenResponse> {
    const clientId = process.env.NEQUI_CLIENT_ID;
    const clientSecret = process.env.NEQUI_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing NEQUI_CLIENT_ID or NEQUI_CLIENT_SECRET environment variables');
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://oauth.sandbox.nequi.com/oauth2/token?grant_type=client_credentials', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get Nequi token: ${response.status} - ${errorText}`);
    }

    const data: NequiTokenResponse = await response.json();

    // Log token info (without exposing the full token in production)
    console.log('Nequi token obtained successfully:', {
        token_type: data.token_type,
        expires_in: data.expires_in,
        token_preview: data.access_token.substring(0, 20) + '...'
    });

    return data;
}
