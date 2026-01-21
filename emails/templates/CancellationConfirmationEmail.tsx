// emails/templates/CancellationConfirmationEmail.tsx
// Cancellation confirmation email with focus on retention and easy resubscription.
// Encourages users to come back while confirming cancellation.

import {
  Column,
  Heading,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, Button } from './components';

/**
 * Props for the CancellationConfirmationEmail component.
 */
export interface CancellationConfirmationEmailProps {
  /** User's first name for personalization */
  firstName?: string;
  /** Whether this is account deletion (vs just subscription cancellation) */
  isAccountDeletion?: boolean;
  /** Days until subscription actually ends */
  retentionDays?: number;
  /** Resubscribe URL */
  resubscribeUrl?: string;
}

// Brand primary color for icons.
const PRIMARY_COLOR = '#6366f1';

/**
 * Cancellation confirmation email template.
 * Focused on encouraging users to resubscribe while confirming cancellation.
 */
export function CancellationConfirmationEmail({
  firstName = 'there',
  isAccountDeletion = false,
  retentionDays = 30,
  resubscribeUrl = 'https://my-full-stack-app-iota.vercel.app/pay',
}: CancellationConfirmationEmailProps) {
  // For account deletion, show a different email
  if (isAccountDeletion) {
    return (
      <EmailLayout previewText="Your account has been deleted.">
        <Section style={styles.mainSection}>
          <Heading as="h1" style={styles.mainHeading}>
            We&apos;re sorry to see you go, {firstName}
          </Heading>
          <Text style={styles.mainText}>
            Your account has been deleted. All your data has been permanently removed.
          </Text>
          <Text style={styles.mainText}>
            If you ever want to build your next MVP with us, we&apos;ll be here.
          </Text>
          <Section style={styles.ctaSection}>
            <Button href="https://github.com/ShenSeanChen/launch-mvp-stripe-nextjs-supabase" variant="dark">
              Visit GitHub
            </Button>
          </Section>
        </Section>
      </EmailLayout>
    );
  }

  // Format remaining days message
  const daysMessage = retentionDays > 0 
    ? ` (${retentionDays} day${retentionDays === 1 ? '' : 's'} remaining)` 
    : '';

  return (
    <EmailLayout previewText={`Hey ${firstName}, we'd love to have you back! Your subscription can be reactivated anytime.`}>
      {/* Main Content Section */}
      <Section style={styles.mainSection}>
        {/* Friendly Heading */}
        <Heading as="h1" style={styles.mainHeading}>
          We&apos;ll miss you, {firstName}!
        </Heading>

        <Text style={styles.mainText}>
          Your subscription has been cancelled. You can still use LaunchMVP until 
          the end of your billing period{daysMessage}.
        </Text>

        {/* What You'll Miss Section */}
        <Section style={styles.missSection}>
          <Text style={styles.missTitle}>
            Here&apos;s what you&apos;ll be missing:
          </Text>
          
          <Row style={styles.missItem}>
            <Column style={styles.missIconColumn}>
              <div style={styles.iconCircle}>●</div>
            </Column>
            <Column>
              <Text style={styles.missText}>
                Production-ready code templates and components
              </Text>
            </Column>
          </Row>

          <Row style={styles.missItem}>
            <Column style={styles.missIconColumn}>
              <div style={styles.iconCircle}>●</div>
            </Column>
            <Column>
              <Text style={styles.missText}>
                Automatic Stripe & Supabase integration updates
              </Text>
            </Column>
          </Row>

          <Row style={styles.missItem}>
            <Column style={styles.missIconColumn}>
              <div style={styles.iconCircle}>●</div>
            </Column>
            <Column>
              <Text style={styles.missText}>
                New features and improvements we ship weekly
              </Text>
            </Column>
          </Row>
        </Section>

        {/* Primary CTA - Resubscribe */}
        <Section style={styles.resubscribeSection}>
          <Text style={styles.resubscribeTitle}>
            Changed your mind?
          </Text>
          <Text style={styles.resubscribeSubtitle}>
            Reactivate your subscription with one click - no setup needed.
          </Text>
          <Section style={styles.ctaSection}>
            <Button href={resubscribeUrl} variant="dark">
              Resubscribe Now
            </Button>
          </Section>
        </Section>

        {/* Feedback Section - Secondary */}
        <Section style={styles.feedbackSection}>
          <Text style={styles.feedbackText}>
            We&apos;d love to hear why you&apos;re leaving - your feedback helps us improve!
          </Text>
          <Text style={styles.feedbackTextSecondary}>
            Just reply to this email or{' '}
            <Link href="https://discord.gg/TKKPzZheua" style={styles.feedbackLink}>
              join our Discord
            </Link>
            {' '}to share your thoughts.
          </Text>
        </Section>
      </Section>

      {/* Footer Links */}
      <Section style={styles.footerSection}>
        <Text style={styles.footerLinks}>
          <Link href="https://github.com/ShenSeanChen/launch-mvp-stripe-nextjs-supabase/issues" style={styles.footerLink}>
            Report issues
          </Link>
          {' • '}
          <Link href="https://discord.gg/TKKPzZheua" style={styles.footerLink}>
            Discord community
          </Link>
          {' • '}
          <Link href="https://www.youtube.com/@SeanAIStories" style={styles.footerLink}>
            YouTube tutorials
          </Link>
        </Text>
      </Section>
    </EmailLayout>
  );
}

