-- =====================================================
-- VIEW ALL TABLE SCHEMAS
-- =====================================================
-- Run this in Supabase SQL Editor to see all table definitions

-- 1. PROFILES TABLE
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. CONTRACTORS TABLE
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'contractors'
ORDER BY ordinal_position;

-- 3. REQUESTERS TABLE
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'requesters'
ORDER BY ordinal_position;

-- 4. LEADS TABLE
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- =====================================================
-- ALTERNATIVE: Get Full Table Definitions
-- =====================================================

-- Get CREATE TABLE statements for all tables
SELECT 
    'CREATE TABLE ' || table_name || ' (' || 
    string_agg(
        column_name || ' ' || 
        data_type || 
        CASE WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')' 
            ELSE '' 
        END ||
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
        ', '
    ) || ');' as table_definition
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'contractors', 'requesters', 'leads')
GROUP BY table_name
ORDER BY table_name;

-- =====================================================
-- VIEW RELATIONSHIPS
-- =====================================================

-- See foreign key relationships
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('profiles', 'contractors', 'requesters', 'leads')
ORDER BY tc.table_name;
