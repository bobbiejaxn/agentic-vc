# External Data Enrichment Foundation

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** External Data Enrichment Foundation - Exa.ai & Firecrawl Integration

### Goal Statement
**Goal:** Establish the foundational infrastructure for external data enrichment by integrating Exa.ai and Firecrawl APIs into the Convex backend, creating reusable data enrichment services with caching, rate limiting, and error handling that will be used by Tier 2 and Tier 3 extraction pipelines.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis

**✅ CONDUCTING STRATEGIC ANALYSIS:**
- Multiple viable architectural approaches for external API integration
- Trade-offs between different caching strategies
- Performance implications of external API calls in extraction pipeline
- Cost considerations for API usage at scale
- User requirements could be met through different enrichment strategies

### Problem Context
The current Tier 2 and Tier 3 extraction relies solely on LLM analysis of document content, creating a fundamental architectural limitation for market intelligence. Based on lessons learned from document processing implementation, we understand that:

1. **Schema-first development is critical** - We must define external enrichment schemas before implementing API integration
2. **External API integration requires robust error handling** - The enrichment infrastructure must handle rate limits, service outages, and data quality variations
3. **Real-time subscriptions eliminate manual refreshing** - Enrichment progress must be tracked and displayed to users in real-time
4. **Environment-driven feature tiers enable graceful degradation** - The system must function with or without external API keys
5. **Component abstraction enables reusability** - Enrichment services must be reusable across Tier 2 and Tier 3 pipelines

To transform document-only analysis into true market intelligence, we need external data enrichment that validates, expands, and enriches extracted information with live market data from Exa.ai (search API) and Firecrawl (web scraping). This architectural decision will significantly impact extraction quality, performance, and costs.

### Solution Options Analysis

#### Option 1: Real-time Enrichment Model
**Approach:** Call external APIs immediately during document extraction, no caching, always fetch latest data.

**Pros:**
- ✅ Always up-to-date market intelligence
- ✅ Real-time competitive advantage
- ✅ Fresh data for every extraction

**Cons:**
- ❌ High API costs (duplicate lookups for same companies)
- ❌ Slower extraction performance
- ❌ Rate limiting vulnerability
- ❌ Dependency on external service availability

**Implementation Complexity:** Medium - Simple architecture, robust error handling needed
**Risk Level:** High - Performance and cost unpredictability

#### Option 2: Smart Caching with TTL
**Approach:** Implement intelligent caching system with configurable TTL (Time-To-Live) for different data types, background refresh for frequently accessed data.

**Pros:**
- ✅ 80-90% reduction in API costs for repeated lookups
- ✅ Faster extraction performance
- ✅ Resilient to external service outages
- ✅ Predictable cost structure
- ✅ Can serve cached data during rate limits

**Cons:**
- ❌ Data freshness depends on TTL strategy
- ❌ More complex caching logic to implement
- ❌ Cache storage requirements in Convex

**Implementation Complexity:** High - Cache management, invalidation logic, background jobs
**Risk Level:** Medium - Cache consistency challenges

#### Option 3: Hybrid Enrichment Strategy
**Approach:** Combine immediate enrichment for critical data with cached enrichment for supplementary data. Use background jobs for continuous portfolio monitoring.

**Pros:**
- ✅ Optimal balance of freshness and cost
- ✅ Immediate value for high-priority intelligence
- ✅ Background monitoring for long-term value
- ✅ Scalable architecture for different user tiers
- ✅ Can prioritize API spend by importance

**Cons:**
- ❌ Most complex implementation
- ❌ Requires background job scheduling
- ❌ Multiple enrichment pathways to manage
- ❌ More sophisticated error handling

**Implementation Complexity:** High - Complex orchestration, job scheduling, multiple strategies
**Risk Level:** Medium - Complexity introduces more failure points

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 2 - Smart Caching with TTL

**Why this is the best choice:**
1. **Cost Efficiency:** 80-90% reduction in duplicate API calls for same companies/sectors
2. **Performance:** Faster extraction times with cached data availability
3. **Resilience:** Can serve cached data during API outages or rate limits
4. **Scalability:** Predictable cost structure as usage grows
5. **Simplicity:** Single enrichment strategy with clear cache management

**Key Decision Factors:**
- **Performance Impact:** Significant improvement over real-time model
- **User Experience:** Faster extraction, more consistent results
- **Maintainability:** Clear caching logic, easier to debug than hybrid approach
- **Scalability:** Linear cost scaling vs exponential with real-time model
- **Security:** All API calls server-side, no external data exposure

**Alternative Consideration:**
The Hybrid approach (Option 3) would be ideal for an enterprise product with different user tiers, but the complexity outweighs benefits for current deployment. We can evolve to hybrid later if user feedback shows need for different enrichment priorities.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended Smart Caching with TTL approach, or would you prefer a different strategy?

**Questions for you to consider:**
- How important is real-time data vs cost efficiency for your use case?
- Are you comfortable with data being potentially hours old for market intelligence?
- Do you have budget constraints that make API cost optimization critical?

**Next Steps:**
Once you approve the strategic direction, I'll update the implementation plan and present you with next step options.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** React 19, Vite, TypeScript 5.4, Convex backend
- **Language:** TypeScript 5.4 with strict mode
- **Database & Backend:** Convex for database, serverless functions, and real-time subscriptions
- **UI & Styling:** shadcn/ui components with Tailwind CSS v4
- **AI Integration:** Mistral (OCR) + OpenAI (enhanced processing and chat)
- **Key Architectural Patterns:** Real-time subscriptions to Convex data, Document processing pipeline
- **Relevant Existing Components:** Document processing pipeline, Enhanced processing functions

### Current State
Currently, the system has:
- Basic Tier 2/3 extraction using only LLM analysis of document content
- Environment variables configured for Exa.ai and Firecrawl APIs
- No external data enrichment implementation
- No caching infrastructure for external data
- Document processing pipeline that can be extended

### Existing Context Providers Analysis
- **UserContext:** User authentication and basic profile data
- **ThemeContext:** Dark/light mode support
- **Document Context:** Real-time document processing status via Convex queries
- **No external data context providers:** Currently no external data management

**🔍 Context Coverage Analysis:**
- Document processing data is available via real-time queries
- No external market data integration currently exists
- Processing status is tracked but external enrichment status is not
- Cache management will need new context/state management

## 4. Context & Problem Definition

### Problem Statement
The current Tier 2 and Tier 3 extraction produces strategic intelligence and advanced analytics based solely on the content within uploaded documents. This limits the intelligence quality because:
1. **Limited Scope:** Only knows what's in the document, missing broader market context
2. **Static Data:** No validation against current market realities
3. **Incomplete Networks:** Can't verify co-investor networks or company relationships
4. **No Benchmarking:** Cannot compare portfolio performance against market baselines
5. **Missed Opportunities:** No detection of emerging trends or competitive threats

