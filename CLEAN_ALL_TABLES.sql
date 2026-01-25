-- =====================================================
-- CLEAN ALL TABLES - Fresh Start for v2.6
-- =====================================================
-- Run this in Supabase SQL Editor
-- This deletes ALL data but keeps table structures

-- Step 1: Delete leads first (has foreign keys)
DELETE FROM leads;

-- Step 2: Delete requesters
DELETE FROM requesters;

-- Step 3: Delete contractors
DELETE FROM contractors;

-- Step 4: Delete profiles
DELETE FROM profiles;

-- Step 5: Reset auto-increment sequences (start IDs at 1)
ALTER SEQUENCE leads_id_seq RESTART WITH 1;
ALTER SEQUENCE requesters_id_seq RESTART WITH 1;
ALTER SEQUENCE contractors_id_seq RESTART WITH 1;

-- =====================================================
-- Verify Cleanup (should all return 0)
-- =====================================================

SELECT COUNT(*) as leads_count FROM leads;
SELECT COUNT(*) as requesters_count FROM requesters;
SELECT COUNT(*) as contractors_count FROM contractors;
SELECT COUNT(*) as profiles_count FROM profiles;

-- ✅ All counts should be 0
