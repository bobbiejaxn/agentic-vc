# Fund Performance Dashboard for Business Angel + LP Hybrid Investors

## 1. Task Overview

### Task Title

Fund Performance Dashboard - LP Portfolio Analytics for Mario's Daily Workflow

### Goal Statement

Create a comprehensive fund performance dashboard that enables Business Angel + LP hybrid investors like Mario to track their fund investments, personal returns, and capital commitments in a unified interface, transforming 20+ hours of manual quarterly report processing into a 5-minute daily portfolio overview.

---

## 2. Strategic Analysis & Solution Options

### Problem Context

Mario needs to track 8+ fund investments as an LP, but currently receives fragmented quarterly reports in various formats. He needs to understand:

- Fund-level performance (MOIC, TVPI, DPI, IRR)
- Personal ownership percentages and returns
- Capital call schedules and distributions
- Fund health indicators and vintage year analysis
- How fund performance compares to his angel investments

Multiple viable approaches exist for fund performance visualization, each with different trade-offs for data accuracy, real-time updates, and complexity.

### Solution Options Analysis

#### Option 1: Manual Upload + AI Processing (Recommended)

**Approach:** Create fund report upload interface with AI-powered extraction and personal ownership calculation

**Pros:**

- ✅ **Accurate Personal Returns** - Calculates Mario's actual share based on ownership percentage
- ✅ **Flexible Report Formats** - Handles different fund reporting styles (quarterly reports, capital account statements)
- ✅ **Real-Time Updates** - Process new reports immediately when received
- ✅ **Cost Effective** - No ongoing API integrations needed

**Cons:**

- ❌ **Manual Upload Required** - Mario needs to upload reports when received
- ❌ **Processing Delay** - 2-5 minutes for AI extraction vs. real-time API data
- ❌ **Setup Overhead** - Requires initial data entry for fund ownership and vintage years

**Implementation Complexity:** **High** - Requires AI document processing, ownership tracking, and fund relationship mapping
**Risk Level:** **Medium** - AI extraction accuracy needs validation, fund data structure variations

#### Option 2: API Integration with Major Fund Platforms

**Approach:** Integrate directly with fund portal APIs for real-time data sync

**Pros:**

- ✅ **Real-Time Data** - Automatic updates when fund portals update
- ✅ **Zero Manual Work** - No upload or processing required
- ✅ **Complete Data Coverage** - Access all fund metrics and transactions

**Cons:**

- ❌ **Limited Platform Support** - Most VC funds don't have modern APIs
- ❌ **Integration Complexity** - Each fund platform has different API structures
- ❌ **Privacy Concerns** - Requires sharing fund portal credentials
- ❌ **High Setup Cost** - Significant development time for each integration

**Implementation Complexity:** **Very High** - Requires individual API integrations, OAuth flows, and platform-specific adapters
**Risk Level:** **High** - API changes break integrations, limited platform coverage

#### Option 3: Fund Manager Data Entry Portal

**Approach:** Create a portal where fund managers can enter performance data directly

**Pros:**

- ✅ **High Data Quality** - Fund managers provide authoritative data
- ✅ **Structured Input** - Standardized form fields ensure consistency
- ✅ **Real-Time Updates** - Immediate availability when managers update

**Cons:**

- ❌ **Adoption Barrier** - Fund managers need to learn and use new system
- ❌ **Incomplete Coverage** - Not all fund managers will participate
- ❌ **Data Entry Burden** - Additional work for already busy fund managers
- ❌ **Verification Issues** - Need to validate manager-entered data

**Implementation Complexity:** **Medium** - Form interfaces, manager onboarding, data validation workflows
**Risk Level:** **Medium** - Depends on fund manager adoption rate and data accuracy

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Manual Upload + AI Processing

**Why this is the best choice:**

1. **Practical Implementation** - Works with current fund reporting practices without requiring platform changes
2. **Mario's Current Workflow** - Aligns with how he currently receives and processes fund reports
3. **Scalable Solution** - Can handle any fund format through AI processing, not limited by API availability
4. **Personal Focus** - Designed specifically for individual LP ownership calculations, not generic fund data

**Key Decision Factors:**

- **Performance Impact:** 2-5 minute processing delay is acceptable for quarterly updates
- **User Experience:** Simple upload interface fits Mario's current workflow
- **Maintainability:** AI processing adapts to new fund report formats automatically
- **Scalability:** Can handle Mario's 8+ fund relationships without integration limits
- **Security:** No external API access needed, data stays local

