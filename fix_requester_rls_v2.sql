-- =====================================================
-- FIX: Requester Signup RLS Policy (v2)
-- =====================================================
-- The INSERT policy needs proper WITH CHECK clause

-- First, let's see what policies exist
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'requesters';

-- Drop ALL existing policies on requesters table
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own profile" ON public.requesters;

-- Create new INSERT policy with proper WITH CHECK
CREATE POLICY "Allow requester signup"
ON public.requesters
FOR INSERT
TO public
WITH CHECK (true);  -- Allow all inserts (we'll validate in app code)

-- Create SELECT policy
CREATE POLICY "Requesters can view own profile"
ON public.requesters
FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Create UPDATE policy
CREATE POLICY "Requesters can update own profile"
ON public.requesters
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verify the new policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'requesters';
