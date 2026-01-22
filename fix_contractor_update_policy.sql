-- Fix RLS policies to allow API routes to update subscription status
-- This allows the payment-success endpoint to activate contractors

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Allow contractor updates" ON public.contractors;

-- Create new update policy that allows service role (API routes) to update
CREATE POLICY "Allow contractor updates" ON public.contractors
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role' OR
        auth.role() = 'authenticated'
    );

-- Verify the policy was created
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'contractors' AND cmd = 'UPDATE';
