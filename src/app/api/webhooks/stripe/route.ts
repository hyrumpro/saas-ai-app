import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import appwriteServer from '@/lib/appwrite-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      const { databases } = appwriteServer;
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        'profiles',
        userId,
        {
          subscriptionTier: 'premium',
          subscriptionEndDate: session.expires_at
            ? new Date(session.expires_at * 1000).toISOString()
            : null,
        },
      );
    }
  }

  return NextResponse.json({ received: true });
}
