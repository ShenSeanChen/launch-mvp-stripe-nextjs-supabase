// emails/templates/components/EmailLayout.tsx
// Shared email layout component with header, footer, and consistent styling.
// Uses React Email components for email-safe rendering.

import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

/**
 * Props for the EmailLayout component.
 */
interface EmailLayoutProps {
  /** Preview text shown in email clients before opening */
  previewText: string;
  /** Main content of the email */
  children: React.ReactNode;
}

/**
 * Shared email layout with consistent branding.
 * Provides consistent header, footer, and styling across all transactional emails.
 */
export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header with Logo */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>🚀 LaunchMVP</Text>
          </Section>

          {/* Main Content */}
          {children}

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              LaunchMVP • Built with Next.js, Supabase & Stripe
            </Text>
            <Text style={styles.footerLinks}>
              <Link href="https://github.com/ShenSeanChen/launch-mvp-stripe-nextjs-supabase" style={styles.footerLink}>
                GitHub
              </Link>
              {' • '}
              <Link href="https://www.youtube.com/@SeanAIStories" style={styles.footerLink}>
                YouTube
              </Link>
              {' • '}
              <Link href="https://x.com/ShenSeanChen" style={styles.footerLink}>
                X/Twitter
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Email-safe inline styles.
 * Uses table-compatible CSS properties for maximum email client support.
 */
const styles = {
  body: {
    backgroundColor: '#f8fafc',
    fontFamily:
      "'Poppins', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    margin: '0',
    padding: '40px 0',
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    maxWidth: '600px',
    width: '100%',
  },
  header: {
    borderBottom: '1px solid #e2e8f0',
    padding: '24px 32px',
  },
  logoText: {
    color: '#6366f1',
    display: 'inline-block',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    margin: '0',
  },
  footer: {
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #f1f5f9',
    padding: '24px 32px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: '#90a1b9',
    fontSize: '12px',
    margin: '0 0 8px 0',
  },
  footerLinks: {
    color: '#62748e',
    fontSize: '12px',
    margin: '0',
  },
  footerLink: {
    color: '#6366f1',
    textDecoration: 'none',
  },
};

export default EmailLayout;