**Alternative Consideration:**
Option 2 would be preferred if major fund platforms had consistent APIs, but current API availability is too fragmented for reliable implementation.

---

## 3. Project Analysis & Current State

### Technology & Architecture

- **Frameworks & Versions:** Next.js 15.3, React 19, TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM for fund data persistence
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling and theming
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations

### Current State

The current V2Dashboard focuses on angel portfolio companies but lacks fund-level LP tracking. Fund data exists in quarterly reports but isn't structured in the database. The existing chart infrastructure (SectorDistributionChart, InvestmentStageChart, RiskReturnQuadrantChart) provides a foundation for fund performance visualization.

### Existing Context Providers Analysis

- **UserContext (`useUser()`):** Available throughout protected routes - provides user profile and authentication state
- **UsageContext (`useUsage()`):** Available in protected routes - handles subscription/billing data
- **Context Hierarchy:** Both providers available in protected route layouts
- **Available Context Hooks:** `useUser()`, `useUsage()` - fund data not currently in context

**🔍 Context Coverage Analysis:**

- Fund performance data will need new context provider for LP portfolio state
- No existing fund-related data in current contexts
- Components will need to fetch fund data via Server Components initially
- Future optimization could add FundContext for frequently accessed fund data

---

## 4. Context & Problem Definition

### Problem Statement

Mario, as a Business Angel + LP hybrid investor, needs to track his 8+ fund investments alongside his 25+ angel investments in a unified dashboard. Currently, he spends 20+ hours monthly processing fragmented quarterly reports from different funds, calculating his personal ownership percentages, and understanding fund performance relative to his angel investments. The current platform only tracks angel investments, creating a fragmented view of his total portfolio and preventing optimal investment decision-making.

### Success Criteria

- [ ] Mario can upload fund quarterly reports and capital account statements
- [ ] AI automatically extracts key performance metrics (MOIC, TVPI, DPI, IRR)
- [ ] Personal ownership percentages are calculated and tracked over time
- [ ] Fund performance is visualized alongside angel investments in unified dashboard
- [ ] Capital calls and distributions are tracked with cash flow forecasting
- [ ] Fund health indicators (vintage year, commitment status) are displayed
- [ ] Processing time reduced from 20+ hours to under 5 minutes per report

---

## 5. Development Mode Context

### Development Mode Context

- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Data loss acceptable** - existing data can be wiped/migrated aggressively
- **Users are developers/testers** - not production users requiring careful migration
- **Priority: Speed and simplicity** over data preservation
- **Aggressive refactoring allowed** - delete/recreate components as needed

---

## 6. Technical Requirements

### Functional Requirements

- [ ] Fund report upload interface supporting PDF and Excel formats
- [ ] AI-powered extraction of performance metrics from fund reports
- [ ] Personal ownership percentage tracking and calculation
- [ ] Fund performance visualization with comparative charts
- [ ] Capital call and distribution tracking with forecasting
- [ ] Fund health indicators and vintage year analysis
- [ ] Integration with existing angel portfolio dashboard

### Non-Functional Requirements

- **Performance:** Report processing completes in under 5 minutes, dashboard loads in under 2 seconds
- **Security:** Fund documents encrypted at rest, access controlled by user authentication
- **Usability:** Simple drag-and-drop upload interface, clear progress indicators
- **Responsive Design:** Works on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Supports both light and dark mode using existing theme system
- **Compatibility:** Modern browsers with PDF/Excel support

### Technical Constraints

- [ ] Must use existing Supabase database and Drizzle ORM
- [ ] Must integrate with current authentication system
- [ ] Must follow established shadcn/ui design patterns
- [ ] Must use existing chart infrastructure (Recharts) for consistency

---

## 7. Data & Database Changes

### Database Schema Changes

