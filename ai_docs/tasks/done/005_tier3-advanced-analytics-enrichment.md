# Tier 3 Advanced Analytics Enrichment

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
**Title:** Tier 3 Advanced Analytics Enrichment with Predictive Intelligence and Market Forecasting

### Goal Statement
**Goal:** Enhance the Tier 3 advanced analytics extraction pipeline by integrating sophisticated external data sources for performance benchmarking, competitive analysis, predictive modeling, and network intelligence, transforming document-based analytics into forward-looking market intelligence with predictive capabilities and competitive positioning insights.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis

**✅ CONDUCTING STRATEGIC ANALYSIS:**
- Multiple viable approaches for advanced analytics enrichment with different complexity levels
- Trade-offs between predictive accuracy vs implementation complexity
- Performance implications of sophisticated analytical models
- Cost considerations for advanced data sources and analytical tools
- Different enrichment strategies for various analytics categories (performance, competitive, network, predictive)

### Problem Context
The current Tier 3 extraction provides advanced analytics based solely on LLM analysis of document content, which creates fundamental limitations for sophisticated investment analysis. Advanced analytics require current market data, competitive benchmarks, predictive modeling, and network intelligence that cannot be derived from document content alone. Different analytics categories have vastly different enrichment requirements and data availability.

Based on lessons learned from document processing implementation, we understand that:

1. **Schema-first development is critical** - We must define advanced analytics schemas with proper validation before implementing predictive models
2. **Real-time subscriptions eliminate manual refreshing** - Complex analytics processing (60-90 seconds) must have progress tracking and status updates
3. **External API integration requires robust error handling** - Advanced analytics will depend on multiple data sources with varying reliability and cost structures
4. **Environment-driven feature tiers enable graceful degradation** - The system must provide value at basic analytics, selective enrichment, and full predictive modeling levels
5. **Component abstraction enables reusability** - Advanced analytics services must leverage foundations from Tasks 003 and 004 for cost optimization
6. **Progress tracking transforms user experience** - Users expect detailed feedback during complex analytical processing that can take 60-90 seconds
7. **Chunking strategies must balance context preservation with processing limits** - Selective analytics enrichment focuses on high-impact categories while managing computational complexity and API costs

### Solution Options Analysis

#### Option 1: Comprehensive Predictive Analytics Platform
**Approach:** Full-scale advanced analytics enrichment including performance benchmarking, competitive analysis, predictive modeling, network intelligence, and market forecasting across all analytics categories.

**Pros:**
- ✅ Complete competitive intelligence with predictive capabilities
- ✅ Maximum analytical depth and forward-looking insights
- ✅ Comprehensive market positioning and competitive landscape analysis
- ✅ Advanced network intelligence and relationship mapping
- ✅ Sophisticated performance benchmarking and predictive modeling

**Cons:**
- ❌ Very high implementation complexity and development cost
- ❌ Significant external data subscription costs (Bloomberg, PitchBook, etc.)
- ❌ Extended processing time (2-5 minutes per document)
- ❌ Requires advanced analytical expertise and data science capabilities
- ❌ High maintenance burden for model updates and data quality

**Implementation Complexity:** Very High - Complex analytical models, multiple data sources, advanced algorithms
**Risk Level:** Very High - High cost, complexity, and technical challenges

#### Option 2: Strategic Advanced Analytics with Selective Enrichment
**Approach:** Focus on high-impact analytics categories (performance benchmarking, competitive positioning, and network intelligence) with selective use of cost-effective external data sources.

**Pros:**
- ✅ High-value analytics with manageable complexity
- ✅ Focus on actionable intelligence for investment decisions
- ✅ Cost-effective use of external data sources
- ✅ Reasonable processing time (60-90 seconds)
- ✅ Clear ROI on analytical enhancement investment

**Cons:**
- ❌ Limited predictive capabilities compared to comprehensive approach
- ❌ Some analytics categories remain document-only
- ❌ Less sophisticated modeling and forecasting capabilities
- ❌ May not meet needs of highly sophisticated investment teams

**Implementation Complexity:** High - Complex analytics but focused scope
**Risk Level:** Medium - Challenging but manageable complexity and cost

#### Option 3: Progressive Analytics Enhancement
**Approach:** Implement tiered analytics enrichment where core performance benchmarking gets immediate enrichment, competitive intelligence gets background enrichment, and advanced predictive capabilities get on-demand enrichment.

**Pros:**
- ✅ Optimal balance of speed, cost, and analytical depth
- ✅ Progressive disclosure of analytical capabilities
- ✅ Background processing maintains acceptable processing time
- ✅ Users can request deeper analysis as needed
- ✅ Cost control through intelligent analytics prioritization

**Cons:**
- ❌ Complex implementation with multiple analytics pathways
- [ ] Requires sophisticated background job management
- [ ] Complex UI to show different levels of analytical enrichment
- [ ] More sophisticated caching and analytical model management

**Implementation Complexity:** Very High - Complex state management, background analytics, progressive UI
**Risk Level:** Medium - Complexity mitigated by staged implementation

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 2 - Strategic Advanced Analytics with Selective Enrichment

**Why this is the best choice:**
1. **High Impact Focus:** Performance benchmarking, competitive positioning, and network intelligence provide immediate analytical value
2. **Manageable Complexity:** Focused scope makes implementation achievable without requiring data science team
3. **Cost Control:** Selective enrichment of high-value analytics categories provides good ROI
4. **Reasonable Performance:** 60-90 second processing time is acceptable for advanced analytics
5. **Scalable Foundation:** Can be extended to more sophisticated analytics later based on user feedback

**Key Decision Factors:**
- **Analytical Value:** Performance benchmarking and competitive positioning provide immediate investment insights
- **Implementation Feasibility:** Focused scope makes project achievable with available resources
- **Cost Predictability:** Clear cost structure based on targeted analytics enrichment
- **User Experience:** Comprehensive analytical insights without excessive processing delays
- **Business Impact:** Direct impact on investment decision quality and competitive intelligence

**Alternative Consideration:**
The Comprehensive approach (Option 1) would provide the most sophisticated analytics but requires significant investment in data science resources and external data subscriptions. The Progressive approach (Option 3) is technically elegant but adds complexity that may not be justified for current deployment scale.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended Strategic Advanced Analytics approach, or would you prefer a different strategy?

**Questions for you to consider:**
- Are performance benchmarking and competitive positioning the highest priority for your advanced analytics needs?
- How important are predictive modeling capabilities vs immediate analytical insights?
- Are you comfortable with some advanced analytics remaining document-only initially?
- What's your budget tolerance for external data subscriptions and analytical tools?

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
- **External APIs:** Exa.ai and Firecrawl available (from Task 003), additional data sources may be needed
- **Key Architectural Patterns:** Real-time subscriptions to Convex data, Document processing pipeline

