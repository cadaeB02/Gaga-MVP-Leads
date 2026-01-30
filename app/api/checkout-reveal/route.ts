import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const { lead_id, contractor_id } = await request.json();

        if (!lead_id || !contractor_id) {
            return NextResponse.json(
                { error: 'Missing lead_id or contractor_id' },
                { status: 400 }
            );
        }

        // Verify the lead exists and is assigned to this contractor
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .select('id, trade_type, job_description, visible_to_user_id, price')
            .eq('id', lead_id)
            .single();

        if (leadError || !lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        if (lead.visible_to_user_id !== contractor_id) {
            return NextResponse.json(
                { error: 'This lead is not assigned to you' },
                { status: 403 }
            );
        }

        // Get contractor email for Stripe
        const { data: { user } } = await supabase.auth.admin.getUserById(contractor_id);
        
        if (!user?.email) {
            return NextResponse.json(
                { error: 'Contractor email not found' },
                { status: 404 }
            );
        }

        // Create Stripe Checkout Session for one-time $40 payment
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Lead Reveal',
                            description: `${lead.trade_type} - ${lead.job_description.substring(0, 50)}...`,
                        },
                        unit_amount: Math.round((lead.price || 40) * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                lead_id: lead_id,
                contractor_id: contractor_id,
                type: 'lead_reveal'
            },
            success_url: `${request.headers.get('origin')}/contractor/dashboard?reveal_success=true`,
            cancel_url: `${request.headers.get('origin')}/contractor/dashboard?reveal_cancelled=true`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Checkout Reveal Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
