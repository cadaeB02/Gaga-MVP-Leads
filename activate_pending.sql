-- Manually activate the pending contractor (since they already paid)
UPDATE contractors 
SET license_status = 'ACTIVE', insurance_verified = true 
WHERE email = 'pending@example.com';

-- Verify it worked
SELECT name, email, license_status, insurance_verified 
FROM contractors 
WHERE email = 'pending@example.com';
