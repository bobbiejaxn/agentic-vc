# Tier 2 Strategic Intelligence Enrichment

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Tier 2 Strategic Intelligence Enrichment with External Market Data

### Goal Statement
**Goal:** Enhance the Tier 2 strategic intelligence extraction pipeline by integrating external market data from Exa.ai and Firecrawl to validate, enrich, and expand co-investor networks, portfolio company information, market trends, and strategic insights with live market intelligence, transforming document-only analysis into comprehensive market intelligence.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis

**✅ CONDUCTING STRATEGIC ANALYSIS:**
- Multiple viable approaches for enriching different types of strategic intelligence
- Trade-offs between breadth of coverage vs depth of enrichment
- Performance implications of different enrichment strategies
- Cost considerations for different levels of market intelligence
- Different enrichment priorities for various intelligence categories

### Problem Context
The current Tier 2 extraction produces strategic intelligence based solely on LLM analysis of document content. This creates significant limitations for strategic decision-making because co-investor networks, portfolio companies, market trends, and strategic insights cannot be validated against current market realities or expanded with broader market context. Different intelligence categories have different enrichment needs and priorities.

Based on lessons learned from document processing implementation, we understand that:

1. **Schema-first development is critical** - We must define enriched intelligence schemas before implementing Tier 2 enrichment
2. **Real-time subscriptions eliminate manual refreshing** - Enrichment progress must be tracked and displayed to users in real-time
3. **External API integration requires robust error handling** - Tier 2 enrichment must handle rate limits, service outages, and data quality variations gracefully
4. **Environment-driven feature tiers enable graceful degradation** - The system must function with or without external API keys, providing value at each tier
5. **Component abstraction enables reusability** - Tier 2 enrichment services must leverage the foundation from Task 003 and be reusable for future intelligence categories
6. **Progress tracking transforms user experience** - Users expect real-time feedback during the 45-60 second enrichment process
7. **Chunking strategies must balance context preservation with processing limits** - Selective enrichment focuses on high-value categories while managing API costs and processing time

### Solution Options Analysis

#### Option 1: Comprehensive Multi-Source Enrichment
**Approach:** Enrich all extracted intelligence categories (co-investors, portfolio companies, market trends, strategy insights) with multiple external data sources in parallel.

**Pros:**
- ✅ Complete market intelligence coverage across all categories
- ✅ Maximum competitive advantage with comprehensive data
- ✅ Consistent enrichment quality across all intelligence types
- ✅ One-time comprehensive enrichment process

**Cons:**
- ❌ High API costs (multiple sources per intelligence category)
- ❌ Longer processing time (parallel but comprehensive enrichment)
- ❌ Potential information overload for users
- ❌ Complex error handling across multiple enrichment pathways

**Implementation Complexity:** High - Complex orchestration, multiple API integrations
**Risk Level:** High - High cost, complexity, and potential performance impact

#### Option 2: Priority-Based Selective Enrichment
**Approach:** Focus enrichment efforts on high-impact intelligence categories first (co-investors and portfolio companies), with optional enrichment for market trends and strategy insights.

**Pros:**
- ✅ Cost-effective with focus on highest-value intelligence
- ✅ Faster processing with selective enrichment
- ✅ Clear value proposition for users (network intelligence first)
- ✅ Scalable approach for different user tiers

**Cons:**
- ❌ Incomplete market intelligence coverage
- ❌ Users may miss insights in non-enriched categories
- ❌ Less comprehensive competitive analysis
- ❌ May create uneven intelligence quality across categories

**Implementation Complexity:** Medium - Clear prioritization logic, focused API usage
**Risk Level:** Medium - Balanced approach with clear value focus

#### Option 3: Progressive Intelligence Enrichment
**Approach:** Implement tiered enrichment where critical intelligence gets immediate enrichment, supplementary intelligence gets background enrichment, and optional intelligence gets on-demand enrichment.

**Pros:**
- ✅ Optimal balance of speed, cost, and intelligence quality
- ✅ Progressive disclosure of intelligence depth
- ✅ Background processing keeps main extraction fast
- ✅ Users can request deeper enrichment as needed
- ✅ Cost control through intelligent prioritization

**Cons:**
- ❌ Most complex implementation with multiple enrichment pathways
- ❌ Requires sophisticated background job management
- ❌ Complex UI to show different levels of enrichment
- ❌ More sophisticated caching and invalidation logic

**Implementation Complexity:** High - Complex state management, background jobs, progressive UI
**Risk Level:** Medium - Complexity mitigated by staged implementation

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 2 - Priority-Based Selective Enrichment

**Why this is the best choice:**
1. **Strategic Value Focus:** Co-investor networks and portfolio companies are the highest-value intelligence for VC decision-making
2. **Cost Efficiency:** Concentrates API spend on most impactful enrichment categories
3. **Performance:** Faster extraction with focused enrichment effort
4. **Implementation Clarity:** Clear business logic for what gets enriched vs. what doesn't
5. **Scalability:** Easy to expand to other categories based on user feedback

**Key Decision Factors:**
- **Strategic Impact:** Co-investor validation and portfolio company enrichment provide immediate competitive advantage
- **User Experience:** Faster processing with focused, high-value enrichment
- **Cost Predictability:** Clear cost structure based on document analysis rather than comprehensive enrichment
- **Maintainability:** Simpler logic with clear enrichment priorities
- **ROI:** High return on investment for co-investor and portfolio company intelligence

**Alternative Consideration:**
The Progressive approach (Option 3) would be ideal for an enterprise platform with different user tiers, but the complexity outweighs benefits for current deployment. We can evolve to progressive enrichment later if user feedback shows demand for deeper market trend and strategy insight enrichment.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended Priority-Based Selective Enrichment approach, or would you prefer a different strategy?

**Questions for you to consider:**
- Are co-investor networks and portfolio company intelligence the highest priority for your use case?
- How important is comprehensive market trend enrichment vs. focused network intelligence?
- Are you comfortable with some intelligence categories remaining document-only initially?

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
- **External APIs:** Exa.ai and Firecrawl available but not yet integrated into Tier 2 extraction
- **Key Architectural Patterns:** Real-time subscriptions to Convex data, Document processing pipeline

### Current State
Currently, the Tier 2 extraction produces:
- **Co-investors**: Extracted from document content only, no external validation
- **Portfolio Companies**: Basic extraction from document, no market data enrichment
- **Market Trends**: LLM analysis of document content only
- **Strategy Insights**: Document-only strategic analysis
- **No external data**: No validation against current market realities
- **No network expansion**: Cannot discover related co-investors or portfolio companies not mentioned in document

