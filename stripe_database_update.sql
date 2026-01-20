-- =====================================================
-- Stripe Subscription Integration - Database Updates
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add subscription columns to contractors table
ALTER TABLE public.contractors
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due')),
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'contractors' 
AND column_name IN ('subscription_status', 'stripe_customer_id', 'stripe_subscription_id');
