// services/emailService.ts
// Unified email service for sending transactional emails via Resend.
// Handles welcome, billing confirmation, and cancellation emails.

import { Resend } from 'resend';
import { render } from '@react-email/components';
import {
  WelcomeEmail,
  WelcomeEmailProps,
  BillingConfirmationEmail,
  BillingConfirmationEmailProps,
  CancellationConfirmationEmail,
  CancellationConfirmationEmailProps,
} from '@/emails/templates';

// Email sender configuration.
// Update this to your verified domain in Resend.
// For this tutorial, we use seanchen.io which is verified in Resend.
const EMAIL_FROM = 'LaunchMVP <startup@seanchen.io>';

// Lazy initialization of Resend client to avoid build errors.
let resendClient: Resend | null = null;

/**
 * Gets or creates the Resend client.
 * Throws an error if RESEND_API_KEY is not configured.
 */
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

/**
 * Email type identifiers for logging and tracking.
 */
export type EmailType = 'welcome' | 'billing_confirmation' | 'cancellation';

/**
 * Result of sending an email.
 */
export interface SendEmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Sends a welcome email to a new user.
 *
 * @param to - Recipient email address
 * @param props - Email personalization data
 * @returns Result with success status and email ID
 */
export async function sendWelcomeEmail(
  to: string,
  props: WelcomeEmailProps
): Promise<SendEmailResult> {
  try {
    const resend = getResendClient();
    const html = await render(WelcomeEmail(props));

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: 'Welcome to LaunchMVP! 👋 Your journey starts here',
      html,
    });

    if (error) {
      console.error('[EmailService] Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }

    console.log(`[EmailService] Welcome email sent to ${to}, id: ${data?.id}`);
    return { success: true, emailId: data?.id };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[EmailService] Error sending welcome email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Sends a billing confirmation email after successful payment setup.
 *
 * @param to - Recipient email address
 * @param props - Billing details for personalization
 * @returns Result with success status and email ID
 */
export async function sendBillingConfirmationEmail(
  to: string,
  props: BillingConfirmationEmailProps
): Promise<SendEmailResult> {
  try {
    const resend = getResendClient();
    const html = await render(BillingConfirmationEmail(props));

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: '✓ Billing setup complete - LaunchMVP',
      html,
    });

    if (error) {
      console.error(
        '[EmailService] Failed to send billing confirmation email:',
        error
      );
      return { success: false, error: error.message };
    }

    console.log(
      `[EmailService] Billing confirmation email sent to ${to}, id: ${data?.id}`
    );
    return { success: true, emailId: data?.id };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(
      '[EmailService] Error sending billing confirmation email:',
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Sends a cancellation confirmation email.
 *
 * @param to - Recipient email address
 * @param props - Cancellation details for personalization
 * @returns Result with success status and email ID
 */
export async function sendCancellationEmail(
  to: string,
  props: CancellationConfirmationEmailProps
): Promise<SendEmailResult> {
  try {
    const resend = getResendClient();
    const html = await render(CancellationConfirmationEmail(props));

    const subject = props.isAccountDeletion
      ? 'Your account has been deleted'
      : 'Your subscription has been cancelled';

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error(
        '[EmailService] Failed to send cancellation email:',
        error
      );
      return { success: false, error: error.message };
    }

    console.log(
      `[EmailService] Cancellation email sent to ${to}, id: ${data?.id}`
    );
    return { success: true, emailId: data?.id };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(
      '[EmailService] Error sending cancellation email:',
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Generic function to send any transactional email by type.
 * Useful for calling from webhooks or API routes.
 *
 * @param type - Type of email to send
 * @param to - Recipient email address
 * @param data - Email-specific personalization data
 * @returns Result with success status and email ID
 */
export async function sendTransactionalEmail(
  type: EmailType,
  to: string,
  data: Record<string, unknown>
): Promise<SendEmailResult> {
  switch (type) {
    case 'welcome':
      return sendWelcomeEmail(to, data as WelcomeEmailProps);
    case 'billing_confirmation':
      return sendBillingConfirmationEmail(
        to,
        data as BillingConfirmationEmailProps
      );
    case 'cancellation':
      return sendCancellationEmail(
        to,
        data as CancellationConfirmationEmailProps
      );
    default:
      return { success: false, error: `Unknown email type: ${type}` };
  }
}

