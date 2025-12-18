import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db-pg';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // Use a recent version or match package.json
});

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'missing x-user-id header' }, { status: 401 });

    const userRes = await db.query('SELECT * FROM users WHERE id=$1', [userId]);
    const user = userRes.rows[0];
    if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

    const { amount_cents } = await req.json();
    if (!amount_cents || amount_cents <= 0) return NextResponse.json({ error: 'invalid amount' }, { status: 400 });

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Top-up Monedera' },
          unit_amount: amount_cents
        },
        quantity: 1
      }],
      customer_email: user.email,
      metadata: { user_id: String(user.id) },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/wallet?topup=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/wallet?topup=cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Topup API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
