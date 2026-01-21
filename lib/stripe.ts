import Stripe from 'stripe';

// Safe initialization - won't crash if env var is missing
let stripe: Stripe | null = null;

try {
    if (process.env.STRIPE_SECRET_KEY) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
} catch (error) {
    console.error('Failed to initialize Stripe:', error);
}

export { stripe };
