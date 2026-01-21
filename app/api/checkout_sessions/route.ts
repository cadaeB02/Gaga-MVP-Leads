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

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get the origin for redirect URLs
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: 'price_1SrmpUECurkOxJwlXVyEFleL', // $60/month
                    quantity: 1,
                },
            ],
            discounts: [
                {
                    promotion_code: 'promo_1Srms5ECurkOxJwlXH1kaWvN', // $1 first month
                },
            ],
            success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?payment=canceled`,
            metadata: {
                supabase_user_id: userId,
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
