## App Pages & Functionality Blueprint

### App Summary
**End Goal:** My app helps **sophisticated investors (business angels, family offices, and small VC funds)** achieve **complete portfolio visibility and actionable investment intelligence** using **AI-powered document processing and network analysis**.

**Core Value Proposition:** Save 10+ hours monthly through automated document processing while making better investment decisions through AI-powered portfolio intelligence and co-investor network analysis.

**Target Users:**
- **Primary:** Business Angels & Family Offices (€500k-€2M portfolio, 20-30 angel investments, 5-10 fund commitments)
- **Secondary:** Small VC Fund Managers (€50M-€200M AUM, 50-150 limited partners)
- **System:** Technical administrators managing platform infrastructure

**Template Type:** RAG-SaaS with premium subscription model and advanced AI document processing

---

## 🌐 Universal SaaS Foundation

### Public Marketing Pages
- **Landing Page** — `/`
  - Hero: "Complete Portfolio Intelligence for Sophisticated Investors" with professional imagery
  - Features: AI-powered document processing, 200+ data point extraction, co-investor network analysis
  - Pricing Tiers: Starter (€200), Professional (€800), Institutional (€3,000) with clear feature differentiation
  - CTA: "Start Free Trial" driving to document processing demonstration

- **Legal Pages** — `/privacy`, `/terms`, `/cookies`
  - Privacy policy, Terms of service, Cookie policy
  - Essential for GDPR compliance and financial data handling
  - Professional legal framework for investment platform

### Authentication Flow
- **Login** — `/auth/login` (Email/password, OAuth options, institutional branding)
- **Sign Up** — `/auth/sign-up` (Account creation with role selection - Investor/Fund Manager/Admin)
- **Forgot Password** — `/auth/forgot-password` (Secure password reset for financial accounts)
- **Sign Up Success** — `/auth/sign-up-success` (Professional confirmation with next steps)

---

## ⚡ Core Application Pages

### Portfolio Intelligence Hub
- **Portfolio Dashboard** — `/portfolio`
  - Real-time portfolio value display with IBM Plex Mono typography (Frontend)
  - Performance metrics (YoY, QoQ, since inception) with benchmarking (Frontend + Backend)
  - Asset allocation visualization with sector and geographic breakdown (Frontend + Backend)
  - Recent activity feed and AI-generated insights (Frontend + Backend)
  - Export portfolio reports for compliance and tax purposes (Frontend + Backend Process)

### Document Processing Center
- **Document Management** — `/documents`
  - Drag-and-drop document upload interface for PDF, Excel, Word files (Frontend)
  - Real-time processing status with confidence score indicators (Frontend + Backend)
  - Document quality validation and error reporting (Frontend + Backend Process)
  - Processing history and document management (Frontend + Backend)
  - Batch upload capabilities for multiple fund reports (Frontend + Backend)

- **Document Analysis** — `/documents/[[...documentId]]`
  - Individual document processing status and results (Frontend + Backend)
  - Extracted data validation with confidence scoring (Frontend + Backend)
  - Document quality metrics and improvement recommendations (Frontend + Backend Process)
  - Source data attribution and verification links (Frontend + Backend)

### Investment Intelligence
- **AI Intelligence Reports** — `/intelligence`
  - AI-generated investment memos based on extracted data (Frontend + Backend Process)
  - Key insights and trend analysis with source attribution (Frontend + Backend)
  - Customizable report templates for different investor types (Frontend + Backend)
  - Export intelligence reports in multiple formats (Frontend + Backend Process)
  - Historical intelligence tracking and comparison (Frontend + Backend)

- **Intelligence Reports** — `/intelligence/[[...reportId]]`
  - Detailed investment analysis and recommendations (Frontend + Backend Process)
  - Supporting data and evidence for AI-generated insights (Frontend + Backend)
  - Comparison with historical performance and benchmarks (Frontend + Backend)
  - Actionable next steps and investment recommendations (Frontend + Backend)

