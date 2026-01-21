// supabase/functions/send-billing-email/index.ts
// LaunchMVP Billing Confirmation Email Edge Function.
// Triggered by database webhook when new subscription is created.
// Calls the main app's email API to send billing confirmation email.

// @ts-ignore - Deno imports are valid in Supabase Edge Functions runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

// Environment variables.
// APP_URL should be set via: supabase secrets set APP_URL=https://my-full-stack-app-iota.vercel.app
// @ts-ignore - Deno global is available in Edge Functions runtime
const APP_URL = Deno.env.get("APP_URL") || "https://my-full-stack-app-iota.vercel.app";
// @ts-ignore - Deno global is available in Edge Functions runtime  
const INTERNAL_API_KEY = Deno.env.get("INTERNAL_API_KEY") || Deno.env.get("RESEND_API_KEY");

/**
 * Webhook payload structure from Supabase database trigger.
 */
interface WebhookPayload {
  type: string;
  table: string;
  record: {
    id: string;
    user_id: string;
    stripe_subscription_id: string;
    stripe_customer_id: string;
    tier: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    created_at: string;
  };
  old_record?: {
    status: string;
  };
  schema: string;
}

serve(async (req) => {
  try {
    // Parse the webhook payload from Supabase.
    const payload: WebhookPayload = await req.json();
    
    console.log('[BillingEmail] Received webhook:', payload.type, 'on table:', payload.table);
    
    // Only process INSERT events on subscriptions table (new subscription = billing confirmation)
    if (payload.type !== 'INSERT' || payload.table !== 'subscriptions') {
      return new Response(
        JSON.stringify({ message: 'Not a new subscription event' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { user_id, tier, stripe_subscription_id, current_period_end } = payload.record;
    
    console.log(`[BillingEmail] Sending billing confirmation email for user: ${user_id}, tier: ${tier}`);

    // Format the charge date nicely (e.g., "February 16, 2026")
    let formattedChargeDate = 'your next billing date';
    if (current_period_end) {
      const date = new Date(current_period_end);
      formattedChargeDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    // Call the main app's email API to send the billing email.
    const emailResponse = await fetch(`${APP_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': INTERNAL_API_KEY || '',
      },
      body: JSON.stringify({
        type: 'billing_confirmation',
        userId: user_id,
        data: {
          tierName: tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Starter',
          firstChargeDate: formattedChargeDate,
        },
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('[BillingEmail] Failed to send email:', emailData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: emailData 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[BillingEmail] Email sent successfully:', emailData.emailId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Billing confirmation email sent successfully',
        emailId: emailData.emailId 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[BillingEmail] Error in function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