### Existing Context Providers Analysis
- **Document Processing Context:** Real-time updates for extraction status
- **Theme Context:** Dark/light mode support
- **User Context:** Basic authentication and profile data
- **No enrichment context:** No current tracking of external enrichment status or progress

**🔍 Context Coverage Analysis:**
- Document processing status is available via real-time queries
- Tier 2 extraction results are available but not externally enriched
- No current infrastructure for tracking enrichment progress or status
- External data caching and job management will need new context integration

## 4. Context & Problem Definition

### Problem Statement
The current Tier 2 strategic intelligence extraction provides valuable insights but is limited to document-only analysis, creating significant strategic disadvantages:

1. **Unvalidated Co-Investor Networks**: Cannot verify if mentioned co-investors are still active, their current investment focus, or discover additional co-investors in the same sectors/geographies
2. **Static Portfolio Company Data**: No current market data, funding rounds, competitive positioning, or recent developments for portfolio companies
3. **Limited Market Intelligence**: Market trends based only on document content, missing broader market context and emerging trends
4. **Incomplete Strategic Insights**: Strategy recommendations not validated against current market realities or competitive landscape
5. **Competitive Disadvantage**: Other market participants using enriched intelligence have significant advantage

### Success Criteria
- [ ] **Schema-first enriched intelligence models** with TypeScript literal types for co-investors and portfolio companies
- [ ] **Robust Tier 2 enrichment API integration** with comprehensive error handling, retry mechanisms, and timeouts for strategic intelligence validation
- [ ] **Real-time Tier 2 enrichment progress tracking** using Convex subscriptions to eliminate manual UI refreshing during 45-60 second enrichment process
- [ ] **Environment-driven feature tiers** enabling graceful degradation when external API keys are unavailable (document-only → basic validation → full enrichment)
- [ ] **Selective enrichment prioritization** focusing on high-value intelligence categories (co-investors and portfolio companies) while managing costs
- [ ] **Reusable Tier 2 enrichment components** that leverage the external enrichment foundation from Task 003
- [ ] **Rate limiting and cost management** to avoid API service interruptions with intelligent prioritization and usage monitoring
- [ ] **Performance optimization** through selective enrichment reducing processing time by 60% compared to comprehensive enrichment
- [ ] **Clear enrichment status indicators** showing which intelligence categories are externally validated vs. document-only
- [ ] **Progressive enhancement capability** allowing the system to provide value at different intelligence levels based on available resources
- [ ] **Component abstraction** for co-investor validation and portfolio company enrichment that can be reused across intelligence categories

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is enhancement to existing Tier 2 extraction**
- **No backwards compatibility concerns** - enriching existing extraction, not replacing it
- **Progressive enhancement approach** - can enable enrichment gradually based on performance and cost feedback
- **Priority: Strategic intelligence quality** over comprehensive coverage
- **Iterative optimization allowed** - can adjust enrichment priorities based on user feedback and cost analysis
- **Real-time progress tracking essential** - Users expect feedback during the 45-60 second selective enrichment process
- **Component abstraction critical** - Tier 2 enrichment must leverage external enrichment foundation from Task 003
- **Schema-first approach required** - All enriched intelligence models must be defined with proper TypeScript typing
- **External API resilience mandatory** - System must gracefully handle service outages and rate limiting
- **Environment-driven feature tiers required** - Must provide value at document-only, basic validation, and full enrichment levels

---

## 6. Technical Requirements

### Functional Requirements
- [Requirement 1: System can enrich co-investor data with Exa.ai search for current activity and network expansion]
- [Requirement 2: System can enrich portfolio companies with funding data, market position, and recent developments]
- [Requirement 3: System validates market trends against current market intelligence sources]
- [Requirement 4: System enhances strategy insights with competitive landscape data]
- [Requirement 5: System implements intelligent prioritization focusing on high-value intelligence categories]
- [Requirement 6: System provides clear enrichment status indicators for different intelligence types]
- [Requirement 7: System optimizes performance through selective enrichment and parallel processing]

### Non-Functional Requirements
- **Performance:** Tier 2 extraction should add less than 60 seconds with selective enrichment
- **Cost:** Target API cost reduction of 60-70% compared to comprehensive enrichment
- **Security:** All enrichment server-side, no external API exposure to client
- **Usability:** Clear visual indicators for externally enriched vs. document-only intelligence
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Compatible with existing Tier 2 extraction schema and UI components

### Technical Constraints
- [Constraint 1: Must use existing external enrichment foundation from Task 003]
- [Constraint 2: Cannot modify existing Tier 2 extraction schema structure]
- [Constraint 3: Must be backward compatible with current Tier 2 extraction results]
- [Constraint 4: Must respect Exa.ai and Firecrawl API rate limits and cost constraints]

---

## 7. Data & Database Changes

### Database Schema Changes
```typescript
// Tier 2 enrichment types with literal union types for type safety
const ENRICHMENT_STATUS = ["not_enriched", "enriching", "enriched", "failed"] as const;
const INTELLIGENCE_TYPES = ["coinvestors", "portfolio_companies", "market_trends", "strategy_insights"] as const;
const VALIDATION_LEVELS = ["document_only", "basic_validation", "full_enrichment"] as const;

// Extension to existing Tier 2 intelligence tables with enrichment metadata
export const tier2Intelligence = defineTable({
  // Existing fields preserved
  documentId: v.id("documents"),
  coInvestors: v.array(v.object({
    name: v.string(),
    qualityScore: v.number(),
    totalCoInvestments: v.number(),
    // NEW: External enrichment metadata
    externalValidation: v.optional(v.object({
      isActive: v.boolean(),
      recentInvestments: v.number(),
      investmentFocus: v.array(v.string()),
      networkExpansion: v.array(v.string()), // Additional co-investors discovered
      confidenceScore: v.number(),
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  portfolioCompanies: v.array(v.object({
    name: v.string(),
    sector: v.string(),
    geography: v.string(),
    // NEW: External enrichment metadata
    externalValidation: v.optional(v.object({
      currentStatus: v.string(), // "active", "acquired", "closed", etc.
      lastFunding: v.optional(v.object({
        amount: v.number(),
        date: v.string(),
        round: v.string(),
        investors: v.array(v.string()),
      })),
      marketPosition: v.optional(v.string()),
      employeeCount: v.optional(v.number()),
      recentDevelopments: v.array(v.object({
        title: v.string(),
        date: v.string(),
        impact: v.string(),
      })),
      confidenceScore: v.number(),
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  marketIntelligence: v.array(v.object({
    category: v.string(),
    metric: v.string(),
    value: v.string(),
    // NEW: External validation
    externalValidation: v.optional(v.object({
      marketData: v.optional(v.any()),
      trendConfirmation: v.boolean(),
      broaderContext: v.optional(v.string()),
      confidenceScore: v.number(),
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  strategyInsights: v.array(v.object({
    area: v.string(),
    insight: v.string(),
    confidence: v.number(),
    // NEW: Competitive landscape validation
    externalValidation: v.optional(v.object({
      competitiveLandscape: v.optional(v.any()),
      marketValidation: v.boolean(),
      riskFactors: v.array(v.string()),
      opportunities: v.array(v.string()),
      confidenceScore: v.number(),
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  // NEW: Enrichment tracking
  enrichmentStatus: v.optional(v.object({
    totalEnriched: v.number(),
    coInvestorsEnriched: v.number(),
    portfolioCompaniesEnriched: v.number(),
    marketTrendsValidated: v.number(),
    strategyInsightsEnhanced: v.number(),
    apiCallsMade: v.number(),
    estimatedCost: v.number(),
    processedAt: v.number(),
    duration: v.number(),
  })),
});
```

