# Cash Flow Management Dashboard for Business Angel + LP Hybrid Investors

## 1. Task Overview

### Task Title

Cash Flow Management Dashboard - Capital Calls & Liquidity Forecasting for Mario's Daily Workflow

### Goal Statement

Create a comprehensive cash flow management dashboard that enables Business Angel + LP hybrid investors like Mario to track capital commitments, forecast upcoming capital calls, monitor distributions, and manage liquidity across their fund investments, transforming manual quarterly cash flow tracking into automated daily liquidity intelligence.

---

## 2. Strategic Analysis & Solution Options

### Problem Context

Mario needs to manage cash flow across 8+ fund investments as an LP, but currently receives fragmented capital call notices and distribution updates. He needs to understand:

- Upcoming capital calls and liquidity requirements
- Distribution timing and amounts
- Available capital vs. committed amounts
- Cash flow forecasting for investment planning
- Integration with his angel investment liquidity needs

Multiple viable approaches exist for cash flow management, each with different trade-offs for automation, accuracy, and user experience.

### Solution Options Analysis

#### Option 1: Manual Entry + Forecasting Engine (Recommended)

**Approach:** Allow manual entry of capital calls and distributions with automated forecasting and liquidity analysis

**Pros:**

- ✅ **Complete Control** - Mario can enter exact capital call amounts and timing
- ✅ **Flexible Forecasting** - Custom forecasting based on fund vintage and performance
- ✅ **Integration Ready** - Can integrate with existing angel investment cash flow
- ✅ **No External Dependencies** - Works without fund portal integrations

**Cons:**

- ❌ **Manual Data Entry** - Requires Mario to enter capital call information
- ❌ **Human Error Risk** - Manual entry could introduce calculation errors
- ❌ **Update Frequency** - Depends on Mario's diligence in entering data

**Implementation Complexity:** **Medium** - Requires forecasting algorithms and manual entry interface
**Risk Level:** **Low** - No external dependencies, straightforward implementation

#### Option 2: Fund Portal Integration for Real-Time Data

**Approach:** Integrate with fund portals to automatically sync capital calls and distributions

**Pros:**

- ✅ **Real-Time Accuracy** - Automatic updates when funds post capital calls
- ✅ **Zero Manual Work** - No data entry required from Mario
- ✅ **Complete Automation** - Full automation of cash flow tracking

**Cons:**

- ❌ **Integration Complexity** - Each fund portal has different APIs and data formats
- ❌ **Limited Coverage** - Not all funds have modern portal APIs
- ❌ **Privacy Concerns** - Requires sharing fund portal credentials
- ❌ **Maintenance Burden** - API changes break integrations regularly

**Implementation Complexity:** **High** - Requires multiple API integrations and data normalization
**Risk Level:** **High** - Depends on fund portal API stability and coverage

#### Option 3: AI-Powered Document Processing

**Approach:** Use AI to extract capital call and distribution data from fund communications

**Pros:**

- ✅ **Automated Processing** - Extract data from emails and documents automatically
- ✅ **Email Integration** - Process capital call notices as they arrive
- ✅ **Format Flexibility** - Handles various communication formats

**Cons:**

- ❌ **Email Access Required** - Needs access to Mario's email for processing
- ❌ **Privacy Concerns** - Requires email account integration
- ❌ **Accuracy Validation** - AI extraction needs manual verification
- ❌ **Setup Complexity** - Email integration setup and permissions

**Implementation Complexity:** **High** - Requires email integration and AI processing pipeline
**Risk Level:** **Medium** - Privacy concerns and accuracy validation needed

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Manual Entry + Forecasting Engine

**Why this is the best choice:**

1. **Practical Implementation** - Works immediately without external integrations
2. **Mario's Current Workflow** - Aligns with how he currently receives capital call notices
3. **Complete Control** - Mario can enter exact amounts and timing he receives
4. **Foundation for Automation** - Can add integrations later as fund portals modernize

**Key Decision Factors:**

- **Performance Impact:** Forecasting calculations are fast and don't affect dashboard performance
- **User Experience:** Simple manual entry interface fits Mario's current workflow
- **Maintainability:** No external API dependencies to maintain
- **Scalability:** Can handle Mario's 8+ fund relationships without integration limits
- **Security:** No external service access needed, data stays local

