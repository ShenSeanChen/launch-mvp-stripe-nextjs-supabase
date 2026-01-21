// supabase/functions/send-cancellation-email/index.ts
// LaunchMVP Cancellation Confirmation Email Edge Function.
// Triggered by database webhook when subscription status changes to cancelled.
// Calls the main app's email API to send cancellation confirmation email.

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
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: string;
  };
  old_record?: {
    status: string;
    cancel_at_period_end: boolean;
  };
  schema: string;
}

serve(async (req) => {
  try {
    // Parse the webhook payload from Supabase.
    const payload: WebhookPayload = await req.json();
    
    console.log('[CancellationEmail] Received webhook:', JSON.stringify(payload, null, 2));
    
    // Only process UPDATE events on subscriptions table
    if (payload.type !== 'UPDATE' || payload.table !== 'subscriptions') {
      console.log('[CancellationEmail] Not a subscription update event, skipping');
      return new Response(
        JSON.stringify({ message: 'Not a subscription update event' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { user_id, status, cancel_at_period_end, current_period_end } = payload.record;
    const oldRecord = payload.old_record;

    console.log('[CancellationEmail] Record details:', {
      user_id,
      status,
      cancel_at_period_end,
      current_period_end,
      old_cancel_at_period_end: oldRecord?.cancel_at_period_end,
    });

    // Check if this is a cancellation event:
    // 1. Status changed to 'canceled' or 'cancelled'
    // 2. cancel_at_period_end changed from false to true
    const isCancellation = 
      (status === 'canceled' || status === 'cancelled') ||
      (cancel_at_period_end === true && oldRecord?.cancel_at_period_end === false);

    if (!isCancellation) {
      console.log('[CancellationEmail] Not a cancellation event, skipping');
      return new Response(
        JSON.stringify({ message: 'Not a cancellation event' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`[CancellationEmail] Sending cancellation email for user: ${user_id}`);

    // Calculate retention days (time until subscription actually ends)
    // Handle null/undefined current_period_end
    let retentionDays = 30; // Default
    if (current_period_end) {
      const endDate = new Date(current_period_end);
      const now = new Date();
      retentionDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }
    console.log('[CancellationEmail] Calculated retention days:', retentionDays);

    // Call the main app's email API to send the cancellation email.
    const emailResponse = await fetch(`${APP_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': INTERNAL_API_KEY || '',
      },
      body: JSON.stringify({
        type: 'cancellation',
        userId: user_id,
        data: {
          isAccountDeletion: false,
          retentionDays: retentionDays,
          endDate: current_period_end,
        },
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('[CancellationEmail] Failed to send email:', emailData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: emailData 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[CancellationEmail] Email sent successfully:', emailData.emailId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Cancellation email sent successfully',
        emailId: emailData.emailId 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[CancellationEmail] Error in function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
