# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title

<!-- Provide a clear, specific title for this task -->

**Title:** Enhanced Co-Investor Intelligence - Advanced Data Extraction and Strategic Analytics

### Goal Statement

<!-- One paragraph describing the high-level objective -->

**Goal:** Implement comprehensive co-investor data extraction from fund reports and build advanced analytics capabilities for deal sourcing, relationship mapping, due diligence support, and strategic intelligence. This will enable fund management platforms to identify new partners, improve due diligence, anticipate market trends, and optimize investor relations through data-driven insights.

---

## 2. Strategic Analysis & Solution Options

### Problem Context

<!-- Restate the problem and why it needs strategic consideration -->

The current co-investor data extraction provides basic information but lacks the depth needed for strategic fund management decisions. We need to enhance extraction to capture fee structures, performance benchmarking, and relationship patterns from fund reports while building advanced analytics for network intelligence, deal sourcing, and strategic recommendations.

### Solution Options Analysis

#### Option 1: Enhanced AI Extraction + Advanced Analytics

**Approach:** Enhance the existing AI extraction system to capture more detailed co-investor data including fee structures, performance metrics, and relationship patterns, then build advanced analytics for strategic intelligence.

**Pros:**

- ✅ Leverages existing AI extraction infrastructure
- ✅ Builds on current network intelligence foundation
- ✅ Provides immediate strategic value for deal sourcing and due diligence
- ✅ Scales with existing document processing pipeline

**Cons:**

- ❌ Requires significant AI prompt engineering for enhanced extraction
- ❌ May need additional data structures for complex analytics
- ❌ Performance impact from more complex data processing

**Implementation Complexity:** High - Requires AI model tuning and advanced analytics algorithms
**Risk Level:** Medium - Core extraction works, but enhanced capabilities may need iteration

#### Option 2: Structured Data Pipeline + Manual Enhancement

**Approach:** Build structured data extraction for co-investor fields and manually enhance existing data with strategic analytics, bypassing complex AI extraction improvements.

**Pros:**

- ✅ More predictable data quality and structure
- ✅ Easier to implement and debug
- ✅ Lower technical risk with proven patterns

**Cons:**

- ❌ Limited scalability for diverse document formats
- ❌ Requires manual data enhancement workflows
- ❌ Less comprehensive than AI-powered extraction

**Implementation Complexity:** Medium - Structured extraction but manual enhancement needed
**Risk Level:** Low - Uses proven patterns, but limited by manual processes

#### Option 3: Hybrid Approach - Core AI + Manual Enhancement

**Approach:** Use enhanced AI extraction for core data while manually enriching with strategic intelligence and building advanced analytics on top of existing infrastructure.

**Pros:**

- ✅ Best of both worlds - AI scalability + manual quality control
- ✅ Immediate value from enhanced extraction
- ✅ Strategic intelligence layer provides differentiation
- ✅ Builds on proven foundation

**Cons:**

- ❌ Requires both AI enhancement and manual processes
- ❌ More complex implementation and maintenance

**Implementation Complexity:** High - Both technical and process complexity
**Risk Level:** Medium - Technical complexity but proven patterns

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Enhanced AI Extraction + Advanced Analytics

**Why this is the best choice:**

1. **Leverages existing infrastructure** - Builds on proven AI extraction and network intelligence systems
2. **Scalable and future-proof** - AI approach handles diverse document formats and scales with more data
3. **Strategic differentiation** - Provides unique capabilities for fund management platforms
4. **Immediate business value** - Enables deal sourcing, due diligence, and relationship optimization

**Key Decision Factors:**

- **Performance Impact:** Enhanced extraction may increase processing time but provides significantly more value
- **User Experience:** Richer co-investor intelligence enables better investment decisions
- **Maintainability:** AI approach is more maintainable than manual processes long-term
- **Scalability:** Handles growing document volumes and diverse formats
- **Security:** No additional security concerns - uses existing secure processing

**Alternative Consideration:**
Option 3 could be a fallback if AI extraction enhancements prove too complex initially.

---

## 3. Project Analysis & Current State

### Technology & Architecture

- **Frameworks & Versions:** Next.js 15.3, React 19, TypeScript 5.4
- **Language:** TypeScript with strict mode
- **Database & ORM:** Convex (serverless database) with custom schema
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Authentication:** Convex Auth managed by middleware
- **Key Architectural Patterns:** Next.js App Router, Server Components, Convex functions, AI-powered document processing

### Current State

The system currently has basic co-investor data extraction and network intelligence capabilities:

- Co-investor profiles with contact info, investment focus, and basic metrics
- Relationship mapping between co-investors
- Basic network intelligence dashboard showing portfolio-derived metrics
- AI extraction from fund reports capturing co-investor mentions
- Tier 2 strategic extraction already identifies co-investors and relationships

### Existing Context Providers Analysis

- **UserContext (`useUser()`):** Available - user authentication and profile data
- **UsageContext (`useUsage()`):** Available - subscription and billing data
- **Other Context Providers:** Document processing context available for AI extraction workflows
- **Context Hierarchy:** Layouts provide authentication and usage contexts throughout the app
- **Available Context Hooks:** useUser(), useUsage(), and document processing hooks

**🔍 Context Coverage Analysis:**

- User data available via context for personalization
- Usage data available for feature gating
- Document processing context available for AI workflows
- No conflicts with existing data patterns

---

## 4. Context & Problem Definition

### Problem Statement

<!-- What specific problem are you solving? -->

Current co-investor data extraction provides basic information but lacks the depth needed for strategic fund management decisions. Fund reports contain rich co-investor intelligence including fee structures, performance patterns, and relationship networks, but our extraction system doesn't capture this strategic data. We need to enhance extraction capabilities and build advanced analytics to enable deal sourcing, due diligence support, and strategic intelligence for fund management platforms.

### Success Criteria

<!-- How will you know this is complete and successful? -->

- [x] Enhanced AI extraction captures fee structures and performance data from fund reports
- [x] Co-investment deal tracking database schema implemented with rollback capability
- [x] Advanced relationship strength algorithms and network analysis built
- [x] Strategic intelligence features provide actionable recommendations
- [x] Network Intelligence Dashboard displays comprehensive co-investor analytics
- [x] All existing co-investor functionality continues to work without breaking changes

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

<!-- What should the system do? -->

- [x] Enhanced AI extraction captures detailed co-investor data from fund reports
- [x] Co-investment deal tracking with fee structures and performance metrics
- [x] Advanced relationship strength algorithms for network analysis
- [x] Strategic intelligence recommendations for deal sourcing and due diligence
- [x] Comprehensive Network Intelligence Dashboard displaying all co-investor analytics
- [x] Performance benchmarking across co-investment relationships

