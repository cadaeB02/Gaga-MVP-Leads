import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: 'price_1SrmpUECurkOxJwlXVyEFleL',
                    quantity: 1,
                },
            ],
            discounts: [
                {
                    promotion_code: 'promo_1Srms5ECurkOxJwlXH1kaWvN',
                },
            ],
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