### Current State
Currently, the Tier 3 extraction produces:
- **Performance Metrics**: Basic performance calculations from document data only
- **Competitive Analysis**: Document-only competitive landscape analysis
- **Network Intelligence**: Basic relationship mapping from document content
- **Market Forecasting**: Simple trend projection from historical data in document
- **No External Benchmarking**: Cannot compare against market baselines or competitor performance
- **No Predictive Models**: Limited to simple extrapolations without sophisticated modeling
- **No Real-time Market Data**: Analytics based on static document data only

### Existing Context Providers Analysis
- **Document Processing Context:** Real-time updates for extraction status
- **Tier 2 Intelligence Context:** Strategic intelligence with enrichment (from Task 004)
- **Theme Context:** Dark/light mode support
- **User Context:** Basic authentication and profile data
- **No advanced analytics context:** No current infrastructure for complex analytics or predictive modeling

**🔍 Context Coverage Analysis:**
- Document and Tier 2 processing status available via real-time queries
- Tier 3 extraction results available but not externally enriched
- No current infrastructure for complex analytics computation or external data integration
- Advanced analytics caching and job management will need new context integration

## 4. Context & Problem Definition

### Problem Statement
The current Tier 3 advanced analytics extraction provides sophisticated analysis but is fundamentally limited to document-based calculations, creating significant analytical blind spots:

1. **No Performance Benchmarking**: Cannot compare portfolio performance against market indices, peer funds, or industry baselines
2. **Limited Competitive Intelligence**: Competitive analysis based only on document content, missing broader market positioning and competitor strategies
3. **Static Network Analysis**: Network intelligence limited to relationships mentioned in documents, missing broader market connections and influence mapping
4. **No Predictive Modeling**: Forecasting limited to simple trend extrapolation without sophisticated predictive algorithms
5. **Missing Market Context**: Advanced analytics not grounded in current market conditions, competitor performance, or macroeconomic factors

### Success Criteria
- [ ] **Schema-first advanced analytics models** with TypeScript literal types for performance benchmarking, competitive positioning, and predictive analytics
- [ ] **Robust multi-source analytics integration** with comprehensive error handling for diverse external data sources and APIs
- [ ] **Real-time advanced analytics progress tracking** using Convex subscriptions to eliminate manual UI refreshing during 60-90 second analytical processing
- [ ] **Environment-driven analytics tiers** enabling graceful degradation when external data sources are unavailable (basic analytics → selective enrichment → full predictive modeling)
- [ ] **Selective analytics enrichment** focusing on high-impact categories (performance benchmarking, competitive positioning, network intelligence) while managing computational complexity
- [ ] **Reusable advanced analytics components** that leverage external enrichment foundations from Tasks 003 and 004 for cost optimization
- [ ] **Performance benchmarking capabilities** against market indices, peer funds, and industry baselines with confidence intervals
- [ ] **Predictive modeling integration** for portfolio performance and market trends using external data sources
- [ ] **Network intelligence expansion** beyond document content to include broader market relationships and influence mapping
- [ ] **Complex analytics visualization** with clear indicators for analytical confidence and data quality
- [ ] **Progressive enhancement capability** allowing the system to provide analytical value at different complexity levels based on available resources and time constraints

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is advanced enhancement to existing Tier 3 analytics**
- **No backwards compatibility concerns** - enriching existing analytics, not replacing them
- **Progressive analytics approach** - can enable advanced features gradually based on performance and user feedback
- **Priority: Actionable intelligence** over comprehensive analytical coverage
- **Iterative optimization allowed** - can adjust analytical models and enrichment based on user feedback
- **Real-time progress tracking essential** - Users expect detailed feedback during complex 60-90 second analytics processing
- **Component abstraction critical** - Advanced analytics must leverage external enrichment foundations from Tasks 003 and 004
- **Schema-first approach required** - All advanced analytics models must be defined with proper TypeScript typing and validation
- **Multi-source API resilience mandatory** - System must handle failures from diverse data sources gracefully
- **Environment-driven analytics tiers required** - Must provide value at basic calculations, selective enrichment, and full predictive modeling levels

---

## 6. Technical Requirements

### Functional Requirements
- [Requirement 1: System can benchmark portfolio performance against market indices and peer funds]
- [Requirement 2: System can enrich competitive analysis with current market positioning data]
- [Requirement 3: System can expand network intelligence beyond document content using external relationship mapping]
- [Requirement 4: System can implement predictive models using historical performance and market indicators]
- [Requirement 5: System can integrate real-time market data for contextual analytics]
- [Requirement 6: System can provide sophisticated analytical visualization for complex insights]
- [Requirement 7: System can optimize performance through selective analytics enrichment]

### Non-Functional Requirements
- **Performance:** Tier 3 extraction should add less than 90 seconds with selective advanced analytics
- **Accuracy:** High analytical confidence with clear confidence intervals and data quality indicators
- **Security:** All analytics enrichment server-side, no external analytical tool exposure to client
- **Usability:** Complex analytics presented with clear visualization and executive summary formats
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Compatible with existing Tier 3 analytics schema and UI components

### Technical Constraints
- [Constraint 1: Must use existing external enrichment foundation from Task 003]
- [Constraint 2: Cannot modify existing Tier 3 analytics schema structure]
- [Constraint 3: Must be backward compatible with current Tier 3 analytics results]
- [Constraint 4: Must respect API rate limits and cost constraints for advanced data sources]
- [Constraint 5: Limited to publicly available data sources for cost control]

---

## 7. Data & Database Changes