### Network Intelligence
- **Co-Investor Network** — `/network`
  - Co-investor network visualization with relationship strength indicators (Frontend + Backend)
  - Quality scoring for potential co-investment partners (Frontend + Backend Process)
  - Network gap analysis and introduction opportunities (Frontend + Backend)
  - Integration with professional networks (LinkedIn, etc.) (Frontend + Backend Process)
  - Network strength metrics and trend analysis (Frontend + Backend)

- **Investor Profiles** — `/network/[[...investorId]]`
  - Individual investor analysis and track record (Frontend + Backend Process)
  - Historical co-investment patterns and success rates (Frontend + Backend)
  - Network strength and relationship mapping (Frontend + Backend)
  - Introduction recommendations and outreach opportunities (Frontend + Backend)

### Risk Management
- **Risk Analytics** — `/risk`
  - Portfolio concentration risk analysis by sector, geography, and fund (Frontend + Backend)
  - Performance benchmarking against relevant indices (Frontend + Backend)
  - Risk alerts with severity levels and recommended actions (Frontend + Backend Process)
  - Stress testing and scenario analysis (Frontend + Backend Process)
  - Compliance monitoring and reporting (Frontend + Backend)

- **Risk Analysis Reports** — `/risk/[[...analysisId]]`
  - Detailed risk assessment reports with mitigation strategies (Frontend + Backend Process)
  - Historical risk tracking and trend analysis (Frontend + Backend)
  - Regulatory compliance monitoring and reporting (Frontend + Backend)
  - Risk-adjusted performance metrics and analysis (Frontend + Backend)

### Fund Performance
- **Fund Tracking** — `/funds`
  - Individual fund performance tracking and analysis (Frontend + Backend)
  - Fund comparison tools and benchmarking (Frontend + Backend)
  - Fund manager performance and track record analysis (Frontend + Backend Process)
  - Document repository for fund-specific reports (Frontend + Backend)
  - Fund news and updates aggregation (Frontend + Backend Process)

- **Fund Analysis** — `/funds/[[...fundId]]`
  - Detailed fund performance metrics and analysis (Frontend + Backend)
  - Portfolio company breakdown and performance tracking (Frontend + Backend)
  - Fund manager track record and investment style analysis (Frontend + Backend Process)
  - Historical returns and risk-adjusted performance (Frontend + Backend)

### Market Research
- **Research Hub** — `/research`
  - Market research and trend analysis based on portfolio data (Frontend + Backend Process)
  - Sector analysis and emerging opportunity identification (Frontend + Backend)
  - Competitive landscape analysis and benchmarking (Frontend + Backend)
  - Custom research reports based on user preferences (Frontend + Backend Process)
  - Research alert system for relevant market developments (Frontend + Backend)

- **Research Reports** — `/research/[[...researchId]]`
  - In-depth market analysis and investment opportunities (Frontend + Backend Process)
  - Sector-specific research and trend identification (Frontend + Backend)
  - Competitive intelligence and market positioning analysis (Frontend + Backend)
  - Actionable investment recommendations based on research (Frontend + Backend)

### User Account
- **Profile & Settings** — `/profile`
  - Unified profile dashboard with subscription tier management (Frontend + Backend)
  - Investment preferences and notification settings (Frontend + Backend)
  - Team member management and access controls (Frontend + Backend)
  - Billing management with payment provider integration (Frontend + Backend)
  - Usage analytics and subscription upgrade recommendations (Frontend + Backend)

---

## 💰 Business Model Pages

### Premium Subscription Management
- **Billing & Subscription** — `/profile/billing`
  - Subscription tier management (Starter/Professional/Institutional)
  - Payment method management and billing history
  - Usage tracking and limits by subscription tier (document processing, AI features)
  - Annual billing options with enterprise discounts
  - Custom enterprise plan configuration and support