### Success Criteria
- [ ] **Schema-first external enrichment data models** with TypeScript literal types and proper validation
- [ ] **Robust external API integration** with comprehensive error handling, retry mechanisms, timeouts, and exponential backoff for Exa.ai and Firecrawl
- [ ] **Real-time enrichment progress tracking** using Convex subscriptions to eliminate manual UI refreshing and improve user experience
- [ ] **Environment-driven feature tiers** enabling graceful degradation when external API keys are unavailable (basic OCR → enhanced processing → full enrichment)
- [ ] **Smart caching system** with configurable TTL for different data types to optimize costs and performance
- [ ] **Reusable enrichment components** that can be abstracted and used across Tier 2 and Tier 3 pipelines
- [ ] **Rate limiting management** to avoid API service interruptions with exponential backoff and proper timeout handling
- [ ] **Cost optimization** through intelligent cache utilization and usage monitoring with clear cost tracking
- [ ] **Performance improvements** in extraction speed with cached data and parallel processing
- [ ] **Comprehensive logging and monitoring** of enrichment operations for debugging and optimization
- [ ] **Type safety enforcement** with proper TypeScript literal union types to prevent runtime errors
- [ ] **Progressive enhancement** allowing system to function at different capability levels based on available API keys

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is a new feature in active development**
- **No backwards compatibility concerns** - safe to add new external enrichment
- **Data migration acceptable** - can populate cache progressively as documents are processed
- **Priority: Robust error handling and cost optimization** over absolute real-time freshness
- **Iterative development allowed** - can start with basic caching and enhance over time
- **Progress tracking essential** - Users expect real-time feedback during long-running enrichment processes
- **Component abstraction critical** - Enrichment services must be reusable across Tier 2 and Tier 3 pipelines
- **Schema-first approach required** - All enrichment data models must be defined before implementation
- **Type safety mandatory** - Use TypeScript literal union types for all enrichment-related enums and status fields

---

## 6. Technical Requirements

### Functional Requirements
- [Requirement 1: System can enrich company data using Exa.ai search API]
- [Requirement 2: System can crawl web content using Firecrawl for detailed information]
- [Requirement 3: System caches enrichment results with configurable TTL based on data type]
- [Requirement 4: System handles API failures gracefully and serves cached data when available]
- [Requirement 5: System implements rate limiting to avoid external service interruptions]
- [Requirement 6: System logs enrichment operations for monitoring and debugging]
- [Requirement 7: System provides cost optimization through intelligent cache usage]

### Non-Functional Requirements
- **Performance:** Enrichment should add less than 10 seconds to document processing time (with cache hits)
- **Security:** All API calls server-side, no external API keys exposed to client
- **Usability:** Clear enrichment status indicators in UI with real-time progress tracking
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Compatible with existing Convex schema and document processing pipeline
- **Context Preservation:** External enrichment must maintain semantic context with extracted entities while respecting API limits
- **Progressive Enhancement:** System must provide value at each enrichment tier (basic → enhanced → full)
- **Real-time Feedback:** Users must see enrichment progress without manual UI refreshing

### Technical Constraints
- [Constraint 1: Must use existing Convex backend architecture]
- [Constraint 2: Cannot modify existing document schema structure]
- [Constraint 3: Must be backward compatible with current extraction pipeline]
- [Constraint 4: API rate limits must be respected (Exa.ai: 1000 requests/month, Firecrawl: varies by plan)]

---

## 7. Data & Database Changes

### Database Schema Changes
```typescript
// External enrichment types with literal union types for type safety
const ENRICHMENT_TYPES = ["company", "person", "market", "sector"] as const;
const SOURCE_TYPES = ["exa_search", "firecrawl_web"] as const;

// New tables for external enrichment - schema-first approach
export const externalEnrichmentCache = defineTable({
  // Primary enrichment data with strict typing
  enrichmentType: v.union(v.literal(ENRICHMENT_TYPES[0]), v.literal(ENRICHMENT_TYPES[1]), v.literal(ENRICHMENT_TYPES[2]), v.literal(ENRICHMENT_TYPES[3])),
  enrichmentKey: v.string(),  // Normalized key for caching (e.g., company name)

  // Source and timing with explicit const assertions
  sourceType: v.union(v.literal(SOURCE_TYPES[0]), v.literal(SOURCE_TYPES[1])),
  sourceUrl: v.optional(v.string()),
  fetchedAt: v.number(),      // Timestamp for cache invalidation

  // Cached data and metadata
  data: v.any(),              // The actual enriched data
  confidence: v.number(),     // Confidence score from source (0-1)
  ttlHours: v.number(),       // How long this data should be cached
  dataQuality: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),

  // Usage tracking for performance optimization
  lastAccessedAt: v.number(),
  accessCount: v.number(),
  costEstimate: v.number(),   // Estimated API cost for this cache entry

  // Error handling and retry tracking
  retryCount: v.number(),
  lastError: v.optional(v.string()),
  nextRetryAt: v.optional(v.number()),
})
.index(["enrichmentType", "enrichmentKey"])
.index(["fetchedAt"])
.index(["dataQuality", "confidence"]);

// Job types with literal union types for job management
const JOB_TYPES = ["company_enrichment", "market_research", "validation", "caching"] as const;
const JOB_STATUS = ["pending", "running", "completed", "failed", "retrying"] as const;
const PRIORITY_LEVELS = ["high", "medium", "low"] as const;

export const enrichmentJobs = defineTable({
  // Job tracking with strict typing
  jobType: v.union(v.literal(JOB_TYPES[0]), v.literal(JOB_TYPES[1]), v.literal(JOB_TYPES[2]), v.literal(JOB_TYPES[3])),
  status: v.union(v.literal(JOB_STATUS[0]), v.literal(JOB_STATUS[1]), v.literal(JOB_STATUS[2]), v.literal(JOB_STATUS[3]), v.literal(JOB_STATUS[4])),

  // Input parameters with validation
  input: v.object({
    enrichmentType: v.union(v.literal(ENRICHMENT_TYPES[0]), v.literal(ENRICHMENT_TYPES[1]), v.literal(ENRICHMENT_TYPES[2]), v.literal(ENRICHMENT_TYPES[3])),
    enrichmentKey: v.string(),
    priority: v.union(v.literal(PRIORITY_LEVELS[0]), v.literal(PRIORITY_LEVELS[1]), v.literal(PRIORITY_LEVELS[2])),
    documentId: v.optional(v.id("documents")),
    requestedAt: v.number(),
  }),

  // Results and metadata
  result: v.optional(v.any()),
  error: v.optional(v.string()),
  errorMessage: v.optional(v.string()), // Detailed error information

  // Progress tracking for real-time UI updates (eliminates manual refreshing)
  progress: v.number(),       // 0-100 completion percentage
  currentStep: v.optional(v.string()),
  stepsCompleted: v.number(),
  totalSteps: v.number(),

  // Timing and performance metrics
  createdAt: v.number(),
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  duration: v.optional(v.number()),

  // Cost and usage tracking
  apiCallsUsed: v.number(),
  estimatedCost: v.number(),
  actualCost: v.number(),

  // Retry and error handling (robust external API integration)
  retryCount: v.number(),
  lastRetryAt: v.optional(v.number()),
  maxRetries: v.number(),
})
.index(["status", "createdAt"])
.index(["jobType", "priority"])
.index(["documentId"])
.index(["progress"]);
```

