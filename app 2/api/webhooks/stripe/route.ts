import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;

    try {
        // For development, we'll skip signature verification
        // In production, you should verify the webhook signature
        const data = JSON.parse(body);
        event = data;
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.supabase_user_id;

        if (userId) {
            // Update contractor status to ACTIVE
            const { error } = await supabase
                .from('contractors')
                .update({
                    license_status: 'ACTIVE',
                    insurance_verified: true
                })
                .eq('user_id', userId);

            if (error) {
                console.error('Error updating contractor:', error);
            } else {
                console.log('✅ Contractor activated:', userId);
            }
        }
    }

    return NextResponse.json({ received: true });
}
