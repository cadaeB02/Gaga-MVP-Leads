-- =====================================================
-- TEMPORARY: Disable RLS on Requesters Table
-- =====================================================
-- This will allow signup to work while we debug the RLS issue
-- WARNING: This is temporary for testing only!

-- Disable RLS on requesters table
ALTER TABLE public.requesters DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'requesters';

-- Should show: rowsecurity = false