/**
 * Email-safe inline styles.
 */
const styles = {
  mainSection: {
    padding: '40px 32px 24px',
  },
  mainHeading: {
    color: '#0f172b',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '36px',
    margin: '0 0 16px 0',
    textAlign: 'center' as const,
  },
  mainText: {
    color: '#45556c',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 16px 0',
    textAlign: 'center' as const,
  },
  missSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    margin: '24px 0',
    padding: '24px',
  },
  missTitle: {
    color: '#0f172b',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    margin: '0 0 16px 0',
  },
  missItem: {
    marginBottom: '12px',
  },
  missIconColumn: {
    verticalAlign: 'middle',
    width: '36px',
  },
  iconCircle: {
    backgroundColor: '#e0e7ff',
    borderRadius: '50%',
    color: PRIMARY_COLOR,
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '600' as const,
    height: '28px',
    lineHeight: '28px',
    textAlign: 'center' as const,
    width: '28px',
  },
  missText: {
    color: '#314158',
    fontSize: '14px',
    lineHeight: '21px',
    margin: '0',
  },
  resubscribeSection: {
    backgroundColor: '#e0e7ff',
    border: '1px solid #c7d2fe',
    borderRadius: '12px',
    margin: '24px 0',
    padding: '28px 24px',
    textAlign: 'center' as const,
  },
  resubscribeTitle: {
    color: '#0f172b',
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '27px',
    margin: '0 0 8px 0',
  },
  resubscribeSubtitle: {
    color: '#45556c',
    fontSize: '14px',
    lineHeight: '21px',
    margin: '0 0 20px 0',
  },
  ctaSection: {
    textAlign: 'center' as const,
  },
  feedbackSection: {
    borderTop: '1px solid #f1f5f9',
    marginTop: '24px',
    paddingTop: '24px',
    textAlign: 'center' as const,
  },
  feedbackText: {
    color: '#45556c',
    fontSize: '14px',
    lineHeight: '21px',
    margin: '0 0 8px 0',
  },
  feedbackTextSecondary: {
    color: '#62748e',
    fontSize: '13px',
    lineHeight: '20px',
    margin: '0',
  },
  feedbackLink: {
    color: PRIMARY_COLOR,
    fontWeight: '500' as const,
    textDecoration: 'none',
  },
  footerSection: {
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #f1f5f9',
    padding: '25px 32px',
    textAlign: 'center' as const,
  },
  footerLinks: {
    color: '#62748e',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '0',
  },
  footerLink: {
    color: '#62748e',
    textDecoration: 'none',
  },
};

export default CancellationConfirmationEmail;

