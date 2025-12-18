import { NextResponse } from 'next/server';
import { createTransaction, getWalletDB } from '@/lib/wallet-db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, recipientEmail, amount, note } = body;

        if (!userId || !recipientEmail || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // In a real app, we would look up the recipient's ID by email.
        // For this mock, we'll just generate a recipient ID or use a mock one.
        // Let's assume recipientEmail IS the recipientId for simplicity if it's not found in a user DB.
        const recipientId = recipientEmail; // Simplified for demo

        try {
            // 1. Debit sender
            createTransaction(
                userId,
                'debit',
                amount,
                `Transferencia a ${recipientEmail}`,
                { recipient: recipientEmail, note }
            );

            // 2. Credit recipient
            createTransaction(
                recipientId,
                'credit',
                amount,
                `Transferencia de ${userId}`, // Ideally use sender's name/email
                { sender: userId, note }
            );

            return NextResponse.json({ success: true });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

    } catch (error) {
        console.error('Transfer API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