### Data Model Updates
```typescript
// Enrichment priority types
export interface EnrichmentPriority {
  category: "coinvestors" | "portfolio_companies" | "market_trends" | "strategy_insights";
  priority: "high" | "medium" | "low";
  costEstimate: number;
  timeEstimate: number;
  impactScore: number;
}

export interface CoInvestorEnrichment {
  validation: {
    isActive: boolean;
    recentActivity: string[];
    currentFocus: string[];
  };
  networkExpansion: {
    relatedInvestors: string[];
    sharedPortfolioCompanies: string[];
    sectorAlignment: number;
  };
  qualityAssessment: {
    investmentFrequency: number;
    successRate: number;
    networkQuality: number;
  };
  metadata: {
    confidenceScore: number;
    sources: string[];
    lastUpdated: string;
  };
}

export interface PortfolioCompanyEnrichment {
  currentStatus: {
    operationalStatus: string;
    employeeCount: number;
    recentFunding: FundingRound;
    valuation: number;
  };
  marketPosition: {
    sectorRank: number;
    competitivePosition: string;
    marketShare: number;
  };
  recentDevelopments: {
    news: NewsItem[];
    partnerships: Partnership[];
    productLaunches: ProductLaunch[];
  };
  metadata: {
    confidenceScore: number;
    sources: string[];
    lastUpdated: string;
  };
}
```

### Data Migration Plan
- [ ] [Migration step 1] Add external validation fields to existing tier2Intelligence table
- [ ] [Migration step 2] Add enrichment status tracking field
- [ ] [Migration step 3] Update existing documents with null enrichment metadata for backward compatibility
- [ ] [Data validation steps] Verify enriched data structure matches existing consumption patterns

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

#### **MUTATIONS (Server Actions)** → `convex/actions/[feature].ts`
- [ ] **Server Actions File** - `convex/actions/tier2Enrichment.ts` - ONLY mutations (store enriched data, update enrichment status)
- [ ] Examples: `enrichTier2Intelligence()`, `updateCoInvestorValidation()`, `trackEnrichmentProgress()`
- [ ] Must use `'use server'` directive and proper error handling
- [ ] **What qualifies as mutations**: Storing enriched data, updating enrichment status, cache management

#### **QUERIES (Data Fetching)** → Choose based on complexity:

**Simple Queries** → Direct in Server Components
- [ ] **Direct in Page Components** - Simple Tier 2 intelligence retrieval with enrichment status
- [ ] Example: `const tier2Data = await db.select().from(tier2Intelligence).where(eq(tier2Intelligence.documentId, id))`
- [ ] Use when: Single table lookup, basic enrichment status checking

