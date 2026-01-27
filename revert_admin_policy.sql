-- Revert back to the original policy that uses profiles.id
-- The error showed that profiles.user_id doesn't exist, so profiles.id must be correct

DROP POLICY IF EXISTS "Admins update contractors" ON contractors;

CREATE POLICY "Admins update contractors"
ON contractors
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Now check if you're actually an admin
SELECT id, email, role FROM profiles WHERE id = auth.uid();
