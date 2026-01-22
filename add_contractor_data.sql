-- =====================================================
-- Add Contractor Data & Sample Leads
-- =====================================================
-- INSTRUCTIONS:
-- 1. Find lines 10 and 11 below
-- 2. Replace 'YOUR-VERIFIED-USER-ID-HERE' with testpro@example.com's User ID
-- 3. Replace 'YOUR-PENDING-USER-ID-HERE' with pending@example.com's User ID
-- 4. Run this entire script
-- =====================================================

DO $$
DECLARE
    verified_user_id UUID := 'YOUR-VERIFIED-USER-ID-HERE';  -- Replace this!
    pending_user_id UUID := 'YOUR-PENDING-USER-ID-HERE';    -- Replace this!
BEGIN
    -- Create profiles
    INSERT INTO public.profiles (id, role, phone, zip_code)
    VALUES 
        (verified_user_id, 'contractor', '(555) 123-4567', '94102'),
        (pending_user_id, 'contractor', '(555) 987-6543', '94110')
    ON CONFLICT (id) DO UPDATE 
    SET role = EXCLUDED.role;

    -- Create verified contractor
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

    -- Create pending contractor
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
    SET license_status = 'PENDING';

    -- Add 5 sample leads
    INSERT INTO public.leads (name, phone, zip_code, trade_type, job_description, status, created_at)
    VALUES
        ('John Smith', '(555) 234-5678', '94102', 'Electrical (C-10)', 'Panel upgrade needed. Currently 100A, need 200A.', 'OPEN', NOW() - INTERVAL '2 hours'),
        ('Sarah Johnson', '(555) 345-6789', '94103', 'Electrical (C-10)', 'EV charger installation. Need 240V circuit.', 'OPEN', NOW() - INTERVAL '5 hours'),
        ('Mike Davis', '(555) 456-7890', '94104', 'Electrical (C-10)', 'Ceiling fan and light fixture installation.', 'OPEN', NOW() - INTERVAL '1 day'),
        ('Emily Chen', '(555) 567-8901', '94105', 'Electrical (C-10)', 'Flickering lights when using microwave.', 'OPEN', NOW() - INTERVAL '2 days'),
        ('Robert Wilson', '(555) 678-9012', '94107', 'Electrical (C-10)', 'Outdoor lighting for patio. 6 fixtures.', 'OPEN', NOW() - INTERVAL '3 days');

    RAISE NOTICE 'Success! Test data created.';
END $$;

-- Verify data was created
SELECT 'Contractors created:' as status;
SELECT name, email, license_status FROM contractors WHERE email IN ('testpro@example.com', 'pending@example.com');

SELECT 'Leads created:' as status;
SELECT COUNT(*) as total_leads FROM leads WHERE trade_type = 'Electrical (C-10)';