**Complex Queries** → `convex/lib/[feature].ts`
- [ ] **Query Functions in lib/** - `convex/lib/tier2Enrichment.ts` for complex enrichment logic
- [ ] Example: `enrichCoInvestorData()`, `validatePortfolioCompanies()`, `calculateEnrichmentPriorities()`
- [ ] Use when: External API calls, complex enrichment logic, data validation, cost calculation

#### **API Routes** → `app/api/[endpoint]/route.ts` - **RARELY NEEDED**
🛑 **Only create API routes for these specific cases:**
- [ ] **External API Proxies** - Not needed (all enrichment server-side)
- [ ] **Non-HTML Responses** - Export functionality (if needed later)

❌ **DO NOT use API routes for:**
- [ ] ❌ Internal Tier 2 enrichment data fetching (use lib/ functions instead)
- [ ] ❌ External API calls (use server actions instead)
- [ ] ❌ Enrichment operations (use server actions instead)

#### **PROFESSIONAL NAMING (Directory-Based Separation):**
- `convex/actions/tier2Enrichment.ts` - For Tier 2 enrichment mutations only
- `convex/lib/tier2Enrichment.ts` - For Tier 2 enrichment logic and external API integration
- Example: `convex/actions/tier2Enrichment.ts` + `convex/lib/tier2Enrichment.ts` (no API route needed)

### Server Actions
<!-- New or modified server actions for mutations -->
- [ ] **`enrichTier2Intelligence`** - Main enrichment orchestrator for Tier 2 intelligence
- [ ] **`enrichCoInvestorNetwork`** - Validate and expand co-investor data
- [ ] **`enrichPortfolioCompanies`** - Add market data to portfolio companies
- [ ] **`validateMarketTrends`** - Cross-validate market trends with external data
- [ ] **`enhanceStrategyInsights`** - Add competitive landscape to strategy insights
- [ ] **`updateEnrichmentStatus`** - Track enrichment progress and costs

### Database Queries
<!-- How you'll fetch data - be explicit about the choice -->
- [ ] **Direct in Server Components** - Basic Tier 2 intelligence lookup with enrichment status
- [ ] **Query Functions in lib/tier2Enrichment/** - Complex enrichment logic, external API integration, data validation

### API Routes (Only for Special Cases)
<!-- 🛑 ONLY create API routes when Server Actions and lib/ functions cannot handle the use case -->
- [ ] **No API routes needed** - All Tier 2 enrichment is server-side only

### External Integrations
<!-- Third-party APIs, services, etc. -->
- [Exa.ai API]: Co-investor search and validation, company research, market intelligence
  - Use Cases: Validate co-investor activity, discover related investors, research portfolio companies
  - Rate Limit Management: Intelligent batching and prioritization
- [Firecrawl API]: Deep company research, recent news extraction, competitive analysis
  - Use Cases: Detailed company information, recent developments, competitive landscape
  - Rate Limit Management: Focused on high-priority companies and investors

**🚨 MANDATORY: Use Latest AI Models**
- When using OpenAI models, use **gpt-4o-mini** for intelligence analysis and data synthesis
- External APIs (Exa, Firecrawl) as specified above with intelligent prioritization

---

## 9. Frontend Changes

### New Components
<!-- Components to create in components/ directory, organized by feature -->
- [ ] **`components/tier2/EnrichmentStatusIndicator.tsx`** - Show Tier 2 enrichment progress and status
- [ ] **`components/tier2/ExternalDataBadge.tsx`** - Visual indicator for externally enriched intelligence
- [ ] **`components/tier2/CoInvestorNetworkCard.tsx`** - Enhanced co-investor display with external validation
- [ ] **`components/tier2/PortfolioCompanyCard.tsx`** - Enriched portfolio company display with market data

**Component Organization Pattern:**
- Use `components/tier2/` directory for Tier 2 specific components
- Keep shared/reusable components in `components/ui/` (existing pattern)
- Import into pages from the global components directory

**Component Requirements:**
- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation

### Page Updates
<!-- Pages that need changes -->
- [ ] **`src/pages/Tier2IntelligencePage.tsx`** - Integrate enrichment status and enhanced data display
- [ ] **`src/DocumentView.tsx`** - Add Tier 2 enrichment progress indicators
- [ ] **`src/components/tier2/CoInvestorList.tsx`** - Enhance with external validation display

### State Management
<!-- How data flows through the app -->
- [Real-time subscriptions] - Enhanced Tier 2 intelligence with enrichment metadata
- [Enrichment progress context] - Track enrichment status and costs
- [Cache status integration] - Show cache hit/miss for different intelligence categories

### 🚨 CRITICAL: Context Usage Strategy

**MANDATORY: Before creating any component props or planning data fetching, verify existing context availability**

#### Context-First Design Pattern
- [ ] **✅ Check Available Contexts:** Document and Tier 2 intelligence context already available
- [ ] **✅ Use Context Over Props:** Enrichment status via existing Tier 2 intelligence subscription
- [ ] **✅ Avoid Prop Drilling:** Leverage existing real-time query patterns for enriched data
- [ ] **✅ Minimize Data Fetching:** Use existing Tier 2 intelligence subscriptions
- [ ] **✅ Context Provider Analysis:** Tier 2 intelligence processing already provides base context

#### Decision Flowchart - "Should this be a prop or use context?"
```
📊 Do I need Tier 2 enrichment data in my component?
│
├─ 🔍 Is component already subscribing to Tier 2 intelligence?
│  ├─ ✅ YES: Extend existing subscription to include enrichment metadata
│  └─ ❌ NO: Create new subscription following existing Tier 2 patterns
│
├─ 🔄 Is enrichment metadata part of Tier 2 intelligence?
│  ├─ ✅ YES: Use existing Tier 2 intelligence context
│  └─ ❌ NO: Consider separate enrichment status context
│
└─ 📝 Is this enrichment status only?
   ├─ ✅ YES: Use existing Tier 2 intelligence subscription patterns
   └─ ❌ NO: Consider context for complex enrichment metadata
```

#### Context Provider Mapping Strategy
**Before implementing any component:**
1. **Map existing Tier 2 subscriptions** - Which components already subscribe to Tier 2 data?
2. **Identify enrichment extension points** - Where can enrichment metadata be added to existing subscriptions?
3. **Check for duplication** - Avoid separate enrichment fetching when Tier 2 data already available
4. **Verify subscription patterns** - Use existing real-time query patterns for enrichment status

#### Common Anti-Patterns to Avoid
```typescript
// ❌ BAD: Component receives enrichment data as props when already in Tier 2 context
interface CoInvestorProps {
  coInvestor: CoInvestorData;        // This is in Tier 2 context!
  enrichment: EnrichmentData;        // This can be part of Tier 2 context!
}

function CoInvestorComponent({ coInvestor, enrichment }: CoInvestorProps) {
  return <div>{coInvestor.name}</div>;
}

// ✅ GOOD: Component queries enriched Tier 2 data directly
function CoInvestorComponent() {
  const tier2Data = useQuery(api.tier2Intelligence.get, { documentId });
  const coInvestor = tier2Data?.coInvestors[0]; // Includes enrichment metadata
  return <div>{coInvestor.name}</div>;
}
```

#### Context Analysis Checklist
- [ ] **Scan existing Tier 2 intelligence subscriptions** for enrichment extension opportunities
- [ ] **Map enrichment data access patterns** following existing Tier 2 query patterns
- [ ] **Check for prop drilling** where direct enriched Tier 2 queries could be used instead
- [ ] **Verify no duplicate enrichment fetching** when data already available in Tier 2 context
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
// Current enhancedProcessing.ts - Tier 2 extraction without enrichment
export const extractTier2Intelligence = {
  args: { documentId: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    const strategicPrompt = `Extract strategic intelligence from this document...`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: strategicPrompt }],
    });

    const strategicData = JSON.parse(response.choices[0].message.content || "{}");

    await ctx.runMutation(internal.tier2Intelligence.store, {
      documentId: args.documentId,
      coInvestors: strategicData.coInvestors || [],
      portfolioCompanies: strategicData.portfolioCompanies || [],
      marketIntelligence: strategicData.marketIntelligence || [],
      strategyInsights: strategicData.strategyInsights || [],
    });

    // No external enrichment, no validation, no network expansion
  }
};
```

#### 📂 **After Tier 2 Enrichment Integration**
```typescript
// Enhanced enhancedProcessing.ts with selective external enrichment
export const extractTier2Intelligence = {
  args: { documentId: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    // 1. Extract base intelligence from document
    const baseIntelligence = await extractBaseStrategicIntelligence(args.content);

    // 2. Prioritize enrichment targets (focus on co-investors and portfolio companies)
    const enrichmentPlan = prioritizeEnrichmentTargets(baseIntelligence);

    // 3. Selective enrichment - high-priority categories only
    const enrichedData = await enrichHighPriorityTargets(ctx, enrichmentPlan);

    // 4. Combine LLM intelligence with external enrichment
    const enhancedIntelligence = combineIntelligence(baseIntelligence, enrichedData);

    // 5. Store with enrichment metadata
    await ctx.runMutation(internal.tier2Intelligence.storeEnriched, {
      documentId: args.documentId,
      intelligence: enhancedIntelligence,
      enrichmentStatus: {
        totalEnriched: enrichedData.length,
        coInvestorsEnriched: enrichedData.filter(d => d.type === 'coinvestor').length,
        portfolioCompaniesEnriched: enrichedData.filter(d => d.type === 'portfolio_company').length,
        estimatedCost: calculateEnrichmentCost(enrichedData),
        processedAt: Date.now(),
      }
    });
  }
};

// New tier2Enrichment.ts - selective enrichment logic
export const enrichHighPriorityTargets = {
  args: { enrichmentTargets: v.array(v.any()) },
  handler: async (ctx, args) => {
    const enrichedResults = [];

    // High priority: Co-investors (validate activity, expand network)
    const coInvestorTargets = args.enrichmentTargets.filter(t => t.type === 'coinvestor');
    for (const target of coInvestorTargets) {
      const validation = await validateCoInvestorActivity(target.name);
      const networkExpansion = await discoverRelatedInvestors(target.name);
      enrichedResults.push({
        type: 'coinvestor',
        original: target,
        externalValidation: { ...validation, networkExpansion },
      });
    }

    // High priority: Portfolio companies (market data, recent developments)
    const portfolioTargets = args.enrichmentTargets.filter(t => t.type === 'portfolio_company');
    for (const target of portfolioTargets) {
      const marketData = await enrichPortfolioCompanyData(target.name);
      enrichedResults.push({
        type: 'portfolio_company',
        original: target,
        externalValidation: marketData,
      });
    }

    // Skip medium/low priority (market trends, strategy insights) for cost control
    return enrichedResults;
  }
};
```

#### 🎯 **Key Changes Summary**
- [ ] **Change 1:** Enhance Tier 2 extraction with selective external enrichment (co-investors + portfolio companies)
- [ ] **Change 2:** Add enrichment prioritization logic focusing on high-value intelligence categories
- [ ] **Change 3:** Extend Tier 2 intelligence schema with external validation metadata
- [ ] **Change 4:** Create enrichment status tracking for cost and performance monitoring
- [ ] **Files Modified:**
  - `convex/enhancedProcessing.ts` (enhanced with selective enrichment)
  - `convex/schema.ts` (enriched Tier 2 intelligence tables)
  - New: `convex/lib/tier2Enrichment.ts` (selective enrichment logic)
  - New: `convex/actions/tier2Enrichment.ts` (enrichment mutations)
  - New: `src/components/tier2/EnrichmentStatusIndicator.tsx` (UI for enrichment status)
- [ ] **Impact:** Transforms Tier 2 from document-only analysis to validated, enriched strategic intelligence with current market data

---

## 11. Implementation Plan

### Phase 1: Database Schema Enhancement for Enriched Intelligence
**Goal:** Extend Tier 2 intelligence schema to support external validation metadata

- [ ] **Task 1.1:** Update Tier 2 Intelligence Schema
  - Files: `convex/schema.ts`
  - Details: Add external validation fields to co-investors, portfolio companies, market trends, and strategy insights
- [ ] **Task 1.2:** Add Enrichment Status Tracking
  - Files: `convex/schema.ts`
  - Details: Add enrichment status field for tracking progress, costs, and results
- [ ] **Task 1.3:** Create Database Migration
  - Files: `drizzle/migrations/XXX_tier2_enrichment.sql`
  - Details: Generate and apply migration with proper down migration

### Phase 2: Tier 2 Enrichment Logic Implementation
**Goal:** Build selective enrichment logic focusing on high-value intelligence categories

- [ ] **Task 2.1:** Create Tier 2 Enrichment Library
  - Files: `convex/lib/tier2Enrichment.ts`
  - Details: Implement co-investor validation, portfolio company enrichment, and prioritization logic
- [ ] **Task 2.2:** Implement Co-Investor Network Enrichment
  - Files: `convex/lib/tier2Enrichment.ts`
  - Details: Validate co-investor activity and discover related investors using Exa.ai
- [ ] **Task 2.3:** Implement Portfolio Company Enrichment
  - Files: `convex/lib/tier2Enrichment.ts`
  - Details: Add funding data, market position, and recent developments using Exa.ai and Firecrawl
- [ ] **Task 2.4:** Add Enrichment Prioritization Logic
  - Files: `convex/lib/tier2Enrichment.ts`
  - Details: Implement intelligent prioritization focusing on high-value intelligence categories

### Phase 3: Server Actions for Tier 2 Enrichment
**Goal:** Create mutations for storing enriched intelligence and tracking enrichment progress

- [ ] **Task 3.1:** Create Tier 2 Enrichment Actions
  - Files: `convex/actions/tier2Enrichment.ts`
  - Details: Server actions for orchestrating Tier 2 enrichment and storing results
- [ ] **Task 3.2:** Add Enrichment Status Tracking
  - Files: `convex/actions/tier2Enrichment.ts`
  - Details: Track enrichment progress, costs, and API usage statistics
- [ ] **Task 3.3:** Implement Enrichment Cache Integration
  - Files: `convex/actions/tier2Enrichment.ts`
  - Details: Integrate with external enrichment cache for cost optimization

### Phase 4: Integration with Enhanced Processing Pipeline
**Goal:** Modify existing Tier 2 extraction to use selective external enrichment

- [ ] **Task 4.1:** Update Enhanced Processing
  - Files: `convex/enhancedProcessing.ts`
  - Details: Integrate selective enrichment calls into existing Tier 2 extraction pipeline
- [ ] **Task 4.2:** Add Enrichment Progress Tracking
  - Files: `convex/enhancedProcessing.ts`
  - Details: Track enrichment progress and provide status updates during processing
- [ ] **Task 4.3:** Optimize Performance with Parallel Processing
  - Files: `convex/enhancedProcessing.ts`
  - Details: Parallel co-investor and portfolio company enrichment with proper error handling

### Phase 5: Frontend Enhancement Display
**Goal:** Add UI components to display enriched intelligence and enrichment status

- [ ] **Task 5.1:** Create Enrichment Status Components
  - Files: `src/components/tier2/EnrichmentStatusIndicator.tsx`
  - Details: Show enrichment progress, costs, and API usage statistics
- [ ] **Task 5.2:** Enhance Co-Investor Display
  - Files: `src/components/tier2/CoInvestorNetworkCard.tsx`
  - Details: Display external validation, network expansion, and activity status
- [ ] **Task 5.3:** Enhance Portfolio Company Display
  - Files: `src/components/tier2/PortfolioCompanyCard.tsx`
  - Details: Show market data, funding information, and recent developments
- [ ] **Task 5.4:** Add External Data Badges
  - Files: `src/components/tier2/ExternalDataBadge.tsx`
  - Details: Visual indicators for externally enriched vs. document-only intelligence

### Phase 6: Tier 2 Intelligence Page Integration
**Goal:** Update Tier 2 intelligence page to display enriched data and status

- [ ] **Task 6.1:** Update Tier 2 Intelligence Page
  - Files: `src/pages/Tier2IntelligencePage.tsx`
  - Details: Integrate enrichment status and enhanced data display components
- [ ] **Task 6.2:** Add Enrichment Progress Display
  - Files: `src/pages/Tier2IntelligencePage.tsx`
  - Details: Show real-time enrichment progress and cost tracking
- [ ] **Task 6.3:** Enhance Intelligence Filtering
  - Files: `src/pages/Tier2IntelligencePage.tsx`
  - Details: Add filtering for enriched vs. document-only intelligence

### Phase 7: Testing and Validation
**Goal:** Comprehensive testing of Tier 2 enrichment functionality

- [ ] **Task 7.1:** Test Enrichment Logic
  - Files: `convex/lib/tier2Enrichment.ts`, `convex/actions/tier2Enrichment.ts`
  - Details: Verify co-investor validation, portfolio company enrichment, and prioritization logic
- [ ] **Task 7.2:** Test Integration with Enhanced Processing
  - Files: `convex/enhancedProcessing.ts`
  - Details: End-to-end testing of enriched Tier 2 extraction
- [ ] **Task 7.3:** Test Frontend Display
  - Files: All Tier 2 frontend components
  - Details: Verify enrichment status display and enhanced intelligence visualization

### Phase 8: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [ ] **Task 8.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
- [ ] **Task 8.2:** Static Logic Review
  - Files: Modified business logic files
  - Details: Read code to verify logic syntax, edge case handling, fallback patterns
- [ ] **Task 8.3:** File Content Verification (if applicable)
  - Files: Schema files, type definitions
  - Details: Read files to verify data structure, configuration correctness (NO live database/API calls)

🛑 **CRITICAL WORKFLOW CHECKPOINT**
After completing Phase 8, you MUST:
1. Present "Implementation Complete!" message (exact text from section 16)
2. Wait for user approval of code review
3. Execute comprehensive code review process
4. NEVER proceed to user testing without completing code review first

### Phase 9: Comprehensive Code Review (Mandatory)
**Goal:** Present implementation completion and request thorough code review

- [ ] **Task 9.1:** Present "Implementation Complete!" Message (MANDATORY)
  - Template: Use exact message from section 16, step 7
  - Details: STOP here and wait for user code review approval
- [ ] **Task 9.2:** Execute Comprehensive Code Review (If Approved)
  - Process: Follow step 8 comprehensive review checklist from section 16
  - Details: Read all files, verify requirements, integration testing, provide detailed summary

### Phase 10: User Browser Testing (Only After Code Review)
**Goal:** Request human testing for UI/UX functionality that requires browser interaction

- [ ] **Task 10.1:** Present AI Testing Results
  - Files: Summary of automated test results
  - Details: Provide comprehensive results of all AI-verifiable testing
- [ ] **Task 10.2:** Request User UI Testing
  - Files: Specific browser testing checklist for user
  - Details: Clear instructions for user to verify enriched intelligence display and interactions
- [ ] **Task 10.3:** Wait for User Confirmation
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
### Phase 1: Database Schema Enhancement for Enriched Intelligence
**Goal:** Extend Tier 2 intelligence schema to support external validation metadata

- [x] **Task 1.1:** Update Tier 2 Intelligence Schema ✓ 2025-01-06
  - Files: `convex/schema.ts` (added external validation fields) ✓
  - Details: Extended coInvestors, portfolioCompanies with externalValidation objects ✓
- [x] **Task 1.2:** Add Enrichment Status Tracking ✓ 2025-01-06
  - Files: `convex/schema.ts` (added enrichmentStatus field) ✓
  - Details: Added tracking for costs, API calls, and enrichment progress ✓
```

---

## 13. File Structure & Organization

### New Files to Create
```
project-root/
├── convex/
│   ├── actions/
│   │   └── tier2Enrichment.ts           # Server actions for Tier 2 enrichment
│   ├── lib/
│   │   └── tier2Enrichment.ts           # Tier 2 selective enrichment logic
│   └── enhancedProcessing.ts            # Updated with selective enrichment integration
├── src/
│   ├── components/
│   │   └── tier2/
│   │       ├── EnrichmentStatusIndicator.tsx  # Enrichment progress and status
│   │       ├── ExternalDataBadge.tsx         # External data source indicator
│   │       ├── CoInvestorNetworkCard.tsx     # Enhanced co-investor display
│   │       └── PortfolioCompanyCard.tsx      # Enriched portfolio company display
│   └── pages/
│       └── Tier2IntelligencePage.tsx         # Updated with enrichment integration
└── drizzle/migrations/
    └── [timestamp]_tier2_enrichment/
        ├── migration.sql                   # Forward migration
        └── down.sql                        # Rollback migration
```

**File Organization Rules:**
- **Components**: Always in `components/[feature]/` directories
- **Server Actions**: In `convex/actions/[feature].ts` files (mutations only)
- **Complex Queries**: In `convex/lib/[feature].ts` files (when needed)
- **Pages**: Route-level components in `src/pages/`
- **Database**: Schema updates in `convex/schema.ts`, migrations in `drizzle/migrations/`

#### **LIB FILE SERVER/CLIENT SEPARATION - CRITICAL ARCHITECTURE RULE**

**🚨 MANDATORY: Prevent Server/Client Boundary Violations**

When creating lib files, **NEVER mix server-only imports with client-safe utilities** in the same file.

**Server-Only Imports (Cannot be used by client components):**
- Exa.ai and Firecrawl API clients
- `@/lib/externalEnrichment` (from Task 003)
- Server Actions or other server-side functions
- Database operations for Tier 2 intelligence

**Decision Flowchart - "Should I split this lib file?"**
```
📁 What's in your convex/lib/tier2Enrichment.ts file?
│
├─ 🔴 Server-only imports + Client-safe utilities?
│  └─ ✅ SPLIT: No client components need Tier 2 enrichment logic
│
├─ 🟢 Only server-side operations?
│  └─ ✅ KEEP: Single convex/lib/tier2Enrichment.ts file (server-only)
│
└─ 🟢 Only client-safe utilities?
   └─ ✅ KEEP: Single file (not applicable for Tier 2 enrichment)
```

**File Naming Pattern:**
- `convex/lib/tier2Enrichment.ts` - Server-side Tier 2 enrichment operations only
- No client-side files needed for Tier 2 enrichment (all server-side)

### Files to Modify
- [ ] **`convex/schema.ts`** - Add external validation fields to Tier 2 intelligence tables
- [ ] **`convex/enhancedProcessing.ts`** - Integrate selective enrichment into existing pipeline
- [ ] **`src/pages/Tier2IntelligencePage.tsx`** - Add enrichment status and enhanced display
- [ ] **`src/components/tier2/CoInvestorList.tsx`** - Enhance with external validation display

### Dependencies to Add
```json
{
  "dependencies": {
    // Dependencies already added in Task 003 (exa-js, @firecrawl/firecrawl)
  }
}
```

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1: External API failure during co-investor validation**
  - **Code Review Focus:** Error handling in `convex/lib/tier2Enrichment.ts`
  - **Potential Fix:** Graceful fallback to document-only data with clear status indicators
- [ ] **Error Scenario 2: Enrichment cost exceeding budget**
  - **Code Review Focus:** Cost tracking and limiting logic in enrichment actions
  - **Potential Fix:** Implement real-time cost monitoring and automatic enrichment limits
- [ ] **Error Scenario 3: Inconsistent enrichment quality across intelligence categories**
  - **Code Review Focus:** Confidence scoring and validation in enrichment logic
  - **Potential Fix:** Standardize confidence scoring and quality thresholds

### Edge Cases to Consider
- [ ] **Edge Case 1: Co-investor name variations and matching challenges**
  - **Analysis Approach:** Review entity matching and normalization logic
  - **Recommendation:** Implement fuzzy matching and manual review for low-confidence matches
- [ ] **Edge Case 2: Portfolio companies with limited public information**
  - **Analysis Approach:** Check fallback behavior when external data is sparse
  - **Recommendation:** Clear indicators for data completeness and availability
- [ ] **Edge Case 3: Rapid market changes making enriched data outdated**
  - **Analysis Approach:** Review cache TTL and refresh strategies for different data types
  - **Recommendation:** Dynamic TTL based on data volatility and importance

### Security & Access Control Review
- [ ] **Data Privacy:** Does co-investor and company validation expose sensitive information?
  - **Check:** Only public information requested, no private document content sent externally
- [ **API Security:** Are external API calls properly secured and rate-limited?
  - **Check:** Server-side only calls, proper authentication, rate limiting implementation
- [ ] **Cache Security:** Is enriched intelligence data properly secured?
  - **Check:** Enriched data inherits same security as original Tier 2 intelligence
- [ ] **Cost Protection:** Are there safeguards against excessive API usage?
  - **Check:** Usage limits, cost monitoring, and intelligent caching strategies

### AI Agent Analysis Approach
**Focus:** Review Tier 2 enrichment code to identify potential failure points and security gaps. When issues are found, provide specific recommendations with file paths and code examples.

**Priority Order:**
1. **Critical:** Cost control and API rate limiting protection
2. **Important:** Error handling and graceful degradation
3. **Nice-to-have:** Enrichment quality optimization and user experience improvements

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# From Task 003 - already configured
EXA_API_KEY=cb59a87e-4ce7-49db-afab-798f9054b0d9
FIRECRAWL_API_KEY=fc-846200c8877c40f59061d2f69ba654f2

# Tier 2 specific configuration
TIER2_ENRICHMENT_ENABLED=true
TIER2_MAX_COINVESTORS_TO_ENRICH=10
TIER2_MAX_COMPANIES_TO_ENRICH=15
TIER2_ENRICHMENT_BUDGET_PER_DOCUMENT=50  # Maximum API cost per document
```

### Monitoring and Observability
- **Enrichment Success Rate:** Track percentage of successful co-investor and company enrichment
- **Cost Tracking:** Monitor Tier 2 enrichment costs vs. budget
- **Quality Metrics:** Track confidence scores and user feedback on enriched intelligence
- **Performance Monitoring:** Measure enrichment processing time and cache hit rates

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
   - [ ] **🔢 FIND LATEST TASK NUMBER**: Use `list_dir` to examine ai_docs/tasks/ directory and find the highest numbered task file (e.g., if highest is 003, use 004)
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
   f. **🚨 CRITICAL:** After final implementation phase, you MUST proceed to Phase 9 (Comprehensive Code Review) before any user testing

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
     - [ ] **Phase 8 Complete** → Present "Implementation Complete!" message (section 16, step 7)
     - [ ] **Wait for user approval** → Execute comprehensive code review (section 16, step 8)
     - [ ] **Code review complete** → ONLY THEN request user browser testing
     - [ ] **NEVER skip comprehensive code review** - Phase 8 basic validation ≠ comprehensive review
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
- "Priority-based selective enrichment looks good"
- "Go with co-investors and portfolio companies first"
- "I prefer the focused enrichment approach"
- "Proceed with selective enrichment"
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
  - [ ] **✅ ALWAYS explain business logic**: "Validate co-investor activity with external market data", "Enrich portfolio companies with funding history and market position"
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
  - [ ] **Never leave placeholder comments** like "// No enrichment needed" or "// Removed for cost"
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
  - [ ] Components use existing Tier 2 intelligence subscription patterns instead of unnecessary props
  - [ ] No duplicate data fetching when enrichment data is available via existing subscriptions
  - [ ] Real-time subscription hooks used appropriately for enrichment status tracking
  - [ ] No prop drilling when subscription alternative exists for the same data
  - [ ] All enrichment data access follows existing Convex query patterns
- [ ] **❌ AVOID: Creating unnecessary API routes for internal operations**
- [ ] **❌ AVOID: Mixing server-only imports with client-safe utilities in same file**
- [ ] **❌ AVOID: Prop drilling when existing subscription patterns provide the needed data**
- [ ] **🔍 DOUBLE-CHECK: Does this really need an API route or should it be a Server Action/lib function?**
- [ ] **🔍 DOUBLE-CHECK: Can Tier 2 enrichment be handled entirely server-side?**
- [ ] **🔍 DOUBLE-CHECK: Are enrichment status updates using existing real-time subscription patterns?**

---

## 17. Notes & Additional Context

### Research Links
- [External Enrichment Foundation](003_external-data-enrichment-foundation.md) - Prerequisite infrastructure for external API integration
- [Current Tier 2 Extraction](../convex/enhancedProcessing.ts) - Existing LLM-only extraction logic to be enhanced
- [Exa.ai API Documentation](https://docs.exa.ai/) - Company search and market intelligence
- [Firecrawl API Documentation](https://docs.firecrawl.dev/) - Web scraping for detailed company research

### **⚠️ Common Tier 2 Enrichment Pitfalls to Avoid**

**❌ NEVER DO:**
- Enrich all intelligence categories equally (cost prohibitive)
- Send sensitive document content to external APIs
- Assume external data is always accurate or complete
- Mix co-investor and portfolio company enrichment logic without clear separation

**✅ ALWAYS DO:**
- Prioritize co-investors and portfolio companies for enrichment (highest strategic value)
- Send only extracted entity names to external APIs, not full document content
- Validate external data quality and provide confidence scores
- Implement clear cost controls and usage limits for enrichment operations

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

Before implementing any changes, the AI must systematically analyze potential second-order consequences and alert the user to any significant impacts. This analysis should identify ripple effects that might not be immediately obvious but could cause problems later.

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing Tier 2 API Contracts:** Will enrichment change the structure of Tier 2 extraction results?
- [ ] **Frontend Component Dependencies:** Which components consume Tier 2 data that might now include enrichment metadata?
- [ ] **Data Display Logic:** How will existing UI handle enriched vs. non-enriched intelligence?
- [ ] **Search and Filtering:** Will enrichment affect existing search/filter functionality?

#### 2. **Ripple Effects Assessment**
- [ ] **User Expectation Changes:** How will external enrichment set expectations for data quality and completeness?
- [ ] **Processing Time Impact:** How will selective enrichment affect document processing user experience?
- [ ] **Cost Management Impact:** What new processes are needed for monitoring and controlling enrichment costs?
- [ ] **Data Quality Consistency:** How to handle mixed enriched and non-enriched intelligence in the same display?

#### 3. **Performance Implications**
- [ ] **Processing Time Changes:** How will selective enrichment affect Tier 2 extraction performance?
- [ ] **Cache Performance:** How effective will caching be for co-investor and portfolio company data?
- [ ] **Database Storage Impact:** How much additional storage will enriched Tier 2 intelligence require?
- [ ] **Concurrent Processing Impact:** Can system handle multiple documents with selective enrichment simultaneously?

#### 4. **Security Considerations**
- [ ] **Data Privacy Enhancement:** How does external enrichment improve or affect data privacy?
- [ ] **External Service Dependency Risk:** What are the risks of depending on external APIs for core intelligence?
- [ ] **Information Leakage Risk:** Could external enrichment patterns reveal sensitive intelligence about user interests?
- [ ] **Cache Security:** How to secure cached external intelligence data?

#### 5. **User Experience Impacts**
- [ ] **Intelligence Quality Perception:** How will users perceive the difference between enriched and document-only intelligence?
- [ ] **Processing Transparency:** How to communicate enrichment progress and costs to users?
- [ ] **Feature Discovery:** How will users discover the benefits of external enrichment?
- [ ] **Trust and Reliability:** How to build user trust in externally enriched intelligence?

#### 6. **Maintenance Burden**
- [ ] **External API Management:** What ongoing maintenance will external API integration require?
- [ ] **Quality Assurance:** How to monitor and maintain quality of externally enriched intelligence?
- [ ] **Cost Monitoring:** What processes needed to track and optimize enrichment costs?
- [ ] **Data Freshness Management:** How to handle refresh schedules for different types of enriched data?

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
These issues must be brought to the user's attention before implementation:
- [ ] **Cost Risk:** Selective enrichment still adds significant cost ($20-100 per document depending on co-investor/company count)
- [ ] **Processing Time Impact:** Tier 2 extraction will increase by 30-60 seconds with selective enrichment
- [ ] **Data Quality Variability:** External data quality varies significantly between companies and markets
- [ ] **User Expectation Management:** Users may expect all intelligence to be enriched after experiencing it for some categories

#### ⚠️ **YELLOW FLAGS - Discuss with User**
These issues should be discussed but may not block implementation:
- [ ] **Mixed Intelligence Quality:** Some intelligence will be enriched while others remain document-only
- [ ] **Cache Warm-up Period:** Initial enrichment will be slower until cache is populated
- [ ] **External API Dependencies:** System becomes dependent on external service quality and availability
- [ ] **Feature Complexity:** Additional UI complexity to show enrichment status and metadata

### Mitigation Strategies

#### Cost Management
- [ ] **Intelligent Prioritization:** Focus enrichment on highest-value intelligence categories first
- [ ] **Usage Monitoring:** Real-time cost tracking with alerts and automatic limits
- [ ] **Cache Optimization:** Aggressive caching for co-investor and portfolio company data
- [ ] **User Controls:** Allow users to enable/disable enrichment or set cost limits

#### Performance Optimization
- [ ] **Progressive Loading:** Load basic Tier 2 intelligence first, enrich progressively
- [ ] **Parallel Processing:** Parallel co-investor and portfolio company enrichment
- [ ] **Smart Caching:** Cache enriched data by company/investor name for reuse across documents
- [ ] **Background Refresh:** Background cache updates for frequently accessed entities

#### User Experience Management
- [ ] **Clear Status Indicators:** Visual indicators showing which intelligence is externally enriched
- [ ] **Transparency:** Clear communication about enrichment costs, timing, and data sources
- [ ] **Graceful Degradation:** Fallback to document-only intelligence when external services fail
- [ ] **Quality Scoring:** Confidence scores for all enriched data

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
- Tier 2 intelligence schema will include optional external validation fields
- Frontend components will need to handle enriched vs. non-enriched data display
- Search/filter functionality may need updates to include enrichment metadata

**Performance Implications:**
- Selective enrichment will add 30-60 seconds to Tier 2 processing time
- Cache effectiveness should reduce processing time by 70% for repeated entities
- Database storage will increase by ~30% for enriched intelligence metadata

**Cost Implications:**
- Estimated enrichment cost: $20-100 per document (depending on co-investor/company count)
- Intelligent prioritization should reduce costs by 60% compared to comprehensive enrichment
- Need real-time cost monitoring and user controls

**User Experience Impacts:**
- Mixed intelligence quality (some enriched, some document-only) requires clear UI indicators
- Users will need education about enrichment benefits and costs
- Processing time increase requires clear progress communication

**🚨 USER ATTENTION REQUIRED:**
Selective Tier 2 enrichment will add approximately 45 seconds to processing time and $20-100 in API costs per document. The system will provide clear cost controls and quality indicators to manage user expectations.
```

---

*Template Version: 1.3*
*Last Updated: 8/26/2025*
*Created By: Brandon Hancock*