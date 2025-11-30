import { NextResponse } from 'next/server';
import { getNequiToken } from '@/lib/nequi';

export async function POST(req: Request) {
    try {
        // In a real app, you might want to verify the user session here
        // const session = await getServerSession(authOptions);
        // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const tokenData = await getNequiToken();
        return NextResponse.json(tokenData);
    } catch (error: any) {
        console.error('Nequi Auth Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to authenticate with Nequi' }, { status: 500 });
    }
}
