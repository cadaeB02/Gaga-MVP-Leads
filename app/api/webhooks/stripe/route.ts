import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Use service role for admin operations (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event;

    try {
        if (!stripe) throw new Error('Stripe not initialized');
        if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET not set');

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as any;
            const userId = session.metadata?.supabase_user_id;

            if (userId) {
                console.log(`✅ Payment completed for user ${userId}. Activating subscription.`);
                
                const { error: subError } = await supabaseAdmin
                    .from('contractors')
                    .update({
                        subscription_status: 'active',
                        subscription_start_date: new Date().toISOString(),
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: session.subscription as string
                    })
                    .eq('user_id', userId);

                if (subError) console.error('❌ Error activating subscription from webhook:', subError);
                
                // Also award the 1 credit "Hook"
                const { error: creditError } = await supabaseAdmin
                    .rpc('increment_credits', { target_user_id: userId, amount: 1 });
                    
                if (creditError) console.error('❌ Error awarding hook credit from webhook:', creditError);
            }
            break;

        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object as any;
            console.log(`❌ Subscription deleted: ${deletedSubscription.id}`);
            
            await supabaseAdmin
                .from('contractors')
                .update({ subscription_status: 'canceled' })
                .eq('stripe_subscription_id', deletedSubscription.id);
            break;

        case 'invoice.payment_failed':
            const failedInvoice = event.data.object as any;
            console.log(`⚠️ Payment failed for invoice: ${failedInvoice.id}`);
            
            await supabaseAdmin
                .from('contractors')
                .update({ subscription_status: 'past_due' })
                .eq('stripe_customer_id', failedInvoice.customer as string);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
