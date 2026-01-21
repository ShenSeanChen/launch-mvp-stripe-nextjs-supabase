-- supabase/scripts/setup/create-public-users-trigger.sql
-- Creates welcome email trigger on public.users table.
-- This fires when a new user signs up and calls the Edge Function.
--
-- ============================================================================
-- BEFORE RUNNING: Replace these placeholders with your actual values:
-- ============================================================================
-- 
-- 1. YOUR_SUPABASE_PROJECT_REF
--    → Find at: Supabase Dashboard → Project Settings → General → Reference ID
--    → Example: abcdefghijklmnopqrst
--
-- 2. YOUR_SUPABASE_ANON_KEY  
--    → Find at: Supabase Dashboard → Project Settings → API → anon/public key
--    → Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
--
-- ============================================================================

-- Drop any existing triggers
DROP TRIGGER IF EXISTS trigger_welcome_email_on_signup ON public.users;
DROP TRIGGER IF EXISTS on_public_user_created_email ON public.users;

-- Create the welcome email trigger function
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function via HTTP request when public.users record is created
  -- Uses pg_net extension to make HTTP calls from database triggers
  PERFORM
    net.http_post(
      url := 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/send-welcome-email',
      headers := '{
        "Content-Type": "application/json", 
        "Authorization": "Bearer YOUR_SUPABASE_ANON_KEY"
      }'::jsonb,
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'users',
        'record', row_to_json(NEW),
        'schema', 'public'
      )
    );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If email sending fails, don't block the user creation
  RAISE WARNING 'Failed to send welcome email for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on public.users table
CREATE TRIGGER trigger_welcome_email_on_signup
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.send_welcome_email_on_signup();

-- ============================================================================
-- VERIFICATION: Run this after creating the trigger to confirm it was created
-- ============================================================================
SELECT 
    '✅ Trigger Created Successfully!' as status,
    trigger_name,
    event_object_table as table_name,
    action_timing || ' ' || event_manipulation as trigger_type
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table = 'users'
AND trigger_name = 'trigger_welcome_email_on_signup';
