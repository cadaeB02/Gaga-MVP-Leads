-- Manually set this contractor to verified
UPDATE contractors 
SET verification_status = 'verified'
WHERE email = 'cade.bergthold@gmail.com';

-- Verify it worked
SELECT 
    id, 
    name, 
    email, 
    license_status, 
    insurance_verified, 
    verification_status
FROM contractors 
WHERE email = 'cade.bergthold@gmail.com';
