-- =====================================================
-- GC Ventures - Lead Tiering and Filtering Update
-- Run these scripts in Supabase SQL Editor
-- =====================================================

-- 1. ADD COLUMNS TO LEADS TABLE
-- =====================================================
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'standard' CHECK (tier IN ('premium', 'standard')),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS visible_to_user_id UUID REFERENCES auth.users(id);

-- 2. UPDATE PROFILES TABLE - FIX CREDIT BUG
-- =====================================================
-- Change default to 0 so new accounts don't start with 1
ALTER TABLE public.profiles 
ALTER COLUMN lead_credits SET DEFAULT 0;

-- Optional: Fix existing accounts if needed (be careful here)
-- UPDATE public.profiles SET lead_credits = 0 WHERE lead_credits = 1 AND role = 'contractor';

-- 3. CREATE INDEX FOR FASTER FILTERING
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_leads_visible_to_user_id ON public.leads(visible_to_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_tier_status ON public.leads(tier, status);

-- 4. UPDATE RLS POLICIES FOR LEAD TIERING
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Contractors view assigned leads" ON public.leads;
DROP POLICY IF EXISTS "Contractors viewable leads" ON public.leads;
DROP POLICY IF EXISTS "Contractors can claim assigned leads" ON public.leads;

-- NEW POLICY: Lead Visibility
-- 1. Admins see everything
-- 2. Contractors see leads specifically assigned to them (visible_to_user_id = auth.uid())
-- 3. Contractors see Standard leads in the pool ONLY if they are verified AND have an active subscription
CREATE POLICY "Leads access policy" ON public.leads
    FOR SELECT USING (
        (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
        OR (visible_to_user_id = auth.uid())
        OR (tier = 'standard' AND EXISTS (
            SELECT 1 FROM public.contractors 
            WHERE user_id = auth.uid() 
            AND verification_status = 'verified'
            AND subscription_status = 'active'
        ))
    );

-- Policy to allow update of leads assigned to them (for revealing/claiming)
CREATE POLICY "Contractors can update assigned leads"
ON public.leads
FOR UPDATE
USING (
    visible_to_user_id = auth.uid() 
    OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- 4. ATOMIC CREDIT INCREMENT FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION increment_credits(target_user_id UUID, amount INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET lead_credits = lead_credits + amount
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. VERIFICATION QUERIES
-- =====================================================
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('tier', 'is_verified', 'visible_to_user_id');
