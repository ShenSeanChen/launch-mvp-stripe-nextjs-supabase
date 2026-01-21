# Next.js + Stripe + Supabase Production-Ready Template

A production-ready Next.js template featuring authentication, dark mode support, Stripe integration, and a clean, modern UI. Built with TypeScript and Tailwind CSS.

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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI Configuration (you'll need to add your key)
OPENAI_API_KEY=

# Stripe Configuration
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_
NEXT_PUBLIC_STRIPE_BUTTON_ID=buy_btn_
# STRIPE_SECRET_KEY=sk_test_
STRIPE_SECRET_KEY=sk_live_
# STRIPE_WEBHOOK_SECRET=whsec_
STRIPE_WEBHOOK_SECRET=whsec_

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
      - Anon Public Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
      - Service Role Secret → SUPABASE_SERVICE_ROLE_KEY
   
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
   
   a. Create a live account and configure:
      - Create product in Product Catalog
      - Create promotional coupon codes
      - Set up Payment Link with trial period
   
   b. Get required keys:
      - Publishable Key → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      - Secret Key → STRIPE_SECRET_KEY
      - Buy Button ID → NEXT_PUBLIC_STRIPE_BUTTON_ID
   
   c. Configure webhooks:
      - Add endpoint: your_url/api/stripe/webhook
      - Subscribe to events: customer.subscription.*, checkout.session.*, invoice.*, payment_intent.*
      - Copy Signing Secret → STRIPE_WEBHOOK_SECRET

8. Start the development server:
```bash
npm run dev
```
or
```bash
yarn dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   │   ├── stripe/       # Stripe payment endpoints
│   │   └── user/         # User API endpoints
│   ├── auth/             # Auth-related pages
│   │   ├── callback/     # handle auth callback
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
├── hooks/                # Custom React hooks
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
