import { NextResponse } from 'next/server';
import { db } from '@/lib/db-pg';

// Simple dev auth: expects `x-user-id` header. Replace with NextAuth in production.
async function getUserFromHeader(req: Request) {
    const id = req.headers.get('x-user-id');
    if (!id) return null;
    const res = await db.query('SELECT * FROM users WHERE id=$1', [id]);
    return res.rows[0] || null;
}

export async function GET(req: Request) {
    try {
        const user = await getUserFromHeader(req);
        if (!user) return NextResponse.json({ error: 'missing x-user-id header (dev auth)' }, { status: 401 });

        const accRes = await db.query('SELECT * FROM accounts WHERE user_id=$1', [user.id]);
        const account = accRes.rows[0];

        let ledger: any[] = [];
        if (account) {
            const ledgerRes = await db.query('SELECT * FROM ledger_entries WHERE account_id=$1 ORDER BY created_at DESC LIMIT 20', [account.id]);
            ledger = ledgerRes.rows;
        }

        return NextResponse.json({ user, account, ledger });
    } catch (error) {
        console.error('Wallet API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
