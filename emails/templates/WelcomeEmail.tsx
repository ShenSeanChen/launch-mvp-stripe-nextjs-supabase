// emails/templates/WelcomeEmail.tsx
// Welcome email sent to new users after signup.
// Features onboarding steps and personalized greeting.

import {
  Column,
  Heading,
  Hr,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout, Button } from './components';

/**
 * Props for the WelcomeEmail component.
 */
export interface WelcomeEmailProps {
  /** User's first name for personalization */
  firstName?: string;
  /** Alternative property name for user name */
  userName?: string;
  /** Dashboard URL (allows for custom domains) */
  dashboardUrl?: string;
}

/**
 * Welcome email template for new users.
 * Features onboarding steps and a warm welcome message.
 */
export function WelcomeEmail({
  firstName,
  userName,
  dashboardUrl = 'https://my-full-stack-app-iota.vercel.app/dashboard',
}: WelcomeEmailProps) {
  const displayName = firstName || userName || 'there';
  
  return (
    <EmailLayout previewText="Welcome! Start building your MVP in minutes.">
      {/* Hero Section */}
      <Section style={styles.heroSection}>
        <Heading as="h1" style={styles.heroHeading}>
          Welcome to LaunchMVP 👋
        </Heading>
        <Text style={styles.heroSubtext}>
          Hey {displayName}! You&apos;re now ready to build your production-ready 
          app with Next.js, Supabase, and Stripe.
        </Text>
      </Section>

      {/* CTA Buttons */}
      <Section style={styles.ctaSection}>
        <Button href={dashboardUrl} variant="primary">
          Go to Dashboard →
        </Button>
        <div style={styles.ctaSpacing}></div>
        <Button href="https://www.youtube.com/watch?v=ad1BxZufer8" variant="secondary">
          Watch Tutorial Video
        </Button>
        <div style={styles.ctaSpacing}></div>
        <Button href="https://github.com/ShenSeanChen/launch-mvp-stripe-nextjs-supabase" variant="secondary">
          ⭐ Star on GitHub
        </Button>
      </Section>

      {/* 3 Steps Section */}
      <Section style={styles.stepsContainer}>
        <Heading as="h2" style={styles.stepsHeading}>
          Get started in 3 steps
        </Heading>

        <Row style={styles.stepsRow}>
          <Column style={styles.stepColumn}>
            <div style={styles.stepNumber}>1</div>
            <Text style={styles.stepTitle}>Set up your project</Text>
            <Text style={styles.stepDescription}>
              Configure Supabase and Stripe with your API keys.
            </Text>
          </Column>

          <Column style={styles.stepColumn}>
            <div style={styles.stepNumber}>2</div>
            <Text style={styles.stepTitle}>Customize your app</Text>
            <Text style={styles.stepDescription}>
              Update branding, pricing, and features to match your vision.
            </Text>
          </Column>

          <Column style={styles.stepColumn}>
            <div style={styles.stepNumber}>3</div>
            <Text style={styles.stepTitle}>Deploy & launch</Text>
            <Text style={styles.stepDescription}>
              Ship to production with one click using Vercel.
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Quote Section */}
      <Section style={styles.quoteSection}>
        <Text style={styles.quoteText}>
          &ldquo;The best time to launch was yesterday. The second best time is today.&rdquo;
        </Text>
        <Hr style={styles.quoteDivider} />
        <Text style={styles.quoteName}>Sean Chen</Text>
        <Text style={styles.quoteRole}>Creator of LaunchMVP</Text>
      </Section>
    </EmailLayout>
  );
}

/**
 * Enhanced email-safe inline styles.
 */
const styles = {
  heroSection: {
    padding: '30px 32px 12px',
    textAlign: 'center' as const,
    backgroundColor: '#ffffff',
  },
  heroHeading: {
    color: '#0f172b',
    fontSize: '32px',
    fontWeight: 'bold',
    lineHeight: '40px',
    margin: '0 0 12px 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  heroSubtext: {
    color: '#45556c',
    fontSize: '18px',
    lineHeight: '29px',
    margin: '0',
    maxWidth: '480px',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  ctaSection: {
    padding: '24px 32px',
    textAlign: 'center' as const,
    backgroundColor: '#ffffff',
  },
  ctaSpacing: {
    height: '12px',
  },
  stepsContainer: {
    padding: '20px 24px 24px',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
  },
  stepsHeading: {
    color: '#0f172b',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '30px',
    margin: '0 0 24px 0',
    textAlign: 'center' as const,
  },
  stepsRow: {
    width: '100%',
    tableLayout: 'fixed' as const,
  },
  stepColumn: {
    padding: '0 8px',
    textAlign: 'center' as const,
    verticalAlign: 'top',
    width: '33.33%',
  },
  stepNumber: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: '50%',
    color: '#6366f1',
    display: 'inline-block',
    fontSize: '18px',
    fontWeight: '700',
    height: '48px',
    lineHeight: '48px',
    marginBottom: '8px',
    width: '48px',
  },
  stepTitle: {
    color: '#0f172b',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '21px',
    margin: '0 0 4px 0',
  },
  stepDescription: {
    color: '#62748e',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '0',
  },
  quoteSection: {
    backgroundColor: '#0f172a',
    borderRadius: '10px',
    padding: '24px 32px',
    margin: '0 auto 24px auto',
    maxWidth: '536px',
    width: 'calc(100% - 48px)',
    boxSizing: 'border-box' as const,
  },
  quoteText: {
    color: '#ffffff',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 16px 0',
    textAlign: 'center' as const,
  },
  quoteDivider: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    margin: '16px 0',
  },
  quoteName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    margin: '0',
    textAlign: 'center' as const,
  },
  quoteRole: {
    color: '#cad5e2',
    fontSize: '14px',
    lineHeight: '21px',
    margin: '0',
    textAlign: 'center' as const,
  },
};

export default WelcomeEmail;

