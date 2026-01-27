-- Check the actual verification_status value in the database
SELECT 
    id, 
    name, 
    email, 
    license_status, 
    insurance_verified, 
    verification_status
FROM contractors 
WHERE email = 'cade.bergthold@gmail.com';

-- This will show you the ACTUAL value in the database
-- If verification_status is NULL or 'unverified' or 'pending', that's the problem