```sql
-- Add fund-related tables for LP portfolio tracking
CREATE TABLE IF NOT EXISTS funds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fund_name text NOT NULL,
  fund_manager text NOT NULL,
  vintage_year integer NOT NULL,
  commitment_amount decimal(15,2) NOT NULL,
  fund_size decimal(15,2),
  currency text DEFAULT 'EUR',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fund_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('quarterly_report', 'capital_account_statement', 'annual_report')),
  report_date date NOT NULL,
  report_period text, -- e.g., "Q1 2025", "2024"
  file_path text,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fund_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  report_id uuid REFERENCES fund_reports(id) ON DELETE SET NULL,
  as_of_date date NOT NULL,
  nav decimal(15,2) NOT NULL,
  moic decimal(5,3),
  tvpi decimal(5,3),
  dpi decimal(5,3),
  rvpi decimal(5,3),
  gross_irr decimal(6,4),
  net_irr decimal(6,4),
  pic_ratio decimal(5,3),
  distributions decimal(15,2),
  capital_calls decimal(15,2),
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_funds_user_id ON funds(user_id);
CREATE INDEX IF NOT EXISTS idx_fund_reports_fund_id ON fund_reports(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_reports_processing_status ON fund_reports(processing_status);
CREATE INDEX IF NOT EXISTS idx_fund_performance_fund_id ON fund_performance(fund_id);
CREATE INDEX IF NOT EXISTS idx_fund_performance_date ON fund_performance(as_of_date);
```

### Data Model Updates

```typescript
// Fund data types
export interface Fund {
  id: string;
  userId: string;
  fundName: string;
  fundManager: string;
  vintageYear: number;
  commitmentAmount: number;
  fundSize?: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundReport {
  id: string;
  fundId: string;
  reportType:
    | "quarterly_report"
    | "capital_account_statement"
    | "annual_report";
  reportDate: string;
  reportPeriod?: string;
  filePath?: string;
  processingStatus: "pending" | "processing" | "completed" | "failed";
  extractedData?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundPerformance {
  id: string;
  fundId: string;
  reportId?: string;
  asOfDate: string;
  nav: number;
  moic?: number;
  tvpi?: number;
  dpi?: number;
  rvpi?: number;
  grossIrr?: number;
  netIrr?: number;
  picRatio?: number;
  distributions: number;
  capitalCalls: number;
  createdAt: Date;
}
```

### Data Migration Plan

- [ ] Create fund and fund_reports tables with proper indexes
- [ ] Create fund_performance table for time-series data
- [ ] Add foreign key constraints and cascade deletes
- [ ] Migrate existing fund-related data if any exists
- [ ] Validate data integrity after migration

### 🚨 MANDATORY: Down Migration Safety Protocol

**CRITICAL REQUIREMENT:** Before running ANY database migration, you MUST create the corresponding down migration file following the `drizzle_down_migration.md` template process:

- [ ] **Step 1: Generate Migration** - Run `npm run db:generate` to create the migration file
- [ ] **Step 2: Create Down Migration** - Follow `drizzle_down_migration.md` template to analyze the migration and create the rollback file
- [ ] **Step 3: Create Subdirectory** - Create `drizzle/migrations/[timestamp_name]/` directory
- [ ] **Step 4: Generate down.sql** - Create the `down.sql` file with safe rollback operations
- [ ] **Step 5: Verify Safety** - Ensure all operations use `IF EXISTS` and include appropriate warnings
- [ ] **Step 6: Apply Migration** - Only after down migration is created, run `npm run db:migrate`

**🛑 NEVER run `npm run db:migrate` without first creating the down migration file!**

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Server Actions)** → `app/actions/[feature].ts`

- [ ] **Server Actions File** - `app/actions/funds.ts` - ONLY mutations (create fund, upload report, update ownership)
- [ ] Examples: `createFund()`, `uploadFundReport()`, `updateFundOwnership()`
- [ ] Must use `'use server'` directive and `revalidatePath()` after mutations
- [ ] **What qualifies as mutations**: POST, PUT, DELETE operations, form submissions, data modifications

#### **QUERIES (Data Fetching)** → Choose based on complexity:

**Simple Queries** → Direct in Server Components

- [ ] **Direct in Page Components** - Simple `await db.select().from(table)` calls
- [ ] Example: `const funds = await db.select().from(funds).where(eq(funds.userId, userId))`
- [ ] Use when: Single table, simple WHERE clause, used in only 1-2 places

**Complex Queries** → `lib/[feature].ts`

