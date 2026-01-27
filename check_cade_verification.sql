-- Check the actual verification_status for Cade Bergthold
SELECT 
    id, 
    name, 
    email, 
    license_status, 
    insurance_verified,
    verification_status
FROM contractors 
WHERE email = 'cade.bergthold@gmail.com';

-- This will show us if the verify button actually updated the database
