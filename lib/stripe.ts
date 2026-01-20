import Stripe from 'stripe';

// Use default Stripe version to avoid TypeScript errors
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