- [ ] **Query Functions in lib/** - `lib/funds.ts` for complex/reused queries
- [ ] Example: `lib/funds.ts` with `getFundPerformanceHistory()`
- [ ] Use when: JOINs, aggregations, complex logic, used in 3+ places, needs efficient lookups
- [ ] **What qualifies as complex queries**: Fund performance time-series, ownership calculations, cross-fund analytics

#### **API Routes** → `app/api/[endpoint]/route.ts` - **RARELY NEEDED**

🛑 **Only create API routes for these specific cases:**

- [ ] **Webhooks** - Third-party service callbacks (fund portal APIs if available)
- [ ] **Non-HTML Responses** - File downloads, CSV exports of fund data
- [ ] **External API Proxies** - When fund portals require API key hiding from client

❌ **DO NOT use API routes for:**

- [ ] ❌ Internal fund data fetching (use lib/ functions instead)
- [ ] ❌ Report processing (use Server Actions instead)
- [ ] ❌ Fund CRUD operations (use Server Actions instead)

#### **PROFESSIONAL NAMING (Directory-Based Separation):**

- `app/actions/funds.ts` - For fund mutations only (directory context is clear)
- `lib/funds.ts` - For complex fund queries and data fetching
- No API route needed for internal fund operations

### Server Actions

<!-- New or modified server actions for mutations -->

- [ ] **`createFund`** - Create new fund with basic information and ownership percentage
- [ ] **`uploadFundReport`** - Handle file upload and trigger AI processing
- [ ] **`updateFundOwnership`** - Update personal ownership percentage for existing fund
- [ ] **`deleteFund`** - Remove fund and all associated reports/performance data

### Database Queries

<!-- How you'll fetch data - be explicit about the choice -->

- [ ] **Direct in Server Components** - Simple fund list queries for dashboard display
- [ ] **Query Functions in lib/funds.ts** - Complex fund performance calculations and time-series data

---

## 9. Frontend Changes

### New Components

<!-- Components to create in components/ directory, organized by feature -->

- [ ] **`components/funds/FundList.tsx`** - Display list of user's funds with key metrics
- [ ] **`components/funds/FundCard.tsx`** - Individual fund card with performance summary
- [ ] **`components/funds/FundReportUploader.tsx`** - Drag-and-drop interface for fund reports
- [ ] **`components/funds/FundPerformanceChart.tsx`** - Time-series performance visualization
- [ ] **`components/funds/CapitalFlowChart.tsx`** - Capital calls and distributions over time

**Component Organization Pattern:**

- Use `components/funds/` directory for fund-specific components
- Keep shared/reusable components in `components/ui/` (existing pattern)
- Import into pages from the global components directory

**Component Requirements:**

- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation

### Page Updates

<!-- Pages that need changes -->

- [ ] **`/dashboard`** - Integrate fund performance section into main dashboard
- [ ] **`/funds`** - New dedicated funds page for detailed LP portfolio management
- [ ] **`/funds/[fundId]`** - Individual fund detail page with performance history

### State Management

<!-- How data flows through the app -->

- [ ] Fund data will be fetched via Server Components initially
- [ ] Future optimization could add FundContext for frequently accessed fund data
- [ ] No existing context conflicts - fund data is new to the application

---

## 10. Code Changes Overview

### 🚨 MANDATORY: Always Show High-Level Code Changes Before Implementation

**AI Agent Instructions:** Before presenting the task document for approval, you MUST provide a clear overview of the code changes you're about to make. This helps the user understand exactly what will be modified without having to approve first.

**Requirements:**

- [ ] **Always include this section** for any task that modifies existing code
- [ ] **Show actual code snippets** with before/after comparisons
- [ ] **Focus on key changes** - don't show every line, but show enough to understand the transformation
- [ ] **Use file paths and line counts** to give context about scope of changes
- [ ] **Explain the impact** of each major change

#### 📂 **Current Implementation (Before)**

```typescript
// V2Dashboard currently only shows angel portfolio data
export default function V2Dashboard() {
  // Only angel company data
  const companies = portfolioCompanies?.companies || [];

  return (
    <div>
      {/* Only angel portfolio sections */}
      <PortfolioHealthDashboard metrics={calculatePortfolioHealth(companies)} />
      <RiskReturnQuadrantChart data={processQuadrantData(companies)} />
      {/* No fund data integration */}
    </div>
  );
}
```

#### 📂 **After Refactor**

```typescript
// V2Dashboard will integrate both angel and fund data
export default function V2Dashboard() {
  // Angel company data (existing)
  const companies = portfolioCompanies?.companies || [];

  // NEW: Fund data integration
  const funds = await getUserFunds();
  const fundMetrics = calculateFundMetrics(funds);

  return (
    <div>
      {/* Combined portfolio overview */}
      <CombinedPortfolioOverview
        angelData={companies}
        fundData={funds}
        totalPortfolioValue={angelValue + fundNAV}
      />

      {/* Angel portfolio sections (existing) */}
      <PortfolioHealthDashboard metrics={calculatePortfolioHealth(companies)} />
      <RiskReturnQuadrantChart data={processQuadrantData(companies)} />

      {/* NEW: Fund performance sections */}
      <FundPerformanceDashboard funds={funds} />
      <CapitalFlowDashboard fundData={fundMetrics} />
    </div>
  );
}
```

#### 🎯 **Key Changes Summary**

- [ ] **Database Schema:** Add `funds`, `fund_reports`, `fund_performance` tables with proper relationships
- [ ] **Backend Integration:** Create fund data queries and Server Actions for fund management
- [ ] **Frontend Components:** Build fund-specific components following existing patterns
- [ ] **Dashboard Integration:** Combine angel and fund data in unified portfolio view
- [ ] **Files Modified:** 15-20 files across database, backend, and frontend layers
- [ ] **Impact:** Adds complete LP portfolio tracking alongside existing angel investment features

---

## 11. Implementation Plan

### Phase 1: Database Foundation

**Goal:** Establish fund data storage with proper schema and migration safety

- [ ] **Task 1.1:** Create Database Migration
  - Files: `lib/drizzle/schema/funds.ts`, `lib/drizzle/schema/fund-reports.ts`, `lib/drizzle/schema/fund-performance.ts`
  - Details: Define tables, indexes, and relationships for fund tracking
- [ ] **Task 1.2:** Create Down Migration (MANDATORY)
  - Files: `drizzle/migrations/[timestamp]/down.sql`
  - Details: Follow `drizzle_down_migration.md` template for safe rollback
- [ ] **Task 1.3:** Apply Migration
  - Command: `npm run db:migrate` (only after down migration created)

### Phase 2: Backend Infrastructure

**Goal:** Implement fund data access and management functionality

- [ ] **Task 2.1:** Create Fund Query Functions
  - Files: `lib/funds.ts`
  - Details: Complex queries for fund performance, ownership calculations, time-series data
- [ ] **Task 2.2:** Create Fund Server Actions
  - Files: `app/actions/funds.ts`
  - Details: Mutations for fund creation, report upload, ownership updates
- [ ] **Task 2.3:** Implement AI Report Processing
  - Files: `lib/fund-report-processor.ts`
  - Details: AI extraction of performance metrics from uploaded fund reports

### Phase 3: Frontend Components

**Goal:** Build fund-specific UI components following existing patterns

- [ ] **Task 3.1:** Create Fund Management Components
  - Files: `components/funds/FundList.tsx`, `components/funds/FundCard.tsx`
  - Details: Display fund information with performance metrics
- [ ] **Task 3.2:** Create Report Upload Interface
  - Files: `components/funds/FundReportUploader.tsx`
  - Details: Drag-and-drop interface for fund report processing
- [ ] **Task 3.3:** Create Fund Analytics Components
  - Files: `components/funds/FundPerformanceChart.tsx`, `components/funds/CapitalFlowChart.tsx`
  - Details: Visualizations for fund performance and cash flow

### Phase 4: Dashboard Integration

**Goal:** Integrate fund data into existing dashboard for unified portfolio view

- [ ] **Task 4.1:** Update V2Dashboard with Fund Data
  - Files: `src/pages/V2Dashboard.tsx`
  - Details: Add fund performance sections alongside angel portfolio
- [ ] **Task 4.2:** Create Combined Portfolio Overview
  - Files: `components/dashboard/CombinedPortfolioOverview.tsx`
  - Details: Unified view of angel investments and LP commitments
- [ ] **Task 4.3:** Add Fund-Specific Routes
  - Files: `src/pages/FundsPage.tsx`, `src/pages/FundDetailPage.tsx`
  - Details: Dedicated pages for fund portfolio management

---

## 12. Task Completion Tracking - MANDATORY WORKFLOW

### Task Completion Tracking - MANDATORY WORKFLOW

🚨 **CRITICAL: Real-time task completion tracking is mandatory**

- [ ] **🗓️ GET TODAY'S DATE FIRST** - Before adding any completion timestamps, use the `time` tool to get the correct current date (fallback to web search if time tool unavailable)
- [ ] **Update task document immediately** after each completed subtask
- [ ] **Mark checkboxes as [x]** with completion timestamp using ACTUAL current date (not assumed date)
- [ ] **Add brief completion notes** (file paths, key changes, etc.)
- [ ] **This serves multiple purposes:**
  - [ ] **Forces verification** - You must confirm you actually did what you said
  - [ ] **Provides user visibility** - Clear progress tracking throughout implementation
  - [ ] **Prevents skipped steps** - Systematic approach ensures nothing is missed
  - [ ] **Creates audit trail** - Documentation of what was actually completed
  - [ ] **Enables better debugging** - If issues arise, easy to see what was changed

---

## 13. File Structure & Organization

### New Files to Create

```
project-root/
├── lib/
│   └── funds.ts                          # Complex fund queries and data processing
├── app/actions/
│   └── funds.ts                          # Server actions for fund mutations
├── components/funds/
│   ├── FundList.tsx                      # List of user's funds
│   ├── FundCard.tsx                      # Individual fund card
│   ├── FundReportUploader.tsx            # Report upload interface
│   ├── FundPerformanceChart.tsx          # Performance time-series chart
│   └── CapitalFlowChart.tsx              # Capital calls/distributions chart
├── src/pages/
│   ├── FundsPage.tsx                     # Main funds management page
│   └── FundDetailPage.tsx                # Individual fund details
└── lib/drizzle/schema/
    ├── funds.ts                          # Fund table schema
    ├── fund-reports.ts                   # Fund reports schema
    └── fund-performance.ts               # Performance data schema
