-- =====================================================
-- NUCLEAR OPTION: Completely remove RLS restrictions
-- =====================================================

-- Check current state
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'requesters';

-- Drop ALL policies
DROP POLICY IF EXISTS "Allow requester signup" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can view own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can update own profile" ON public.requesters;
DROP POLICY IF EXISTS "Requesters can delete own profile" ON public.requesters;

-- Disable RLS entirely (TEMPORARY!)
ALTER TABLE public.requesters DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'requesters';
-- Should show rowsecurity = false

-- Check if there are any triggers or constraints
SELECT tgname, tgtype FROM pg_trigger WHERE tgrelid = 'public.requesters'::regclass;
