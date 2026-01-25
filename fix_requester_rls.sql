-- =====================================================
-- FIX: Requester Signup RLS Policy
-- =====================================================
-- The current policy blocks requester creation during signup
-- This fixes it by allowing inserts when user_id matches auth.uid()

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;

-- Create new policy that allows signup
CREATE POLICY "Allow requester signup"
ON public.requesters
FOR INSERT
WITH CHECK (
    -- Allow insert if the user_id matches the authenticated user
    auth.uid() = user_id
    OR
    -- OR if user_id is being set to the current auth user
    user_id = auth.uid()
);

-- Also ensure the SELECT policy exists for users to view their own data
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;

CREATE POLICY "Requesters can view own profile"
ON public.requesters
FOR SELECT
USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'requesters';
