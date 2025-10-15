## App Pages & Functionality Blueprint

### App Summary

**End Goal:** Help Business Angels and LPs managing complex investment portfolios achieve automated investment intelligence with personal return optimization using Europe's exclusive investment intelligence network
**Core Value Proposition:** Transform €50k-€200k annual productivity losses into profitable investment insights through comprehensive data extraction and co-investor intelligence used by Europe's top 1% of investors
**Target Users:** Senior executives and entrepreneurs with €500k-€2M annual investment capacity managing 20-30 angel investments and 5-10 fund commitments, plus sophisticated co-investors seeking network intelligence
**Template Type:** adk-agent-saas (premium SaaS with AI intelligence network and qualification-based access)

### UI/UX Design Principles - Scandinavian Minimalism

**Semantic Text-Driven Interface:**

- All navigation and actionable UI controls use clear, meaningful text labels instead of icons
- Financial data (IRR, MOIC, portfolio values) rendered with Inter font + tabular numerals for perfect alignment
- Ultra-sparse color palette - accent colors reserved only for critical focus states and error/success cues
- Visual hierarchy achieved through typography size, weight, and semantic naming rather than colored boxes

**Financial Data Standards:**

- ALL numerical data must use Inter with tabular numerals enabled for effortless scannability
- Monospaced presentation mandatory for portfolio values, percentages, and performance metrics
- Text content accessible with clear contrast, no jargon, graceful expansion for longer text

**Accessibility & Usability:**

- Interfaces feel calm, trustworthy, and effortless following Scandinavian ethos
- Real user testing ensures text-driven navigation never impedes core workflows
- Responsive adaptation through semantic scale, not visual ornamentation

---

## 🌐 Universal SaaS Foundation

### Public Marketing Pages

- **Landing Page** — `/`

  - Hero section highlighting the transformation from €50k-€200k productivity losses to profitable investment intelligence
  - Feature highlights showcasing comprehensive data extraction (200+ fields) and Europe's exclusive investor network
  - Personal returns calculator demonstrating actual vs perceived performance
  - Co-investor intelligence network preview showing quality scoring and track record analysis
  - Qualification-based pricing tiers (Starter €200/month, Professional €800/month, Institutional €3,000/month)
  - CTA emphasizing "Join Europe's Top 1% of Investors" and intelligence network access

- **Legal Pages** — `/privacy`, `/terms`, `/cookies`
  - Privacy policy covering AI data processing and financial information handling
  - Terms of service for VC portfolio management platform
  - Cookie policy for GDPR compliance and SaaS operations

### Authentication Flow

- **Login** — `/auth/login` (Email/password, OAuth options)
- **Sign Up** — `/auth/sign-up` (Account creation with portfolio size selection)
- **Forgot Password** — `/auth/forgot-password` (Password reset flow)
- **Sign Up Success** — `/auth/sign-up-success` (Confirmation page with onboarding preview)

---

## ⚡ Core Application Pages

### Portfolio Intelligence Dashboard

- **Intelligence Dashboard** — `/dashboard`
  - Real-time personal returns overview revealing actual vs perceived investment performance
  - Comprehensive data extraction results with 95%+ accuracy across 200+ critical fields
  - Personal ownership calculations and commitment tracking across all investment vehicles
  - Portfolio optimization recommendations based on co-investor intelligence and market analysis
  - European investor network insights and deal flow intelligence
  - Quick access to personal returns calculator and intelligence network features

### Investment Management

- **Investments Overview** — `/investments`

  - Comprehensive list of all angel investments and fund commitments
  - Real-time performance tracking with automated updates from fund reports
  - Investment details with ownership percentages and actual returns
  - Export capabilities for portfolio analysis and reporting
  - Integration with external data sources for market intelligence

- **Fund Reports** — `/fund-reports`
  - Upload interface for 10+ different fund report formats (PDF, email attachments)
  - AI-powered document processing pipeline with 95%+ accuracy
  - Automated extraction of key metrics and performance data
  - Historical tracking of fund performance and distributions
  - Alert system for new fund reports and critical updates

### Co-investor Network

- **Co-investors** — `/co-investors`
  - Network of trusted co-investors for deal syndication
  - Track record analysis and quality assessment of co-investors
  - Deal sharing and opportunity matching system
  - Syndicate formation tools with commitment tracking
  - Communication history and collaboration features

### Advanced Analytics

- **Analytics** — `/analytics`
  - Portfolio performance benchmarking against market indices
  - Sector analysis and concentration risk assessment
  - Comparative analysis between personal investments and fund commitments
  - Predictive insights for portfolio optimization
  - Custom reporting and export functionality

### User Account

- **Profile & Settings** — `/profile`
  - Account management and portfolio preferences
  - Notification settings for fund reports and insights
  - API access management for integrations
  - Data export and backup options

---

## 💰 Business Model Pages

### Billing & Subscription

- **Intelligence Access Management** — `/profile/billing`
  - Qualification-based subscription tiers with progressive intelligence unlock
  - Usage tracking for comprehensive data extraction and network intelligence
  - Billing history and invoice management with value-based pricing
  - Payment method management and updates
  - Progressive upgrade path: Starter (€200/month) → Professional (€800/month) → Institutional (€3,000/month)

---

## 👥 Admin Features (Phase 2)

### Admin Section

- **Admin Dashboard** — `/admin/dashboard`

  - System-wide analytics and usage metrics
  - User management and role administration
  - Feature usage monitoring and optimization
  - System configuration and settings