### Data Model Updates
```typescript
// External enrichment types
export interface CompanyEnrichment {
  basicInfo: {
    name: string;
    description: string;
    website: string;
    foundedYear: number;
    employeeCount: number;
  };
  funding: {
    totalRaised: number;
    lastRound: {
      amount: number;
      date: string;
      investors: string[];
    };
    valuation: number;
  };
  market: {
    sector: string;
    subsector: string;
    geography: string;
    marketCap?: number;
  };
  recentNews: Array<{
    title: string;
    url: string;
    date: string;
    sentiment: "positive" | "negative" | "neutral";
  }>;
  confidence: number;
  lastUpdated: string;
}

export interface MarketIntelligence {
  sector: string;
  trends: Array<{
    topic: string;
    impact: "high" | "medium" | "low";
    timeframe: "current" | "emerging" | "long-term";
  }>;
  competitors: Array<{
    name: string;
    relation: "direct" | "indirect" | "adjacent";
  }>;
  marketSize: {
    current: number;
    projected: number;
    growthRate: number;
  };
  confidence: number;
  lastUpdated: string;
}
```

### Data Migration Plan
- [ ] [Migration step 1] Create externalEnrichmentCache and enrichmentJobs tables
- [ ] [Migration step 2] Set up indexes for efficient cache lookup
- [ ] [Migration step 3] Add validation for new table structures
- [ ] [Data validation steps] Verify cache operations work correctly

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
- [ ] **Server Actions File** - `convex/actions/externalEnrichment.ts` - ONLY mutations (create, update, delete cache entries, create jobs)
- [ ] Examples: `createEnrichmentJob()`, `updateCacheEntry()`, `invalidateCache()`
- [ ] Must use `'use server'` directive and `revalidatePath()` after mutations
- [ ] **What qualifies as mutations**: Cache updates, job creation, cache invalidation

#### **QUERIES (Data Fetching)** → Choose based on complexity:

**Simple Queries** → Direct in Server Components
- [ ] **Direct in Page Components** - Simple `await db.select().from(externalEnrichmentCache)` calls
- [ ] Example: `const cacheEntry = await db.select().from(externalEnrichmentCache).where(eq(externalEnrichmentCache.enrichmentKey, key))`
- [ ] Use when: Single table, simple WHERE clause, used in only 1-2 places

