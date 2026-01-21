# How to Enable Apple Pay in Stripe

## Step 1: Go to Stripe Dashboard
1. Log in to https://dashboard.stripe.com
2. Click **Settings** (gear icon) in the left sidebar
3. Click **Payment methods**

## Step 2: Enable Apple Pay
1. Scroll down to **Wallets** section
2. Find **Apple Pay**
3. Toggle it **ON**
4. Click **Save**

## Step 3: Verify Domain (for production)
For Apple Pay to work on your live site, you need to verify your domain:

1. In Stripe Dashboard → Settings → Payment methods
2. Under Apple Pay, click **Add domain**
3. Enter your domain: `gaga-mvp-leads.vercel.app`
4. Download the verification file
5. Upload it to your site (Stripe will provide instructions)

**Note:** Apple Pay will automatically appear in Stripe Checkout once enabled. No code changes needed!

## Requirements for Apple Pay to Show:
- ✅ Enabled in Stripe Dashboard
- ✅ User is on Safari browser (or iOS device)
- ✅ User has Apple Pay set up on their device
- ✅ Domain is verified (for production)

## Test Mode
In test mode, Apple Pay will show if:
- You're using Safari on Mac with Apple Pay enabled
- OR using iOS device with Apple Pay set up

If you don't see it, it's likely because you're using Chrome or don't have Apple Pay configured on your device.
