import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccount, getTransactions } from '@/lib/wallet-db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const userId = (session.user as any).id;

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
