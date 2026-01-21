// app/api/email/send/route.ts
// API route for sending transactional emails.
// Can be called from Supabase Edge Functions, webhooks, or internal services.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  sendTransactionalEmail,
  EmailType,
} from '@/services/emailService';
import { supabaseAdmin } from '@/utils/supabase-admin';

/**
 * Request body for sending an email.
 */
interface SendEmailRequest {
  /** Type of email to send */
  type: EmailType;
  /** Recipient email address (optional if userId provided) */
  to?: string;
  /** User ID for logging and looking up email (optional if to provided) */
  userId?: string;
  /** Email-specific data for personalization */
  data: Record<string, unknown>;
}

/**
 * POST /api/email/send
 *
 * Sends a transactional email and logs the result.
 * Requires API key authentication via X-API-Key header.
 * Can provide either 'to' (email) or 'userId' (will lookup email from DB).
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key for security.
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.INTERNAL_API_KEY || process.env.RESEND_API_KEY;

    if (!apiKey || apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body.
    const body: SendEmailRequest = await request.json();
    const { type, userId, data } = body;
    let { to } = body;

    // Validate required fields - need either 'to' or 'userId'
    if (!type || (!to && !userId)) {
      return NextResponse.json(
        { error: 'Missing required fields: type, and either to or userId' },
        { status: 400 }
      );
    }

    // If no 'to' email provided but userId is, look up the user's email and name
    if (!to && userId) {
      let userEmail: string | null = null;
      let userName: string | null = null;

      // Try public.users first
      const { data: publicUser } = await supabaseAdmin
        .from('users')
        .select('email, full_name, raw_user_meta_data')
        .eq('id', userId)
        .single();

      if (publicUser?.email) {
        userEmail = publicUser.email;
        userName = publicUser.full_name || null;
        console.log(`[Email API] Found email in public.users: ${userEmail}`);
      }

      // Fallback to auth.users if not found in public.users
      if (!userEmail) {
        console.log('[Email API] Not found in public.users, checking auth.users...');
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (authUser?.user?.email) {
          userEmail = authUser.user.email;
          userName = authUser.user.user_metadata?.full_name || 
                    authUser.user.user_metadata?.name || null;
          console.log(`[Email API] Found email in auth.users: ${userEmail}`);
        } else {
          console.error('[Email API] Could not find user in auth.users:', authError?.message);
        }
      }

      if (!userEmail) {
        console.error('[Email API] Could not find user email for userId:', userId);
        return NextResponse.json(
          { error: 'User not found or no email address' },
          { status: 404 }
        );
      }

      to = userEmail;

      // Try to get firstName if not provided in data
      if (!data.firstName) {
        let firstName = 'there';
        
        // 1. Use userName if available
        if (userName) {
          firstName = userName.split(' ')[0];
        }
        // 2. Check raw_user_meta_data from public.users
        else if (publicUser?.raw_user_meta_data) {
          const meta = publicUser.raw_user_meta_data as Record<string, unknown>;
          firstName = (meta.firstName as string) || 
                     (meta.full_name as string)?.split(' ')[0] ||
                     (meta.name as string)?.split(' ')[0] ||
                     'there';
        }
        // 3. Extract from email as last resort
        else if (to) {
          const emailName = to.split('@')[0];
          firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1).split(/[._-]/)[0];
        }
        
        data.firstName = firstName;
        console.log(`[Email API] Using firstName: ${firstName}`);
      }
    }

    // Check for duplicate emails to prevent spam.
    if (userId) {
      const { data: existingEmail } = await supabaseAdmin
        .from('user_email_log')
        .select('id')
        .eq('user_id', userId)
        .eq('email_type', type)
        .single();

      if (existingEmail) {
        console.log(
          `[Email API] Duplicate ${type} email blocked for user ${userId}`
        );
        return NextResponse.json({
          success: false,
          message: `${type} email already sent to this user`,
          duplicate: true,
        });
      }
    }

    // Send the email (to is guaranteed to be set at this point).
    const result = await sendTransactionalEmail(type, to!, data);

    // Log the email send attempt.
    if (userId) {
      await supabaseAdmin.from('user_email_log').insert({
        user_id: userId,
        email_type: type,
        email_address: to!,
        status: result.success ? 'sent' : 'failed',
        error_message: result.error || null,
        sent_at: new Date().toISOString(),
      });
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: result.emailId,
    });
  } catch (error) {
    console.error('[Email API] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

