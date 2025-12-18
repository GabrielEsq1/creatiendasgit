import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db-pg';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error('Webhook signature invalid', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const amount = session.amount_total; // in cents
        const txId = session.payment_intent as string || session.id;

        if (!userId || !amount) {
            return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
        }

        const client = await db.getClient();
        try {
            await client.query('BEGIN');
            // check idempotency
            const exists = await client.query('SELECT 1 FROM ledger_entries WHERE tx_id=$1', [txId]);

            if (exists.rowCount === 0) {
                const accRes = await client.query('SELECT * FROM accounts WHERE user_id=$1 FOR UPDATE', [userId]);
                let account;

                if (accRes.rowCount === 0) {
                    // create account
                    const createAcc = await client.query('INSERT INTO accounts(user_id, balance) VALUES($1, $2) RETURNING *', [userId, amount]);
                    account = createAcc.rows[0];
                } else {
                    account = accRes.rows[0];
                    const newBalance = Number(account.balance) + Number(amount);
                    await client.query('UPDATE accounts SET balance=$1 WHERE id=$2', [newBalance, account.id]);
                    account.balance = newBalance;
                }

                await client.query('INSERT INTO ledger_entries(account_id, tx_id, type, amount, balance_after, metadata) VALUES($1,$2,$3,$4,$5,$6)', [
                    account.id, txId, 'credit', amount, account.balance, JSON.stringify({ stripe: session })
                ]);
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            console.error('webhook processing failed', e);
            return NextResponse.json({ error: 'internal error' }, { status: 500 });
        } finally {
            client.release();
        }
    }

    return NextResponse.json({ received: true });
}
