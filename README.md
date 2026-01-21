# Next.js + Stripe + Supabase Production-Ready Template

A production-ready Next.js template featuring authentication, dark mode support, Stripe integration, **automated email workflows with Resend**, and a clean, modern UI. Built with TypeScript and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

📹 Full YouTube Guide: [Youtube link](https://www.youtube.com/watch?v=ad1BxZufer8&list=PLE9hy4A7ZTmpGq7GHf5tgGFWh2277AeDR&index=8)

🚀 X Post: [X link](https://x.com/ShenSeanChen/status/1895163913161109792)

💡 Try the App: [App link](https://mvp.seanchen.io)

☕️ Buy me a coffee: [Cafe Latte](https://buy.stripe.com/5kA176bA895ggog4gh)

🤖️ Discord: [Invite link](https://discord.com/invite/TKKPzZheua)

## ✨ Features

- 🔐 Authentication with Supabase
- 💳 Stripe payment integration
- 📧 **Automated Email Workflows with Resend** (welcome, billing, cancellation emails)
- 🌓 Dark mode support
- 📱 Responsive design
- 🎨 Tailwind CSS styling
- 🔄 Framer Motion animations
- 🛡️ TypeScript support
- 📊 Error boundary implementation
- 🔍 SEO optimized
- 🤖 MCP integration for AI-powered development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account
- A Stripe account
- A Resend account (for emails)
- A Google Cloud Platform account

### Installation and Setup

1. Clone the template:

```bash
git clone https://github.com/ShenSeanChen/launch-stripe-nextjs-supabase my-full-stack-app
cd my-full-stack-app
rm -rf .git
git init
git add .
git commit -m "Initial commit"
# git remote add origin https://github.com/ShenSeanChen/my-full-stack-app.git
git remote add origin https://github.com/USE_YOUR_OWN_GITHUB_NAME/my-full-stack-app.git
git push -u origin main
```

2. Install dependencies:
```bash
npm install
```
or
```bash
yarn install
```

3. Create .env.local with all variables from .env.example
```
NEXT_PUBLIC_APP_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Supabase Configuration
# Note: In Supabase Dashboard, these are now called "Publishable key" and "Secret key"
# but the variable names below still work correctly
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI Configuration (you'll need to add your key)
OPENAI_API_KEY=

# Stripe Configuration
# ⚠️ Use TEST keys (pk_test_, sk_test_) during development!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
NEXT_PUBLIC_STRIPE_BUTTON_ID=buy_btn_
STRIPE_SECRET_KEY=sk_test_
STRIPE_WEBHOOK_SECRET=whsec_

# Email Configuration (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
INTERNAL_API_KEY=your_internal_api_key

# ANALYTICS
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

4. Set up Google Cloud Platform (GCP):
   - Create new OAuth 2.0 credentials in GCP Console
   - Configure authorized JavaScript origins
   - Configure redirect URIs
   - Save the Client ID and Client Secret

5. Configure Supabase:

   a. Get API Keys (Project Settings > API):
      - Project URL → NEXT_PUBLIC_SUPABASE_URL
      - Publishable Key (or Anon Key in legacy tab) → NEXT_PUBLIC_SUPABASE_ANON_KEY
      - Secret Key (or Service Role in legacy tab) → SUPABASE_SERVICE_ROLE_KEY
   
   b. Set up Authentication:
      - Go to Authentication > Providers > Google
      - Add your GCP Client ID and Client Secret
      - Update Site URL and Redirect URLs
   
   c. Database Setup:
      - Enable Row Level Security (RLS) for all tables
      - Create policies for authenticated users and service roles
      - Create the following trigger function:

      ```sql
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.users (id, email, created_at, updated_at, is_deleted)
        VALUES (NEW.id, NEW.email, NOW(), NOW(), FALSE);
        
        INSERT INTO public.user_preferences (user_id, has_completed_onboarding)
        VALUES (NEW.id, FALSE);
        
        INSERT INTO public.user_trials (user_id, trial_start_time, trial_end_time)
        VALUES (NEW.id, NOW(), NOW() + INTERVAL '48 hours');
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      ```

6. Set up Stripe:
   
   a. **Use TEST mode during development:**
      - Go to Stripe Dashboard and ensure "Test mode" is enabled (toggle in top-right)
      - Use test card number: `4242 4242 4242 4242`
      - Create product in Product Catalog
      - Create promotional coupon codes
      - Set up Payment Link with trial period
   
   b. Get required keys (from TEST mode):
      - Publishable Key (pk_test_xxx) → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      - Secret Key (sk_test_xxx) → STRIPE_SECRET_KEY
      - Buy Button ID → NEXT_PUBLIC_STRIPE_BUTTON_ID
   
   c. Configure webhooks:
      - Add endpoint: your_url/api/stripe/webhook
      - Subscribe to events: customer.subscription.*, checkout.session.*, invoice.*, payment_intent.*
      - Copy Signing Secret → STRIPE_WEBHOOK_SECRET

7. Start the development server:
```bash
npm run dev
```
or
```bash
yarn dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📧 Email Automation Setup

This template includes automated transactional emails using **Supabase Database Triggers**, **Supabase Edge Functions**, and **Resend**. When a user signs up, subscribes, or cancels, they automatically receive beautiful emails.

> 📹 **Video Tutorial**: Follow along with the YouTube video for a step-by-step walkthrough of this section.

### Understanding the Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WHERE THINGS RUN                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  VERCEL (Next.js App)              SUPABASE (Database + Functions)          │
│  ─────────────────────            ────────────────────────────────          │
│  • Your website UI                 • Database (PostgreSQL)                  │
│  • API routes (/api/*)             • Database Triggers (pg_net)             │
│  • Email service                   • Edge Functions (Deno runtime)          │
│                                                                              │
│  Uses: .env.local or               Uses: supabase secrets                   │
│        Vercel Environment Variables       (separate from Vercel!)           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why `supabase secrets`?** Edge Functions run on Supabase's infrastructure (not Vercel), so they need their own environment variables set via `supabase secrets set`. This is different from the `.env.local` / Vercel env vars used by your Next.js app.

---

### Step 1: Set up Resend (Email Provider)

1. Create account at [resend.com](https://resend.com)
2. **Verify your domain** at [resend.com/domains](https://resend.com/domains)
   - Add DNS records to your domain
   - For this tutorial: `seanchen.io` is verified, using `startup@seanchen.io`
3. Get API key from [resend.com/api-keys](https://resend.com/api-keys)
4. Add to your `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   INTERNAL_API_KEY=generate_a_random_secret_here
   ```
5. Also add these to **Vercel** → Project Settings → Environment Variables

**✅ Verification**: Go to Resend dashboard → API Keys. You should see your key listed.

---

### Step 2: Enable pg_net Extension in Supabase

Database triggers need the `pg_net` extension to make HTTP calls to Edge Functions.

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
   ```

**✅ Verification**: Go to **Database** → **Extensions** → Search "pg_net" → Should show "Enabled"

---

### Step 3: Create Email Tracking Table

This table prevents duplicate emails and tracks email history.

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run the contents of `supabase/scripts/setup/02-create-user-email-log-table.sql`

**✅ Verification**: Go to **Table Editor** → You should see `user_email_log` table

---

### Step 4: Deploy Edge Functions

Edge Functions process the trigger and call your email API.

```bash
# Install Supabase CLI
npm install -g supabase

# Login (opens browser for authentication)
supabase login

# Link to your project
# Find your project ref at: Supabase Dashboard → Project Settings → General → Reference ID
supabase link --project-ref lnznhclnbeujbicjeosk

# Set secrets for Edge Functions (these are DIFFERENT from Vercel env vars!)
supabase secrets set APP_URL=https://my-full-stack-app-iota.vercel.app
supabase secrets set RESEND_API_KEY=re_your_actual_key
supabase secrets set INTERNAL_API_KEY=your_internal_key

# Deploy the functions
supabase functions deploy send-welcome-email
supabase functions deploy send-billing-email
supabase functions deploy send-cancellation-email
```

**✅ Verification**: 
- Go to **Supabase Dashboard** → **Edge Functions**
- You should see all 3 functions listed with "Active" status
- Click on a function → Check "Logs" tab for any errors

---

### Step 5: Create Database Triggers

Triggers watch for database changes and call the Edge Functions.

1. Go to **Supabase Dashboard** → **SQL Editor**
2. **IMPORTANT**: Open `supabase/scripts/setup/03-create-public-users-trigger.sql` and replace:
   - `YOUR_SUPABASE_PROJECT_REF` → Your project reference (e.g., `lnznhclnbeujbicjeosk`)
   - `YOUR_SUPABASE_ANON_KEY` → Your anon key (find at Project Settings → API)
3. Run the modified SQL
4. Repeat for `supabase/scripts/setup/04-create-billing-cancellation-triggers.sql`

**✅ Verification**: 
- The SQL output should show "✅ Trigger Created Successfully!"
- Go to **Database** → **Triggers** → You should see the triggers listed

---

### Step 6: Test the Flow! 🎉

1. Go to your app (e.g., `http://localhost:3000`)
2. Sign up with a new account
3. Check your email inbox for the Welcome email!

**✅ Verification if something goes wrong**:
- **Supabase** → **Edge Functions** → Click function → **Logs** (see if trigger called it)
- **Vercel** → **Deployments** → **Functions** → Check `/api/email/send` logs
- **Resend** → **Emails** (see if email was sent)

---

### Preview Email Templates

Visit [http://localhost:3000/preview-email](http://localhost:3000/preview-email) to preview your email templates locally before deploying.

---

### Email Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EMAIL AUTOMATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Signs Up → Supabase Auth → public.users INSERT                        │
│                                        ↓                                     │
│                               Database Trigger                               │
│                                        ↓                                     │
│                               Edge Function                                  │
│                                        ↓                                     │
│                              /api/email/send                                 │
│                                        ↓                                     │
│                                 Resend API                                   │
│                                        ↓                                     │
│                               📧 Email Delivered                             │
│                                                                              │
│  Similarly for Billing & Cancellation emails via subscriptions table        │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Email Type | Trigger | Description |
|------------|---------|-------------|
| Welcome | User signs up | Sent when `public.users` receives an INSERT |
| Billing Confirmation | Subscription created | Sent when `subscriptions` receives an INSERT |
| Cancellation | Subscription cancelled | Sent when `subscriptions` is updated with cancelled status |

---

## 🛠️ MCP Integration Setup

### What is MCP?

MCP (Model Control Protocol) enables enhanced AI assistant capabilities for this project, allowing the AI to interact directly with your Stripe and Supabase accounts to help with debugging, configuring, and managing your application.

For a comprehensive demonstration of MCP capabilities, check out our dedicated demo repository:
- 🔗 [launch-mcp-demo](https://github.com/ShenSeanChen/launch-mcp-demo) - Collection of powerful MCP tools
- 📹 [Full YouTube Guide](https://www.youtube.com/watch?v=sfCBCyNyw7U&list=PLE9hy4A7ZTmpGq7GHf5tgGFWh2277AeDR&index=10)
- 🚀 [X Post](https://x.com/ShenSeanChen/status/1910057838032097688)

### Setting up MCP

1. Create an `mcp.json` file:
   
   Copy the example file to create your own configuration:
   
   ```bash
   cp .cursor/mcp.json.example .cursor/mcp.json
   ```

2. Configure your credentials:

   a. Stripe Integration:
      - Get your Stripe API key from the Stripe Dashboard
      - Replace `your_stripe_test_key_here` with your actual test key

   b. Supabase Integration:
      - Generate a Supabase access token from your Supabase dashboard (Project Settings > API)
      - Replace `your_supabase_access_token_here` with your actual token

   c. GitHub Integration (optional):
      - Create a GitHub Personal Access Token with appropriate permissions
      - Replace `your_github_personal_access_token_here` with your actual token

3. Example of a completed `mcp.json` file:

   ```json
   {
     "mcpServers": {
       "stripe": {
         "command": "npx",
         "args": [
           "-y", 
           "@stripe/mcp"
         ],
         "env": {
           "STRIPE_SECRET_KEY": "sk_test_51ABC123..."
         }
       },
       "supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@supabase/mcp-server-supabase@latest",
           "--access-token",
           "sbp_1234abcd5678efgh..."
         ]
       }
     }
   }
   ```

4. Using MCP with AI assistants:
   
   After configuring `mcp.json`, the AI assistant within the Cursor editor will be able to:
   - Query and manage your Stripe subscriptions
   - Interact with your Supabase database
   - Help troubleshoot integration issues
   - Provide contextual help based on your actual configuration

5. Security Considerations:
   
   - Never commit your `mcp.json` file to version control
   - Use test credentials during development
   - Limit access tokens to only the permissions needed

### Extending MCP with Additional Tools

The MCP framework can be extended with various tools beyond Stripe and Supabase. Our [launch-mcp-demo](https://github.com/ShenSeanChen/launch-mcp-demo) repository demonstrates how to integrate basic MCP examples.

To integrate these additional tools with your project:

1. Clone the demo repository:
   ```bash
   git clone https://github.com/ShenSeanChen/launch-mcp-demo.git
   ```

2. Follow the installation instructions in the repository's README

3. Update your `.cursor/mcp.json` to include the additional tools:
   ```json
   {
     "mcpServers": {
       "stripe": {
         // Your existing Stripe configuration
       },
       "supabase": {
         // Your existing Supabase configuration
       },
       "weather": {
         "command": "/path/to/your/python/environment",
         "args": [
           "--directory",
           "/path/to/launch-mcp-demo/weather",
           "run",
           "weather.py"
         ]
       },
       "files": {
         "command": "/path/to/your/python/environment",
         "args": [
           "--directory",
           "/path/to/launch-mcp-demo/files",
           "run",
           "files.py"
         ]
       }
     }
   }
   ```

4. Restart your Cursor editor to apply the changes

These additional tools can help enhance your development workflow and provide more capabilities to the AI assistant when working with your project.

## 📖 Project Structure

```
├── app/                  # Next.js 14 app directory
│   ├── api/              # API routes
│   │   ├── email/send/   # Email sending API
│   │   ├── stripe/       # Stripe payment endpoints
│   │   └── user/         # User API endpoints
│   ├── auth/             # Auth-related pages
│   │   ├── callback/     # handle auth callback
│   ├── preview-email/    # Email template preview
│   ├── dashboard/        # Dashboard pages
│   ├── pay/              # Payment pages
│   ├── profile/          # User profile pages
│   ├── reset-password/   # Reset password pages
│   ├── update-password/  # Update password pages
│   ├── verify-email/     # Verify email pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
├── contexts/             # React contexts
├── emails/               # Email templates (React Email)
│   └── templates/
├── hooks/                # Custom React hooks
├── services/             # Service layer (emailService, etc.)
├── supabase/             # Supabase configuration
│   ├── functions/        # Edge Functions
│   └── scripts/setup/    # SQL migration scripts
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── styles/               # Global styles
└── .cursor/              # Cursor editor and MCP configurations
    ├── mcp.json.example  # Example MCP configuration
    └── mcp.json          # Your custom MCP configuration (gitignored)
```

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Supabase](https://supabase.com/) - Authentication & Database
- [Stripe](https://stripe.com/) - Payments
- [Resend](https://resend.com/) - Transactional Emails
- [React Email](https://react.email/) - Email Templates
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 🔧 Configuration

### Tailwind Configuration

The template includes a custom Tailwind configuration with:
- Custom colors
- Dark mode support
- Extended theme options
- Custom animations

### Authentication

Authentication is handled through Supabase with support for:
- Email/Password
- Google OAuth
- Magic Links
- Password Reset

### Payment Integration

Stripe integration includes:
- Subscription management
- Trial periods
- Webhook handling
- Payment status tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- Tailwind CSS team for the utility-first CSS framework
- Supabase team for the backend platform
- Stripe team for the payment infrastructure
- Resend team for the email infrastructure
- Cursor team for the AI-powered editor and MCP capabilities
- Anthropic for Claude AI and Claude Desktop integration
- MCP framework developers for enabling extended AI capabilities

## 📫 Contact

X - [@ShenSeanChen](https://x.com/ShenSeanChen)

YouTube - [@SeanAIStories](https://www.youtube.com/@SeanAIStories)

Discord - [@Sean's AI Stories](https://discord.gg/TKKPzZheua)

Instagram - [@SeanAIStories](https://www.instagram.com/sean_ai_stories )

Project Link: [https://github.com/ShenSeanChen/launch-stripe-nextjs-supabase](https://github.com/ShenSeanChen/launch-stripe-nextjs-supabase)

## 🚀 Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo-name)

---

Made with 🔥 by [ShenSeanChen](https://github.com/ShenSeanChen)
