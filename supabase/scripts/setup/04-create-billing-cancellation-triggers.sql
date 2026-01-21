-- supabase/scripts/setup/create-billing-cancellation-triggers.sql
-- Creates triggers for billing and cancellation emails on subscriptions table.
-- Following the same pattern: trigger → Edge Function → Email API → Resend
--
-- ============================================================================
-- BEFORE RUNNING: Replace this placeholder with your actual value:
-- ============================================================================
-- 
-- YOUR_SUPABASE_PROJECT_REF
--    → Find at: Supabase Dashboard → Project Settings → General → Reference ID
--    → Example: abcdefghijklmnopqrst
--
-- ============================================================================

-- ================================
-- 1. BILLING CONFIRMATION TRIGGER
-- ================================
-- Fires when a new subscription is created (INSERT on subscriptions table)
-- Sends billing confirmation email with tier details

CREATE OR REPLACE FUNCTION public.trigger_billing_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function via HTTP request
  -- Uses pg_net extension to make HTTP calls from database triggers
  PERFORM
    net.http_post(
      url := 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/send-billing-email',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', 'subscriptions',
        'record', row_to_json(NEW),
        'schema', 'public'
      )
    );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If email sending fails, don't block the subscription creation
  RAISE WARNING 'Failed to send billing email for subscription %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_subscription_created_email ON public.subscriptions;
CREATE TRIGGER on_subscription_created_email
    AFTER INSERT ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_billing_email();


-- ================================
-- 2. CANCELLATION TRIGGER
-- ================================
-- Fires when subscription status changes to cancelled or cancel_at_period_end becomes true
-- Sends cancellation confirmation with retention info and resubscribe CTA

CREATE OR REPLACE FUNCTION public.trigger_cancellation_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if this is a cancellation event:
  -- 1. Status changed to 'canceled' or 'cancelled'
  -- 2. cancel_at_period_end changed from false to true
  
  IF (NEW.status IN ('canceled', 'cancelled') AND OLD.status NOT IN ('canceled', 'cancelled'))
     OR (NEW.cancel_at_period_end = true AND OLD.cancel_at_period_end = false) THEN
    
    -- Call the Edge Function via HTTP request
    PERFORM
      net.http_post(
        url := 'https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/send-cancellation-email',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := jsonb_build_object(
          'type', 'UPDATE',
          'table', 'subscriptions',
          'record', row_to_json(NEW),
          'old_record', row_to_json(OLD),
          'schema', 'public'
        )
      );
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If email sending fails, don't block the subscription update
  RAISE WARNING 'Failed to send cancellation email for subscription %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_subscription_cancelled_email ON public.subscriptions;
CREATE TRIGGER on_subscription_cancelled_email
    AFTER UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_cancellation_email();


-- ============================================================================
-- VERIFICATION: Run this after creating the triggers to confirm they exist
-- ============================================================================
SELECT 
    '✅ Subscription Triggers Created!' as status,
    trigger_name,
    event_object_table as table_name,
    action_timing || ' ' || event_manipulation as trigger_type
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table = 'subscriptions'
ORDER BY trigger_name;