- **User Management** — `/admin/users`

  - User account oversight and support
  - Role-based access control management
  - Usage monitoring and feature access
  - Account suspension and reactivation

- **System Analytics** — `/admin/analytics`

  - Platform-wide performance metrics
  - AI model accuracy and processing statistics
  - Feature adoption and usage patterns
  - Revenue and subscription analytics

- **Content Management** — `/admin/content`
  - Fund report format configurations
  - AI model updates and improvements
  - Help documentation and user guides
  - Announcement and notification management

---

## 📱 Navigation Structure

### Main Sidebar (Responsive)

- **Investment Intelligence** (Dashboard, Personal Returns, Portfolio Optimization, Market Intelligence)
- **Network Intelligence** (Co-investor Analysis, Deal Intelligence, Syndicate Formation)
- **Intelligence Access** (Profile, Billing, API Access, Network Preferences)
- **Intelligence Community** (Documentation, Network Support, Feature Intelligence)
- **Admin Intelligence** (Network Analytics, User Intelligence, System Intelligence) - Admin users only

### Mobile Navigation

- Collapsible sidebar with touch-optimized interface
- Essential portfolio tracking features prioritized
- Quick access to fund report uploads
- Streamlined co-investor communication tools

---

## 🔧 Next.js App Router Structure

### Layout Groups

```
app/
├── (public)/          # Marketing and legal pages
├── (auth)/             # Authentication flow
├── (protected)/        # Main authenticated app
└── api/                # Backend endpoints
```

### Complete Route Mapping

**🌐 Public Routes**

- `/` → Landing page with VC portfolio intelligence value proposition
- `/privacy` → Privacy policy for AI-powered financial data processing
- `/terms` → Terms of service for VC portfolio management platform
- `/cookies` → Cookie policy for GDPR compliance

**🔐 Auth Routes**

- `/auth/login` → User login with portfolio size context
- `/auth/sign-up` → User registration with investment capacity selection
- `/auth/forgot-password` → Password reset flow
- `/auth/sign-up-success` → Registration confirmation with preview

**🛡️ Protected Routes**

- `/dashboard` → Investment intelligence overview and personal returns revelation
- `/personal-returns` → Personal returns calculator and actual vs perceived performance
- `/portfolio-optimization` → Portfolio intelligence and optimization recommendations
- `/network-intelligence` → Co-investor intelligence and deal flow analysis
- `/market-intelligence` → European market intelligence and benchmarking
- `/intelligence-access` → Intelligence network access and billing management
- `/intelligence-access/billing` → Qualification-based subscription and intelligence tier management

**👑 Admin Routes (Role-Based Access)**

- `/admin/dashboard` → System-wide analytics and monitoring
- `/admin/users` → User management and account oversight
- `/admin/analytics` → Platform performance and usage metrics
- `/admin/content` → Content and configuration management

**🔧 Backend Architecture**

**API Endpoints (External Communication Only)**

- `/api/fund-providers/route.ts` → Integration with fund management platforms
- `/api/market-data/route.ts` → External market intelligence and benchmarking
- `/api/webhooks/stripe/route.ts` → Stripe payment provider webhooks
- `/api/webhooks/fund-reports/route.ts` → Automated fund report notifications

**Server Actions (Internal App Functionality)**

- `app/actions/portfolio.ts` → Portfolio calculations and analytics
- `app/actions/fund-reports.ts` → Document processing and AI analysis
- `app/actions/co-investors.ts` → Network matching and syndication
- `app/actions/billing.ts` → Subscription and payment management
- `app/actions/admin.ts` → System administration and user management

**Lib Queries (Database & Business Logic)**

- `lib/queries/portfolio.ts` → Portfolio data access and calculations
- `lib/queries/investments.ts` → Investment tracking and performance
- `lib/queries/fund-reports.ts` → Document processing and storage
- `lib/queries/co-investors.ts` → Network and relationship management
- `lib/queries/analytics.ts` → Analytics and reporting data
- `lib/queries/billing.ts` → Subscription and usage tracking

**Architecture Flow**

- Frontend → Server Actions → Lib Queries → Database (Internal)
- Frontend → `/api/[service]` → External Services (Market data, fund providers)
- External Services → `/api/webhooks/[service]` → Server Actions → Lib Queries (Webhooks)

---

## 🎯 MVP Functionality Summary

This blueprint delivers your strategic value proposition: **Transform €50k-€200k annual productivity losses into profitable investment intelligence through Europe's exclusive investment intelligence network**

**Phase 1 (Launch Ready):**

- Universal SaaS foundation with qualification-based access (auth, legal, responsive design)
- Core investment intelligence functionality revealing personal returns vs perceived performance
- Comprehensive data extraction pipeline with 95%+ accuracy across 200+ critical fields
- Personal returns dashboard with actual vs fund-level performance tracking
- Co-investor intelligence network with quality scoring and deal flow analysis
- Progressive intelligence access with tiered pricing (€200-€3,000/month)
- Intelligence network features with European market focus
- Qualification-based subscription management with network effect pricing

**Phase 2 (Intelligence Network Growth):**

- Advanced market intelligence and European sector benchmarking
- Enhanced AI capabilities for predictive investment optimization
- Expanded network intelligence with co-investor track record analysis
- Advanced institutional features for exclusive network access
- Intelligence network API for European investor ecosystem
- Mobile intelligence access for on-the-go investment decisions

> **Next Step:** Ready for wireframe design with this concrete blueprint
