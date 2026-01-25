-- =====================================================
-- CLEAN DATABASE - Remove All Test Data
-- =====================================================
-- Run this in Supabase SQL Editor to start fresh
-- This keeps all table schemas but deletes test data

-- 1. Delete all leads
DELETE FROM leads;

-- 2. Delete all requesters
DELETE FROM requesters;

-- 3. Delete all requester profiles (keep contractor profiles)
DELETE FROM profiles WHERE role = 'requester';

-- 4. Delete auth users for requesters (optional - be careful!)
-- Note: This requires admin access, may need to do manually in Supabase Auth UI

-- 5. Reset auto-increment sequences (optional - starts IDs at 1)
ALTER SEQUENCE leads_id_seq RESTART WITH 1;
ALTER SEQUENCE requesters_id_seq RESTART WITH 1;

-- =====================================================
-- Verify Cleanup
-- =====================================================

-- Check leads (should be empty)
SELECT COUNT(*) as lead_count FROM leads;

-- Check requesters (should be empty)
SELECT COUNT(*) as requester_count FROM requesters;

-- Check requester profiles (should be empty)
SELECT COUNT(*) as requester_profile_count FROM profiles WHERE role = 'requester';

-- Check contractor profiles (should still exist if you have test contractors)
SELECT COUNT(*) as contractor_profile_count FROM profiles WHERE role = 'contractor';

-- =====================================================
-- OPTIONAL: Keep Contractors, Delete Only Requesters
-- =====================================================
-- If you want to keep your test contractors, the above script already does this
-- It only deletes requesters and requester-related data
