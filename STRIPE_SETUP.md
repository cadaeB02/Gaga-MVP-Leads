# Stripe Integration Setup Instructions

## 1. Run Database Migration

Run this SQL in Supabase SQL Editor:

```sql
ALTER TABLE public.contractors
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due')),
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
```

## 2. Add Stripe Environment Variables

Add these to your `.env.local` file:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 3. Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## 4. Test Locally with Stripe CLI (Optional)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret and add to .env.local
```

## 5. Test the Flow

1. Sign up as a contractor at `/contractor/join`
2. Admin verifies license (status → ACTIVE)
3. Contractor logs in (will need to implement auth)
4. Dashboard shows "Subscribe to Unlock Leads" button
5. Click button → Redirects to Stripe Checkout
6. Use test card: `4242 4242 4242 4242`
7. Complete payment
8. Webhook fires → Updates `subscription_status = 'active'`
9. Contractor redirected to dashboard
10. Leads now visible!

## Stripe Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date and any CVC.

## Important Notes

- The first month is $1 (promo code applied automatically)
- After first month, auto-renews at $60/month
- Contractors must have `license_status = 'ACTIVE'` to subscribe
- Leads are blurred until subscription is active
- Webhook signature verification prevents fake payment events
