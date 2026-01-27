-- Add verification_status column to contractors table
-- This column tracks whether a contractor has been verified by admin

ALTER TABLE contractors 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';

-- Update existing contractors to have a verification_status
-- Set to 'verified' if they have ACTIVE license and verified insurance
UPDATE contractors 
SET verification_status = 'verified'
WHERE license_status = 'ACTIVE' AND insurance_verified = true;

-- Set to 'pending' for contractors who are not yet verified
UPDATE contractors 
SET verification_status = 'pending'
WHERE verification_status = 'unverified' AND license_status IS NOT NULL;

-- Verify the column was added
SELECT id, name, email, license_status, insurance_verified, verification_status
FROM contractors
ORDER BY created_at DESC
LIMIT 10;