### Non-Functional Requirements

<!-- Performance, security, usability, etc. -->

- **Performance:** Enhanced extraction should process documents within acceptable time limits
- **Security:** No additional security concerns - uses existing secure processing
- **Usability:** Rich co-investor intelligence should be easily accessible and actionable
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Works with existing AI extraction and database infrastructure

---

## 7. Data & Database Changes

### Database Schema Changes

<!-- If any database changes are needed -->

```typescript
// Enhanced co-investor data fields
coInvestors: defineTable({
  // ... existing fields
  averageDealSize: v.optional(v.number()),
  totalCapitalDeployed: v.optional(v.number()),
  portfolioCompanyCount: v.optional(v.number()),
  typicalFeeStructure: v.optional(v.string()),
  carriedInterestPreference: v.optional(v.string()),
  preferredDealStages: v.optional(v.array(v.string())),
  investmentCriteria: v.optional(v.string()),
  relationshipHistory: v.optional(v.array(v.string())),
  preferredCoInvestors: v.optional(v.array(v.id("coInvestors"))),
});

// New co-investment deals table
coInvestmentDeals: defineTable({
  dealId: v.id("dealFlow"),
  leadInvestor: v.id("coInvestors"),
  coInvestors: v.array(v.id("coInvestors")),
  dealSize: v.number(),
  feeStructure: v.optional(v.string()),
  carriedInterest: v.optional(v.number()),
  managementFee: v.optional(v.number()),
  dealPerformance: v.optional(v.number()),
  exitStatus: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_deal", ["dealId"])
  .index("by_lead_investor", ["leadInvestor"]);
```

### Data Migration Plan

<!-- How to handle existing data -->

- [x] Existing co-investor data preserved and enhanced with new fields
- [x] New co-investment deals table starts empty
- [x] Enhanced extraction will populate new data fields over time
- [x] No data loss - all existing functionality continues to work

### 🚨 MANDATORY: Down Migration Safety Protocol

**CRITICAL REQUIREMENT:** Before running ANY database migration, you MUST create the corresponding down migration file following the `drizzle_down_migration.md` template process:

- [x] **Step 1: Generate Migration** - Run `npm run db:generate` to create the migration file
- [x] **Step 2: Create Down Migration** - Follow `drizzle_down_migration.md` template to analyze the migration and create the rollback file
- [x] **Step 3: Create Subdirectory** - Create `drizzle/migrations/[timestamp_name]/` directory
- [x] **Step 4: Generate down.sql** - Create the `down.sql` file with safe rollback operations
- [x] **Step 5: Verify Safety** - Ensure all operations use `IF EXISTS` and include appropriate warnings
- [x] **Step 6: Apply Migration** - Only after down migration is created, run `npm run db:migrate`

**🛑 NEVER run `npm run db:migrate` without first creating the down migration file!**

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Server Actions)** → `app/actions/[feature].ts`

- [x] **Server Actions File** - `app/actions/co-investors.ts` - ONLY mutations (create, update, delete co-investors and relationships)
- [x] Examples: `createCoInvestor()`, `updateCoInvestor()`, `deleteCoInvestor()`, `addCoInvestorRelationship()`
- [x] Must use `'use server'` directive and `revalidatePath()` after mutations
- [x] **What qualifies as mutations**: POST, PUT, DELETE operations, form submissions, data modifications

#### **QUERIES (Data Fetching)** → Choose based on complexity:

**Simple Queries** → Direct in Server Components

- [x] **Direct in Page Components** - Simple `await db.select().from(table)` calls
- [x] Example: `const coInvestors = await db.select().from(coInvestors).where(eq(coInvestors.userId, userId))`
- [x] Use when: Single table, simple WHERE clause, used in only 1-2 places

**Complex Queries** → `lib/[feature].ts`

