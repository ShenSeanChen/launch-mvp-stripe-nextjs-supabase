// supabase/functions/send-welcome-email/index.ts
// LaunchMVP Welcome Email Edge Function.
// Triggered by database webhook when new user is created.
// Calls the main app's email API to send welcome email with React Email template.

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
    email: string;
    raw_user_meta_data?: {
      firstName?: string;
      full_name?: string;
    };
    created_at: string;
  };
  schema: string;
}

serve(async (req: Request) => {
  try {
    // Parse the webhook payload from Supabase.
    const payload: WebhookPayload = await req.json();
    
    console.log('[WelcomeEmail] Received webhook:', payload.type);
    
    // Only process signup events (INSERT on users table).
    if (payload.type !== 'INSERT' || payload.table !== 'users') {
      return new Response(
        JSON.stringify({ message: 'Not a signup event' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id, email, raw_user_meta_data } = payload.record;
    
    // Extract first name for personalization.
    const firstName = 
      raw_user_meta_data?.firstName || 
      raw_user_meta_data?.full_name?.split(' ')[0] || 
      'there';

    console.log(`[WelcomeEmail] Sending welcome email to: ${email}`);

    // Call the main app's email API to send the welcome email.
    const emailResponse = await fetch(`${APP_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': INTERNAL_API_KEY || '',
      },
      body: JSON.stringify({
        type: 'welcome',
        to: email,
        userId: id,
        data: {
          firstName,
          dashboardUrl: `${APP_URL}/dashboard`,
        },
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('[WelcomeEmail] Failed to send email:', emailData);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: emailData 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if email was a duplicate (already sent).
    if (emailData.duplicate) {
      console.log('[WelcomeEmail] Duplicate email blocked:', email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Welcome email already sent',
          duplicate: true 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[WelcomeEmail] Email sent successfully:', emailData.emailId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: emailData.emailId 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[WelcomeEmail] Error in function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: errorMessage 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

