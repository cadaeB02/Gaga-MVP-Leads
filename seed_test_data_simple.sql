-- =====================================================
-- SIMPLIFIED Test Contractor Setup
-- This script creates EVERYTHING in one go
-- Run this ONCE in Supabase SQL Editor
-- =====================================================

-- IMPORTANT: This uses Supabase's auth.users table directly
-- You'll need to create the auth users manually first OR
-- use this simpler approach with hardcoded test UUIDs

-- =====================================================
-- Option 1: Use These Hardcoded Test UUIDs
-- =====================================================
-- These are fake UUIDs for testing purposes only
-- You'll create the actual auth users manually after running this

DO $$
DECLARE
    verified_user_id UUID := '11111111-1111-1111-1111-111111111111';
    pending_user_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
    -- Insert profiles for test contractors
    INSERT INTO public.profiles (id, role, phone, zip_code)
    VALUES 
        (verified_user_id, 'contractor', '(555) 123-4567', '94102'),
        (pending_user_id, 'contractor', '(555) 987-6543', '94110')
    ON CONFLICT (id) DO UPDATE 
    SET role = EXCLUDED.role, phone = EXCLUDED.phone, zip_code = EXCLUDED.zip_code;

    -- Insert verified contractor
    INSERT INTO public.contractors (
        user_id, name, email, phone, license_number, 
        trade_type, business_name, license_status, insurance_verified
    )
    VALUES (
        verified_user_id,
        'Bergthold Ventures',
        'testpro@example.com',
        '(555) 123-4567',
        'C-10 #123456',
        'Electrical (C-10)',
        'Bergthold Ventures LLC',
        'ACTIVE',
        true
    )
    ON CONFLICT (user_id) DO UPDATE
    SET license_status = 'ACTIVE', insurance_verified = true;

    -- Insert pending contractor
    INSERT INTO public.contractors (
        user_id, name, email, phone, license_number, 
        trade_type, business_name, license_status, insurance_verified
    )
    VALUES (
        pending_user_id,
        'Pending Pro LLC',
        'pending@example.com',
        '(555) 987-6543',
        'C-36 #654321',
        'Plumbing (C-36)',
        'Pending Pro LLC',
        'PENDING',
        false
    )
    ON CONFLICT (user_id) DO UPDATE
    SET license_status = 'PENDING', insurance_verified = false;

    -- Insert 5 sample leads
    INSERT INTO public.leads (name, phone, zip_code, trade_type, job_description, status, created_at)
    VALUES
        ('John Smith', '(555) 234-5678', '94102', 'Electrical (C-10)', 'Panel upgrade needed for home renovation. Currently have 100A service, need 200A.', 'OPEN', NOW() - INTERVAL '2 hours'),
        ('Sarah Johnson', '(555) 345-6789', '94103', 'Electrical (C-10)', 'Outlet installation in garage for EV charger. Need 240V circuit.', 'OPEN', NOW() - INTERVAL '5 hours'),
        ('Mike Davis', '(555) 456-7890', '94104', 'Electrical (C-10)', 'Ceiling fan and light fixture installation in master bedroom.', 'OPEN', NOW() - INTERVAL '1 day'),
        ('Emily Chen', '(555) 567-8901', '94105', 'Electrical (C-10)', 'Troubleshoot flickering lights in kitchen. Happens when using microwave.', 'OPEN', NOW() - INTERVAL '2 days'),
        ('Robert Wilson', '(555) 678-9012', '94107', 'Electrical (C-10)', 'Install outdoor lighting for backyard patio. 6 fixtures total.', 'OPEN', NOW() - INTERVAL '3 days');

    RAISE NOTICE 'Test data created successfully!';
END $$;

-- =====================================================
-- NOW Create Auth Users Manually
-- =====================================================
-- After running this script, go to Supabase Dashboard:
-- 1. Authentication > Users > Add User
-- 2. Create user: testpro@example.com / TestPassword123!
-- 3. IMPORTANT: Copy the User UID
-- 4. Run this UPDATE to link it:
--    UPDATE profiles SET id = 'PASTE-ACTUAL-UID-HERE' WHERE id = '11111111-1111-1111-1111-111111111111';
--    UPDATE contractors SET user_id = 'PASTE-ACTUAL-UID-HERE' WHERE user_id = '11111111-1111-1111-1111-111111111111';
--
-- 5. Repeat for pending@example.com with the second UUID

-- =====================================================
-- Verification Queries
-- =====================================================
SELECT 'Contractors created:' as status;
SELECT c.name, c.email, c.license_status, c.insurance_verified, p.role
FROM contractors c
JOIN profiles p ON c.user_id = p.id;

SELECT 'Leads created:' as status;
SELECT COUNT(*) as lead_count FROM leads WHERE trade_type = 'Electrical (C-10)';
