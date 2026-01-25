-- =====================================================
-- SIMPLE TABLE STRUCTURE EXPORT
-- Copy each query result and send to me
-- =====================================================

-- Query 1: PROFILES TABLE STRUCTURE
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Query 2: CONTRACTORS TABLE STRUCTURE  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'contractors'
ORDER BY ordinal_position;

-- Query 3: REQUESTERS TABLE STRUCTURE
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'requesters'
ORDER BY ordinal_position;

-- Query 4: LEADS TABLE STRUCTURE
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;