- **Usage Analytics** — `/profile/usage`
  - Document processing usage and limits tracking
  - AI intelligence feature usage by tier
  - Network analysis access and usage metrics
  - Subscription upgrade recommendations based on usage patterns
  - Cost optimization and tier utilization analysis

---

## 👥 Admin Features (Phase 2)

### System Administration
- **Platform Configuration** — `/admin/system`
  - Platform health monitoring and performance metrics (Frontend + Backend)
  - AI processing configuration and optimization (Frontend + Backend)
  - Integration management with external data sources (Frontend + Backend)
  - Security settings and compliance monitoring (Frontend + Backend)
  - System maintenance and update management (Frontend + Backend)

### User Management
- **User Administration** — `/admin/users`
  - User account management and role assignments (Frontend + Backend)
  - Subscription tier monitoring and management (Frontend + Backend)
  - Usage analytics and behavior tracking (Frontend + Backend)
  - Support ticket management and user communication (Frontend + Backend)
  - Compliance monitoring and reporting (Frontend + Backend)

### AI Configuration
- **AI System Management** — `/admin/ai`
  - AI model configuration and optimization settings (Frontend + Backend)
  - Processing limits and cost management by subscription tier (Frontend + Backend)
  - Quality control settings and confidence score thresholds (Frontend + Backend)
  - Extraction accuracy monitoring and improvement (Frontend + Backend Process)
  - Custom AI training for specific investment strategies (Frontend + Backend Process)

### Business Analytics
- **Platform Analytics** — `/admin/analytics`
  - Platform usage metrics and user engagement analytics (Frontend + Backend)
  - Revenue tracking and subscription analysis (Frontend + Backend)
  - Feature usage analysis and optimization recommendations (Frontend + Backend)
  - Customer acquisition and retention analytics (Frontend + Backend)
  - Business intelligence and growth opportunity identification (Frontend + Backend Process)

---

## 📱 Navigation Structure

### Main Sidebar (Responsive)
- **Portfolio** - Central portfolio overview and performance metrics
- **Documents** - Upload and processing center for fund reports
- **Intelligence** - AI-generated insights and strategic analysis
- **Network** - Co-investor relationships and network intelligence
- **Risk** - Portfolio risk assessment and alerts
- **Funds** - Individual fund performance and analysis
- **Research** - Market research and trend intelligence
- **Profile** - Account, subscription, and billing management

### Role-Based Access Control
- **All Users**: Portfolio, Documents, Intelligence, Network, Risk, Funds, Research, Profile
- **System Admin Only**: System (admin/system), Users (admin/users), AI Configuration (admin/ai), Analytics (admin/analytics)

### Mobile Navigation
- Collapsible sidebar with hamburger menu for professional mobile experience
- Top navigation bar with key portfolio metrics summary
- Touch-optimized document upload interface
- Quick access to critical portfolio alerts and notifications
- Essential features prioritized for mobile investment workflows

---

## 🔧 Next.js App Router Structure

### Layout Groups
```
app/
├── (public)/          # Marketing and legal pages
├── (auth)/             # Authentication flow
├── (protected)/        # Main authenticated investment platform
├── (admin)/            # Admin-only investment platform management
└── api/                # Backend endpoints for external services
```

### Complete Route Mapping
**🌐 Public Routes**
- `/` → Landing page with investment intelligence value proposition
- `/privacy` → Privacy policy for financial data handling
- `/terms` → Terms of service for investment platform
- `/cookies` → Cookie policy for GDPR compliance

**🔐 Auth Routes**
- `/auth/login` → Professional user login with institutional options
- `/auth/sign-up` → User registration with role selection
- `/auth/forgot-password` → Secure password reset for financial accounts
- `/auth/sign-up-success` → Professional confirmation with next steps

