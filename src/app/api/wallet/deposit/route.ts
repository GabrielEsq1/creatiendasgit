import { NextResponse } from 'next/server';
import { createTransaction } from '@/lib/wallet-db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, amount, method } = body;

        if (!userId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const transaction = createTransaction(
            userId,
            'credit',
            amount,
            `Recarga vía ${method}`,
            { method }
        );

        return NextResponse.json({ success: true, transaction });
    } catch (error) {
        console.error('Deposit API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