**Complex Queries** → `lib/[feature].ts`
- [ ] **Query Functions in lib/** - `convex/lib/externalEnrichment.ts` for complex/reused queries
- [ ] Example: `getCompanyEnrichment()`, `getValidCacheEntries()`, `getEnrichmentJobs()`
- [ ] Use when: JOINs, aggregations, complex logic, used in 3+ places, needs efficient lookups
- [ ] **What qualifies as complex queries**: Cache invalidation logic, TTL management, batch operations

#### **API Routes** → `app/api/[endpoint]/route.ts` - **RARELY NEEDED**
🛑 **Only create API routes for these specific cases:**
- [ ] **External API Proxies** - When you need to hide API keys from client (NOT applicable - all enrichment is server-side)
- [ ] **Non-HTML Responses** - Export functionality (NOT applicable for cache management)

❌ **DO NOT use API routes for:**
- [ ] ❌ Internal cache data fetching (use lib/ functions instead)
- [ ] ❌ External API calls (use server actions instead)
- [ ] ❌ Enrichment operations (use server actions instead)

#### **PROFESSIONAL NAMING (Directory-Based Separation):**
- `convex/actions/externalEnrichment.ts` - For cache/job mutations only
- `convex/lib/externalEnrichment.ts` - For enrichment query functions and API calls
- Example: `convex/actions/externalEnrichment.ts` + `convex/lib/externalEnrichment.ts` (no API route needed)

### Server Actions
<!-- New or modified server actions for mutations -->
- [ ] **`createEnrichmentJob`** - Create new enrichment job with input parameters
- [ ] **`updateCacheEntry`** - Store or update cached enrichment data
- [ ] **`invalidateCache`** - Mark cache entries as stale for refresh
- [ ] **`trackEnrichmentUsage`** - Update cache access statistics

### Database Queries
<!-- How you'll fetch data - be explicit about the choice -->
- [ ] **Direct in Server Components** - Simple cache lookups (single key lookup)
- [ ] **Query Functions in lib/externalEnrichment/** - Complex cache management, batch operations, TTL logic

### API Routes (Only for Special Cases)
<!-- 🛑 ONLY create API routes when Server Actions and lib/ functions cannot handle the use case -->
- [ ] **No API routes needed** - All external enrichment is server-side only

### External Integrations
<!-- Third-party APIs, services, etc. -->
- [Exa.ai API]: Company search and market intelligence
  - API Key: Already configured as EXA_API_KEY
  - Rate Limit: 1000 requests/month
  - Use Cases: Company lookup, market research, competitive analysis
- [Firecrawl API]: Web scraping and content extraction
  - API Key: Already configured as FIRECRAWL_API_KEY
  - Rate Limit: Depends on plan, implement throttling
  - Use Cases: Deep company research, news extraction, content analysis

**🚨 MANDATORY: Use Latest AI Models**
- When using OpenAI models, use **gpt-4o-mini** for enrichment processing (balance of cost and capability)
- External APIs (Exa, Firecrawl) as specified above

---

## 9. Frontend Changes

### New Components
<!-- Components to create in components/ directory, organized by feature -->
- [ ] **`components/enrichment/EnrichmentStatus.tsx`** - Show enrichment progress and status
- [ ] **`components/enrichment/CacheIndicator.tsx`** - Display cache hit/miss status and freshness
- [ ] **`components/enrichment/ExternalDataBadge.tsx`** - Visual indicator for externally enriched data

**Component Organization Pattern:**
- Use `components/enrichment/` directory for enrichment-specific components
- Keep shared/reusable components in `components/ui/` (existing pattern)
- Import into pages from the global components directory

**Component Requirements:**
- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation

### Page Updates
<!-- Pages that need changes -->
- [ ] **`src/pages/Tier2IntelligencePage.tsx`** - Add enrichment status indicators
- [ ] **`src/pages/Tier3IntelligencePage.tsx`** - Add external data sourcing information
- [ ] **`src/DocumentView.tsx`** - Show enrichment progress during processing

### State Management
<!-- How data flows through the app -->
- [Real-time subscriptions] - Existing Convex subscription pattern for enrichment status
- [Cache metadata context] - New context for managing enrichment cache information
- [Enrichment progress tracking] - Real-time updates during enrichment processing

### 🚨 CRITICAL: Context Usage Strategy

**MANDATORY: Before creating any component props or planning data fetching, verify existing context availability**

#### Context-First Design Pattern
- [ ] **✅ Check Available Contexts:** Document processing context already available via Convex
- [ ] **✅ Use Context Over Props:** Enrichment status via existing document subscription pattern
- [ ] **✅ Avoid Prop Drilling:** Leverage existing real-time query patterns
- [ ] **✅ Minimize Data Fetching:** Use existing document processing subscriptions
- [ ] **✅ Context Provider Analysis:** Document processing already provides base context

#### Decision Flowchart - "Should this be a prop or use context?"
```
📊 Do I need enrichment data in my component?
│
├─ 🔍 Is component already subscribing to document data?
│  ├─ ✅ YES: Extend existing subscription to include enrichment status
│  └─ ❌ NO: Create new subscription following existing patterns
│
├─ 🔄 Is enrichment data part of document processing?
│  ├─ ✅ YES: Use existing document processing context
│  └─ ❌ NO: Consider separate enrichment context
│
└─ 📝 Is this enrichment status only?
   ├─ ✅ YES: Use existing real-time subscription patterns
   └─ ❌ NO: Consider context for complex enrichment metadata
```

#### Context Provider Mapping Strategy
**Before implementing any component:**
1. **Map existing document subscriptions** - Which components already subscribe to document data?
2. **Identify enrichment extension points** - Where can enrichment status be added to existing subscriptions?
3. **Check for duplication** - Avoid separate enrichment fetching when document data already available
4. **Verify subscription patterns** - Use existing real-time query patterns

#### Common Anti-Patterns to Avoid
```typescript
// ❌ BAD: Component receives enrichment data as props when already in context
interface Tier2Props {
  enrichmentStatus: EnrichmentStatus;  // This is in document context!
  cacheData: CacheData;               // This can be queried directly!
}

function Tier2Component({ enrichmentStatus, cacheData }: Tier2Props) {
  return <div>{enrichmentStatus}</div>;
}

// ✅ GOOD: Component queries enrichment data directly
function Tier2Component() {
  const document = useQuery(api.documents.get, { id: documentId });
  const enrichmentStatus = document?.enrichmentStatus;
  const cacheData = useQuery(api.externalEnrichment.getCache, { key: company });
  return <div>{enrichmentStatus}</div>;
}
```

#### Context Analysis Checklist
- [ ] **Scan existing document subscriptions** for enrichment extension opportunities
- [ ] **Map enrichment data access patterns** following existing query patterns
- [ ] **Check for prop drilling** where direct queries could be used instead
- [ ] **Verify no duplicate enrichment fetching** when data already available
- [ ] **Review real-time subscription patterns** for enrichment status updates

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

### Format to Follow:

#### 📂 **Current Implementation (Before)**
```typescript
// Current enhancedProcessing.ts - only LLM analysis
export const extractTier2Intelligence = {
  args: { documentId: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    const strategicPrompt = `Extract strategic intelligence from this document...`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: strategicPrompt }],
    });
    // Only LLM-based extraction, no external data
  }
};
```

#### 📂 **After Enrichment Foundation**
```typescript
// New enhancedProcessing.ts with external enrichment
export const extractTier2Intelligence = {
  args: { documentId: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    // 1. Extract base intelligence from document
    const baseIntelligence = await extractBaseIntelligence(args.content);

    // 2. Identify entities for external enrichment
    const enrichmentTargets = identifyEnrichmentTargets(baseIntelligence);

    // 3. Enrich with external data
    const enrichedData = await Promise.all(
      enrichmentTargets.map(target => enrichWithExternalData(ctx, target))
    );

    // 4. Combine LLM + external data
    return combineIntelligence(baseIntelligence, enrichedData);
  }
};

// New externalEnrichment.ts
export const enrichCompanyData = {
  args: { companyName: v.string() },
  handler: async (ctx, args) => {
    // Check cache first
    const cached = await getCachedCompanyData(ctx, args.companyName);
    if (cached && !isExpired(cached)) return cached;

    // Fetch from external APIs
    const exaData = await searchCompanyWithExa(args.companyName);
    const firecrawlData = await crawlCompanyWebsite(args.companyName);

    // Store in cache
    const enriched = combineExternalData(exaData, firecrawlData);
    await cacheCompanyData(ctx, args.companyName, enriched);

    return enriched;
  }
};
```

#### 🎯 **Key Changes Summary**
- [ ] **Change 1:** Add external API integration infrastructure (Exa.ai + Firecrawl)
- [ ] **Change 2:** Implement intelligent caching system with TTL management
- [ ] **Change 3:** Modify extraction pipeline to include external enrichment step
- [ ] **Change 4:** Add database tables for cache and job tracking
- [ ] **Files Modified:**
  - `convex/enhancedProcessing.ts` (extended with enrichment calls)
  - `convex/schema.ts` (new cache and job tables)
  - New: `convex/lib/externalEnrichment.ts` (API integration)
  - New: `convex/actions/externalEnrichment.ts` (cache management)
- [ ] **Impact:** Transforms extraction from document-only to document + live market intelligence

---

## 11. Implementation Plan

### Phase 1: Database Schema and Cache Infrastructure
**Goal:** Create foundation for external data caching and job tracking

- [ ] **Task 1.1:** Update Database Schema
  - Files: `convex/schema.ts`
  - Details: Add externalEnrichmentCache and enrichmentJobs tables with proper indexes
- [ ] **Task 1.2:** Create Database Migration
  - Files: `drizzle/migrations/XXX_external_enrichment.sql`
  - Details: Generate and apply migration with proper down migration
- [ ] **Task 1.3:** Create Cache Data Types
  - Files: `convex/types/externalEnrichment.ts`
  - Details: Define TypeScript interfaces for different enrichment data types

### Phase 2: External API Integration Layer
**Goal:** Build reusable services for Exa.ai and Firecrawl with error handling

- [ ] **Task 2.1:** Create External Enrichment Library
  - Files: `convex/lib/externalEnrichment.ts`
  - Details: Implement Exa.ai search and Firecrawl web scraping functions
- [ ] **Task 2.2:** Add Error Handling and Rate Limiting
  - Files: `convex/lib/externalEnrichment.ts`
  - Details: Robust error handling, retry logic, rate limiting protection
- [ ] **Task 2.3:** Implement Cache Management Functions
  - Files: `convex/lib/externalEnrichment.ts`
  - Details: Cache lookup, TTL management, invalidation logic

### Phase 3: Server Actions for Cache and Job Management
**Goal:** Create mutations for cache operations and job tracking

- [ ] **Task 3.1:** Create External Enrichment Actions
  - Files: `convex/actions/externalEnrichment.ts`
  - Details: Server actions for cache CRUD operations and job management
- [ ] **Task 3.2:** Add Background Job Processing
  - Files: `convex/actions/externalEnrichment.ts`
  - Details: Background job queue for asynchronous enrichment tasks
- [ ] **Task 3.3:** Implement Cache Invalidation Logic
  - Files: `convex/actions/externalEnrichment.ts`
  - Details: Smart cache invalidation based on TTL and data freshness

### Phase 4: Integration with Existing Extraction Pipeline
**Goal:** Modify Tier 2/3 extraction to use external enrichment

- [ ] **Task 4.1:** Update Enhanced Processing
  - Files: `convex/enhancedProcessing.ts`
  - Details: Add external enrichment calls to existing extraction pipeline
- [ ] **Task 4.2:** Add Enrichment Status Tracking
  - Files: `convex/enhancedProcessing.ts`
  - Details: Track enrichment progress and status in document processing
- [ ] **Task 4.3:** Optimize Performance with Parallel Enrichment
  - Files: `convex/enhancedProcessing.ts`
  - Details: Parallel external API calls with proper error handling

### Phase 5: Frontend Integration
**Goal:** Add UI components for enrichment status and external data indicators

- [ ] **Task 5.1:** Create Enrichment Status Components
  - Files: `src/components/enrichment/EnrichmentStatus.tsx`
  - Details: Show enrichment progress and status indicators
- [ ] **Task 5.2:** Add External Data Badges
  - Files: `src/components/enrichment/ExternalDataBadge.tsx`
  - Details: Visual indicators for externally enriched data points
- [ ] **Task 5.3:** Update Tier 2/3 Pages
  - Files: `src/pages/Tier2IntelligencePage.tsx`, `src/pages/Tier3IntelligencePage.tsx`
  - Details: Integrate enrichment status and external data indicators

### Phase 6: Testing and Validation
**Goal:** Comprehensive testing of enrichment functionality

- [ ] **Task 6.1:** Test External API Integration
  - Files: All external enrichment files
  - Details: Verify API calls, error handling, and cache operations
- [ ] **Task 6.2:** Test Extraction Pipeline Integration
  - Files: `convex/enhancedProcessing.ts`
  - Details: End-to-end testing of enriched extraction
- [ ] **Task 6.3:** Performance Testing
  - Files: Complete enrichment system
  - Details: Measure performance impact and optimize bottlenecks

### Phase 7: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [ ] **Task 7.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
- [ ] **Task 7.2:** Static Logic Review
  - Files: Modified business logic files
  - Details: Read code to verify logic syntax, edge case handling, fallback patterns
- [ ] **Task 7.3:** File Content Verification (if applicable)
  - Files: Schema files, type definitions
  - Details: Read files to verify data structure, configuration correctness (NO live database/API calls)

🛑 **CRITICAL WORKFLOW CHECKPOINT**
After completing Phase 7, you MUST:
1. Present "Implementation Complete!" message (exact text from section 16)
2. Wait for user approval of code review
3. Execute comprehensive code review process
4. NEVER proceed to user testing without completing code review first

### Phase 8: Comprehensive Code Review (Mandatory)
**Goal:** Present implementation completion and request thorough code review

- [ ] **Task 8.1:** Present "Implementation Complete!" Message (MANDATORY)
  - Template: Use exact message from section 16, step 7
  - Details: STOP here and wait for user code review approval
- [ ] **Task 8.2:** Execute Comprehensive Code Review (If Approved)
  - Process: Follow step 8 comprehensive review checklist from section 16
  - Details: Read all files, verify requirements, integration testing, provide detailed summary

### Phase 9: User Browser Testing (Only After Code Review)
**Goal:** Request human testing for UI/UX functionality that requires browser interaction

- [ ] **Task 9.1:** Present AI Testing Results
  - Files: Summary of automated test results
  - Details: Provide comprehensive results of all AI-verifiable testing
- [ ] **Task 9.2:** Request User UI Testing
  - Files: Specific browser testing checklist for user
  - Details: Clear instructions for user to verify UI behavior, interactions, visual changes
- [ ] **Task 9.3:** Wait for User Confirmation
  - Files: N/A
  - Details: Wait for user to complete browser testing and confirm results

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

### Example Task Completion Format
```
### Phase 1: Database Schema and Cache Infrastructure
**Goal:** Create foundation for external data caching and job tracking

- [x] **Task 1.1:** Update Database Schema ✓ 2025-01-06
  - Files: `convex/schema.ts` (added externalEnrichmentCache, enrichmentJobs tables) ✓
  - Details: Added proper indexes and validation rules ✓
- [x] **Task 1.2:** Create Database Migration ✓ 2025-01-06
  - Command: `npm run db:generate` executed successfully ✓
  - Details: Migration generated with proper down migration ✓
```

---

## 13. File Structure & Organization

### New Files to Create
```
project-root/
├── convex/
│   ├── actions/
│   │   └── externalEnrichment.ts         # Server actions for cache/job management
│   ├── lib/
│   │   └── externalEnrichment.ts         # External API integration and cache logic
│   ├── types/
│   │   └── externalEnrichment.ts         # TypeScript interfaces for enrichment data
│   └── schema.ts                         # Updated with new tables
├── src/
│   └── components/
│       └── enrichment/
│           ├── EnrichmentStatus.tsx      # Enrichment progress indicator
│           ├── CacheIndicator.tsx        # Cache hit/miss status
│           └── ExternalDataBadge.tsx     # External data source indicator
└── drizzle/migrations/
    └── [timestamp]_external_enrichment/
        ├── migration.sql                 # Forward migration
        └── down.sql                      # Rollback migration
```

**File Organization Rules:**
- **Components**: Always in `components/[feature]/` directories
- **Server Actions**: In `convex/actions/[feature].ts` files (mutations only)
- **Complex Queries**: In `convex/lib/[feature].ts` files (when needed)
- **Types**: Co-located with features in `convex/types/[feature].ts`
- **Database**: Schema updates in `convex/schema.ts`, migrations in `drizzle/migrations/`

#### **LIB FILE SERVER/CLIENT SEPARATION - CRITICAL ARCHITECTURE RULE**

**🚨 MANDATORY: Prevent Server/Client Boundary Violations**

When creating lib files, **NEVER mix server-only imports with client-safe utilities** in the same file.

**Server-Only Imports (Cannot be used by client components):**
- Exa.ai and Firecrawl API clients
- `@/lib/externalEnrichment` (database operations)
- Server Actions or other server-side functions
- Node.js modules (fs, path, etc.)

**Decision Flowchart - "Should I split this lib file?"**
```
📁 What's in your convex/lib/externalEnrichment.ts file?
│
├─ 🔴 Server-only imports + Client-safe utilities?
│  └─ ✅ SPLIT: No client components need external enrichment
│
├─ 🟢 Only server-side operations?
│  └─ ✅ KEEP: Single convex/lib/externalEnrichment.ts file (server-only)
│
└─ 🟢 Only client-safe utilities?
   └─ ✅ KEEP: Single file (not applicable for external enrichment)
```

**File Naming Pattern:**
- `convex/lib/externalEnrichment.ts` - Server-side external API operations only
- No client-side files needed for external enrichment (all server-side)

### Files to Modify
- [ ] **`convex/schema.ts`** - Add externalEnrichmentCache and enrichmentJobs tables
- [ ] **`convex/enhancedProcessing.ts`** - Integrate external enrichment calls
- [ ] **`src/pages/Tier2IntelligencePage.tsx`** - Add enrichment status indicators
- [ ] **`src/pages/Tier3IntelligencePage.tsx`** - Add external data sourcing information

### Dependencies to Add
```json
{
  "dependencies": {
    "exa-js": "^1.0.0",           // Exa.ai API client
    "@firecrawl/firecrawl": "^1.0.0"  // Firecrawl API client
  }
}
```

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1: External API rate limiting**
  - **Code Review Focus:** Rate limiting implementation in `convex/lib/externalEnrichment.ts`
  - **Potential Fix:** Implement exponential backoff and queue management
- [ ] **Error Scenario 2: Cache invalidation race conditions**
  - **Code Review Focus:** Cache update logic in `convex/actions/externalEnrichment.ts`
  - **Potential Fix:** Use transactional cache updates with proper locking
- [ ] **Error Scenario 3: External API service outage**
  - **Code Review Focus:** Fallback behavior in enrichment functions
  - **Potential Fix:** Graceful degradation to cached data or skip enrichment

### Edge Cases to Consider
- [ ] **Edge Case 1: Company name variations and spelling differences**
  - **Analysis Approach:** Check company name normalization and matching logic
  - **Recommendation:** Implement fuzzy matching and canonical company identification
- [ ] **Edge Case 2: Cache TTL expiration during extraction**
  - **Analysis Approach:** Review cache invalidation timing and refresh strategies
  - **Recommendation:** Background refresh for frequently accessed data
- [ ] **Edge Case 3: External API returning incomplete or malformed data**
  - **Analysis Approach:** Examine data validation and error handling in API integration
  - **Recommendation:** Robust data validation with fallback to LLM-only extraction

### Security & Access Control Review
- [ ] **API Key Security:** Are external API keys properly secured and not exposed to client?
  - **Check:** Server-side only API calls, environment variable usage
- [ ] **Data Privacy:** Does external enrichment expose sensitive document data?
  - **Check:** Only extracted entity names sent to external APIs, not full document content
- [ ] **Cache Data Protection:** Is cached enrichment data properly secured?
  - **Check:** Cache access limited to authenticated users, proper data ownership
- [ ] **External Service Dependencies:** Can external service failures impact core functionality?
  - **Check:** Graceful degradation when external services unavailable

### AI Agent Analysis Approach
**Focus:** Review external integration code to identify potential failure points and security gaps. When issues are found, provide specific recommendations with file paths and code examples.

**Priority Order:**
1. **Critical:** API key security and data privacy protection
2. **Important:** Error handling for external service failures
3. **Nice-to-have:** Cache optimization and performance improvements

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# Already configured, but validating for enrichment
EXA_API_KEY=cb59a87e-4ce7-49db-afab-798f9054b0d9
FIRECRAWL_API_KEY=fc-846200c8877c40f59061d2f69ba654f2

# New cache configuration options
ENRICHMENT_CACHE_TTL_HOURS=24        # Default cache TTL
ENRICHMENT_MAX_CONCURRENT_REQUESTS=5  # Rate limiting protection
ENRICHMENT_BACKGROUND_REFRESH_ENABLED=true
```

### Monitoring and Observability
- **Cache hit rates** - Monitor enrichment cache effectiveness
- **API usage tracking** - Track Exa.ai and Firecrawl API consumption
- **Enrichment performance** - Measure extraction time impact
- **Error rates** - Monitor external service failures and fallback behavior

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
   - [ ] **🔢 FIND LATEST TASK NUMBER**: Use `list_dir` to examine ai_docs/tasks/ directory and find the highest numbered task file (e.g., if highest is 002, use 003)
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
   f. **🚨 CRITICAL:** After final implementation phase, you MUST proceed to Phase 8 (Comprehensive Code Review) before any user testing

   **🚨 PHASE-SPECIFIC REQUIREMENTS:**
     - [ ] **Real-time task completion tracking** - Update task document immediately after each subtask
  - [ ] **Mark checkboxes as [x]** with completion timestamps
  - [ ] **Add specific completion notes** (file paths, line counts, key changes)
  - [ ] **Run linting on each modified file** during the phase (static analysis only - no dev server/build commands)
  - [ ] **🚨 MANDATORY: For ANY database changes, create down migration file BEFORE running `npm run db:migrate`**
     - [ ] Follow `drizzle_down_migration.md` template process
     - [ ] Create `drizzle/migrations/[timestamp]/down.sql` file
     - [ ] Verify all operations use `IF EXISTS` and include warnings
     - [ ] Only then run `npm run db:migrate`
     - [ ] **For any new page route, create `loading.tsx` and `error.tsx` files alongside `page.tsx`**
  - [ ] **Always create components in `components/[feature]/` directories**
  - [ ] **🚨 MANDATORY WORKFLOW SEQUENCE:** After implementation phases, follow this exact order:
     - [ ] **Phase 7 Complete** → Present "Implementation Complete!" message (section 16, step 7)
     - [ ] **Wait for user approval** → Execute comprehensive code review (section 16, step 8)
     - [ ] **Code review complete** → ONLY THEN request user browser testing
     - [ ] **NEVER skip comprehensive code review** - Phase 7 basic validation ≠ comprehensive review
  - [ ] **NEVER plan manual browser testing as AI task** - always mark as "👤 USER TESTING" and wait for user confirmation

6. **VERIFY LIB FILE ARCHITECTURE (For any lib/ changes)**
   - [ ] **Audit new lib files** for server/client mixing
   - [ ] **Check import chains** - trace what server dependencies are pulled in
   - [ ] **Test client component imports** - ensure no boundary violations
   - [ ] **Split files if needed** using `[feature]-client.ts` pattern
   - [ ] **Update import statements** in client components to use client-safe files

7. **FINAL CODE REVIEW RECOMMENDATION (Mandatory after all phases)**
   - [ ] **Present this exact message** to user after all implementation complete:

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

   - [ ] **Wait for user approval** of code review
   - [ ] **If approved**: Execute comprehensive code review process below

8. **COMPREHENSIVE CODE REVIEW PROCESS (If user approves)**
   - [ ] **Read all modified files** and verify changes match task requirements exactly
   - [ ] **Run linting and type-checking** on all modified files using appropriate commands
   - [ ] **Check for integration issues** between modified components
   - [ ] **Verify all success criteria** from task document are met
   - [ ] **Test critical workflows** affected by changes
   - [ ] **Provide detailed review summary** using this format:

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
- "Option 2 looks good"
- "Go with your recommendation"
- "I prefer the caching approach"
- "Proceed with smart caching"
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
- [ ] Follow TypeScript best practices
- [ ] Add proper error handling
- [ ] **🚨 MANDATORY: Write Professional Comments - Never Historical Comments**
  - [ ] **❌ NEVER write change history**: "Fixed this", "Removed function", "Updated to use new API"
  - [ ] **❌ NEVER write migration artifacts**: "Moved from X", "Previously was Y"
  - [ ] **✅ ALWAYS explain business logic**: "Enrich company data with external market intelligence", "Cache enrichment results to optimize API costs"
  - [ ] **✅ Write for future developers** - explain what/why the code does what it does, not what you changed
  - [ ] **Remove unused code completely** - don't leave comments explaining what was removed
- [ ] **🚨 MANDATORY: Use early returns to keep code clean and readable**
  - [ ] **Prioritize early returns** over nested if-else statements
  - [ ] **Validate inputs early** and return immediately for invalid cases
  - [ ] **Handle error conditions first** before proceeding with main logic
  - [ ] **Exit early for edge cases** to reduce nesting and improve readability
  - [ ] **Example pattern**: `if (invalid) return error; // main logic here`
- [ ] **🚨 MANDATORY: Use async/await instead of .then() chaining**
  - [ ] **Avoid Promise .then() chains** - use async/await for better readability
  - [ ] **Use try/catch blocks** for error handling instead of .catch() chaining
  - [ ] **Use Promise.all()** for concurrent operations instead of chaining multiple .then()
  - [ ] **Create separate async functions** for complex operations instead of long chains
  - [ ] **Example**: `const result = await operation();` instead of `operation().then(result => ...)`
- [ ] **🚨 MANDATORY: NO FALLBACK BEHAVIOR - Always throw errors instead**
  - [ ] **Never handle "legacy formats"** - expect the current format or fail fast
  - [ ] **No "try other common fields"** fallback logic - if expected field missing, throw error
  - [ ] **Fail fast and clearly** - don't mask issues with fallback behavior
  - [ ] **Single expected response format** - based on current API contract
  - [ ] **Throw descriptive errors** - explain exactly what format was expected vs received
  - [ ] **Example**: `if (!expectedFormat) throw new Error('Expected X format, got Y');`
- [ ] **🚨 MANDATORY: Create down migration files before running ANY database migration**
  - [ ] Follow `drizzle_down_migration.md` template process
  - [ ] Use `IF EXISTS` clauses for safe rollback operations
  - [ ] Include appropriate warnings for data loss risks
- [ ] **Ensure responsive design (mobile-first approach with Tailwind breakpoints)**
- [ ] **Test components in both light and dark mode**
- [ ] **Verify mobile usability on devices 320px width and up**
- [ ] Follow accessibility guidelines (WCAG AA)
- [ ] Use semantic HTML elements
- [ ] **🚨 MANDATORY: Clean up removal artifacts**
  - [ ] **Never leave placeholder comments** like "// No cache needed" or "// Removed for simplicity"
  - [ ] **Delete empty functions/components** completely rather than leaving commented stubs
  - [ ] **Remove unused imports** and dependencies after deletions
  - [ ] **Clean up empty interfaces/types** that no longer serve a purpose
  - [ ] **Remove dead code paths** rather than commenting them out
  - [ ] **If removing code, remove it completely** - don't leave explanatory comments about what was removed

### Architecture Compliance
- [ ] **✅ VERIFY: Used correct data access pattern**
  - [ ] Mutations → Server Actions (`convex/actions/[feature].ts`)
  - [ ] Queries → lib functions (`convex/lib/[feature].ts`) for complex, direct in components for simple
  - [ ] API routes → Only for webhooks, file exports, external integrations
- [ ] **🚨 VERIFY: No server/client boundary violations in lib files**
  - [ ] Files with server imports (external APIs, database operations) don't export client-safe utilities
  - [ ] Client components can import utilities without pulling in server dependencies
  - [ ] Mixed server/client files are split using `-client.ts` pattern
- [ ] **🚨 VERIFY: Proper context usage patterns**
  - [ ] Components use existing document subscription patterns instead of unnecessary props
  - [ ] No duplicate data fetching when enrichment data is available via existing subscriptions
  - [ ] Real-time subscription hooks used appropriately for enrichment status tracking
  - [ ] No prop drilling when subscription alternative exists for the same data
  - [ ] All enrichment data access follows existing Convex query patterns
- [ ] **❌ AVOID: Creating unnecessary API routes for internal operations**
- [ ] **❌ AVOID: Mixing server-only imports with client-safe utilities in same file**
- [ ] **❌ AVOID: Prop drilling when existing subscription patterns provide the needed data**
- [ ] **🔍 DOUBLE-CHECK: Does this really need an API route or should it be a Server Action/lib function?**
- [ ] **🔍 DOUBLE-CHECK: Can external enrichment be handled entirely server-side?**
- [ ] **🔍 DOUBLE-CHECK: Are enrichment status updates using existing real-time subscription patterns?**

---

## 17. Notes & Additional Context

### Research Links
- [Exa.ai API Documentation](https://docs.exa.ai/) - Search API for company and market research
- [Firecrawl API Documentation](https://docs.firecrawl.dev/) - Web scraping and content extraction
- [Reference Implementation](../refs/old-vc-project/src-old/lib/external-data-enrichment.ts) - Complete pattern for external data integration

### **⚠️ Common External Integration Pitfalls to Avoid**

**❌ NEVER DO:**
- Send full document content to external APIs (privacy violation)
- Cache sensitive personal or financial information without encryption
- Ignore API rate limits and service terms
- Assume external APIs will always be available
- Mix external API results directly without validation

**✅ ALWAYS DO:**
- Send only extracted entity names (companies, people, sectors) to external APIs
- Implement proper caching with TTL to optimize costs and performance
- Handle external service failures gracefully with fallbacks
- Validate external data before combining with extracted intelligence
- Monitor API usage and costs systematically

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

Before implementing any changes, the AI must systematically analyze potential second-order consequences and alert the user to any significant impacts. This analysis should identify ripple effects that might not be immediately obvious but could cause problems later.

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** Will external enrichment change the structure of Tier 2/3 extraction results?
- [ ] **Database Dependencies:** Are there other tables/queries that depend on current extraction output format?
- [ ] **Component Dependencies:** Which frontend components consume extraction results that might change format?
- [ ] **Authentication/Authorization:** Will external enrichment require new permission checks?

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** How will cached external data affect downstream processing and display?
- [ ] **UI/UX Cascading Effects:** Will enrichment status indicators require changes to existing components?
- [ ] **Performance Impact:** How will external API calls affect document processing time and user experience?
- [ ] **Cost Impact:** What are the expected monthly costs for Exa.ai and Firecrawl API usage?

#### 3. **Performance Implications**
- [ ] **Cache Hit Rate Impact:** How will cache effectiveness impact extraction performance over time?
- [ ] **Concurrent Processing Impact:** Can the system handle multiple documents requiring external enrichment simultaneously?
- [ ] **Database Storage Impact:** How much additional storage will be required for cached enrichment data?
- [ ] **API Rate Limiting Impact:** How will rate limits affect system throughput during peak usage?

#### 4. **Security Considerations**
- [ ] **Data Privacy:** Does sending company names to external APIs create privacy concerns?
- [ ] **Cache Security:** Is cached external data properly secured and access-controlled?
- [ ] **API Key Exposure:** Are external API keys properly secured and not exposed to client?
- [ ] **External Service Dependencies:** What are the risks of depending on third-party services?

#### 5. **User Experience Impacts**
- [ ] **Processing Time Changes:** How will external enrichment affect document processing time?
- [ ] **Status Visibility:** Will users understand why processing takes longer with enrichment?
- [ ] **Data Quality Expectations:** Will external enrichment set expectations for data freshness?
- [ ] **Feature Discovery:** How will users discover externally enriched vs. document-only data?

#### 6. **Maintenance Burden**
- [ ] **API Versioning:** How will changes to Exa.ai/Firecrawl APIs affect the system?
- [ ] **Cache Management:** What ongoing maintenance will cache invalidation and refresh require?
- [ ] **Cost Monitoring:** What processes are needed to monitor and control external API costs?
- [ ] **Service Downtime:** How will external service outages be handled and communicated?

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
These issues must be brought to the user's attention before implementation:
- [ ] **API Cost Exposure:** External enrichment could add significant monthly costs ($100-500+ depending on usage)
- [ ] **Processing Time Impact:** External API calls could add 30-60 seconds to document processing
- [ ] **Privacy Considerations:** Sending company/investor names to external services may have privacy implications
- [ ] **Service Dependency Risk:** System becomes dependent on external services that could change pricing or availability

#### ⚠️ **YELLOW FLAGS - Discuss with User**
These issues should be discussed but may not block implementation:
- [ ] **Cache Storage Requirements:** External data caching will increase database storage needs
- [ ] **Complexity Increase:** External enrichment adds significant system complexity
- [ ] **Error Handling Complexity:** External service failures require sophisticated error handling
- [ ] **Data Quality Variability:** External data quality may vary and require validation

### Mitigation Strategies

#### Cost Management
- [ ] **Usage Monitoring:** Implement detailed API usage tracking and cost alerts
- [ ] **Cache Optimization:** Aggressive caching strategies to minimize duplicate API calls
- [ ] **Usage Limits:** Implement per-user or per-organization usage limits
- [ ] **Cost Alerts:** Set up alerts for unusual usage patterns

#### Performance Optimization
- [ ] **Background Processing:** Use background jobs for non-critical enrichment
- [ ] **Progressive Loading:** Load basic extraction first, enrich progressively
- [ ] **Cache Warming:** Pre-populate cache for frequently accessed companies/sectors
- [ ] **Rate Limiting:** Implement client-side rate limiting to prevent abuse

#### Reliability Assurance
- [ ] **Graceful Degradation:** Fallback to LLM-only extraction when external services fail
- [ ] **Service Health Monitoring:** Monitor external service availability and response times
- [ ] **Retry Logic:** Implement exponential backoff and retry for failed API calls
- [ ] **Alternative Data Sources:** Consider multiple external data providers for redundancy

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:
- [ ] **Complete Impact Analysis:** Fill out all sections of the impact assessment
- [ ] **Identify Critical Issues:** Flag any red or yellow flag items
- [ ] **Propose Mitigation:** Suggest specific mitigation strategies for identified risks
- [ ] **Alert User:** Clearly communicate any significant second-order impacts
- [ ] **Recommend Alternatives:** If high-risk impacts are identified, suggest alternative approaches

### Example Analysis Template

```
🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
- External enrichment will add new fields to Tier 2/3 extraction results
- Frontend components may need updates to handle enriched data structure
- API response format changes could affect existing integrations

**Performance Implications:**
- External API calls will add 30-60 seconds to document processing time
- Cache implementation will reduce processing time for repeated company lookups
- Database storage requirements will increase by ~50% for cached external data

**Cost Implications:**
- Estimated monthly API costs: $100-500 depending on document volume
- Cache optimization can reduce costs by 80-90% for repeated lookups
- Need implementation of usage monitoring and cost alerts

**Security Considerations:**
- Only company/investor names sent to external APIs, not full document content
- External API keys secured server-side, no client exposure
- Cached data access controlled by existing authentication system

**🚨 USER ATTENTION REQUIRED:**
External enrichment will add approximately 45 seconds to document processing time and $100-500 monthly API costs. The system will gracefully fallback to LLM-only extraction if external services are unavailable.
```

---

*Template Version: 1.3*
*Last Updated: 8/26/2025*
*Created By: Brandon Hancock*