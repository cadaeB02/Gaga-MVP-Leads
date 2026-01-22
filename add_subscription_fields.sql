-- Add subscription_status field to contractors table
ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'INACTIVE' CHECK (subscription_status IN ('INACTIVE', 'ACTIVE', 'CANCELED', 'PAST_DUE'));

-- Add subscription tracking fields
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

-- Update existing contractors to have INACTIVE subscription
UPDATE contractors 
SET subscription_status = 'INACTIVE'
WHERE subscription_status IS NULL;

-- Verify changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'contractors'
AND column_name IN ('subscription_status', 'stripe_customer_id', 'stripe_subscription_id');