**Alternative Consideration:**
Option 2 would be preferred if fund portals had consistent APIs, but current API availability is too fragmented for reliable implementation.

---

## 3. Project Analysis & Current State

### Technology & Architecture

- **Frameworks & Versions:** Next.js 15.3, React 19, TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM for cash flow data persistence
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling and theming
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations

### Current State

The current fund performance dashboard foundation exists but lacks cash flow management. Fund data structure supports capital calls and distributions tracking. The existing chart infrastructure provides a foundation for cash flow visualization.

### Existing Context Providers Analysis

- **UserContext (`useUser()`):** Available throughout protected routes - provides user profile and authentication state
- **UsageContext (`useUsage()`):** Available in protected routes - handles subscription/billing data
- **Context Hierarchy:** Both providers available in protected route layouts
- **Available Context Hooks:** `useUser()`, `useUsage()` - fund data not currently in context

**🔍 Context Coverage Analysis:**

- Cash flow data will need new context provider for liquidity and capital management state
- No existing cash flow data in current contexts
- Components will need to fetch cash flow data via Server Components initially

---

## 4. Context & Problem Definition

### Problem Statement

Mario, as a Business Angel + LP hybrid investor, needs to manage cash flow across his fund investments to avoid missing capital calls or over-committing liquidity. Currently, he manually tracks capital call notices from 8+ funds, forecasts upcoming liquidity needs, and manages distributions across different time horizons. Without automated cash flow management, he risks missing investment opportunities due to poor liquidity planning or failing to meet capital call obligations.

### Success Criteria

- [ ] Mario can manually enter capital calls and distributions for each fund
- [ ] Automated forecasting shows upcoming liquidity requirements by month
- [ ] Cash flow dashboard integrates with fund performance data
- [ ] Available capital vs. committed amounts clearly displayed
- [ ] Historical cash flow trends and patterns visualized
- [ ] Integration with angel investment cash flow for complete liquidity picture

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

- [ ] Manual entry interface for capital calls and distributions
- [ ] Automated cash flow forecasting based on fund vintage and performance
- [ ] Liquidity requirement visualization by month/quarter
- [ ] Available capital vs. committed capital tracking
- [ ] Historical cash flow trend analysis
- [ ] Integration with fund performance dashboard

### Non-Functional Requirements

- **Performance:** Cash flow calculations complete in under 1 second, dashboard loads in under 2 seconds
- **Security:** Cash flow data encrypted at rest, access controlled by user authentication
- **Usability:** Simple form interface for manual entry, clear forecasting displays
- **Responsive Design:** Works on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Supports both light and dark mode using existing theme system
- **Compatibility:** Modern browsers with good form support

### Technical Constraints

- [ ] Must use existing Supabase database and Drizzle ORM
- [ ] Must integrate with current authentication system
- [ ] Must follow established shadcn/ui design patterns
- [ ] Must use existing chart infrastructure (Recharts) for consistency

---

## 7. Data & Database Changes

### Database Schema Changes

```sql
-- Add cash flow tracking tables for LP capital management
CREATE TABLE IF NOT EXISTS fund_capital_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  call_date date NOT NULL,
  amount decimal(15,2) NOT NULL,
  currency text DEFAULT 'EUR',
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  due_date date,
  notice_date date DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fund_distributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  distribution_date date NOT NULL,
  amount decimal(15,2) NOT NULL,
  currency text DEFAULT 'EUR',
  distribution_type text CHECK (distribution_type IN ('capital_return', 'dividend', 'carried_interest', 'other')),
  description text,
  taxable_amount decimal(15,2),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS liquidity_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  forecast_date date NOT NULL,
  forecast_type text NOT NULL CHECK (forecast_type IN ('capital_call', 'distribution', 'net_cash_flow')),
  fund_id uuid REFERENCES funds(id) ON DELETE CASCADE,
  amount decimal(15,2) NOT NULL,
  confidence_level decimal(3,2) CHECK (confidence_level >= 0 AND confidence_level <= 1),
  forecast_method text CHECK (forecast_method IN ('manual_entry', 'vintage_based', 'performance_based', 'historical_average')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, forecast_date, forecast_type, fund_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_capital_calls_fund_id ON fund_capital_calls(fund_id);
CREATE INDEX IF NOT EXISTS idx_capital_calls_due_date ON fund_capital_calls(due_date);
CREATE INDEX IF NOT EXISTS idx_capital_calls_status ON fund_capital_calls(status);
CREATE INDEX IF NOT EXISTS idx_distributions_fund_id ON fund_distributions(fund_id);
CREATE INDEX IF NOT EXISTS idx_distributions_date ON fund_distributions(distribution_date);
CREATE INDEX IF NOT EXISTS idx_liquidity_forecasts_user_date ON liquidity_forecasts(user_id, forecast_date);
```

