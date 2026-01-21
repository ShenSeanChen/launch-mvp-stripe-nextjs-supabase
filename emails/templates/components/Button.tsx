// emails/templates/components/Button.tsx
// Reusable button component for email templates.
// Supports primary, secondary, and dark variants with email-safe styling.

import { Link } from '@react-email/components';
import * as React from 'react';

/**
 * Props for the Button component.
 */
interface ButtonProps {
  /** URL to navigate to when clicked */
  href: string;
  /** Button content (text or React nodes) */
  children: React.ReactNode;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'dark';
}

/**
 * Email-safe button component.
 * Uses Link from React Email with inline styles for maximum compatibility.
 */
export function Button({ href, children, variant = 'primary' }: ButtonProps) {
  const buttonStyle = {
    ...styles.base,
    ...styles[variant],
  };

  return (
    <Link href={href} style={buttonStyle}>
      {children}
    </Link>
  );
}

/**
 * Button styles for different variants.
 */
const styles = {
  base: {
    borderRadius: '8px',
    display: 'inline-block',
    fontSize: '15px',
    fontWeight: '600' as const,
    lineHeight: '1',
    padding: '14px 28px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    width: '220px',
    boxSizing: 'border-box' as const,
  },
  primary: {
    backgroundColor: '#6366f1',
    border: '2px solid #6366f1',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: '#ffffff',
    border: '2px solid #e2e8f0',
    color: '#314158',
  },
  dark: {
    backgroundColor: '#0f172a',
    border: '2px solid #0f172a',
    color: '#ffffff',
  },
};

export default Button;

