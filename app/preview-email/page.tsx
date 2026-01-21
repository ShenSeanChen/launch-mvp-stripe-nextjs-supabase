'use client';

// app/preview-email/page.tsx
// Email preview page for testing templates before sending.
// Uses iframe to properly isolate the email's HTML structure from the page.

import { useState, useEffect } from 'react';
import { render } from '@react-email/components';
import { 
  WelcomeEmail, 
  BillingConfirmationEmail, 
  CancellationConfirmationEmail 
} from '@/emails/templates';

type EmailTemplate = 'welcome' | 'billing' | 'cancellation';

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>('welcome');
  const [emailHtml, setEmailHtml] = useState<string>('');

  // Sample data for previews - using the actual Vercel URL
  const welcomeData = {
    userName: 'Sean',
    dashboardUrl: 'https://my-full-stack-app-iota.vercel.app/dashboard',
  };

  const billingData = {
    firstName: 'Sean',
    tierName: 'Pro',
    firstChargeDate: 'February 16, 2026',
    dashboardUrl: 'https://my-full-stack-app-iota.vercel.app/dashboard',
    billingUrl: 'https://my-full-stack-app-iota.vercel.app/profile',
  };

  const cancellationData = {
    firstName: 'Sean',
    retentionDays: 14,
    resubscribeUrl: 'https://my-full-stack-app-iota.vercel.app/pay',
  };

  // Render email to HTML string when template changes
  useEffect(() => {
    const renderEmail = async () => {
      let html = '';
      switch (selectedTemplate) {
        case 'welcome':
          html = await render(WelcomeEmail(welcomeData));
          break;
        case 'billing':
          html = await render(BillingConfirmationEmail(billingData));
          break;
        case 'cancellation':
          html = await render(CancellationConfirmationEmail(cancellationData));
          break;
      }
      setEmailHtml(html);
    };
    renderEmail();
  }, [selectedTemplate]);

  const getTemplateInfo = () => {
    switch (selectedTemplate) {
      case 'welcome':
        return { name: 'Welcome Email', description: 'Sent when a new user signs up' };
      case 'billing':
        return { name: 'Billing Confirmation', description: 'Sent after successful payment setup' };
      case 'cancellation':
        return { name: 'Cancellation Confirmation', description: 'Sent when subscription is cancelled' };
    }
  };

  const templateInfo = getTemplateInfo();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📧 Email Template Preview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Preview your email templates before sending. These are rendered with React Email.
          </p>
        </div>

        {/* Template Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTemplate('welcome')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTemplate === 'welcome'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Welcome Email
            </button>
            <button
              onClick={() => setSelectedTemplate('billing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTemplate === 'billing'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Billing Confirmation
            </button>
            <button
              onClick={() => setSelectedTemplate('cancellation')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTemplate === 'cancellation'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Cancellation Email
            </button>
          </div>
        </div>

        {/* Template Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {templateInfo.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {templateInfo.description}
          </p>
        </div>

        {/* Email Preview in iframe */}
        <div 
          className="bg-gray-300 dark:bg-gray-600 rounded-lg p-4 shadow-inner"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-lg mx-auto" style={{ maxWidth: '650px' }}>
            {emailHtml ? (
              <iframe
                srcDoc={emailHtml}
                title="Email Preview"
                className="w-full border-0"
                style={{ height: '800px', minHeight: '600px' }}
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Loading preview...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            ✨ Built with{' '}
            <a 
              href="https://react.email" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              React Email
            </a>
            {' '}and{' '}
            <a 
              href="https://resend.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Resend
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