### Data Model Updates

```typescript
// Cash flow data types
export interface FundCapitalCall {
  id: string;
  fundId: string;
  callDate: string;
  amount: number;
  currency: string;
  description?: string;
  status: "pending" | "paid" | "cancelled";
  dueDate?: string;
  noticeDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundDistribution {
  id: string;
  fundId: string;
  distributionDate: string;
  amount: number;
  currency: string;
  distributionType?:
    | "capital_return"
    | "dividend"
    | "carried_interest"
    | "other";
  description?: string;
  taxableAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiquidityForecast {
  id: string;
  userId: string;
  forecastDate: string;
  forecastType: "capital_call" | "distribution" | "net_cash_flow";
  fundId?: string;
  amount: number;
  confidenceLevel?: number;
  forecastMethod:
    | "manual_entry"
    | "vintage_based"
    | "performance_based"
    | "historical_average";
  createdAt: Date;
}
```

### Data Migration Plan

- [ ] Create fund_capital_calls, fund_distributions, and liquidity_forecasts tables
- [ ] Add appropriate indexes for query performance
- [ ] Add foreign key constraints and cascade deletes
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

- [ ] **Server Actions File** - `app/actions/cash-flow.ts` - ONLY mutations (add capital call, record distribution, update forecast)
- [ ] Examples: `addCapitalCall()`, `recordDistribution()`, `updateLiquidityForecast()`
- [ ] Must use `'use server'` directive and `revalidatePath()` after mutations

#### **QUERIES (Data Fetching)** → Choose based on complexity:

- [ ] **Direct in Server Components** - Simple cash flow queries for dashboard display
- [ ] **Query Functions in lib/cash-flow.ts** - Complex forecasting calculations and time-series analysis

### Server Actions

- [ ] **`addCapitalCall`** - Add new capital call with amount, date, and fund association
- [ ] **`updateCapitalCallStatus`** - Mark capital calls as paid or cancelled
- [ ] **`recordDistribution`** - Record fund distributions with type and tax implications
- [ ] **`generateLiquidityForecast`** - Create automated forecasts based on fund vintage and performance

### Database Queries

- [ ] **Direct in Server Components** - Simple queries for recent capital calls and distributions
- [ ] **Query Functions in lib/cash-flow.ts** - Complex forecasting algorithms and cash flow analysis

---

## 9. Frontend Changes

### New Components

- [ ] **`components/cash-flow/CashFlowOverview.tsx`** - Main cash flow dashboard with key metrics
- [ ] **`components/cash-flow/CapitalCallList.tsx`** - List of upcoming and historical capital calls
- [ ] **`components/cash-flow/DistributionTracker.tsx`** - Distribution history and tax tracking
- [ ] **`components/cash-flow/LiquidityForecastChart.tsx`** - Monthly/quarterly cash flow forecasting
- [ ] **`components/cash-flow/CapitalCallForm.tsx`** - Form for adding new capital calls
- [ ] **`components/cash-flow/DistributionForm.tsx`** - Form for recording distributions

**Component Organization Pattern:**

- Use `components/cash-flow/` directory for cash flow-specific components
- Follow existing patterns for responsive design and theme support

### Page Updates

- [ ] **`/dashboard`** - Add cash flow section to main dashboard
- [ ] **`/cash-flow`** - New dedicated cash flow management page

---

## 10. Code Changes Overview

#### 📂 **Current Implementation (Before)**

