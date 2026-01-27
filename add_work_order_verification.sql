-- Add verification_status to work_orders table
ALTER TABLE work_orders 
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified';

-- Set existing leads to verified (grandfather them in)
UPDATE work_orders 
SET verification_status = 'verified'
WHERE verification_status IS NULL OR verification_status = '';

-- Verify the column was added
SELECT 
    id, 
    description, 
    status,
    verification_status,
    created_at
FROM work_orders 
ORDER BY created_at DESC
LIMIT 5;