**🛡️ Protected Routes**
- `/portfolio` → Central portfolio dashboard with performance metrics
- `/documents` → Document upload and processing center
- `/documents/[[...documentId]]` → Individual document analysis and processing status
- `/intelligence` → AI-generated insights and investment recommendations
- `/intelligence/[[...reportId]]` → Specific intelligence reports and analysis
- `/network` → Co-investor network analysis and relationship mapping
- `/network/[[...investorId]]` → Individual investor profiles and network analysis
- `/risk` → Portfolio risk assessment and management
- `/risk/[[...analysisId]]` → Specific risk analysis reports
- `/funds` → Fund performance tracking and comparison
- `/funds/[[...fundId]]` → Individual fund detailed analysis
- `/research` → Market research and investment opportunity analysis
- `/research/[[...researchId]]` → Specific research reports and findings
- `/profile` → Unified profile, subscription, and billing management

**👑 Admin Routes (Role-Based Access)**
- `/admin/system` → Platform configuration and performance monitoring
- `/admin/users` → User management and subscription oversight
- `/admin/ai` → AI processing configuration and optimization
- `/admin/analytics` → Platform business analytics and insights

**🔧 Backend Architecture**

**API Endpoints (External Communication Only)**
- `/api/payments/stripe/webhook` → Stripe payment webhooks for subscription management
- `/api/data/[financial-provider]/route.ts` → Communication with external financial data services
- `/api/documents/ocr/process` → External OCR service integration for document processing

**Server Actions (Internal Investment Intelligence)**
- `app/actions/portfolio.ts` → Portfolio analysis and performance calculations
- `app/actions/documents.ts` → Document upload, processing, and validation
- `app/actions/intelligence.ts` → AI-powered investment analysis and insights
- `app/actions/network.ts` → Co-investor network analysis and relationship mapping
- `app/actions/risks.ts` → Risk assessment and alert generation
- `app/actions/funds.ts` → Fund performance tracking and benchmarking
- `app/actions/research.ts` → Market research and trend analysis
- `app/actions/users.ts` → User management and subscription handling
- `app/actions/admin.ts` → System administration and configuration

**Lib Queries (Database & Investment Business Logic)**
- `lib/queries/portfolio.ts` → Portfolio data queries and aggregation
- `lib/queries/documents.ts` → Document storage and retrieval operations
- `lib/queries/intelligence.ts` → AI-generated insights storage and analysis
- `lib/queries/network.ts` → Co-investor network data and relationships
- `lib/queries/risks.ts` → Risk assessment data and calculations
- `lib/queries/funds.ts` → Fund performance data and benchmarking
- `lib/queries/research.ts` → Market research data and analysis
- `lib/queries/users.ts` → User data and subscription management
- `lib/queries/admin.ts` → System administration data and analytics

**Architecture Flow**
- Frontend → Server Actions → Lib Queries → Database (Internal Investment Intelligence)
- Frontend → `/api/[service]` → External Financial Services (External Data Integration)
- External Services → `/api/webhooks/[service]` → Server Actions → Lib Queries (Payment & Data Webhooks)

---

## 🎯 MVP Functionality Summary

This blueprint delivers your core value proposition: **Complete portfolio visibility and actionable investment intelligence through AI-powered document processing**

**Phase 1 (Launch Ready):**
- Universal SaaS foundation with professional authentication and legal compliance
- Core AI-powered document processing with 200+ field extraction
- Portfolio intelligence dashboard with real-time performance metrics
- Co-investor network analysis and relationship mapping
- Risk management and compliance monitoring
- Tiered subscription model with Stripe integration
- Role-based access control for different user types
- Mobile-responsive design for investment professionals

**Phase 2 (Growth Features):**
- Advanced admin features for platform management
- Custom AI agent training for specific investment strategies
- Enterprise plan customization and dedicated support
- Advanced business analytics and growth intelligence
- API access for institutional integrations
- White-label options for large investment firms

> **Next Step:** Ready for Scandinavian wireframe design with this concrete investment intelligence blueprint