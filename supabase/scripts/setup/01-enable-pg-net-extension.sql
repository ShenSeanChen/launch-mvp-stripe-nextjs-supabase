-- supabase/scripts/setup/enable-pg-net-extension.sql
-- Enable the pg_net extension for making HTTP requests from database triggers.
-- This is REQUIRED for the email triggers to call Edge Functions.
--
-- NOTE: You must enable this extension from the Supabase Dashboard:
-- 1. Go to Database > Extensions
-- 2. Search for "pg_net"
-- 3. Click to enable it
--
-- Alternatively, run this SQL in the SQL Editor:

-- Enable the pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Verify extension is enabled
SELECT 
    'pg_net extension status' as check,
    extname,
    extversion
FROM pg_extension 
WHERE extname = 'pg_net';

-- If you see results, the extension is enabled and ready to use!

