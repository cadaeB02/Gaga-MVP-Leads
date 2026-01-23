-- =====================================================
-- Fix: Add 'requester' to profiles role constraint
-- Run this BEFORE seed_requester_data.sql
-- =====================================================

-- Drop the old constraint if it exists
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint that includes 'requester'
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('contractor', 'admin', 'requester'));

-- Verify the constraint was updated
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.profiles'::regclass 
AND conname = 'profiles_role_check';

-- =====================================================
-- Now you can run seed_requester_data.sql
-- =====================================================
