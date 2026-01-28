-- Add visible_to_user_id to leads table for manual assignment
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS visible_to_user_id UUID REFERENCES auth.users(id);

-- Update status constraint to include 'ASSIGNED'
-- First drop the existing constraint if possible, or just add the new status
-- Note: In Supabase/Postgres, we might need to recreate the constraint or use a check
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check CHECK (status IN ('OPEN', 'MATCHED', 'CLOSED', 'ASSIGNED'));

-- Create index for faster lookups by visible_to_user_id
CREATE INDEX IF NOT EXISTS idx_leads_visible_to_user_id ON public.leads(visible_to_user_id);

-- Update RLS Policy to allow assigned contractors to see their leads
DROP POLICY IF EXISTS "Contractors view assigned leads" ON public.leads;
CREATE POLICY "Contractors view assigned leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  visible_to_user_id = auth.uid() -- Assigned specifically to them
  OR 
  (
    visible_to_user_id IS NULL -- In the open pool
    AND
    trade_type IN (
      SELECT trade_type FROM public.contractors 
      WHERE user_id = auth.uid() 
      AND insurance_verified = true 
      AND license_status = 'ACTIVE'
    )
  )
);