```typescript
// V2Dashboard focuses only on portfolio performance
<PortfolioHealthDashboard metrics={calculatePortfolioHealth(companies)} />
<RiskReturnQuadrantChart data={processQuadrantData(companies)} />
{/* No cash flow or liquidity management */}
```

#### 📂 **After Refactor**

```typescript
// V2Dashboard includes cash flow management
<CombinedPortfolioOverview angelData={companies} fundData={funds} />

{/* Existing portfolio sections */}
<PortfolioHealthDashboard metrics={calculatePortfolioHealth(companies)} />

{/* NEW: Cash flow management */}
<CashFlowOverview
  upcomingCalls={getUpcomingCapitalCalls()}
  recentDistributions={getRecentDistributions()}
  liquidityForecast={calculateLiquidityForecast()}
/>
```

#### 🎯 **Key Changes Summary**

- [ ] **Database Schema:** Add cash flow tracking tables with forecasting capabilities
- [ ] **Backend Integration:** Create cash flow queries and Server Actions
- [ ] **Frontend Components:** Build cash flow management interface
- [ ] **Dashboard Integration:** Add cash flow section to main dashboard
- [ ] **Files Modified:** 12-15 files across database, backend, and frontend layers

---

## 11. Implementation Plan

### Phase 1: Database Foundation

**Goal:** Establish cash flow data storage with proper schema and migration safety

- [ ] **Task 1.1:** Create Database Migration
  - Files: `lib/drizzle/schema/cash-flow.ts`
  - Details: Define capital calls, distributions, and forecasting tables
- [ ] **Task 1.2:** Create Down Migration (MANDATORY)
  - Files: `drizzle/migrations/[timestamp]/down.sql`
  - Details: Follow `drizzle_down_migration.md` template for safe rollback
- [ ] **Task 1.3:** Apply Migration
  - Command: `npm run db:migrate` (only after down migration created)

### Phase 2: Backend Infrastructure

**Goal:** Implement cash flow data access and forecasting functionality

- [ ] **Task 2.1:** Create Cash Flow Query Functions
  - Files: `lib/cash-flow.ts`
  - Details: Complex queries for forecasting, aggregation, and analysis
- [ ] **Task 2.2:** Create Cash Flow Server Actions
  - Files: `app/actions/cash-flow.ts`
  - Details: Mutations for capital calls, distributions, and forecast management
- [ ] **Task 2.3:** Implement Forecasting Algorithms
  - Files: `lib/forecasting-engine.ts`
  - Details: Vintage-based and performance-based forecasting logic

### Phase 3: Frontend Components

**Goal:** Build cash flow management UI components

- [ ] **Task 3.1:** Create Cash Flow Overview Component
  - Files: `components/cash-flow/CashFlowOverview.tsx`
  - Details: Main dashboard with key liquidity metrics
- [ ] **Task 3.2:** Create Capital Call Management
  - Files: `components/cash-flow/CapitalCallList.tsx`, `components/cash-flow/CapitalCallForm.tsx`
  - Details: Interface for managing capital calls and due dates
- [ ] **Task 3.3:** Create Distribution Tracking
  - Files: `components/cash-flow/DistributionTracker.tsx`, `components/cash-flow/DistributionForm.tsx`
  - Details: Track distributions and calculate tax implications

### Phase 4: Dashboard Integration

**Goal:** Integrate cash flow management into existing dashboard

- [ ] **Task 4.1:** Update V2Dashboard with Cash Flow Section
  - Files: `src/pages/V2Dashboard.tsx`
  - Details: Add cash flow overview to main dashboard
- [ ] **Task 4.2:** Create Dedicated Cash Flow Page
  - Files: `src/pages/CashFlowPage.tsx`
  - Details: Full cash flow management interface
- [ ] **Task 4.3:** Add Forecasting Visualization
  - Files: `components/cash-flow/LiquidityForecastChart.tsx`
  - Details: Monthly/quarterly cash flow forecasting charts

---

## 12. Task Completion Tracking - MANDATORY WORKFLOW

### Task Completion Tracking - MANDATORY WORKFLOW

🚨 **CRITICAL: Real-time task completion tracking is mandatory**