```

**File Organization Rules:**

- **Components**: Always in `components/[feature]/` directories
- **Pages**: Only `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` in `app/` routes
- **Server Actions**: In `app/actions/[feature].ts` files (mutations only)
- **Complex Queries**: In `lib/[feature].ts` files (when needed)
- **Utilities**: In `lib/` directory

#### **LIB FILE SERVER/CLIENT SEPARATION - CRITICAL ARCHITECTURE RULE**

**🚨 MANDATORY: Prevent Server/Client Boundary Violations**

When creating lib files, **NEVER mix server-only imports with client-safe utilities** in the same file.

**Server-Only Imports (Cannot be used by client components):**

- `next/headers` (cookies, headers)
- `@/lib/supabase/server`
- `@/lib/drizzle/db` (database operations)
- Server Actions or other server-side functions
- Node.js modules (fs, path, etc.)

**Decision Flowchart - "Should I split this lib file?"**

```
📁 What's in your lib/funds.ts file?
│
├─ 🔴 Server-only imports + Client-safe utilities?
│  └─ ✅ SPLIT: Create lib/funds-client.ts for client utilities
│
├─ 🟢 Only server-side operations?
│  └─ ✅ KEEP: Single lib/funds.ts file (server-only)
│
└─ 🟢 Only client-safe utilities?
   └─ ✅ KEEP: Single lib/funds.ts file (client-safe)
