import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract userId from metadata
        const userId = session.metadata?.userId;

        if (!userId) {
            console.error('No userId in session metadata');
            return NextResponse.json(
                { error: 'No userId in metadata' },
                { status: 400 }
            );
        }

        // Update contractor in Supabase
        const { error } = await supabase
            .from('contractors')
            .update({
                subscription_status: 'active',
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
            })
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating contractor:', error);
            return NextResponse.json(
                { error: 'Failed to update contractor' },
                { status: 500 }
            );
        }

        console.log(`✅ Subscription activated for user ${userId}`);
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;

        const { error } = await supabase
            .from('contractors')
            .update({
                subscription_status: 'canceled',
            })
            .eq('stripe_subscription_id', subscription.id);

        if (error) {
            console.error('Error updating canceled subscription:', error);
        }
    }

    // Handle failed payments
    if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object as Stripe.Invoice;

        const { error } = await supabase
            .from('contractors')
            .update({
                subscription_status: 'past_due',
            })
            .eq('stripe_customer_id', invoice.customer as string);

        if (error) {
            console.error('Error updating past_due subscription:', error);
        }
    }

    return NextResponse.json({ received: true });
}
