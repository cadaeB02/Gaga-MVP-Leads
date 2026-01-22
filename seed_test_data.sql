-- =====================================================
-- Seed Test Contractor Data
-- Run this in Supabase SQL Editor AFTER creating test users
-- =====================================================

-- IMPORTANT: You must first create these auth users manually in Supabase Auth:
-- 1. testpro@example.com with password: TestPassword123!
-- 2. pending@example.com with password: TestPassword123!
-- Then get their user IDs and replace the UUIDs below

-- =====================================================
-- Test Contractor #1: VERIFIED (Success Case)
-- =====================================================
-- Email: testpro@example.com
-- Password: TestPassword123!
-- Status: APPROVED - Can see leads

-- Replace 'YOUR-VERIFIED-USER-ID-HERE' with the actual auth.users.id from Supabase
DO $$
DECLARE
    verified_user_id UUID := 'YOUR-VERIFIED-USER-ID-HERE'; -- REPLACE THIS
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, role, phone, zip_code)
    VALUES (verified_user_id, 'contractor', '(555) 123-4567', '94102')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'contractor', phone = '(555) 123-4567', zip_code = '94102';

    -- Insert contractor
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

    -- Insert 5 sample leads
    INSERT INTO public.leads (name, phone, zip_code, trade_type, job_description, status, created_at)
    VALUES
        ('John Smith', '(555) 234-5678', '94102', 'Electrical (C-10)', 'Panel upgrade needed for home renovation. Currently have 100A service, need 200A.', 'OPEN', NOW() - INTERVAL '2 hours'),
        ('Sarah Johnson', '(555) 345-6789', '94103', 'Electrical (C-10)', 'Outlet installation in garage for EV charger. Need 240V circuit.', 'OPEN', NOW() - INTERVAL '5 hours'),
        ('Mike Davis', '(555) 456-7890', '94104', 'Electrical (C-10)', 'Ceiling fan and light fixture installation in master bedroom.', 'OPEN', NOW() - INTERVAL '1 day'),
        ('Emily Chen', '(555) 567-8901', '94105', 'Electrical (C-10)', 'Troubleshoot flickering lights in kitchen. Happens when using microwave.', 'OPEN', NOW() - INTERVAL '2 days'),
        ('Robert Wilson', '(555) 678-9012', '94107', 'Electrical (C-10)', 'Install outdoor lighting for backyard patio. 6 fixtures total.', 'OPEN', NOW() - INTERVAL '3 days');
END $$;

-- =====================================================
-- Test Contractor #2: PENDING (Pending Case)
-- =====================================================
-- Email: pending@example.com
-- Password: TestPassword123!
-- Status: PENDING - Cannot see leads yet

-- Replace 'YOUR-PENDING-USER-ID-HERE' with the actual auth.users.id from Supabase
DO $$
DECLARE
    pending_user_id UUID := 'YOUR-PENDING-USER-ID-HERE'; -- REPLACE THIS
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, role, phone, zip_code)
    VALUES (pending_user_id, 'contractor', '(555) 987-6543', '94110')
    ON CONFLICT (id) DO UPDATE 
    SET role = 'contractor', phone = '(555) 987-6543', zip_code = '94110';

    -- Insert contractor
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

    -- No leads for pending contractor (to show empty state)
END $$;

-- =====================================================
-- Verification Queries
-- =====================================================
-- Check if test contractors were created:
SELECT c.name, c.email, c.license_status, c.insurance_verified, p.role
FROM contractors c
JOIN profiles p ON c.user_id = p.id
WHERE c.email IN ('testpro@example.com', 'pending@example.com');

-- Check leads for verified contractor:
SELECT name, phone, trade_type, job_description, created_at
FROM leads
WHERE trade_type = 'Electrical (C-10)'
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- INSTRUCTIONS:
-- =====================================================
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Create user with email: testpro@example.com, password: TestPassword123!
-- 4. Copy the User UID
-- 5. Replace 'YOUR-VERIFIED-USER-ID-HERE' above with the UID
-- 6. Repeat steps 3-5 for pending@example.com
-- 7. Run this entire script in Supabase SQL Editor
-- 8. Test login with both accounts
-- =====================================================