```

### Files to Modify

- [ ] **`src/pages/V2Dashboard.tsx`** - Integrate fund data into existing dashboard
- [ ] **`convex/queries.ts`** - Add fund-related queries
- [ ] **`convex/schema.ts`** - Add fund-related tables

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze

- [ ] **AI Extraction Accuracy** - Fund reports have varying formats, AI might misextract key metrics
  - **Code Review Focus:** Fund report processing logic in `lib/fund-report-processor.ts`
  - **Potential Fix:** Add validation rules and manual correction interface
- [ ] **Large File Uploads** - Fund reports can be large PDFs, might cause memory issues
  - **Code Review Focus:** File upload handling in `app/actions/funds.ts`
  - **Potential Fix:** Implement file size limits and streaming processing
- [ ] **Performance Impact** - Adding fund data might slow dashboard load times
  - **Code Review Focus:** Database queries in `lib/funds.ts`
  - **Potential Fix:** Add caching and optimize query performance

### Edge Cases to Consider

- [ ] **Missing Ownership Data** - Users might not know their exact ownership percentages
  - **Analysis Approach:** Check fund creation flow for ownership input
  - **Recommendation:** Allow manual entry with clear instructions
- [ ] **Multiple Report Formats** - Different funds use different report structures
  - **Analysis Approach:** Review AI processing logic for format flexibility
  - **Recommendation:** Template-based extraction with fallback to manual entry

### Security & Access Control Review

- [ ] **Fund Document Security** - Fund reports contain sensitive financial information
  - **Check:** Encryption at rest, access controls, audit logging
- [ ] **User Data Isolation** - Ensure users can only access their own fund data
  - **Check:** Database queries filter by user_id, no cross-user data access

---

## 15. Deployment & Configuration

### Environment Variables

```bash
# No new environment variables needed for fund dashboard
# Existing Supabase configuration handles database access
```

---

## 16. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST

🎯 **STANDARD OPERATING PROCEDURE:**
When a user requests any new feature, improvement, or significant change, your **DEFAULT BEHAVIOR** should be:

1. **EVALUATE STRATEGIC NEED** - Determine if multiple solutions exist or if it's straightforward
2. **STRATEGIC ANALYSIS** (if needed) - Present solution options with pros/cons and get user direction
3. **CREATE A TASK DOCUMENT** in `ai_docs/` using this template
4. **GET USER APPROVAL** of the task document
5. **IMPLEMENT THE FEATURE** only after approval

**DO NOT:** Present implementation plans in chat without creating a proper task document first.
**DO:** Always create comprehensive task documentation that can be referenced later.
**DO:** Present strategic options when multiple viable approaches exist.

### Communication Preferences

- [ ] Ask for clarification if requirements are unclear
- [ ] Provide regular progress updates
- [ ] Flag any blockers or concerns immediately
- [ ] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW

🚨 **MANDATORY: Always follow this exact sequence:**

1. **EVALUATE STRATEGIC NEED FIRST (Required)**
   - [ ] **Assess complexity** - Is this a straightforward change or are there multiple viable approaches?
   - [ ] **Review the criteria** in "Strategic Analysis & Solution Options" section
   - [ ] **Decision point**: Skip to step 3 if straightforward, proceed to step 2 if strategic analysis needed

2. **STRATEGIC ANALYSIS SECOND (If needed)**
   - [ ] **Present solution options** with pros/cons analysis for each approach
   - [ ] **Include implementation complexity, time estimates, and risk levels** for each option
   - [ ] **Provide clear recommendation** with rationale
   - [ ] **Wait for user decision** on preferred approach before proceeding
   - [ ] **Document approved strategy** for inclusion in task document

3. **CREATE TASK DOCUMENT THIRD (Required)**
   - [ ] **Create a new task document** in the `ai_docs/tasks/` directory using this template
   - [ ] **Fill out all sections** with specific details for the requested feature
   - [ ] **Include strategic analysis** (if conducted) in the appropriate section
   - [ ] **🔢 FIND LATEST TASK NUMBER**: Use `list_dir` to examine ai_docs/tasks/ directory and find the highest numbered task file (e.g., if highest is 028, use 029)
   - [ ] **Name the file** using the pattern `XXX_feature_name.md` (where XXX is the next incremental number)
   - [ ] **🚨 MANDATORY: POPULATE CODE CHANGES OVERVIEW**: Always read existing files and show before/after code snippets in section 9
   - [ ] **Present a summary** of the task document to the user for review

4. **PRESENT IMPLEMENTATION OPTIONS (Required)**
   - [ ] **After incorporating user feedback**, present these 3 exact options:

   **👤 IMPLEMENTATION OPTIONS:**

   **A) Preview High-Level Code Changes**
   Would you like me to show you detailed code snippets and specific changes before implementing? I'll walk through exactly what files will be modified and show before/after code examples.

   **B) Proceed with Implementation**
   Ready to begin implementation? Say "Approved" or "Go ahead" and I'll start implementing phase by phase.

   **C) Provide More Feedback**
   Have questions or want to modify the approach? I can adjust the plan based on additional requirements or concerns.
   - [ ] **Wait for explicit user choice** (A, B, or C) - never assume or default
   - [ ] **If A chosen**: Provide detailed code snippets showing exact changes planned
   - [ ] **If B chosen**: Begin phase-by-phase implementation immediately
   - [ ] **If C chosen**: Address feedback and re-present options

---

## 17. Notes & Additional Context

### Research Links

- [LP Portfolio Management Best Practices](https://example.com/lp-portfolio-management)
- [Fund Performance Metrics Guide](https://example.com/fund-metrics-guide)
- [Capital Account Statement Analysis](https://example.com/capital-accounts)

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions

🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

Before implementing any changes, the AI must systematically analyze potential second-order consequences and alert the user to any significant impacts. This analysis should identify ripple effects that might not be immediately obvious but could cause problems later.

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**

- [ ] **Existing API Contracts:** No breaking changes - fund features are additive to existing angel portfolio functionality
- [ ] **Database Dependencies:** New tables don't affect existing portfolio companies data
- [ ] **Component Dependencies:** Dashboard integration is additive, doesn't break existing components
- [ ] **Authentication/Authorization:** Uses existing user authentication, no new permission requirements

#### 2. **Ripple Effects Assessment**

- [ ] **Data Flow Impact:** New fund data flows don't interfere with existing angel investment data flows
- [ ] **UI/UX Cascading Effects:** Dashboard layout changes are contained to new sections
- [ ] **State Management:** No existing state management patterns are disrupted
- [ ] **Routing Dependencies:** New `/funds` route doesn't affect existing routes

#### 3. **Performance Implications**

- [ ] **Database Query Impact:** New fund queries don't affect existing portfolio company query performance
- [ ] **Bundle Size:** New components increase bundle size by ~50KB (acceptable for feature value)
- [ ] **Server Load:** Additional fund data processing adds minimal server load
- [ ] **Caching Strategy:** No existing caching mechanisms are invalidated

#### 4. **Security Considerations**

- [ ] **Attack Surface:** No new attack vectors - fund data is user-scoped and encrypted
- [ ] **Data Exposure:** Fund documents are encrypted at rest, access controlled
- [ ] **Permission Escalation:** Users can only access their own fund data
- [ ] **Input Validation:** File uploads validated for type and size, AI processing sandboxed

#### 5. **User Experience Impacts**

- [ ] **Workflow Disruption:** Fund features are additive, don't change existing angel portfolio workflows
- [ ] **Data Migration:** No existing user data needs migration for fund features
- [ ] **Feature Deprecation:** No existing features are being removed or significantly changed
- [ ] **Learning Curve:** Fund features follow existing UI patterns, minimal learning required

#### 6. **Maintenance Burden**

- [ ] **Code Complexity:** Fund features add moderate complexity but follow established patterns
- [ ] **Dependencies:** No new third-party dependencies required
- [ ] **Testing Overhead:** Fund features require additional test coverage for AI processing
- [ ] **Documentation:** Fund features need documentation for LP portfolio management workflows

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**

These issues must be brought to the user's attention before implementation:

- [ ] **AI Processing Accuracy** - Fund report extraction accuracy needs validation across different fund formats
- [ ] **File Upload Security** - Large PDF uploads need proper validation and security controls

#### ⚠️ **YELLOW FLAGS - Discuss with User**

These issues should be discussed but may not block implementation:

- [ ] **Report Format Variations** - Different funds may have significantly different report structures
- [ ] **Manual Data Entry** - Users may need to manually enter ownership percentages initially

### Mitigation Strategies

#### Database Changes

- [ ] **Backup Strategy:** Standard Supabase backups cover new fund tables
- [ ] **Rollback Plan:** Down migration provides safe rollback capability
- [ ] **Staging Testing:** Test fund schema changes in staging environment first

#### API Changes

- [ ] **Versioning Strategy:** No API changes required - fund features are internal
- [ ] **Deprecation Timeline:** No deprecation needed for additive features
- [ ] **Client Communication:** No external API consumers affected
- [ ] **Graceful Degradation:** Fund features can be disabled if issues arise

#### UI/UX Changes

- [ ] **Feature Flags:** Fund features can be rolled out gradually if needed
- [ ] **User Communication:** Clear documentation of new fund management capabilities
- [ ] **Help Documentation:** Update help system with fund portfolio management guides
- [ ] **Feedback Collection:** Monitor usage and gather feedback on fund features

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:

- [ ] **Complete Impact Analysis:** Fill out all sections of the impact assessment
- [ ] **Identify Critical Issues:** Flag any red or yellow flag items
- [ ] **Propose Mitigation:** Suggest specific mitigation strategies for identified risks
- [ ] **Alert User:** Clearly communicate any significant second-order impacts
- [ ] **Recommend Alternatives:** If high-risk impacts are identified, suggest alternative approaches

---

_Template Version: 1.3_
_Last Updated: 10/10/2025_
_Created By: AI Assistant_
