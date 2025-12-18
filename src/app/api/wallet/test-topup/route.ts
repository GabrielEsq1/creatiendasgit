import { NextResponse } from 'next/server';
import { db } from '@/lib/db-pg';

export async function POST(req: Request) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) return NextResponse.json({ error: 'missing x-user-id header' }, { status: 401 });

        const { amount_cents } = await req.json();
        if (!amount_cents || amount_cents <= 0) return NextResponse.json({ error: 'invalid amount' }, { status: 400 });

        const txId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const accRes = await client.query('SELECT * FROM accounts WHERE user_id=$1 FOR UPDATE', [userId]);
            let account;

            if (accRes.rowCount === 0) {
                // create account
                const createAcc = await client.query('INSERT INTO accounts(user_id, balance) VALUES($1, $2) RETURNING *', [userId, amount_cents]);
                account = createAcc.rows[0];
            } else {
                account = accRes.rows[0];
                const newBalance = Number(account.balance) + Number(amount_cents);
                await client.query('UPDATE accounts SET balance=$1 WHERE id=$2', [newBalance, account.id]);
                account.balance = newBalance;
            }

            await client.query('INSERT INTO ledger_entries(account_id, tx_id, type, amount, balance_after, metadata) VALUES($1,$2,$3,$4,$5,$6)', [
                account.id, txId, 'test_credit', amount_cents, account.balance, JSON.stringify({ source: 'test_mode' })
            ]);

            await client.query('COMMIT');
            return NextResponse.json({ success: true, new_balance: account.balance });
        } catch (e) {
            await client.query('ROLLBACK');
            console.error('test topup failed', e);
            return NextResponse.json({ error: 'internal error' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Test Topup API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
