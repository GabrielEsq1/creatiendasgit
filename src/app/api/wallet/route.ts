import { NextResponse } from 'next/server';
import { getAccount, getTransactions } from '@/lib/wallet-db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // In a real app, get userId from session. 
        // For now, we accept it from headers for flexibility with our unified login.
        const userId = req.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 401 });
        }

        const account = getAccount(userId);
        const ledger = getTransactions(userId);

        return NextResponse.json({
            user: { id: userId },
            account,
            ledger
        });
    } catch (error) {
        console.error('Wallet API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