### Database Schema Changes
```typescript
// Extension to existing Tier 3 analytics tables with enrichment metadata
export const tier3Analytics = defineTable({
  // Existing fields preserved
  documentId: v.id("documents"),
  performanceMetrics: v.array(v.object({
    metric: v.string(),
    value: v.number(),
    calculation: v.string(),
    // NEW: Benchmarking and external validation
    benchmarking: v.optional(v.object({
      marketComparison: v.array(v.object({
        benchmark: v.string(), // "S&P 500", "VC Index", "Peer Average"
        value: v.number(),
        percentile: v.number(),
        outperformance: v.number(),
      })),
      industryRank: v.number(),
      timeHorizon: v.string(), // "1Y", "3Y", "5Y", "Since Inception"
      confidenceInterval: v.object({
        lower: v.number(),
        upper: v.number(),
        level: v.number(), // 95%, 99%
      }),
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  competitiveAnalysis: v.array(v.object({
    competitor: v.string(),
    metric: v.string(),
    relativePosition: v.string(), // "above", "below", "neutral"
    gap: v.number(),
    // NEW: Current market data and competitive intelligence
    marketIntelligence: v.optional(v.object({
      currentMarketShare: v.number(),
      recentPerformance: v.array(v.object({
        period: v.string(),
        value: v.number(),
        change: v.number(),
      })),
      strategicMoves: v.array(v.object({
        type: v.string(), // "funding", "acquisition", "expansion", "product_launch"
        description: v.string(),
        impact: v.string(),
        date: v.string(),
      })),
      threatLevel: v.number(), // 0-100 scale
      opportunityLevel: v.number(), // 0-100 scale
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  networkIntelligence: v.array(v.object({
    entity: v.string(),
    relationship: v.string(),
    strength: v.number(),
    // NEW: Expanded network mapping with external data
    networkExpansion: v.optional(v.object({
      extendedConnections: v.array(v.object({
        entity: v.string(),
        relationship: v.string(),
        strength: v.number(),
        influence: v.number(),
      })),
      centralityMetrics: v.object({
        betweenness: v.number(),
        closeness: v.number(),
        eigenvector: v.number(),
      }),
      marketInfluence: v.number(), // Overall influence in market
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  predictiveModels: v.array(v.object({
    model: v.string(),
    prediction: v.any(),
    confidence: v.number(),
    timeframe: v.string(),
    // NEW: Advanced predictive modeling with external data
    modelValidation: v.optional(v.object({
      accuracy: v.number(),
      backtestResults: v.array(v.object({
        period: v.string(),
        predicted: v.number(),
        actual: v.number(),
        error: v.number(),
      })),
      variables: v.array(v.object({
        name: v.string(),
        importance: v.number(),
        currentValue: v.number(),
      })),
      lastTrained: v.number(),
      predictionInterval: v.object({
        lower: v.number(),
        upper: v.number(),
      }),
      lastUpdated: v.number(),
      sources: v.array(v.string()),
    })),
  })),
  // NEW: Advanced analytics tracking
  enrichmentStatus: v.optional(v.object({
    totalEnriched: v.number(),
    benchmarkingEnabled: v.boolean(),
    competitiveIntelligenceEnabled: v.boolean(),
    networkExpansionEnabled: v.boolean(),
    predictiveModelsEnabled: v.boolean(),
    apiCallsMade: v.number(),
    estimatedCost: v.number(),
    processingTime: v.number(),
    modelAccuracy: v.number(),
    dataFreshness: v.number(), // How fresh the external data is
    processedAt: v.number(),
  })),
});
```

### Data Model Updates
```typescript
// Advanced analytics enrichment types
export interface PerformanceBenchmarking {
  marketComparisons: {
    benchmark: string;
    relativePerformance: number;
    percentileRanking: number;
    riskAdjustedReturn: number;
  };
  timeSeriesAnalysis: {
    period: string;
    returns: number[];
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  attributionAnalysis: {
    factor: string;
    contribution: number;
    confidence: number;
  };
  metadata: {
    confidenceInterval: [number, number];
    dataQuality: 'high' | 'medium' | 'low';
    lastUpdated: string;
    sources: string[];
  };
}

export interface CompetitivePositioning {
  marketPosition: {
    marketShare: number;
    competitiveRanking: number;
    growthRate: number;
    profitability: number;
  };
  competitorIntelligence: {
    competitor: string;
    strengths: string[];
    weaknesses: string[];
    recentMoves: string[];
    threatLevel: number;
  };
  strategicOpportunities: {
    opportunity: string;
    marketSize: number;
    growthPotential: number;
    competitiveAdvantage: number;
  };
  metadata: {
    analysisDepth: number;
    confidenceLevel: number;
    lastUpdated: string;
    sources: string[];
  };
}

export interface NetworkAnalysis {
  centralityMetrics: {
    betweenness: number;
    closeness: number;
    eigenvector: number;
    pageRank: number;
  };
  communityDetection: {
    communities: Array<{
      id: string;
      members: string[];
      influence: number;
    }>;
  };
  influenceMapping: {
    directInfluence: number;
    indirectInfluence: number;
    totalReach: number;
  };
  metadata: {
    networkSize: number;
    density: number;
    lastUpdated: string;
    sources: string[];
  };
}
```

### Data Migration Plan
- [ ] [Migration step 1] Add advanced analytics fields to existing tier3Analytics table
- [ ] [Migration step 2] Add enrichment status tracking for advanced analytics
- [ ] [Migration step 3] Update existing documents with null analytics metadata for backward compatibility
- [ ] [Data validation steps] Verify enriched analytics structure matches existing consumption patterns

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
- [ ] **Server Actions File** - `convex/actions/tier3Analytics.ts` - ONLY mutations (store enriched analytics, update analytics status)
- [ ] Examples: `enrichTier3Analytics()`, `updatePerformanceBenchmarking()`, `trackAnalyticsProgress()`
- [ ] Must use `'use server'` directive and proper error handling for complex analytics
- [ ] **What qualifies as mutations**: Storing enriched analytics, updating analytics status, analytical model management

#### **QUERIES (Data Fetching)** → Choose based on complexity:

**Simple Queries** → Direct in Server Components
- [ ] **Direct in Page Components** - Simple Tier 3 analytics retrieval with enrichment status
- [ ] Example: `const tier3Data = await db.select().from(tier3Analytics).where(eq(tier3Analytics.documentId, id))`
- [ ] Use when: Single table lookup, basic analytics status checking