- [ ] **🗓️ GET TODAY'S DATE FIRST** - Before adding any completion timestamps, use the `time` tool to get the correct current date
- [ ] **Update task document immediately** after each completed subtask
- [ ] **Mark checkboxes as [x]** with completion timestamp using ACTUAL current date
- [ ] **Add brief completion notes** (file paths, key changes, etc.)

---

## 13. File Structure & Organization

### New Files to Create

```
project-root/
├── lib/
│   ├── cash-flow.ts                      # Cash flow queries and forecasting
│   └── forecasting-engine.ts             # Forecasting algorithms
├── app/actions/
│   └── cash-flow.ts                      # Cash flow mutations
├── components/cash-flow/
│   ├── CashFlowOverview.tsx              # Main cash flow dashboard
│   ├── CapitalCallList.tsx               # Capital call management
│   ├── CapitalCallForm.tsx               # Add/edit capital calls
│   ├── DistributionTracker.tsx           # Distribution history
│   ├── DistributionForm.tsx              # Record distributions
│   └── LiquidityForecastChart.tsx        # Cash flow forecasting visualization
├── src/pages/
│   └── CashFlowPage.tsx                  # Dedicated cash flow management page
└── lib/drizzle/schema/
    └── cash-flow.ts                      # Cash flow database schema
```

### Files to Modify

- [ ] **`src/pages/V2Dashboard.tsx`** - Add cash flow section
- [ ] **`lib/funds.ts`** - Add cash flow integration

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze

- [ ] **Forecasting Accuracy** - Automated forecasts may not match actual fund behavior
  - **Code Review Focus:** Forecasting algorithms in `lib/forecasting-engine.ts`
  - **Potential Fix:** Add manual override capabilities and confidence scoring
- [ ] **Currency Handling** - Different funds may use different currencies
  - **Code Review Focus:** Currency conversion logic in cash flow calculations
  - **Potential Fix:** Add currency conversion rates and user currency preferences

### Edge Cases to Consider

- [ ] **Missed Capital Calls** - Users may forget to enter or update capital call information
  - **Analysis Approach:** Check for notification system and reminder features
  - **Recommendation:** Add email/SMS reminders for upcoming capital calls
- [ ] **Partial Payments** - Some capital calls may be partially paid
  - **Analysis Approach:** Review payment status tracking
  - **Recommendation:** Support partial payment tracking and status updates

---

## 15. Deployment & Configuration

### Environment Variables

```bash
# No new environment variables needed for cash flow management
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

---

## 17. Notes & Additional Context

### Research Links

- [LP Cash Flow Management Best Practices](https://example.com/lp-cash-flow-management)
- [Capital Call Forecasting Methods](https://example.com/capital-call-forecasting)
- [Distribution Tax Treatment for LPs](https://example.com/lp-tax-treatment)

---

## 18. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**

- [ ] **Existing API Contracts:** No breaking changes - cash flow features are additive
- [ ] **Database Dependencies:** New tables don't affect existing fund performance data
- [ ] **Component Dependencies:** Dashboard integration is additive, doesn't break existing components

#### 2. **Performance Implications**

- [ ] **Database Query Impact:** Cash flow queries add minimal load to existing database
- [ ] **Bundle Size:** Cash flow components add ~30KB (acceptable for feature value)
- [ ] **Server Load:** Forecasting calculations are lightweight and cached

#### 3. **Security Considerations**

- [ ] **Data Protection:** Cash flow data encrypted at rest, access controlled
- [ ] **Financial Information:** Sensitive capital call and distribution data properly secured
- [ ] **Audit Trail:** All cash flow changes logged for compliance

#### 4. **User Experience Impacts**

- [ ] **Workflow Integration:** Cash flow management integrates seamlessly with fund performance
- [ ] **Learning Curve:** Follows existing UI patterns, minimal additional learning required
- [ ] **Mobile Accessibility:** Cash flow interface works well on mobile devices

### Critical Issues Identification

- [ ] **Forecasting Algorithm Accuracy** - Need to validate forecasting methods across different fund types

### Mitigation Strategies

- [ ] **Gradual Rollout** - Start with manual entry, add automation as confidence grows
- [ ] **User Validation** - Allow users to override automated forecasts with manual adjustments

---

_Template Version: 1.3_
_Last Updated: 10/10/2025_
_Created By: AI Assistant_
