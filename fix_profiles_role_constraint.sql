-- =====================================================
-- Fix: Add 'requester' to profiles role constraint
-- Run this BEFORE seed_requester_data.sql
-- =====================================================

-- Drop the old constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint that includes 'requester'
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (
    role = 'contractor' OR 
    role = 'admin' OR 
    role = 'requester'
);

-- =====================================================
-- Now you can run seed_requester_data.sql
-- =====================================================