**Complex Queries** → `convex/lib/[feature].ts`
- [ ] **Query Functions in lib/** - `convex/lib/tier3Analytics.ts` for complex analytics logic
- [ ] Example: `calculatePerformanceBenchmarking()`, `analyzeCompetitivePositioning()`, `buildNetworkModels()`
- [ ] Use when: External API calls, complex analytical calculations, predictive modeling, data validation

#### **API Routes** → `app/api/[endpoint]/route.ts` - **RARELY NEEDED**
🛑 **Only create API routes for these specific cases:**
- [ ] **External API Proxies** - Not needed (all analytics enrichment server-side)
- [ ] **Non-HTML Responses** - Export functionality for analytics reports (if needed later)

❌ **DO NOT use API routes for:**
- [ ] ❌ Internal Tier 3 analytics data fetching (use lib/ functions instead)
- [ ] ❌ External API calls for analytics (use server actions instead)
- [ ] ❌ Analytics processing operations (use server actions instead)

#### **PROFESSIONAL NAMING (Directory-Based Separation):**
- `convex/actions/tier3Analytics.ts` - For Tier 3 analytics mutations only
- `convex/lib/tier3Analytics.ts` - For Tier 3 analytics logic and external data integration
- Example: `convex/actions/tier3Analytics.ts` + `convex/lib/tier3Analytics.ts` (no API route needed)

### Server Actions
<!-- New or modified server actions for mutations -->
- [ ] **`enrichTier3Analytics`** - Main analytics enrichment orchestrator for Tier 3
- [ ] **`benchmarkPerformance`** - Add market benchmarking to performance metrics
- [ ] **`analyzeCompetitivePositioning`** - Enrich competitive analysis with market intelligence
- [ ] **`expandNetworkIntelligence`** - Build network models with external relationship data
- [ ] **`generatePredictiveModels`** - Create predictive analytics using external data
- [ ] **`updateAnalyticsStatus`** - Track analytics enrichment progress and model accuracy

### Database Queries
<!-- How you'll fetch data - be explicit about the choice -->
- [ ] **Direct in Server Components** - Basic Tier 3 analytics lookup with enrichment status
- [ ] **Query Functions in lib/tier3Analytics/** - Complex analytics logic, external data integration, predictive modeling

### API Routes (Only for Special Cases)
<!-- 🛑 ONLY create API routes when Server Actions and lib/ functions cannot handle the use case -->
- [ ] **No API routes needed** - All Tier 3 analytics enrichment is server-side only

### External Integrations
<!-- Third-party APIs, services, etc. -->
- [Exa.ai API]: Market research, competitive intelligence, industry analysis
  - Use Cases: Market benchmarking, competitive positioning, industry trends
  - Rate Limit Management: Focused on high-value analytics categories
- [Firecrawl API]: Detailed company research, financial data extraction, competitive analysis
  - Use Cases: Deep competitive intelligence, performance benchmarking data
  - Rate Limit Management: Prioritized for key competitors and market leaders
- [Financial APIs]: Market data, index performance, economic indicators (if budget allows)
  - Use Cases: Real-time benchmarking, predictive model inputs
  - Rate Limit Management: Selective use for critical analytics only

**🚨 MANDATORY: Use Latest AI Models**
- When using OpenAI models, use **gpt-4o-mini** for advanced analytics processing and insight synthesis
- External APIs (Exa, Firecrawl) as specified above with intelligent prioritization for advanced analytics

---

## 9. Frontend Changes

### New Components
<!-- Components to create in components/ directory, organized by feature -->
- [ ] **`components/tier3/AnalyticsEnrichmentStatus.tsx`** - Show Tier 3 analytics enrichment progress and model accuracy
- [ ] **`components/tier3/PerformanceBenchmarkingCard.tsx`** - Display performance comparisons with market benchmarks
- [ ] **`components/tier3/CompetitivePositioningChart.tsx`** - Visualize competitive intelligence and market positioning
- [ ] **`components/tier3/NetworkIntelligenceGraph.tsx`** - Interactive network analysis visualization
- [ ] **`components/tier3/PredictiveModelsPanel.tsx`** - Display predictive analytics with confidence intervals

**Component Organization Pattern:**
- Use `components/tier3/` directory for Tier 3 specific components
- Keep shared/reusable components in `components/ui/` (existing pattern)
- Import into pages from the global components directory

**Component Requirements:**
- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation
- **Data Visualization:** Use charts and graphs effectively for complex analytics presentation

### Page Updates
<!-- Pages that need changes -->
- [ ] **`src/pages/Tier3IntelligencePage.tsx`** - Integrate analytics enrichment status and advanced data visualization
- [ ] **`src/DocumentView.tsx`** - Add Tier 3 analytics progress indicators
- [ ] **`src/components/tier3/AnalyticsDashboard.tsx`** - Enhance with enriched analytics display

### State Management
<!-- How data flows through the app -->
- [Real-time subscriptions] - Enhanced Tier 3 analytics with enrichment metadata
- [Analytics progress context] - Track analytics enrichment progress and model training
- [Advanced analytics cache] - Manage complex analytics caching and computation status

### 🚨 CRITICAL: Context Usage Strategy

**MANDATORY: Before creating any component props or planning data fetching, verify existing context availability**

#### Context-First Design Pattern
- [ ] **✅ Check Available Contexts:** Document, Tier 2, and Tier 3 analytics context already available
- [ ] **✅ Use Context Over Props:** Analytics enrichment status via existing Tier 3 analytics subscription
- [ ] **✅ Avoid Prop Drilling:** Leverage existing real-time query patterns for enriched analytics data
- [ ] **✅ Minimize Data Fetching:** Use existing Tier 3 analytics subscriptions
- [ ] **✅ Context Provider Analysis:** Tier 3 analytics processing already provides base context

#### Decision Flowchart - "Should this be a prop or use context?"
```
📊 Do I need Tier 3 analytics enrichment data in my component?
│
├─ 🔍 Is component already subscribing to Tier 3 analytics?
│  ├─ ✅ YES: Extend existing subscription to include enrichment metadata
│  └─ ❌ NO: Create new subscription following existing Tier 3 patterns
│
├─ 🔄 Is analytics enrichment metadata part of Tier 3 analytics?
│  ├─ ✅ YES: Use existing Tier 3 analytics context
│  └─ ❌ NO: Consider separate analytics enrichment context
│
└─ 📝 Is this analytics enrichment status only?
   ├─ ✅ YES: Use existing Tier 3 analytics subscription patterns
   └─ ❌ NO: Consider context for complex analytics metadata
```

#### Context Provider Mapping Strategy
**Before implementing any component:**
1. **Map existing Tier 3 subscriptions** - Which components already subscribe to Tier 3 data?
2. **Identify analytics enrichment extension points** - Where can enrichment metadata be added to existing subscriptions?
3. **Check for duplication** - Avoid separate analytics enrichment fetching when Tier 3 data already available
4. **Verify subscription patterns** - Use existing real-time query patterns for analytics enrichment status

#### Common Anti-Patterns to Avoid
```typescript
// ❌ BAD: Component receives analytics data as props when already in Tier 3 context
interface AnalyticsProps {
  analytics: Tier3Data;           // This is in Tier 3 context!
  enrichment: AnalyticsEnrichment; // This can be part of Tier 3 context!
}

function AnalyticsComponent({ analytics, enrichment }: AnalyticsProps) {
  return <div>{analytics.metric}</div>;
}

// ✅ GOOD: Component queries enriched Tier 3 analytics directly
function AnalyticsComponent() {
  const tier3Data = useQuery(api.tier3Analytics.get, { documentId });
  const analytics = tier3Data?.performanceMetrics[0]; // Includes enrichment metadata
  return <div>{analytics.metric}</div>;
}
```

#### Context Analysis Checklist
- [ ] **Scan existing Tier 3 analytics subscriptions** for enrichment extension opportunities
- [ ] **Map analytics enrichment data access patterns** following existing Tier 3 query patterns
- [ ] **Check for prop drilling** where direct enriched Tier 3 queries could be used instead
- [ ] **Verify no duplicate analytics enrichment fetching** when data already available in Tier 3 context
- [ ] **Review real-time subscription patterns** for analytics enrichment status updates

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
// Current enhancedProcessing.ts - Tier 3 analytics without external enrichment
export const extractTier3Analytics = {
  args: { documentId: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    const analyticsPrompt = `Extract advanced analytics from this document...`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: analyticsPrompt }],
    });

    const analyticsData = JSON.parse(response.choices[0].message.content || "{}");

    await ctx.runMutation(internal.tier3Analytics.store, {
      documentId: args.documentId,
      performanceMetrics: analyticsData.performanceMetrics || [],
      competitiveAnalysis: analyticsData.competitiveAnalysis || [],
      networkIntelligence: analyticsData.networkIntelligence || [],
      predictiveModels: analyticsData.predictiveModels || [],
    });

    // No external benchmarking, competitive intelligence, or predictive modeling
  }
};
```

#### 📂 **After Tier 3 Advanced Analytics Integration**
```typescript
// Enhanced enhancedProcessing.ts with strategic advanced analytics enrichment
export const extractTier3Analytics = {
  args: { documentId: v.id("documents"), content: v.string() },
  handler: async (ctx, args) => {
    // 1. Extract base analytics from document
    const baseAnalytics = await extractBaseAdvancedAnalytics(args.content);

    // 2. Prioritize analytics enrichment targets
    const analyticsPlan = prioritizeAnalyticsEnrichment(baseAnalytics);

    // 3. Strategic enrichment - focus on high-impact analytics
    const enrichedAnalytics = await enrichHighImpactAnalytics(ctx, analyticsPlan);

    // 4. Combine LLM analytics with external enrichment
    const enhancedAnalytics = combineAdvancedAnalytics(baseAnalytics, enrichedAnalytics);

    // 5. Store with analytics enrichment metadata
    await ctx.runMutation(internal.tier3Analytics.storeEnriched, {
      documentId: args.documentId,
      analytics: enhancedAnalytics,
      enrichmentStatus: {
        totalEnriched: enrichedAnalytics.length,
        benchmarkingEnabled: enrichedAnalytics.some(a => a.type === 'benchmarking'),
        competitiveIntelligenceEnabled: enrichedAnalytics.some(a => a.type === 'competitive'),
        networkExpansionEnabled: enrichedAnalytics.some(a => a.type === 'network'),
        predictiveModelsEnabled: enrichedAnalytics.some(a => a.type === 'predictive'),
        estimatedCost: calculateAnalyticsCost(enrichedAnalytics),
        modelAccuracy: calculateModelAccuracy(enrichedAnalytics),
        processedAt: Date.now(),
      }
    });
  }
};

// New tier3Analytics.ts - strategic advanced analytics logic
export const enrichHighImpactAnalytics = {
  args: { analyticsTargets: v.array(v.any()) },
  handler: async (ctx, args) => {
    const enrichedResults = [];

    // High priority: Performance benchmarking
    const performanceTargets = args.analyticsTargets.filter(t => t.type === 'performance');
    for (const target of performanceTargets) {
      const benchmarking = await calculatePerformanceBenchmarking(target);
      const marketComparison = await getMarketComparisons(target);
      enrichedResults.push({
        type: 'performance',
        original: target,
        benchmarking: { ...benchmarking, marketComparison },
      });
    }

    // High priority: Competitive positioning
    const competitiveTargets = args.analyticsTargets.filter(t => t.type === 'competitive');
    for (const target of competitiveTargets) {
      const positioning = await analyzeCompetitivePositioning(target);
      const marketIntelligence = await getMarketIntelligence(target);
      enrichedResults.push({
        type: 'competitive',
        original: target,
        marketIntelligence: { ...positioning, marketIntelligence },
      });
    }

    // High priority: Network intelligence expansion
    const networkTargets = args.analyticsTargets.filter(t => t.type === 'network');
    for (const target of networkTargets) {
      const networkExpansion = await expandNetworkAnalysis(target);
      enrichedResults.push({
        type: 'network',
        original: target,
        networkExpansion,
      });
    }

    // Selective: Predictive modeling (if sufficient data quality)
    const predictiveTargets = args.analyticsTargets.filter(t =>
      t.type === 'predictive' && t.dataQuality === 'high'
    );
    for (const target of predictiveTargets.slice(0, 2)) { // Limit for cost control
      const models = await generatePredictiveModels(target);
      enrichedResults.push({
        type: 'predictive',
        original: target,
        modelValidation: models,
      });
    }

    return enrichedResults;
  }
};
```

#### 🎯 **Key Changes Summary**
- [ ] **Change 1:** Enhance Tier 3 analytics with strategic external enrichment (benchmarking, competitive, network, predictive)
- [ ] **Change 2:** Add advanced analytics prioritization focusing on high-impact categories
- [ ] **Change 3:** Extend Tier 3 analytics schema with sophisticated enrichment metadata
- [ ] **Change 4:** Create advanced analytics validation and model accuracy tracking
- [ ] **Files Modified:**
  - `convex/enhancedProcessing.ts` (enhanced with strategic analytics enrichment)
  - `convex/schema.ts` (enriched Tier 3 analytics tables)
  - New: `convex/lib/tier3Analytics.ts` (advanced analytics logic)
  - New: `convex/actions/tier3Analytics.ts` (analytics mutations)
  - New: `src/components/tier3/PerformanceBenchmarkingCard.tsx` (benchmarking visualization)
  - New: `src/components/tier3/CompetitivePositioningChart.tsx` (competitive intelligence)
  - New: `src/components/tier3/NetworkIntelligenceGraph.tsx` (network visualization)
- [ ] **Impact:** Transforms Tier 3 from document-only analytics to sophisticated market intelligence with predictive capabilities

---

## 11. Implementation Plan

### Phase 1: Database Schema Enhancement for Advanced Analytics
**Goal:** Extend Tier 3 analytics schema to support sophisticated enrichment metadata

- [ ] **Task 1.1:** Update Tier 3 Analytics Schema
  - Files: `convex/schema.ts`
  - Details: Add benchmarking, competitive intelligence, network expansion, and predictive model fields
- [ ] **Task 1.2:** Add Advanced Analytics Status Tracking
  - Files: `convex/schema.ts`
  - Details: Add comprehensive analytics enrichment status tracking
- [ ] **Task 1.3:** Create Database Migration
  - Files: `drizzle/migrations/XXX_tier3_advanced_analytics.sql`
  - Details: Generate and apply migration with proper down migration

### Phase 2: Advanced Analytics Logic Implementation
**Goal:** Build strategic analytics enrichment focusing on high-impact categories

- [ ] **Task 2.1:** Create Tier 3 Advanced Analytics Library
  - Files: `convex/lib/tier3Analytics.ts`
  - Details: Implement performance benchmarking, competitive analysis, and network intelligence logic
- [ ] **Task 2.2:** Implement Performance Benchmarking
  - Files: `convex/lib/tier3Analytics.ts`
  - Details: Market comparisons, peer analysis, risk-adjusted performance calculations
- [ ] **Task 2.3:** Implement Competitive Intelligence Analysis
  - Files: `convex/lib/tier3Analytics.ts`
  - Details: Market positioning, competitive landscape, strategic move analysis
- [ ] **Task 2.4:** Implement Network Intelligence Expansion
  - Files: `convex/lib/tier3Analytics.ts`
  - Details: Network centrality analysis, relationship mapping, influence calculation
- [ ] **Task 2.5:** Implement Predictive Modeling (Selective)
  - Files: `convex/lib/tier3Analytics.ts`
  - Details: Basic predictive models for high-quality data with confidence intervals

### Phase 3: Server Actions for Advanced Analytics
**Goal:** Create mutations for storing enriched analytics and tracking model performance

- [ ] **Task 3.1:** Create Tier 3 Analytics Actions
  - Files: `convex/actions/tier3Analytics.ts`
  - Details: Server actions for orchestrating advanced analytics enrichment
- [ ] **Task 3.2:** Add Analytics Model Management
  - Files: `convex/actions/tier3Analytics.ts`
  - Details: Track model accuracy, training status, and validation results
- [ ] **Task 3.3:** Implement Advanced Analytics Cache Integration
  - Files: `convex/actions/tier3Analytics.ts`
  - Details: Integrate with external enrichment cache for complex analytics data

### Phase 4: Integration with Enhanced Processing Pipeline
**Goal:** Modify existing Tier 3 extraction to use strategic advanced analytics enrichment

- [ ] **Task 4.1:** Update Enhanced Processing
  - Files: `convex/enhancedProcessing.ts`
  - Details: Integrate strategic analytics enrichment into existing Tier 3 pipeline
- [ ] **Task 4.2:** Add Analytics Progress Tracking
  - Files: `convex/enhancedProcessing.ts`
  - Details: Track complex analytics enrichment progress and model training
- [ ] **Task 4.3:** Optimize Performance with Selective Analytics
  - Files: `convex/enhancedProcessing.ts`
  - Details: Intelligent analytics prioritization and parallel processing

### Phase 5: Advanced Analytics Visualization Components
**Goal:** Create sophisticated UI components for complex analytics display

- [ ] **Task 5.1:** Create Performance Benchmarking Visualization
  - Files: `src/components/tier3/PerformanceBenchmarkingCard.tsx`
  - Details: Charts and graphs for performance comparisons and market rankings
- [ ] **Task 5.2:** Create Competitive Intelligence Display
  - Files: `src/components/tier3/CompetitivePositioningChart.tsx`
  - Details: Competitive landscape visualization and market positioning
- [ ] **Task 5.3:** Create Network Intelligence Visualization
  - Files: `src/components/tier3/NetworkIntelligenceGraph.tsx`
  - Details: Interactive network graphs and relationship mapping
- [ ] **Task 5.4:** Create Predictive Models Panel
  - Files: `src/components/tier3/PredictiveModelsPanel.tsx`
  - Details: Predictive analytics with confidence intervals and model accuracy

### Phase 6: Tier 3 Analytics Page Integration
**Goal:** Update Tier 3 analytics page to display sophisticated enriched data

- [ ] **Task 6.1:** Update Tier 3 Analytics Page
  - Files: `src/pages/Tier3IntelligencePage.tsx`
  - Details: Integrate advanced analytics visualization and enrichment status
- [ ] **Task 6.2:** Add Analytics Model Status Display
  - Files: `src/pages/Tier3IntelligencePage.tsx`
  - Details: Show model accuracy, data quality, and processing information
- [ ] **Task 6.3:** Enhance Analytics Filtering and Exploration
  - Files: `src/pages/Tier3IntelligencePage.tsx`
  - Details: Advanced filtering for different analytics categories and enrichment levels

### Phase 7: Testing and Validation
**Goal:** Comprehensive testing of advanced analytics functionality

- [ ] **Task 7.1:** Test Advanced Analytics Logic
  - Files: `convex/lib/tier3Analytics.ts`, `convex/actions/tier3Analytics.ts`
  - Details: Verify benchmarking, competitive analysis, and network intelligence calculations
- [ ] **Task 7.2:** Test Integration with Enhanced Processing
  - Files: `convex/enhancedProcessing.ts`
  - Details: End-to-end testing of enriched Tier 3 analytics extraction
- [ ] **Task 7.3:** Test Advanced Analytics Visualization
  - Files: All Tier 3 frontend components
  - Details: Verify complex analytics display and interactive features

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
  - Details: Clear instructions for user to verify advanced analytics visualization and interactions
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
### Phase 1: Database Schema Enhancement for Advanced Analytics
**Goal:** Extend Tier 3 analytics schema to support sophisticated enrichment metadata

- [x] **Task 1.1:** Update Tier 3 Analytics Schema ✓ 2025-01-06
  - Files: `convex/schema.ts` (added benchmarking, competitive, network fields) ✓
  - Details: Extended performanceMetrics, competitiveAnalysis with advanced metadata ✓
- [x] **Task 1.2:** Add Advanced Analytics Status Tracking ✓ 2025-01-06
  - Files: `convex/schema.ts` (added comprehensive enrichmentStatus) ✓
  - Details: Added model accuracy, processing time, data freshness tracking ✓
```

---

## 13. File Structure & Organization

### New Files to Create
```
project-root/
├── convex/
│   ├── actions/
│   │   └── tier3Analytics.ts           # Server actions for advanced analytics
│   ├── lib/
│   │   └── tier3Analytics.ts           # Advanced analytics logic and calculations
│   └── enhancedProcessing.ts            # Updated with strategic analytics integration
├── src/
│   ├── components/
│   │   └── tier3/
│   │       ├── AnalyticsEnrichmentStatus.tsx  # Analytics progress and model accuracy
│   │       ├── PerformanceBenchmarkingCard.tsx # Performance comparison visualization
│   │       ├── CompetitivePositioningChart.tsx # Competitive intelligence display
│   │       ├── NetworkIntelligenceGraph.tsx    # Network analysis visualization
│   │       └── PredictiveModelsPanel.tsx      # Predictive analytics display
│   └── pages/
│       └── Tier3IntelligencePage.tsx         # Updated with advanced analytics integration
└── drizzle/migrations/
    └── [timestamp]_tier3_advanced_analytics/
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
- Advanced analytics calculation libraries
- External APIs (Exa.ai, Firecrawl) for analytics enrichment
- `@/lib/externalEnrichment` (from Task 003)
- Server Actions or other server-side functions
- Database operations for Tier 3 analytics

**Decision Flowchart - "Should I split this lib file?"**
```
📁 What's in your convex/lib/tier3Analytics.ts file?
│
├─ 🔴 Server-only imports + Client-safe utilities?
│  └─ ✅ SPLIT: No client components need advanced analytics logic
│
├─ 🟢 Only server-side operations?
│  └─ ✅ KEEP: Single convex/lib/tier3Analytics.ts file (server-only)
│
└─ 🟢 Only client-safe utilities?
   └─ ✅ KEEP: Single file (not applicable for advanced analytics)
```

**File Naming Pattern:**
- `convex/lib/tier3Analytics.ts` - Server-side advanced analytics operations only
- No client-side files needed for Tier 3 analytics (all server-side)

### Files to Modify
- [ ] **`convex/schema.ts`** - Add advanced analytics fields to Tier 3 analytics tables
- [ ] **`convex/enhancedProcessing.ts`** - Integrate strategic analytics enrichment
- [ ] **`src/pages/Tier3IntelligencePage.tsx`** - Add advanced analytics visualization
- [ ] **`src/components/tier3/AnalyticsDashboard.tsx`** - Enhance with enriched analytics display

### Dependencies to Add
```json
{
  "dependencies": {
    // Dependencies already added in Task 003 (exa-js, @firecrawl/firecrawl)
    // Chart libraries for advanced analytics visualization (if needed)
    "recharts": "^2.8.0",  // For performance and competitive charts
    "d3": "^7.8.0",       // For network intelligence visualization (optional)
  }
}
```

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1: Insufficient data for predictive modeling**
  - **Code Review Focus:** Data quality validation in `convex/lib/tier3Analytics.ts`
  - **Potential Fix:** Graceful fallback to descriptive analytics with clear quality indicators
- [ ] **Error Scenario 2: Market benchmarking data unavailable or unreliable**
  - **Code Review Focus:** Fallback logic for benchmarking calculations
  - **Potential Fix:** Use alternative benchmarks or provide clear data limitation notices
- [ ] **Error Scenario 3: Complex analytics calculations causing performance issues**
  - **Code Review Focus:** Performance optimization and caching strategies
  - **Potential Fix:** Background processing for complex calculations with progress indicators

### Edge Cases to Consider
- [ ] **Edge Case 1: Limited competitive intelligence data available**
  - **Analysis Approach:** Review competitive analysis fallback behavior
  - **Recommendation:** Clear indicators for data completeness and competitive coverage
- [ ] **Edge Case 2: Network analysis with disconnected entities**
  - **Analysis Approach:** Check network graph handling for isolated or sparsely connected data
  - **Recommendation:** Graceful handling of network visualization with limited connectivity
- [ ] **Edge Case 3: Rapid market changes making analytics outdated**
  - **Analysis Approach:** Review data freshness indicators and refresh strategies
  - **Recommendation:** Real-time data freshness tracking and user notifications

### Security & Access Control Review
- [ ] **Advanced Analytics Privacy:** Does sophisticated analytics reveal sensitive competitive intelligence?
  - **Check:** All analytics based on publicly available data, no private document content shared externally
- [ ] **Model Security:** Are predictive models and analytical algorithms properly secured?
  - **Check:** Server-side only processing, no model exposure to client
- [ ] **Data Aggregation Security:** Are aggregated analytics properly secured and anonymized?
  - **Check:** Analytics data inherits same security as original Tier 3 analytics
- [ ] **Computational Resource Protection:** Are complex analytics protected against resource abuse?
  - **Check:** Rate limiting, cost controls, and computational resource management

### AI Agent Analysis Approach
**Focus:** Review advanced analytics code to identify potential failure points and security gaps. When issues are found, provide specific recommendations with file paths and code examples.

**Priority Order:**
1. **Critical:** Predictive model accuracy and validation
2. **Important:** Performance benchmarking data quality and reliability
3. **Nice-to-have:** Advanced visualization and user experience optimization

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# From Task 003 - already configured
EXA_API_KEY=cb59a87e-4ce7-49db-afab-798f9054b0d9
FIRECRAWL_API_KEY=fc-846200c8877c40f59061d2f69ba654f2

# Tier 3 specific configuration
TIER3_ADVANCED_ANALYTICS_ENABLED=true
TIER3_BENCHMARKING_ENABLED=true
TIER3_COMPETITIVE_INTELLIGENCE_ENABLED=true
TIER3_PREDICTIVE_MODELS_ENABLED=true
TIER3_ANALYTICS_BUDGET_PER_DOCUMENT=100  # Maximum API cost per document
TIER3_MIN_DATA_QUALITY_FOR_PREDICTION=0.7
```

### Monitoring and Observability
- **Model Accuracy Tracking:** Monitor predictive model performance and accuracy over time
- **Analytics Processing Time:** Track time for different analytics enrichment categories
- **Cost Monitoring:** Monitor Tier 3 advanced analytics costs vs. budget
- **Data Quality Metrics:** Track confidence scores and validation results for enriched analytics

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
   - [ ] **🔢 FIND LATEST TASK NUMBER**: Use `list_dir` to examine ai_docs/tasks/ directory and find the highest numbered task file (e.g., if highest is 004, use 005)
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
- "Strategic advanced analytics looks good"
- "Go with performance benchmarking and competitive intelligence focus"
- "I prefer the focused analytics approach"
- "Proceed with strategic analytics enrichment"
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
  - [ ] **✅ ALWAYS explain business logic**: "Calculate performance benchmarking against market indices", "Generate competitive intelligence using external market data"
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
  - [ ] **Never leave placeholder comments** like "// No predictive models needed" or "// Removed for cost"
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
  - [ ] Components use existing Tier 3 analytics subscription patterns instead of unnecessary props
  - [ ] No duplicate data fetching when analytics enrichment data is available via existing subscriptions
  - [ ] Real-time subscription hooks used appropriately for analytics enrichment status tracking
  - [ ] No prop drilling when subscription alternative exists for the same data
  - [ ] All analytics enrichment data access follows existing Convex query patterns
- [ ] **❌ AVOID: Creating unnecessary API routes for internal operations**
- [ ] **❌ AVOID: Mixing server-only imports with client-safe utilities in same file**
- [ ] **❌ AVOID: Prop drilling when existing subscription patterns provide the needed data**
- [ ] **🔍 DOUBLE-CHECK: Does this really need an API route or should it be a Server Action/lib function?**
- [ ] **🔍 DOUBLE-CHECK: Can Tier 3 analytics enrichment be handled entirely server-side?**
- [ ] **🔍 DOUBLE-CHECK: Are analytics enrichment status updates using existing real-time subscription patterns?**

---

## 17. Notes & Additional Context

### Research Links
- [External Enrichment Foundation](003_external-data-enrichment-foundation.md) - Prerequisite infrastructure for external API integration
- [Tier 2 Strategic Intelligence Enrichment](004_tier2-strategic-intelligence-enrichment.md) - Complementary strategic intelligence enhancement
- [Current Tier 3 Analytics](../convex/enhancedProcessing.ts) - Existing advanced analytics logic to be enhanced
- [Exa.ai API Documentation](https://docs.exa.ai/) - Market intelligence and competitive analysis
- [Firecrawl API Documentation](https://docs.firecrawl.dev/) - Detailed company research for analytics

### **⚠️ Common Advanced Analytics Pitfalls to Avoid**

**❌ NEVER DO:**
- Implement predictive models with insufficient data quality
- Mix advanced analytics categories without clear separation and prioritization
- Send sensitive document content to external APIs for analytics processing
- Present predictive analytics without confidence intervals and accuracy indicators

**✅ ALWAYS DO:**
- Prioritize performance benchmarking and competitive intelligence for immediate value
- Validate external data quality and provide confidence scores for all analytics
- Use only publicly available data for competitive intelligence and benchmarking
- Implement clear model validation and accuracy tracking for predictive analytics

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

Before implementing any changes, the AI must systematically analyze potential second-order consequences and alert the user to any significant impacts. This analysis should identify ripple effects that might not be immediately obvious but could cause problems later.

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing Tier 3 API Contracts:** Will advanced analytics enrichment change the structure of analytics results?
- [ ] **Frontend Visualization Dependencies:** Which components consume Tier 3 data that might now include advanced analytics?
- [ ] **Analytics Display Logic:** How will existing UI handle enriched vs. non-enriched advanced analytics?
- [ ] **Data Export and Reporting:** Will enrichment affect existing analytics export functionality?

#### 2. **Ripple Effects Assessment**
- [ ] **User Expectation Changes:** How will advanced analytics set expectations for analytical sophistication and predictive capabilities?
- [ ] **Processing Time Impact:** How will selective advanced analytics affect document processing user experience?
- [ ] **Analytics Quality Consistency:** How to handle mixed advanced analytics quality across different documents and data availability?
- [ ] **Competitive Intelligence Value:** How will enhanced competitive analysis change user decision-making processes?

#### 3. **Performance Implications**
- [ ] **Processing Time Changes:** How will selective advanced analytics enrichment affect Tier 3 extraction performance?
- [ ] **Computational Complexity Impact:** How will complex analytics calculations affect system performance and resource usage?
- [ ] **Cache Performance:** How effective will caching be for benchmarking and competitive intelligence data?
- [ ] **Visualization Performance:** How will advanced analytics charts and graphs affect frontend performance?

#### 4. **Security Considerations**
- [ ] **Competitive Intelligence Privacy:** How to handle potentially sensitive competitive intelligence data?
- [ ] **Predictive Model Security:** Are predictive models and analytical algorithms properly secured?
- [ ] **Data Aggregation Security:** How to secure aggregated benchmarking and competitive analytics?
- [ ] **External Data Dependency Risk:** What are the risks of depending on external data for advanced analytics?

#### 5. **User Experience Impacts**
- [ ] **Analytics Complexity Management:** How to present sophisticated analytics without overwhelming users?
- [ ] **Data Quality Communication:** How to communicate varying data quality and confidence levels in advanced analytics?
- [ ] **Predictive Analytics Expectation Management:** How to set appropriate expectations for predictive model accuracy?
- [ ] **Advanced Analytics Discovery:** How will users discover and utilize advanced analytics capabilities?

#### 6. **Maintenance Burden**
- [ ] **Model Maintenance:** What ongoing maintenance will predictive models and analytical algorithms require?
- [ ] **Data Source Management:** How to maintain quality and reliability of external data sources for analytics?
- [ ] **Analytics Validation:** What processes needed to validate and maintain accuracy of advanced analytics?
- [ ] **Visualization Maintenance:** How to maintain and update complex analytics visualizations?

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
These issues must be brought to the user's attention before implementation:
- [ ] **Predictive Model Risk:** Predictive analytics may provide false confidence in uncertain market conditions
- [ ] **Processing Time Impact:** Advanced analytics enrichment will increase Tier 3 processing time by 60-90 seconds
- [ ] **Data Quality Variability:** External data quality varies significantly affecting analytics reliability
- [ ] **Competitive Intelligence Sensitivity:** Advanced competitive analysis may reveal sensitive market positioning

#### ⚠️ **YELLOW FLAGS - Discuss with User**
These issues should be discussed but may not block implementation:
- [ ] **Analytics Complexity:** Advanced analytics may be too complex for some users without proper education
- [ ] **Model Accuracy Expectations:** Users may overestimate predictive model accuracy and reliability
- [ ] **External Data Dependencies:** System becomes dependent on external data quality and availability
- [ ] **Visualization Complexity:** Advanced analytics charts and graphs may require significant UI/UX design consideration

### Mitigation Strategies

#### Predictive Model Management
- [ ] **Confidence Interval Display:** Always show confidence intervals and accuracy metrics for predictive models
- [ ] **Model Validation:** Implement ongoing backtesting and validation of predictive models
- [ ] **User Education:** Clear documentation and tooltips explaining predictive model limitations
- [ ] **Quality Thresholds:** Minimum data quality requirements before generating predictive models

#### Performance Optimization
- [ ] **Progressive Loading:** Load basic analytics first, enrich with advanced analytics progressively
- [ ] **Background Processing:** Background computation for complex analytics with progress indicators
- [ ] **Intelligent Caching:** Cache benchmarking and competitive intelligence data by market/sector
- [ ] **Selective Analytics:** Allow users to choose which advanced analytics categories to enable

#### User Experience Management
- [ ] **Executive Summaries:** Provide clear executive summaries alongside detailed analytics
- [ ] **Quality Indicators:** Visual indicators for data quality and confidence levels
- [ ] **Progressive Disclosure:** Reveal complex analytics layers progressively based on user interest
- [ ] **Interactive Exploration:** Allow users to drill down into analytics details as needed

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
- Tier 3 analytics schema will include optional advanced analytics enrichment fields
- Frontend components will need to handle enhanced analytics vs. basic analytics display
- Analytics export functionality may need updates to include enrichment metadata

**Performance Implications:**
- Advanced analytics enrichment will add 60-90 seconds to Tier 3 processing time
- Complex analytics calculations may increase computational resource usage
- Advanced visualizations may impact frontend performance, especially on mobile devices

**Data Quality Implications:**
- External data quality varies significantly affecting analytics reliability
- Predictive models require minimum data quality thresholds before generation
- Competitive intelligence freshness varies by market and data source availability

**User Experience Impacts:**
- Advanced analytics complexity requires careful UI/UX design to avoid overwhelming users
- Predictive analytics need clear confidence interval communication to manage expectations
- Mixed analytics quality (some enriched, some basic) requires clear status indicators

**🚨 USER ATTENTION REQUIRED:**
Advanced analytics enrichment will add approximately 75 seconds to processing time and $50-150 in API costs per document. The system will provide clear confidence intervals and quality indicators to manage expectations about predictive model accuracy.
```

---

*Template Version: 1.3*
*Last Updated: 8/26/2025*
*Created By: Brandon Hancock*