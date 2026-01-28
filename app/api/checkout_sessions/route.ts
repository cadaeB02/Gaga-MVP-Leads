import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        // Check if Stripe is initialized
        if (!stripe) {
            return NextResponse.json(
                { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
                { status: 500 }
            );
        }

        const { userId, type = 'subscription', priceAmount = 4000 } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get the origin for redirect URLs
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Create line items based on type
        const line_items = type === 'payment' ? [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Gaga Leads - 1 Exclusive Lead Credit',
                        description: 'Unlock 1 assigned lead with full contact details.',
                    },
                    unit_amount: priceAmount,
                },
                quantity: 1,
            }
        ] : [
            {
                price: 'price_1SrmpUECurkOxJwlXVyEFleL', // $60/month Maintenance Retainer
                quantity: 1,
            },
        ];

        const session = await stripe.checkout.sessions.create({
            mode: type === 'payment' ? 'payment' : 'subscription',
            line_items,
            success_url: `${origin}/api/payment-success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}&type=${type}`,
            cancel_url: `${origin}/dashboard?payment=canceled`,
            metadata: {
                supabase_user_id: userId,
                purchase_type: type,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
