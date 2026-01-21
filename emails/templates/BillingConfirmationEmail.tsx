// emails/templates/BillingConfirmationEmail.tsx
// Billing confirmation email sent after successful payment setup.
// Confirms subscription and shows what's included.

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
 * Props for the BillingConfirmationEmail component.
 */
export interface BillingConfirmationEmailProps {
  /** User's first name for personalization */
  firstName?: string;
  /** First billing date (formatted string) */
  firstChargeDate?: string;
  /** Subscription tier name (Starter, Pro, etc.) */
  tierName?: string;
  /** Dashboard URL */
  dashboardUrl?: string;
  /** Billing management URL */
  billingUrl?: string;
}

// Brand primary color for success icon.
const SUCCESS_COLOR = '#00a63e';

/**
 * Get tier-specific benefits based on the subscription tier.
 */
function getTierBenefits(tierName: string): string[] {
  const tierLower = tierName.toLowerCase();
  
  if (tierLower === 'pro' || tierLower === 'professional') {
    return [
      'Unlimited projects and deployments',
      'Priority support and faster response times',
      'Advanced analytics and insights',
      'Team collaboration features',
    ];
  }
  
  // Default to Starter benefits
  return [
    'Full access to all core features',
    'Up to 3 projects',
    'Community support',
    'Regular updates and improvements',
  ];
}

/**
 * Billing confirmation email template.
 * Sent when a user successfully sets up their subscription.
 */
export function BillingConfirmationEmail({
  firstName = 'there',
  firstChargeDate = 'your next billing date',
  tierName = 'Starter',
  dashboardUrl = 'https://my-full-stack-app-iota.vercel.app/dashboard',
  billingUrl = 'https://my-full-stack-app-iota.vercel.app/profile',
}: BillingConfirmationEmailProps) {
  const benefits = getTierBenefits(tierName);

  return (
    <EmailLayout previewText={`Welcome to LaunchMVP ${tierName}! Your billing is set up.`}>
      {/* Success Icon and Heading */}
      <Section style={styles.heroSection}>
        <div style={styles.successIcon}>✓</div>
        <Heading as="h1" style={styles.heroHeading}>
          Welcome to LaunchMVP {tierName}!
        </Heading>
        <Text style={styles.heroSubtext}>
          Hey {firstName}, your payment method has been added successfully.
        </Text>
      </Section>

      {/* Content Section with padding */}
      <Section style={styles.contentSection}>
        {/* First Charge Info Box */}
        <Section style={styles.chargeInfoBox}>
          <Text style={styles.chargeTitle}>
            Your first charge will be on {firstChargeDate}
          </Text>
          <Text style={styles.chargeDescription}>
            You won&apos;t be charged until the end of your trial period.
            You&apos;ll receive a reminder 3 days before your first payment.
          </Text>
        </Section>

        {/* What's Unlocked Section */}
        <Section style={styles.unlockedSection}>
          <Text style={styles.sectionHeading}>
            What&apos;s unlocked with {tierName}:
          </Text>

          {benefits.map((benefit, index) => (
            <Row key={index} style={styles.checkRow}>
              <Column style={styles.checkIconColumn}>
                <div style={styles.checkIcon}>✓</div>
              </Column>
              <Column>
                <Text style={styles.checkText}>{benefit}</Text>
              </Column>
            </Row>
          ))}
        </Section>

        {/* CTA Button */}
        <Section style={styles.ctaSection}>
          <Button href={dashboardUrl} variant="dark">
            Go to dashboard
          </Button>
        </Section>

        {/* Control Section */}
        <Section style={styles.controlSection}>
          <Text style={styles.controlTitle}>You&apos;re in control</Text>
          <Text style={styles.controlLinks}>
            <Link href={dashboardUrl} style={styles.controlLink}>
              View dashboard
            </Link>
            {' • '}
            <Link href={billingUrl} style={styles.controlLink}>
              Manage billing
            </Link>
          </Text>
        </Section>
      </Section>

      {/* Help Section */}
      <Section style={styles.helpSection}>
        <Text style={styles.helpTitle}>Questions about billing?</Text>
        <Text style={styles.helpLinks}>
          <Link href="https://github.com/ShenSeanChen/launch-mvp-stripe-nextjs-supabase/issues" style={styles.helpLinkPrimary}>
            Open an issue
          </Link>
          {' • '}
          <Link href="https://discord.gg/TKKPzZheua" style={styles.helpLink}>
            Join Discord
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
  heroSection: {
    padding: '40px 32px 32px',
    textAlign: 'center' as const,
  },
  successIcon: {
    backgroundColor: '#dcfce7',
    borderRadius: '50%',
    color: SUCCESS_COLOR,
    display: 'inline-block',
    fontSize: '32px',
    fontWeight: '600' as const,
    height: '64px',
    lineHeight: '64px',
    marginBottom: '16px',
    width: '64px',
  },
  heroHeading: {
    color: '#0f172b',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '36px',
    margin: '0 0 8px 0',
  },
  heroSubtext: {
    color: '#45556c',
    fontSize: '15px',
    lineHeight: '22px',
    margin: '0',
  },
  contentSection: {
    padding: '0 32px 8px',
  },
  chargeInfoBox: {
    backgroundColor: '#e0e7ff',
    border: '1px solid #c7d2fe',
    borderRadius: '10px',
    marginBottom: '24px',
    padding: '20px 24px',
  },
  chargeTitle: {
    color: '#0f172b',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '21px',
    margin: '0 0 8px 0',
  },
  chargeDescription: {
    color: '#45556c',
    fontSize: '13px',
    lineHeight: '21px',
    margin: '0',
  },
  unlockedSection: {
    marginBottom: '24px',
  },
  sectionHeading: {
    color: '#0f172b',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    margin: '0 0 16px 0',
  },
  checkRow: {
    marginBottom: '12px',
  },
  checkIconColumn: {
    verticalAlign: 'middle',
    width: '36px',
  },
  checkIcon: {
    backgroundColor: '#dcfce7',
    borderRadius: '50%',
    color: SUCCESS_COLOR,
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600' as const,
    height: '24px',
    lineHeight: '24px',
    textAlign: 'center' as const,
    width: '24px',
  },
  checkText: {
    color: '#314158',
    fontSize: '14px',
    lineHeight: '21px',
    margin: '0',
  },
  ctaSection: {
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  controlSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    marginBottom: '24px',
    padding: '20px',
    textAlign: 'center' as const,
  },
  controlTitle: {
    color: '#45556c',
    fontSize: '13px',
    lineHeight: '19px',
    margin: '0 0 12px 0',
  },
  controlLinks: {
    color: '#314158',
    fontSize: '13px',
    lineHeight: '24px',
    margin: '0',
  },
  controlLink: {
    color: '#314158',
    textDecoration: 'underline',
  },
  helpSection: {
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #f1f5f9',
    padding: '25px 32px',
    textAlign: 'center' as const,
  },
  helpTitle: {
    color: '#45556c',
    fontSize: '13px',
    lineHeight: '19px',
    margin: '0 0 8px 0',
  },
  helpLinks: {
    color: '#62748e',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '0',
  },
  helpLinkPrimary: {
    color: '#6366f1',
    fontWeight: '500',
    textDecoration: 'none',
  },
  helpLink: {
    color: '#62748e',
    textDecoration: 'none',
  },
};

export default BillingConfirmationEmail;

