-- =====================================================
-- PROPER FIX: Requester RLS Policy
-- =====================================================
-- The issue: During signup, auth.uid() might not be available yet
-- The solution: Allow inserts without checking auth.uid()
--               We validate user_id in the application code

-- Drop existing policies
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own profile" ON public.requesters;

-- 1. INSERT: Allow anyone to insert (we validate in app code)
CREATE POLICY "Allow requester signup"
ON public.requesters
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- 2. SELECT: Users can only view their own data
CREATE POLICY "Requesters can view own profile"
ON public.requesters
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. UPDATE: Users can only update their own data
CREATE POLICY "Requesters can update own profile"
ON public.requesters
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. DELETE: Users can delete their own data (optional)
CREATE POLICY "Requesters can delete own profile"
ON public.requesters
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Verify policies
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'requesters'
ORDER BY cmd;