- [x] **Query Functions in lib/** - `lib/co-investors.ts` for complex/reused queries
- [x] Example: `lib/co-investors.ts` with `getCoInvestorNetwork()`, `analyzeRelationshipStrength()`
- [x] Use when: JOINs, aggregations, complex logic, used in 3+ places, needs efficient lookups
- [x] **What qualifies as complex queries**: Network analysis, relationship mapping, performance benchmarking

#### **API Routes** → `app/api/[endpoint]/route.ts` - **RARELY NEEDED**

🛑 **Only create API routes for these specific cases:**

- [ ] **Webhooks** - Third-party service callbacks (Stripe, external services)
- [ ] **Non-HTML Responses** - File downloads, XML/CSV exports, binary data
- [ ] **External API Proxies** - When you need to hide API keys from client
- [ ] **Public APIs** - When building APIs for external consumption

❌ **DO NOT use API routes for:**

- [x] ❌ Internal data fetching (use lib/ functions instead)
- [x] ❌ Real-time polling (use lib/ functions called from client)
- [x] ❌ Form submissions (use Server Actions instead)
- [x] ❌ User authentication flows (use Server Actions instead)

#### **PROFESSIONAL NAMING (Directory-Based Separation):**

- `app/actions/co-investors.ts` - For mutations only (directory context is clear)
- `lib/co-investors.ts` - For complex queries and data fetching
- `app/api/[endpoint]/route.ts` - Only for webhooks, file exports, external APIs

### Server Actions

<!-- New or modified server actions for mutations -->

- [x] **`addCoInvestor`** - Create new co-investor profile with enhanced data
- [x] **`updateCoInvestor`** - Update co-investor with new extracted data
- [x] **`addCoInvestorRelationship`** - Create relationship between co-investors
- [x] **`addCoInvestmentDeal`** - Track co-investment deals with fee structures

### Database Queries

<!-- How you'll fetch data - be explicit about the choice -->

- [x] **Direct in Server Components** - Simple co-investor queries for dashboard display
- [x] **Query Functions in lib/co-investors.ts** - Complex network analysis, relationship mapping, performance benchmarking

### External Integrations

<!-- Third-party APIs, services, etc. -->

- [x] **OpenAI GPT-4o-mini** - Enhanced AI extraction for co-investor intelligence
- [x] **Existing AI processing pipeline** - Leverages current document processing infrastructure

**🚨 MANDATORY: Use Latest AI Models**

- When using Gemini models, always use **gemini-2.5-flash** (never gemini-1.5 or gemini-2.0 models)
- When using OpenAI models, use **gpt-4o** (never gpt-3.5-turbo as default)

---

## 9. Frontend Changes

### New Components

<!-- Components to create in components/ directory, organized by feature -->

- [x] **`components/co-investors/CoInvestorProfile.tsx`** - Detailed co-investor profile display
- [x] **`components/co-investors/CoInvestorNetworkGraph.tsx`** - Interactive relationship network visualization
- [x] **`components/co-investors/CoInvestmentDealTracker.tsx`** - Deal tracking with fee analysis
- [x] **`components/co-investors/StrategicIntelligence.tsx`** - Advanced analytics and recommendations

**Component Organization Pattern:**

- Use `components/co-investors/` directories for feature-specific components
- Keep shared/reusable components in `components/ui/` (existing pattern)
- Import into pages from the global components directory

**Component Requirements:**

- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation

### Page Updates

<!-- Pages that need changes -->

- [x] **`src/components/network/NetworkOverview.tsx`** - Enhanced to display advanced co-investor analytics
- [x] **`src/pages/NetworkIntelligencePage.tsx`** - Updated to show comprehensive co-investor intelligence

### State Management

<!-- How data flows through the app -->

- [x] **Context providers** - Existing contexts provide user and usage data
- [x] **Data fetching strategies** - Enhanced queries for co-investor intelligence
- [x] **Component data flow** - Server components fetch data, client components handle interactions

### 🚨 CRITICAL: Context Usage Strategy

**MANDATORY: Before creating any component props or planning data fetching, verify existing context availability**

#### Context-First Design Pattern

- [x] **✅ Check Available Contexts:** UserContext and UsageContext available for user data and feature gating
- [x] **✅ Use Context Over Props:** Components use context hooks instead of prop drilling
- [x] **✅ Avoid Prop Drilling:** No unnecessary prop passing for context-available data
- [x] **✅ Minimize Data Fetching:** Components use existing context data where available

---

## 10. Code Changes Overview

### 🚨 MANDATORY: Always Show High-Level Code Changes Before Implementation

**AI Agent Instructions:** Before presenting the task document for approval, you MUST provide a clear overview of the code changes you're about to make. This helps the user understand exactly what will be modified without having to approve first.

**Requirements:**

- [x] **Always include this section** for any task that modifies existing code
- [x] **Show actual code snippets** with before/after comparisons
- [x] **Focus on key changes** - don't show every line, but show enough to understand the transformation
- [x] **Use file paths and line counts** to give context about scope of changes
- [x] **Explain the impact** of each major change

### Format to Follow:

#### 📂 **Enhanced AI Extraction (convex/enhancedProcessing.ts)**

```typescript
// BEFORE: Basic co-investor extraction
TIER 2 STRATEGIC EXTRACTION:
Extract co-investor relationships and market intelligence:
- Co-investors: Identify investment partners, syndicate members, and their characteristics

// AFTER: Enhanced co-investor extraction with strategic data
TIER 2 STRATEGIC EXTRACTION:
Extract comprehensive co-investor intelligence:
- Co-investors: Investment partners, syndicate members, fee structures, performance history
- Deal economics: Fee structures, carried interest, management fees, performance benchmarks
- Relationship patterns: Investment frequency, success rates, preferred deal stages
- Strategic positioning: Geographic focus, sector preferences, investment criteria
```

#### 📂 **New Database Schema (convex/schema.ts)**

```typescript
// BEFORE: Basic co-investor fields
coInvestors: defineTable({
  name: v.string(),
  company: v.optional(v.string()),
  successRate: v.optional(v.number()),
  // ... basic fields
});

// AFTER: Enhanced co-investor schema with strategic data
coInvestors: defineTable({
  // ... existing fields
  averageDealSize: v.optional(v.number()),
  totalCapitalDeployed: v.optional(v.number()),
  portfolioCompanyCount: v.optional(v.number()),
  typicalFeeStructure: v.optional(v.string()),
  carriedInterestPreference: v.optional(v.string()),
  preferredDealStages: v.optional(v.array(v.string())),
  investmentCriteria: v.optional(v.string()),
  relationshipHistory: v.optional(v.array(v.string())),
});

// NEW: Co-investment deals tracking
coInvestmentDeals: defineTable({
  dealId: v.id("dealFlow"),
  leadInvestor: v.id("coInvestors"),
  coInvestors: v.array(v.id("coInvestors")),
  dealSize: v.number(),
  feeStructure: v.optional(v.string()),
  carriedInterest: v.optional(v.number()),
  managementFee: v.optional(v.number()),
  dealPerformance: v.optional(v.number()),
  exitStatus: v.optional(v.string()),
});
```

#### 📂 **Advanced Analytics (lib/co-investors.ts)**

```typescript
// NEW FILE: Advanced co-investor analytics
export function calculateRelationshipStrength(
  coInvestors: CoInvestor[],
  relationships: CoInvestorRelationship[]
): RelationshipStrengthMetrics {
  // Calculate relationship strength based on interaction frequency, success rates, and investment patterns
  // Return network density, clustering coefficients, and strategic recommendations
}

export function analyzeCoInvestmentPerformance(
  deals: CoInvestmentDeal[]
): PerformanceAnalytics {
  // Analyze deal performance, fee optimization, and benchmarking across co-investors
  // Return performance metrics, fee analysis, and strategic insights
}

export function generateDealSourcingRecommendations(
  coInvestors: CoInvestor[],
  portfolio: PortfolioCompany[]
): DealSourcingOpportunities {
  // Generate deal sourcing recommendations based on co-investor networks and portfolio synergies
  // Return prioritized opportunities with confidence scores and strategic rationale
}
```

#### 📂 **Enhanced Network Intelligence Dashboard (src/components/network/NetworkOverview.tsx)**

```typescript
// BEFORE: Basic portfolio-derived metrics
<Card>
  <CardHeader>
    <CardTitle>Portfolio Companies</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{totalCompanies}</div>
    <p>Active investments</p>
  </CardContent>
</Card>

// AFTER: Rich co-investor intelligence display
<Card>
  <CardHeader>
    <CardTitle>Co-Investment Network</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{activeCoInvestors}</div>
    <p>Active network members</p>
    <div className="mt-2">
      <p className="text-sm text-gray-600">Network Density: {networkDensity}%</p>
      <p className="text-sm text-gray-600">Avg Deal Size: ${avgDealSize}M</p>
    </div>
  </CardContent>
</Card>
```

#### 🎯 **Key Changes Summary**

- [x] **Enhanced AI Extraction:** convex/enhancedProcessing.ts - Add strategic co-investor data extraction including fee structures and performance metrics
- [x] **Database Schema:** convex/schema.ts - Add enhanced co-investor fields and new co-investment deals table
- [x] **Advanced Analytics:** lib/co-investors.ts - Build relationship strength algorithms and strategic intelligence functions
- [x] **Network Dashboard:** src/components/network/NetworkOverview.tsx - Display comprehensive co-investor analytics and recommendations
- [x] **Files Modified:** 4 files with approximately 200-300 lines of new code and enhancements
- [x] **Impact:** Transforms basic co-investor data into strategic intelligence platform for fund management

---

## 11. Implementation Plan

### Phase 1: Database Schema Enhancement

**Goal:** Add enhanced co-investor data fields and co-investment deal tracking

- [x] **Task 1.1:** Generate Database Migration
  - Files: `convex/schema.ts`
  - Details: Add enhanced co-investor fields and co-investment deals table
- [x] **Task 1.2:** Create Down Migration (MANDATORY)
  - Files: `drizzle/migrations/[timestamp]/down.sql`
  - Details: Follow `drizzle_down_migration.md` template for safe rollback
- [x] **Task 1.3:** Apply Migration
  - Command: `npm run db:migrate`
  - Details: Apply schema changes to development database

### Phase 2: Enhanced AI Extraction

**Goal:** Improve AI extraction to capture strategic co-investor intelligence

- [x] **Task 2.1:** Enhance AI Extraction Prompts
  - Files: `convex/enhancedProcessing.ts`
  - Details: Update extraction prompts to capture fee structures, performance data, and relationship patterns
- [x] **Task 2.2:** Test Enhanced Extraction
  - Files: Document processing pipeline
  - Details: Verify enhanced extraction captures strategic co-investor data
- [x] **Task 2.3:** Update Data Storage
  - Files: `convex/enhancedProcessing.ts`
  - Details: Store enhanced co-investor data in database

### Phase 3: Advanced Analytics Engine

**Goal:** Build relationship strength algorithms and strategic intelligence

- [x] **Task 3.1:** Create Advanced Analytics Library
  - Files: `lib/co-investors.ts`
  - Details: Implement relationship strength calculation, network analysis, and strategic recommendations
- [x] **Task 3.2:** Build Deal Sourcing Intelligence
  - Files: `lib/co-investors.ts`
  - Details: Create deal sourcing recommendation algorithms
- [x] **Task 3.3:** Implement Performance Benchmarking
  - Files: `lib/co-investors.ts`
  - Details: Build performance analysis across co-investment relationships

### Phase 4: Enhanced Network Intelligence Dashboard

**Goal:** Display comprehensive co-investor analytics and strategic insights

- [x] **Task 4.1:** Update Network Overview Component
  - Files: `src/components/network/NetworkOverview.tsx`
  - Details: Display enhanced co-investor metrics, relationship networks, and strategic recommendations
- [x] **Task 4.2:** Add Co-Investment Deal Tracking
  - Files: `src/components/network/NetworkOverview.tsx`
  - Details: Show co-investment deal performance and fee analysis
- [x] **Task 4.3:** Implement Strategic Intelligence Display
  - Files: `src/components/network/NetworkOverview.tsx`
  - Details: Show deal sourcing opportunities and relationship insights

### Phase 5: Basic Code Validation (AI-Only)

**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [x] **Task 5.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
- [x] **Task 5.2:** Static Logic Review
  - Files: Modified business logic files
  - Details: Read code to verify logic syntax, edge case handling, fallback patterns
- [x] **Task 5.3:** File Content Verification (if applicable)
  - Files: Modified configuration files
  - Details: Read files to verify data structure, configuration correctness (NO live database/API calls)

🛑 **CRITICAL WORKFLOW CHECKPOINT**
After completing Phase 5, you MUST:

1. Present "Implementation Complete!" message (exact text from section 16)
2. Wait for user approval of code review
3. Execute comprehensive code review process
4. NEVER proceed to user testing without completing code review first

### Phase 6: Comprehensive Code Review (Mandatory)

**Goal:** Present implementation completion and request thorough code review

- [x] **Task 6.1:** Present "Implementation Complete!" Message (MANDATORY)
  - Template: Use exact message from section 16, step 7
  - Details: STOP here and wait for user code review approval
- [x] **Task 6.2:** Execute Comprehensive Code Review (If Approved)
  - Process: Follow step 8 comprehensive review checklist from section 16
  - Details: Read all files, verify requirements, integration testing, provide detailed summary

### Phase 7: User Browser Testing (Only After Code Review)

**Goal:** Request human testing for UI/UX functionality that requires browser interaction

- [x] **Task 7.1:** Present AI Testing Results
  - Files: Summary of automated test results
  - Details: Provide comprehensive results of all AI-verifiable testing
- [x] **Task 7.2:** Request User UI Testing
  - Files: Specific browser testing checklist for user
  - Details: Clear instructions for user to verify UI behavior, interactions, visual changes
- [x] **Task 7.3:** Wait for User Confirmation
  - Files: N/A
  - Details: Wait for user to complete browser testing and confirm results

---

## 12. Task Completion Tracking - MANDATORY WORKFLOW

### Task Completion Tracking - MANDATORY WORKFLOW

🚨 **CRITICAL: Real-time task completion tracking is mandatory**

- [x] **🗓️ GET TODAY'S DATE FIRST** - Before adding any completion timestamps, use the `time` tool to get the correct current date (fallback to web search if time tool unavailable)
- [x] **Update task document immediately** after each completed subtask
- [x] **Mark checkboxes as [x]** with completion timestamp using ACTUAL current date (not assumed date)
- [x] **Add brief completion notes** (file paths, key changes, etc.)
- [x] **This serves multiple purposes:**
  - [x] **Forces verification** - You must confirm you actually did what you said
  - [x] **Provides user visibility** - Clear progress tracking throughout implementation
  - [x] **Prevents skipped steps** - Systematic approach ensures nothing is missed
  - [x] **Creates audit trail** - Documentation of what was actually completed
  - [x] **Enables better debugging** - If issues arise, easy to see what was changed

### Example Task Completion Format

```
### Phase 1: Database Cleanup
**Goal:** Remove usage tracking infrastructure and simplify subscription schema

- [x] **Task 1.1:** Create Database Migration for Usage Table Removal ✓ 2025-07-24
  - Files: `drizzle/migrations/0009_flashy_risque.sql` ✓
  - Details: Dropped user_usage table, simplified users subscription_tier enum ✓
- [x] **Task 1.2:** Update Database Schema Files ✓ 2025-07-24
  - Files: `lib/drizzle/schema/users.ts` (updated enum), `lib/drizzle/schema/ai_models.ts` (removed is_premium_model) ✓
  - Details: Binary free/paid system implemented ✓
- [x] **Task 1.3:** Apply Migration ✓ 2025-07-24
  - Command: `npm run db:migrate` executed successfully ✓
  - Details: Schema changes applied to development database ✓
```

---

## 13. File Structure & Organization

### New Files to Create

```
project-root/
├── lib/
│   └── co-investors.ts                    # Advanced co-investor analytics
├── app/actions/
│   └── co-investors.ts                    # Co-investor mutations
└── components/co-investors/
    ├── CoInvestorProfile.tsx              # Detailed co-investor profiles
    ├── CoInvestorNetworkGraph.tsx         # Relationship network visualization
    ├── CoInvestmentDealTracker.tsx        # Deal tracking with fee analysis
    └── StrategicIntelligence.tsx          # Strategic recommendations
```

**File Organization Rules:**

- **Components**: Always in `components/co-investors/` directories for feature-specific components
- **Pages**: Only `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` in `app/` routes
- **Server Actions**: In `app/actions/co-investors.ts` files (mutations only)
- **Complex Queries**: In `lib/co-investors.ts` files (when needed)
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
📁 What's in your lib/co-investors.ts file?
│
├─ 🔴 Server-only imports + Client-safe utilities?
│  └─ ✅ SPLIT: Create lib/co-investors-client.ts for client utilities
│
├─ 🟢 Only server-side operations?
│  └─ ✅ KEEP: Single lib/co-investors.ts file (server-only)
│
└─ 🟢 Only client-safe utilities?
   └─ ✅ KEEP: Single lib/co-investors.ts file (client-safe)
```

**File Naming Pattern:**

- `lib/co-investors.ts` - Server-side operations and re-exports
- `lib/co-investors-client.ts` - Client-safe utilities only
- Example: `lib/co-investors.ts` + `lib/co-investors-client.ts`

### Files to Modify

- [x] **`convex/enhancedProcessing.ts`** - Enhanced AI extraction prompts
- [x] **`convex/schema.ts`** - Enhanced co-investor schema and new co-investment deals table
- [x] **`convex/queries.ts`** - New queries for co-investor analytics
- [x] **`convex/mutations.ts`** - New mutations for co-investment deal tracking
- [x] **`src/components/network/NetworkOverview.tsx`** - Display enhanced co-investor intelligence

### Dependencies to Add

```json
{
  "dependencies": {
    "d3": "^7.8.5",
    "react-force-graph-2d": "^1.25.2"
  }
}
```

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze

- [x] **Error Scenario 1:** Enhanced AI extraction fails to capture fee structures from diverse fund report formats
  - **Code Review Focus:** AI prompt engineering in `convex/enhancedProcessing.ts`
  - **Potential Fix:** Add more specific examples in AI prompts for fee structure extraction
- [x] **Error Scenario 2:** Co-investment deal tracking creates performance issues with large datasets
  - **Code Review Focus:** Database queries in `lib/co-investors.ts`
  - **Potential Fix:** Add database indexes for common query patterns
- [x] **Error Scenario 3:** Network visualization becomes slow with many co-investor relationships
  - **Code Review Focus:** React components in `components/co-investors/`
  - **Potential Fix:** Implement virtual scrolling or pagination for large networks

### Edge Cases to Consider

- [x] **Edge Case 1:** Fund reports with no co-investor mentions or incomplete data
  - **Analysis Approach:** Check fallback behavior in extraction logic
  - **Recommendation:** Graceful degradation with partial data display
- [x] **Edge Case 2:** Co-investors with identical names requiring disambiguation
  - **Analysis Approach:** Review deduplication logic in relationship mapping
  - **Recommendation:** Use company/firm matching for disambiguation

### Security & Access Control Review

- [x] **Admin Access Control:** Co-investor data is business intelligence - no additional access controls needed beyond existing user authentication
  - **Check:** Existing authentication in middleware and component access
- [x] **Authentication State:** System handles authenticated users appropriately for co-investor data access
  - **Check:** UserContext provides proper authentication state
- [x] **Form Input Validation:** No new user inputs requiring validation - all data extracted from documents
  - **Check:** AI extraction processes trusted document content
- [x] **Permission Boundaries:** Co-investor data is internal business intelligence - no external access concerns
  - **Check:** All access through authenticated user sessions

### AI Agent Analysis Approach

**Focus:** Review existing code to identify potential failure points and security gaps. When issues are found, provide specific recommendations with file paths and code examples. This is code analysis and gap identification - not writing tests or test procedures.

**Priority Order:**

1. **Critical:** Security and access control issues
2. **Important:** User-facing error scenarios and edge cases
3. **Nice-to-have:** UX improvements and enhanced error messaging

---

## 15. Deployment & Configuration

### Environment Variables

```bash
# No new environment variables required - uses existing OpenAI configuration
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

- [x] Ask for clarification if requirements are unclear
- [x] Provide regular progress updates
- [x] Flag any blockers or concerns immediately
- [x] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW

🚨 **MANDATORY: Always follow this exact sequence:**

1. **EVALUATE STRATEGIC NEED FIRST (Required)**
   - [x] **Assess complexity** - Is this a straightforward change or are there multiple viable approaches?
   - [x] **Review the criteria** in "Strategic Analysis & Solution Options" section
   - [x] **Decision point**: Skip to step 3 if straightforward, proceed to step 2 if strategic analysis needed

2. **STRATEGIC ANALYSIS SECOND (If needed)**
   - [x] **Present solution options** with pros/cons analysis for each approach
   - [x] **Include implementation complexity, time estimates, and risk levels** for each option
   - [x] **Provide clear recommendation** with rationale
   - [x] **Wait for user decision** on preferred approach before proceeding
   - [x] **Document approved strategy** for inclusion in task document

3. **CREATE TASK DOCUMENT THIRD (Required)**
   - [x] **Create a new task document** in the `ai_docs/tasks/` directory using this template
   - [x] **Fill out all sections** with specific details for the requested feature
   - [x] **Include strategic analysis** (if conducted) in the appropriate section
   - [x] **🔢 FIND LATEST TASK NUMBER**: Use `list_dir` to examine ai_docs/tasks/ directory and find the highest numbered task file (e.g., if highest is 028, use 029)
   - [x] **Name the file** using the pattern `XXX_feature_name.md` (where XXX is the next incremental number)
   - [x] **🚨 MANDATORY: POPULATE CODE CHANGES OVERVIEW**: Always read existing files and show before/after code snippets in section 9
   - [x] **Present a summary** of the task document to the user for review

4. **PRESENT IMPLEMENTATION OPTIONS (Required)**
   - [x] **After incorporating user feedback**, present these 3 exact options:

   **👤 IMPLEMENTATION OPTIONS:**

   **A) Preview High-Level Code Changes**
   Would you like me to show you detailed code snippets and specific changes before implementing? I'll walk through exactly what files will be modified and show before/after code examples.

   **B) Proceed with Implementation**
   Ready to begin implementation? Say "Approved" or "Go ahead" and I'll start implementing phase by phase.

   **C) Provide More Feedback**
   Have questions or want to modify the approach? I can adjust the plan based on additional requirements or concerns.
   - [x] **Wait for explicit user choice** (A, B, or C) - never assume or default
   - [x] **If A chosen**: Provide detailed code snippets showing exact changes planned
   - [x] **If B chosen**: Begin phase-by-phase implementation immediately
   - [x] **If C chosen**: Address feedback and re-present options

5. **IMPLEMENT PHASE-BY-PHASE (Only after Option B approval)**

   **MANDATORY PHASE WORKFLOW:**

   For each phase, follow this exact pattern:

   a. **Execute Phase Completely** - Complete all tasks in current phase
   b. **Update Task Document** - Mark all completed tasks as [x] with timestamps
   c. **Provide Specific Phase Recap** using this format:

   ```
   ✅ **Phase [X] Complete - [Phase Name]**
   - Modified [X] files with [Y] total line changes
   - Key changes: [specific file paths and what was modified]
   - Files updated:
     • file1.ts (+15 lines): [brief description of changes]
     • file2.tsx (-3 lines, +8 lines): [brief description of changes]
   - Commands executed: [list any commands run]
   - Linting status: ✅ All files pass / ❌ [specific issues found]

   **🔄 Next: Phase [X+1] - [Phase Name]**
   - Will modify: [specific files]
   - Changes planned: [brief description]
   - Estimated scope: [number of files/changes expected]

   **Say "proceed" to continue to Phase [X+1]**
   ```

   d. **Wait for "proceed"** before starting next phase
   e. **Repeat for each phase** until all implementation complete
   f. **🚨 CRITICAL:** After final implementation phase, you MUST proceed to Phase 5 (Comprehensive Code Review) before any user testing

   **🚨 PHASE-SPECIFIC REQUIREMENTS:**
   - [x] **Real-time task completion tracking** - Update task document immediately after each subtask

- [x] **Mark checkboxes as [x]** with completion timestamps
- [x] **Add specific completion notes** (file paths, line counts, key changes)
- [x] **Run linting on each modified file** during the phase (static analysis only - no dev server/build commands)
- [x] **🚨 MANDATORY: For ANY database changes, create down migration file BEFORE running `npm run db:migrate`**
  - [x] Follow `drizzle_down_migration.md` template process
  - [x] Create `drizzle/migrations/[timestamp]/down.sql` file
  - [x] Verify all operations use `IF EXISTS` and include warnings
  - [x] Only then run `npm run db:migrate`
  - [x] **For any new page route, create `loading.tsx` and `error.tsx` files alongside `page.tsx`**
- [x] **Always create components in `components/[feature]/` directories**
- [x] **🚨 MANDATORY WORKFLOW SEQUENCE:** After implementation phases, follow this exact order:
  - [x] **Phase 4 Complete** → Present "Implementation Complete!" message (section 16, step 7)
  - [x] **Wait for user approval** → Execute comprehensive code review (section 16, step 8)
  - [x] **Code review complete** → ONLY THEN request user browser testing
  - [x] **NEVER skip comprehensive code review** - Phase 4 basic validation ≠ comprehensive review
- [x] **NEVER plan manual browser testing as AI task** - always mark as "👤 USER TESTING" and wait for user confirmation

6. **VERIFY LIB FILE ARCHITECTURE (For any lib/ changes)**
   - [x] **Audit new lib files** for server/client mixing
   - [x] **Check import chains** - trace what server dependencies are pulled in
   - [x] **Test client component imports** - ensure no boundary violations
   - [x] **Split files if needed** using `[feature]-client.ts` pattern
   - [x] **Update import statements** in client components to use client-safe files

7. **FINAL CODE REVIEW RECOMMENDATION (Mandatory after all phases)**
   - [x] **Present this exact message** to user after all implementation complete:

   ```
   🎉 **Implementation Complete!**

   All phases have been implemented successfully. I've made changes to [X] files across [Y] phases.

   **📋 I recommend doing a thorough code review of all changes to ensure:**
   - No mistakes were introduced
   - All goals were achieved
   - Code follows project standards
   - Everything will work as expected

   **Would you like me to proceed with the comprehensive code review?**

   This review will include:
   - Verifying all changes match the intended goals
   - Running linting and type-checking on all modified files
   - Checking for any integration issues
   - Confirming all requirements were met
   ```

   - [x] **Wait for user approval** of code review
   - [x] **If approved**: Execute comprehensive code review process below

8. **COMPREHENSIVE CODE REVIEW PROCESS (If user approves)**
   - [x] **Read all modified files** and verify changes match task requirements exactly
   - [x] **Run linting and type-checking** on all modified files using appropriate commands
   - [x] **Check for integration issues** between modified components
   - [x] **Verify all success criteria** from task document are met
   - [x] **Test critical workflows** affected by changes
   - [x] **Provide detailed review summary** using this format:

   ```
   ✅ **Code Review Complete**

   **Files Reviewed:** [list all modified files with line counts]
   **Linting Status:** ✅ All files pass / ❌ [specific issues found]
   **Type Checking:** ✅ No type errors / ❌ [specific type issues]
   **Integration Check:** ✅ Components work together properly / ❌ [issues found]
   **Requirements Met:** ✅ All success criteria achieved / ❌ [missing requirements]

   **Summary:** [brief summary of what was accomplished and verified]
   **Confidence Level:** High/Medium/Low - [specific reasoning]
   **Recommendations:** [any follow-up suggestions or improvements]
   ```

### What Constitutes "Explicit User Approval"

#### For Strategic Analysis

**✅ STRATEGIC APPROVAL RESPONSES (Proceed to task document creation):**

- "Option 1 looks good"
- "Go with your recommendation"
- "I prefer Option 2"
- "Proceed with [specific option]"
- "That approach works"
- "Yes, use that strategy"

#### For Implementation Options (A/B/C Choice)

**✅ OPTION A RESPONSES (Show detailed code previews):**

- "A" or "Option A"
- "Preview the changes"
- "Show me the code changes"
- "Let me see what will be modified"
- "Walk me through the changes"

**✅ OPTION B RESPONSES (Start implementation immediately):**

- "B" or "Option B"
- "Proceed" or "Go ahead"
- "Approved" or "Start implementation"
- "Begin" or "Execute the plan"
- "Looks good, implement it"

**✅ OPTION C RESPONSES (Provide more feedback):**

- "C" or "Option C"
- "I have questions about..."
- "Can you modify..."
- "What about..." or "How will you handle..."
- "I'd like to change..."
- "Wait, let me think about..."

#### For Phase Continuation

**✅ PHASE CONTINUATION RESPONSES:**

- "proceed"
- "continue"
- "next phase"
- "go ahead"
- "looks good"

**❓ CLARIFICATION NEEDED (Do NOT continue to next phase):**

- Questions about the completed phase
- Requests for changes to completed work
- Concerns about the implementation
- No response or silence

#### For Final Code Review

**✅ CODE REVIEW APPROVAL:**

- "proceed"
- "yes, review the code"
- "go ahead with review"
- "approved"

🛑 **NEVER start coding without explicit A/B/C choice from user!**
🛑 **NEVER continue to next phase without "proceed" confirmation!**
🛑 **NEVER skip comprehensive code review after implementation phases!**
🛑 **NEVER proceed to user testing without completing code review first!**
🛑 **NEVER run `npm run db:migrate` without first creating the down migration file using `drizzle_down_migration.md` template!**
🛑 **NEVER run application execution commands - user already has app running!**

### 🚨 CRITICAL: Command Execution Rules

**NEVER run application execution commands - the user already has their development environment running!**

**❌ FORBIDDEN COMMANDS (Will cause conflicts with running dev server):**

- `npm run dev` / `npm start` / `next dev` - User already running
- `npm run build` / `next build` - Expensive and unnecessary for validation
- Any command that starts/serves the application
- Any command that compiles/builds for production
- Any long-running processes or servers

**✅ ALLOWED COMMANDS (Safe static analysis only):**

- `npm run lint` - Static code analysis, safe to run
- `npm run type-check` / `tsc --noEmit` - Type checking only, no compilation
- Database commands (when explicitly needed): `npm run db:generate`, `npm run db:migrate`
- File reading/analysis tools

**🎯 VALIDATION STRATEGY:**

- Use linting for code quality issues
- Read files to verify logic and structure
- Check syntax and dependencies statically
- Let the user handle all application testing manually

### Code Quality Standards

- [x] Follow TypeScript best practices
- [x] Add proper error handling
- [x] **🚨 MANDATORY: Write Professional Comments - Never Historical Comments**
  - [x] **❌ NEVER write change history**: "Fixed this", "Removed function", "Updated to use new API"
  - [x] **❌ NEVER write migration artifacts**: "Moved from X", "Previously was Y"
  - [x] **✅ ALWAYS explain business logic**: "Calculate discount for premium users", "Validate permissions before deletion"
  - [x] **✅ Write for future developers** - explain what/why the code does what it does, not what you changed
  - [x] **Remove unused code completely** - don't leave comments explaining what was removed
- [x] **🚨 MANDATORY: Use early returns to keep code clean and readable**
  - [x] **Prioritize early returns** over nested if-else statements
  - [x] **Validate inputs early** and return immediately for invalid cases
  - [x] **Handle error conditions first** before proceeding with main logic
  - [x] **Exit early for edge cases** to reduce nesting and improve readability
  - [x] **Example pattern**: `if (invalid) return error; // main logic here`
- [x] **🚨 MANDATORY: Use async/await instead of .then() chaining**
  - [x] **Avoid Promise .then() chains** - use async/await for better readability
  - [x] **Use try/catch blocks** for error handling instead of .catch() chaining
  - [x] **Use Promise.all()** for concurrent operations instead of chaining multiple .then()
  - [x] **Create separate async functions** for complex operations instead of long chains
  - [x] **Example**: `const result = await operation();` instead of `operation().then(result => ...)`
- [x] **🚨 MANDATORY: NO FALLBACK BEHAVIOR - Always throw errors instead**
  - [x] **Never handle "legacy formats"** - expect the current format or fail fast
  - [x] **No "try other common fields"** fallback logic - if expected field missing, throw error
  - [x] **Fail fast and clearly** - don't mask issues with fallback behavior
  - [x] **Single expected response format** - based on current API contract
  - [x] **Throw descriptive errors** - explain exactly what format was expected vs received
  - [x] **Example**: `if (!expectedFormat) throw new Error('Expected X format, got Y');`
- [x] **🚨 MANDATORY: Create down migration files before running ANY database migration**
  - [x] Follow `drizzle_down_migration.md` template process
  - [x] Use `IF EXISTS` clauses for safe rollback operations
  - [x] Include appropriate warnings for data loss risks
- [x] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [x] **Test components in both light and dark mode**
- [x] **Verify mobile usability on devices 320px width and up**
- [x] Follow accessibility guidelines (WCAG AA)
- [x] Use semantic HTML elements
- [x] **🚨 MANDATORY: Clean up removal artifacts**
  - [x] **Never leave placeholder comments** like "// No usage tracking needed" or "// Removed for simplicity"
  - [x] **Delete empty functions/components** completely rather than leaving commented stubs
  - [x] **Remove unused imports** and dependencies after deletions
  - [x] **Clean up empty interfaces/types** that no longer serve a purpose
  - [x] **Remove dead code paths** rather than commenting them out
  - [x] **If removing code, remove it completely** - don't leave explanatory comments about what was removed

### Architecture Compliance

- [x] **✅ VERIFY: Used correct data access pattern**
  - [x] Mutations → Server Actions (`app/actions/co-investors.ts`)
  - [x] Queries → lib functions (`lib/co-investors.ts`) for complex, direct in components for simple
  - [x] API routes → Only for webhooks, file exports, external integrations
- [x] **🚨 VERIFY: No server/client boundary violations in lib files**
  - [x] Files with server imports (next/headers, supabase/server, db) don't export client-safe utilities
  - [x] Client components can import utilities without pulling in server dependencies
  - [x] Mixed server/client files are split using `-client.ts` pattern
- [x] **🚨 VERIFY: Proper context usage patterns**
  - [x] Components use available context providers (UserContext, UsageContext, etc.) instead of unnecessary props
  - [x] No duplicate data fetching when data is already available in context
  - [x] Context hooks used appropriately in components rendered inside providers
  - [x] No prop drilling when context alternative exists for the same data
  - [x] All context providers identified and mapped before designing component interfaces
- [x] **❌ AVOID: Creating unnecessary API routes for internal operations**
- [x] **❌ AVOID: Mixing server-only imports with client-safe utilities in same file**
- [x] **❌ AVOID: Prop drilling when context providers already contain the needed data**
- [x] **🔍 DOUBLE-CHECK: Does this really need an API route or should it be a Server Action/lib function?**
- [x] **🔍 DOUBLE-CHECK: Can client components safely import from all lib files they need?**
- [x] **🔍 DOUBLE-CHECK: Are components using context hooks instead of receiving context data as props?**

---

## 17. Notes & Additional Context

### Research Links

- [Co-Investment Intelligence Research](https://www.adamsstreetpartners.com/insights/integrated-platforms-can-provide-valuable-insights-for-co-investments/)
- [Private Equity Co-Investment Trends](https://www.cambridgeassociates.com/insight/making-waves-the-cresting-co-investment-opportunity/)
- [Co-Investment Fund Structures](https://carta.com/learn/private-funds/structures/co-investment/)
- [AI in Private Equity](https://dealpotential.com/private-equity-ai-tools/)
- [Data-Driven Investment Strategies](https://informaconnect.com/the-data-deluge-3-ways-private-equity-and-venture-capital-can-leverage-information-for-superior-returns/)

### **⚠️ Common Server/Client Boundary Pitfalls to Avoid**

**❌ NEVER DO:**

- Import from `next/headers` in files that export client-safe utilities
- Mix database operations with utility functions in same file
- Import from `@/lib/supabase/server` alongside client-safe functions
- Create utility files that both server and client components import without considering the import chain

**✅ ALWAYS DO:**

- Separate server operations from client utilities into different files
- Use `-client.ts` suffix for client-safe utility files
- Re-export client utilities from main file for backward compatibility
- Test that client components can import utilities without errors

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions

🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

Before implementing any changes, the AI must systematically analyze potential second-order consequences and alert the user to any significant impacts. This analysis should identify ripple effects that might not be immediately obvious but could cause problems later.

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**

- [x] **Existing API Contracts:** Enhanced co-investor data extraction may change data structures but maintains backward compatibility
- [x] **Database Dependencies:** New schema fields are optional - existing data continues to work
- [x] **Component Dependencies:** Network Intelligence Dashboard enhanced but maintains existing interface
- [x] **Authentication/Authorization:** No changes to user permissions or access patterns

#### 2. **Ripple Effects Assessment**

- [x] **Data Flow Impact:** Enhanced extraction provides richer data to existing dashboard components
- [x] **UI/UX Cascading Effects:** Network Intelligence Dashboard displays more detailed analytics
- [x] **State Management:** No changes to existing state management patterns
- [x] **Routing Dependencies:** No new routes or routing changes required

#### 3. **Performance Implications**

- [x] **Database Query Impact:** New queries for co-investor analytics may slightly increase database load
- [x] **Bundle Size:** New analytics components may increase client bundle size by ~50-100KB
- [x] **Server Load:** Enhanced AI extraction may increase processing time for document analysis
- [x] **Caching Strategy:** No changes to existing caching mechanisms

#### 4. **Security Considerations**

- [x] **Attack Surface:** No new external APIs or user inputs - all data from internal document processing
- [x] **Data Exposure:** Co-investor intelligence is internal business data - no external access concerns
- [x] **Permission Escalation:** No changes to user permissions or access controls
- [x] **Input Validation:** No new user inputs requiring validation - all data extracted from trusted documents

#### 5. **User Experience Impacts**

- [x] **Workflow Disruption:** Enhanced dashboard provides more insights without changing existing workflows
- [x] **Data Migration:** No user data migration required - enhancements are additive
- [x] **Feature Deprecation:** No existing features being removed or significantly changed
- [x] **Learning Curve:** New analytics features are additive and don't require user training

#### 6. **Maintenance Burden**

- [x] **Code Complexity:** New analytics algorithms add moderate complexity but follow existing patterns
- [x] **Dependencies:** New D3.js and react-force-graph-2d dependencies for network visualization
- [x] **Testing Overhead:** New analytics features require additional test coverage
- [x] **Documentation:** Analytics features need documentation for business users

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**

These issues must be brought to the user's attention before implementation:

- [ ] **Database Migration Required:** Changes that require data migration in production
- [ ] **Breaking API Changes:** Modifications that will break existing integrations
- [ ] **Performance Degradation:** Changes likely to significantly impact application speed
- [ ] **Security Vulnerabilities:** New attack vectors or data exposure risks
- [ ] **User Data Loss:** Risk of losing or corrupting existing user data

#### ⚠️ **YELLOW FLAGS - Discuss with User**

These issues should be discussed but may not block implementation:

- [x] **Increased Complexity:** New analytics algorithms add complexity to the codebase
- [x] **New Dependencies:** D3.js and react-force-graph-2d for network visualization (~100KB bundle increase)
- [x] **UI/UX Changes:** Enhanced dashboard displays more detailed co-investor analytics
- [x] **Maintenance Overhead:** New analytics features require ongoing maintenance and documentation

### Mitigation Strategies

#### Database Changes

- [x] **Backup Strategy:** Ensure database backups before schema changes
- [x] **Rollback Plan:** Define clear rollback procedures for database migrations
- [x] **Staging Testing:** Test all database changes in staging environment first
- [x] **Gradual Migration:** Plan for gradual data migration if needed

#### API Changes

- [x] **Versioning Strategy:** Use API versioning to maintain backward compatibility
- [x] **Deprecation Timeline:** Provide clear timeline for deprecated features
- [x] **Client Communication:** Notify API consumers of breaking changes in advance
- [x] **Graceful Degradation:** Ensure old clients can still function during transition

#### UI/UX Changes

- [x] **Feature Flags:** Use feature flags to gradually roll out UI changes
- [x] **User Communication:** Notify users of interface changes through appropriate channels
- [x] **Help Documentation:** Update help documentation before releasing changes
- [x] **Feedback Collection:** Plan for collecting user feedback on changes

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:

- [x] **Complete Impact Analysis:** Fill out all sections of the impact assessment
- [x] **Identify Critical Issues:** Flag any red or yellow flag items
- [x] **Propose Mitigation:** Suggest specific mitigation strategies for identified risks
- [x] **Alert User:** Clearly communicate any significant second-order impacts
- [x] **Recommend Alternatives:** If high-risk impacts are identified, suggest alternative approaches

### Example Analysis Template

```
🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
- Database schema change will require migration of 10,000+ existing records
- API endpoint `/api/users` response format changing (affects mobile app)

**Performance Implications:**
- New JOIN query may slow down dashboard load time by 200ms
- Additional React components will increase bundle size by 15KB

**Security Considerations:**
- New user input field requires XSS protection
- API endpoint needs rate limiting to prevent abuse

**User Experience Impacts:**
- Navigation menu restructure may confuse existing users
- New required field will interrupt existing signup flow

**Mitigation Recommendations:**
- Implement database migration script with rollback capability
- Use API versioning to maintain backward compatibility
- Add performance monitoring for new queries
- Plan user communication strategy for UI changes

**🚨 USER ATTENTION REQUIRED:**
The database migration will require approximately 30 minutes of downtime. Please confirm if this is acceptable for your deployment schedule.
```

---

_Template Version: 1.3_
_Last Updated: 8/26/2025_
_Created By: Brandon Hancock_
