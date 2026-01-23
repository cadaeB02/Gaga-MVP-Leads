-- =====================================================
-- Seed Test Requester Data
-- Run this AFTER creating the requesters table
-- =====================================================

-- STEP 1: Auth user already created in Supabase Dashboard
-- Email: testrequester@test.com
-- Password: TestPassword123!
-- User ID: c542ca8f-cacd-4ecb-89fd-8c5d0dd28c26

-- STEP 2: Insert requester profile and link leads
DO $$
DECLARE
    test_user_id UUID := 'c542ca8f-cacd-4ecb-89fd-8c5d0dd28c26'; -- ✅ ACTUAL USER ID
    test_requester_id INTEGER;
BEGIN
    -- Insert requester profile
    INSERT INTO public.requesters (user_id, name, email, phone)
    VALUES (
        test_user_id,
        'Test Requester',
        'testrequester@test.com',
        '(555) 999-8888'
    )
    ON CONFLICT (user_id) DO UPDATE
    SET name = 'Test Requester', phone = '(555) 999-8888'
    RETURNING id INTO test_requester_id;

    -- Link some existing leads to this requester for testing
    -- This updates the first 2 leads in the database
    UPDATE public.leads
    SET requester_id = test_requester_id
    WHERE id IN (
        SELECT id FROM public.leads
        ORDER BY created_at DESC
        LIMIT 2
    );

    -- Insert profile entry
    INSERT INTO public.profiles (id, role, phone, zip_code)
    VALUES (test_user_id, 'requester', '(555) 999-8888', '94102')
    ON CONFLICT (id) DO UPDATE
    SET role = 'requester';

    RAISE NOTICE 'Test requester created with ID: %', test_requester_id;
END $$;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if test requester was created:
SELECT r.name, r.email, r.phone, r.is_verified, p.role
FROM requesters r
JOIN profiles p ON r.user_id = p.id
WHERE r.email = 'testrequester@test.com';

-- Check work orders linked to test requester:
SELECT l.name, l.phone, l.trade_type, l.job_description, l.created_at
FROM leads l
JOIN requesters r ON l.requester_id = r.id
WHERE r.email = 'testrequester@test.com'
ORDER BY l.created_at DESC;

-- =====================================================
-- INSTRUCTIONS:
-- =====================================================
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Create user with email: testrequester@test.com, password: TestPassword123!
-- 4. Copy the User UID
-- 5. Replace 'YOUR-TEST-REQUESTER-USER-ID-HERE' above with the UID
-- 6. Run this script in Supabase SQL Editor
-- 7. Test login at /requester/login
-- =====================================================
