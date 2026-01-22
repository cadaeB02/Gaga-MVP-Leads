-- Fix infinite recursion in RLS policies
-- This happens when policies reference each other in a loop

-- Drop all existing policies on contractors table
DROP POLICY IF EXISTS "Contractors can view own record" ON public.contractors;
DROP POLICY IF EXISTS "Allow contractor signup" ON public.contractors;
DROP POLICY IF EXISTS "Admins can view all contractors" ON public.contractors;
DROP POLICY IF EXISTS "Admins can update contractors" ON public.contractors;
DROP POLICY IF EXISTS "Allow contractor updates" ON public.contractors;

-- Create simple, non-recursive policies
-- Allow contractors to view their own record
CREATE POLICY "Contractors can view own record" ON public.contractors
    FOR SELECT USING (auth.uid() = user_id);

-- Allow contractors to insert their own record
CREATE POLICY "Allow contractor signup" ON public.contractors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow contractors to update their own record
CREATE POLICY "Contractors can update own record" ON public.contractors
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow service role (API routes) to do everything
-- This is what allows payment-success to work
CREATE POLICY "Service role full access" ON public.contractors
    FOR ALL USING (auth.role() = 'service_role');

-- Verify policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'contractors';
