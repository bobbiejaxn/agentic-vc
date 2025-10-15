# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
<!-- Provide a clear, specific title for this task -->
**Title:** Implement OpenAI Enhanced Processing Pipeline for Document Intelligence Extraction

### Goal Statement
<!-- One paragraph describing the high-level objective -->
**Goal:** Implement OpenAI-powered enhanced processing pipeline that creates intelligent chunks, generates vector embeddings, and extracts tiered intelligence from OCR-processed documents, enabling semantic search and sophisticated financial analysis capabilities.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
<!--
AI Agent: Use your judgement to determine when strategic analysis is needed vs direct implementation.

**✅ CONDUCT STRATEGIC ANALYSIS WHEN:**
- Multiple viable technical approaches exist
- Trade-offs between different solutions are significant
- User requirements could be met through different UX patterns
- Architectural decisions will impact future development
- Implementation approach affects performance, security, or maintainability significantly
- Change touches multiple systems or has broad impact
- User has expressed uncertainty about the best approach

**❌ SKIP STRATEGIC ANALYSIS WHEN:**
- Only one obvious technical solution exists
- It's a straightforward bug fix or minor enhancement
- The implementation pattern is clearly established in the codebase
- Change is small and isolated with minimal impact
- User has already specified the exact approach they want

**DEFAULT BEHAVIOR:** When in doubt, provide strategic analysis. It's better to over-communicate than to assume.
-->

### Problem Context
After OCR processing extracts raw text from documents, the system needs to transform this text into structured, searchable intelligence. The reference implementation shows a sophisticated pipeline using OpenAI for embeddings, chunking strategies, and tiered extraction, but the main system lacks this critical component. The system needs to:
1. Create intelligent chunks that preserve document structure and context
2. Generate vector embeddings for semantic search capabilities
3. Implement the 3-tier intelligence extraction system (Tier 1: metrics, Tier 2: strategic, Tier 3: advanced analytics)
4. Store results in the existing enhanced hybrid chunks schema

### Solution Options Analysis

#### Option 1: Direct Port from Reference Implementation
**Approach:** Adapt the existing enhanced processing pipeline from `refs/financial_data_extraction_system/convex/enhancedProcessingActions.ts` to work with the current schema and Convex setup.

**Pros:**
- ✅ **Proven Architecture** - Reference implementation already demonstrates the full pipeline
- ✅ **Complete Solution** - Includes chunking, embeddings, and all 3 intelligence tiers
- ✅ **Fast Implementation** - Minimal design decisions needed, just adaptation work
- ✅ **Battle-tested** - Reference code handles edge cases and error scenarios

**Cons:**
- ❌ **Schema Mismatch** - Need to adapt to current enhanced hybrid chunks schema
- ❌ **Complexity** - Reference implementation is sophisticated and may be over-engineered for current needs
- ❌ **Dependencies** - Requires understanding of multiple interconnected components
- ❌ **Maintenance Burden** - Complex pipeline may be difficult to debug and modify

**Implementation Complexity:** **Medium** - Requires careful adaptation but pattern is established
**Risk Level:** **Medium** - Schema adaptation could introduce bugs

#### Option 2: Modular Implementation with Core Features First
**Approach:** Implement the enhanced processing pipeline in phases, starting with basic chunking and embeddings, then adding tiered extraction incrementally.

**Pros:**
- ✅ **Incremental Development** - Can validate each component before adding complexity
- ✅ **Simpler Debugging** - Easier to isolate issues in smaller components
- ✅ **Faster Time-to-Value** - Basic semantic search available sooner
- ✅ **Flexibility** - Can adjust approach based on real-world usage patterns

**Cons:**
- ❌ **Longer Development Time** - Multiple implementation phases required
- ❌ **Inconsistent Experience** - Features available at different times
- ❌ **Architecture Complexity** - Need to design for extensibility from start
- ❌ **Testing Overhead** - Each phase requires its own testing and validation

**Implementation Complexity:** **High** - Requires careful planning for extensibility
**Risk Level:** **Low** - Incremental approach reduces risk of major failures

#### Option 3: Streamlined Pipeline Focused on Tier 1 Metrics
**Approach:** Implement a simplified pipeline focused primarily on Tier 1 metrics extraction with basic chunking and embeddings, leaving higher tiers for future development.

**Pros:**
- ✅ **Rapid Deployment** - Focus on highest-value financial metrics first
- ✅ **Lower Complexity** - Simpler pipeline easier to maintain and debug
- ✅ **Cost Control** - Reduced OpenAI API usage by focusing on essential extraction
- ✅ **Clear Success Metrics** - Easy to measure value delivered through metrics extraction

**Cons:**
- ❌ **Limited Intelligence** - Missing strategic and advanced analytics capabilities
- ❌ **Incomplete Architecture** - Will need significant refactoring to add higher tiers later
- ❌ **Competitive Disadvantage** - Full 3-tier system is a key differentiator
- ❌ **User Expectation Gap** - Architecture promises 3 tiers but only delivers 1

**Implementation Complexity:** **Low** - Simplified scope reduces implementation complexity
**Risk Level:** **Low** - Focused scope reduces risk factors

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Direct Port from Reference Implementation

**Why this is the best choice:**
1. **Architecture Alignment** - The reference implementation was designed specifically for this VC Portfolio OS use case
2. **Complete Feature Set** - Delivers on the full 3-tier intelligence extraction promise
3. **Proven Patterns** - Handles document structure, chunking strategies, and financial data extraction correctly
4. **Efficient Development** - Adapting existing code is faster than designing from scratch
5. **Future-Proof** - Architecture supports advanced features like co-investor analysis and network intelligence

**Key Decision Factors:**
- **Performance Impact:** Acceptable - reference implementation optimized for financial documents
- **User Experience:** Excellent - provides complete intelligence extraction capabilities
- **Maintainability:** Good - reference code well-structured and documented
- **Scalability:** High - designed to handle VC portfolio analysis workload
- **Security:** High - follows Convex security patterns and API key management

**Alternative Consideration:**
If the reference implementation proves too complex to adapt during implementation, Option 2 (Modular Implementation) would provide a fallback path. The reference architecture can be implemented incrementally while maintaining the end goal of the full 3-tier system.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 1 - Direct Port from Reference Implementation), or would you prefer a different approach?

**Questions for you to consider:**
- Are you comfortable with the complexity of the full 3-tier intelligence extraction system?
- Do you want to deliver the complete system now, or would you prefer incremental rollout?
- Is the development speed of adapting the reference implementation more important than a simplified first version?

**Next Steps:**
Once you approve the strategic direction, I'll update the implementation plan and present you with next step options.

---

## 3. Project Analysis & Current State

### Technology & Architecture
<!--
AI Agent: Analyze the project to fill this out.
- Check `package.json` for versions and dependencies.
- Check `tsconfig.json` for TypeScript configuration.
- Check `tailwind.config.ts` for styling and theme.
- Check `drizzle/schema/` for database schema.
- Check `middleware.ts` for authentication and routing.
- Check `components/` for existing UI patterns.
-->
- **Frameworks & Versions:** Convex for backend, React 19 + Vite + TypeScript for frontend
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Convex built-in database with comprehensive schema including enhanced hybrid chunks
- **UI & Styling:** shadcn/ui components with Tailwind CSS v4
- **Authentication:** Convex auth system with `auth.config.ts`
- **Key Architectural Patterns:** Convex actions for external API calls, internal mutations for data updates, queries for data fetching
- **Relevant Existing Components:** Document management UI, chunking utilities, schema definitions for enhanced hybrid chunks

### Current State
The system currently has:
- ✅ Complete document schema with enhanced hybrid chunks table ready for processing
- ✅ Advanced chunking logic in `convex/chunking.ts` with multiple strategies
- ✅ Document upload and OCR integration (to be implemented in task 001)
- ✅ Schema support for 3-tier intelligence extraction (tier1_critical, tier2_strategic, tier3_analytics)
- ✅ Vector embedding support in enhanced hybrid chunks schema
- ❌ **Missing:** OpenAI enhanced processing pipeline
- ❌ **Missing:** Vector embedding generation
- ❌ **Missing:** Tiered intelligence extraction (metrics, strategic, advanced analytics)
- ❌ **Missing:** Integration with existing chunking strategies

### Existing Context Providers Analysis
<!--
AI Agent: MANDATORY - Analyze existing context providers before planning new data flow
- Check app/(protected)/layout.tsx and other layouts for existing providers
- Check contexts/ directory for available context providers
- Identify what data is already available via context
- Determine what hooks are available (useUser, useUsage, etc.)
-->
- **UserContext (useUser):** User authentication data available in React components
- **Document Processing Context:** No existing context for enhanced processing state
- **Real-time Subscriptions:** Convex provides real-time updates to processing status
- **Context Hierarchy:** React components can access Convex queries directly
- **Available Context Hooks:** useQuery, useMutation for Convex operations

**🔍 Context Coverage Analysis:**
- Enhanced processing status can be tracked via Convex real-time queries
- Tiered intelligence results available through existing enhanced hybrid chunks queries
- No existing context for processing-specific state (will need to implement progress tracking)
- Real-time updates available through Convex subscriptions without additional context providers

## 4. Context & Problem Definition

### Problem Statement
The VC Portfolio OS needs to transform OCR-processed document text into structured, searchable intelligence. The system must implement OpenAI-powered enhanced processing that:
1. Creates intelligent chunks preserving document structure and financial context
2. Generates vector embeddings for semantic search across document collections
3. Extracts 3-tier intelligence: Tier 1 (fund metrics), Tier 2 (strategic intelligence), Tier 3 (advanced analytics)
4. Stores results in the existing enhanced hybrid chunks schema for downstream analysis
5. Provides real-time progress updates during the processing pipeline

### Success Criteria
- [ ] OCR text is automatically processed into intelligent chunks with context preservation
- [ ] Vector embeddings are generated for all chunks enabling semantic search
- [ ] Tier 1 metrics extraction identifies 20+ fund performance indicators
- [ ] Tier 2 strategic intelligence extracts co-investor and market intelligence
- [ ] Tier 3 advanced analytics provides forecasting and network intelligence
- [ ] Processing pipeline integrates seamlessly with existing chunking strategies
- [ ] Real-time progress updates work during enhanced processing
- [ ] Results are stored in enhanced hybrid chunks schema for frontend consumption

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
- [Requirement 1: System automatically triggers enhanced processing after OCR completion]
- [Requirement 2: Intelligent chunking preserves document structure and financial context]
- [Requirement 3: Vector embeddings are generated for semantic search capabilities]
- [Requirement 4: Tier 1 extraction identifies fund performance metrics (IRR, TVPI, DPI, etc.)]
- [Requirement 5: Tier 2 extraction provides strategic intelligence (co-investors, market data)]
- [Requirement 6: Tier 3 extraction delivers advanced analytics (forecasting, network intelligence)]
- [Requirement 7: Users can search documents using semantic queries]
- [Requirement 8: Real-time progress updates work during enhanced processing]

### Non-Functional Requirements
- **Performance:** Enhanced processing should complete within 5-10 minutes for typical financial documents
- **Security:** OpenAI API keys properly secured, document access controlled by user authentication
- **Usability:** Clear progress indicators and semantic search interface
- **Responsive Design:** Search results and progress indicators work on mobile, tablet, and desktop
- **Theme Support:** Enhanced processing UI supports both light and dark mode
- **Compatibility:** Works with modern browsers that support Convex real-time updates

### Technical Constraints
- [Constraint 1: Must use Convex actions for OpenAI API calls]
- [Constraint 2: Must respect Convex action timeout limits (10 minutes)]
- [Constraint 3: Must integrate with existing enhanced hybrid chunks schema]
- [Constraint 4: Must utilize existing chunking strategies from convex/chunking.ts]
- [Constraint 5: Must integrate with existing document management system]

---

## 7. Data & Database Changes

### Database Schema Changes
```sql
-- No new tables needed - existing enhanced hybrid chunks schema supports all requirements
-- Will utilize existing enhancedHybridChunks table with fields:
-- content, embedding, tier, type, importance, metadata, etc.
```

### Data Model Updates
```typescript
// Enhanced processing progress tracking (utilizing existing processingProgress table)
interface EnhancedProcessingProgress {
  documentId: Id<"documents">;
  stage: "chunking" | "embedding" | "tier1_extraction" | "tier2_extraction" | "tier3_extraction" | "completed" | "failed";
  progress: number; // 0-100
  message: string;
  startedAt?: number;
  completedAt?: number;
}

// Enhanced hybrid chunks (using existing schema)
interface EnhancedHybridChunk {
  documentId: Id<"documents">;
  content: string;
  embedding: number[];
  tier: "tier1_critical" | "tier2_strategic" | "tier3_analytics";
  type: "fund_metrics" | "portfolio_company" | "co_investor" | "market_data" | "narrative_text" | "financial_table";
  importance: number; // 0-100
  metadata: {
    section: string;
    confidence: number;
    extractedAt: number;
    [key: string]: any;
  };
}
```

### Data Migration Plan
- [ ] No data migration required - existing enhanced hybrid chunks schema supports all requirements
- [ ] Verify existing enhancedHybridChunks table has all necessary fields for embeddings and tier classification
- [ ] Test enhanced processing with new documents only (no retroactive processing needed)

### 🚨 MANDATORY: Down Migration Safety Protocol
**CRITICAL REQUIREMENT:** No database schema changes required, so no migration needed.

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Convex Mutations)** → `convex/queries.ts`
- [ ] **Enhanced Processing Status Updates** - Update processing progress during pipeline
- [ ] **Enhanced Chunk Storage** - Store processed chunks with embeddings and metadata
- [ ] **Tier Results Storage** - Store extracted intelligence for each tier

#### **ACTIONS (Convex Actions)** → `convex/enhancedProcessing.ts` (NEW FILE)
- [ ] **Document Enhancement Processing** - Coordinate the entire enhanced processing pipeline
- [ ] **Intelligent Chunking** - Create context-aware chunks using existing chunking strategies
- [ ] **Vector Embedding Generation** - Call OpenAI API for embedding generation
- [ ] **Tier 1 Metrics Extraction** - Extract fund performance metrics using OpenAI
- [ ] **Tier 2 Strategic Intelligence** - Extract co-investor and market intelligence
- [ ] **Tier 3 Advanced Analytics** - Extract forecasting and network intelligence

#### **QUERIES (Data Fetching)** → `convex/queries.ts`
- [ ] **Enhanced Processing Status Queries** - Fetch processing pipeline progress
- [ ] **Enhanced Hybrid Chunks Queries** - Retrieve processed chunks with embeddings
- [ ] **Semantic Search Queries** - Search documents using vector similarity
- [ ] **Tier-Specific Queries** - Fetch results by intelligence tier

#### **API Routes** → Not needed - Using Convex actions instead

### Server Actions
- [ ] **`updateEnhancedProcessingStatus`** - Update progress during enhanced processing
- [ ] **`storeEnhancedHybridChunk`** - Store processed chunks with embeddings
- [ ] **`storeTierExtraction`** - Store tiered intelligence results

### Database Queries
- [ ] **Direct in Server Components** - Simple enhanced processing status queries
- [ ] **Query Functions in convex/queries.ts** - Complex semantic search and chunk retrieval

### External Integrations
- [OpenAI API] - Generate embeddings and extract intelligence from document chunks
- **API Keys:** OPENAI_API_KEY required in environment variables
- **Configuration:** Embedding model selection, extraction prompts, timeout settings

**🚨 MANDATORY: Use Latest AI Models**
- OpenAI GPT-4o-mini for intelligence extraction (cost-effective, high quality)
- OpenAI text-embedding-ada-002 for vector embeddings
- Temperature settings optimized for financial data extraction

---

## 9. Frontend Changes

### New Components
- [ ] **`components/document/EnhancedProcessingProgress.tsx`** - Real-time enhanced processing progress
- [ ] **`components/search/SemanticSearch.tsx`** - Semantic search interface for document intelligence
- [ ] **`components/intelligence/TierIntelligenceView.tsx`** - Display tiered intelligence results

**Component Organization Pattern:**
- Use `components/document/` directory for document-specific components
- Use `components/search/` directory for search functionality
- Use `components/intelligence/` directory for intelligence display components
- Keep shared/reusable components in `components/ui/` (existing pattern)

**Component Requirements:**
- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation

### Page Updates
- [ ] **`/documents/[id]`** - Add enhanced processing status and semantic search
- [ ] **`/intelligence`** - New page for exploring tiered intelligence across documents
- [ ] **`/search`** - New semantic search page for document collections

### State Management
- **Real-time Updates:** Use Convex subscriptions for enhanced processing progress
- **Search State:** Manage semantic search queries and results
- **Filter State:** Filter intelligence by tier, type, importance level
- **Error Handling:** Display clear error messages for processing failures

### 🚨 CRITICAL: Context Usage Strategy

**MANDATORY: Before creating any component props or planning data fetching, verify existing context availability**

#### Context-First Design Pattern
- [ ] **✅ Check Available Contexts:** Convex queries provide real-time data access
- [ ] **✅ Use Convex Queries Over Props:** Enhanced processing status available via useQuery
- [ ] **✅ Avoid Prop Drilling:** Use direct Convex queries in components
- [ ] **✅ Minimize Data Fetching:** Leverage real-time subscriptions efficiently
- [ ] **✅ Context Provider Analysis:** Use Convex's built-in real-time capabilities

#### Decision Flowchart - "Should this be a prop or use Convex query?"
```
📊 Do I need enhanced processing/intelligence data in my component?
│
├─ 🔍 Is the data available via Convex queries?
│  ├─ ✅ YES: Use useQuery hook - NO PROPS NEEDED
│  └─ ❌ NO: Check if parent component can fetch data or if prop is necessary
│
├─ 🔄 Is this real-time data (processing status, new intelligence)?
│  ├─ ✅ YES: Use Convex real-time subscriptions
│  └─ ❌ NO: Static data fetch is appropriate
│
└─ 📝 Is this component-specific UI state only?
   ├─ ✅ YES: Local state management is appropriate
   └─ ❌ NO: Consider using Convex query or parent component state
```

#### Universal Context Examples (Apply to All Applications)
- **Convex Queries:** Real-time access to enhanced processing status, semantic search results, tiered intelligence
- **Real-time Subscriptions:** Automatic updates during enhanced processing
- **Authentication:** User access control through Convex auth system

#### Context Analysis Checklist
- [ ] **Verify Convex query availability** for all enhanced processing and intelligence data
- [ ] **Use useQuery hooks** for accessing processing status and intelligence results
- [ ] **Leverage real-time subscriptions** for enhanced processing progress updates
- [ ] **Check for prop drilling** where Convex queries could be used instead
- [ ] **Verify no duplicate data fetching** when queries already provide the data

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
// convex/queries.ts - No enhanced processing exists currently
export const listDocuments = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    // Basic document listing without enhanced processing
    return await ctx.db.query("documents").collect();
  },
});

// No enhanced hybrid chunks processing
// No OpenAI integration
// No semantic search capabilities
```

#### 📂 **After Refactor**
```typescript
// NEW FILE: convex/enhancedProcessing.ts
export const processDocumentEnhanced = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    // 1. Get OCR content from document
    // 2. Create intelligent chunks using existing chunking strategies
    // 3. Generate embeddings with OpenAI
    // 4. Extract Tier 1 metrics (fund performance)
    // 5. Extract Tier 2 strategic intelligence
    // 6. Extract Tier 3 advanced analytics
    // 7. Store in enhanced hybrid chunks table
  },
});

// convex/queries.ts - Enhanced with semantic search
export const searchEnhancedChunks = query({
  args: {
    documentId: v.id("documents"),
    query: v.string(),
    tier: v.optional(v.union(...)),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    // Semantic search using vector embeddings
    // Filter by tier and type
    // Return ranked results
  },
});

export const getEnhancedProcessingProgress = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    // Return current processing stage and progress
  },
});
```

#### 🎯 **Key Changes Summary**
- [ ] **New Enhanced Processing Actions:** Created convex/enhancedProcessing.ts with full 3-tier extraction pipeline
- [ ] **Semantic Search Capability:** Added vector-based search using OpenAI embeddings
- [ ] **Intelligent Chunking Integration:** Connected existing chunking strategies with OpenAI processing
- [ ] **Real-time Progress Tracking:** Added progress queries for enhanced processing status
- [ ] **Tiered Intelligence Storage:** Utilized existing enhanced hybrid chunks schema for all extraction results
- [ ] **Files Modified:** convex/queries.ts (enhanced with semantic search), NEW convex/enhancedProcessing.ts
- [ ] **Impact:** Enables complete intelligence extraction pipeline from OCR to searchable 3-tier intelligence

**Note:** This represents the core enhanced processing system. Additional UI components will be added to support semantic search and intelligence exploration.

---

## 11. Implementation Plan

### Phase 1: Enhanced Processing Actions Implementation
**Goal:** Create core OpenAI enhanced processing pipeline with chunking and embeddings

- [ ] **Task 1.1:** Create `convex/enhancedProcessing.ts` file
  - Files: `convex/enhancedProcessing.ts` (NEW)
  - Details: Adapt reference implementation for enhanced processing with chunking and embeddings
- [ ] **Task 1.2:** Implement intelligent chunking integration
  - Files: `convex/enhancedProcessing.ts`
  - Details: Connect existing chunking strategies with OpenAI processing pipeline
- [ ] **Task 1.3:** Add vector embedding generation
  - Files: `convex/enhancedProcessing.ts`
  - Details: Implement OpenAI embedding generation for semantic search capabilities

### Phase 2: Tiered Intelligence Extraction
**Goal:** Implement 3-tier intelligence extraction system

- [ ] **Task 2.1:** Implement Tier 1 metrics extraction
  - Files: `convex/enhancedProcessing.ts`
  - Details: Extract 20+ fund performance metrics using OpenAI with financial prompts
- [ ] **Task 2.2:** Implement Tier 2 strategic intelligence
  - Files: `convex/enhancedProcessing.ts`
  - Details: Extract co-investor analysis, market intelligence, and strategic insights
- [ ] **Task 2.3:** Implement Tier 3 advanced analytics
  - Files: `convex/enhancedProcessing.ts`
  - Details: Extract forecasting, network intelligence, and advanced analytics

### Phase 3: Enhanced Processing Queries
**Goal:** Add semantic search and intelligence retrieval capabilities

- [ ] **Task 3.1:** Add semantic search queries
  - Files: `convex/queries.ts`
  - Details: Implement vector-based semantic search for document intelligence
- [ ] **Task 3.2:** Add enhanced processing status queries
  - Files: `convex/queries.ts`
  - Details: Add queries for tracking enhanced processing progress and status
- [ ] **Task 3.3:** Add tier-specific intelligence queries
  - Files: `convex/queries.ts`
  - Details: Add filtered queries for each intelligence tier and type

### Phase 4: Integration with Document Processing Pipeline
**Goal:** Connect enhanced processing to OCR completion and existing document workflow

- [ ] **Task 4.1:** Modify OCR completion to trigger enhanced processing
  - Files: `convex/ocrActions.ts` (from task 001)
  - Details: Schedule enhanced processing after OCR completion
- [ ] **Task 4.2:** Add enhanced processing result storage
  - Files: `convex/queries.ts`
  - Details: Store processed chunks and intelligence in enhanced hybrid chunks table
- [ ] **Task 4.3:** Implement progress tracking integration
  - Files: `convex/queries.ts`
  - Details: Connect enhanced processing progress to existing progress tracking system

### Phase 5: Frontend Intelligence Components
**Goal:** Add UI components for exploring enhanced processing results

- [ ] **Task 5.1:** Create enhanced processing progress component
  - Files: `components/document/EnhancedProcessingProgress.tsx` (NEW)
  - Details: Real-time progress indicator for enhanced processing stages
- [ ] **Task 5.2:** Create semantic search component
  - Files: `components/search/SemanticSearch.tsx` (NEW)
  - Details: Search interface using vector embeddings and intelligence filtering
- [ ] **Task 5.3:** Create tiered intelligence display components
  - Files: `components/intelligence/TierIntelligenceView.tsx` (NEW)
  - Details: Display extracted intelligence organized by tier and type

### Phase 6: Error Handling and Validation
**Goal:** Implement comprehensive error handling for enhanced processing pipeline

- [ ] **Task 6.1:** Add enhanced processing error handling
  - Files: `convex/enhancedProcessing.ts`
  - Details: Handle OpenAI API failures, timeout management, and retry logic
- [ ] **Task 6.2:** Implement validation for extraction results
  - Files: `convex/enhancedProcessing.ts`
  - Details: Validate extracted intelligence quality and completeness
- [ ] **Task 6.3:** Add frontend error states
  - Files: Enhanced processing progress components
  - Details: Display error messages and recovery options for processing failures

### Phase 7: Integration Testing
**Goal:** Verify end-to-end enhanced processing pipeline functionality

- [ ] **Task 7.1:** Test complete pipeline from OCR to intelligence extraction
  - Files: Test full document processing workflow
  - Details: Verify enhanced processing triggers correctly after OCR completion
- [ ] **Task 7.2:** Test semantic search functionality
  - Files: Test search components and queries
  - Details: Verify vector-based search returns relevant results
- [ ] **Task 7.3:** Test tiered intelligence extraction
  - Files: Test intelligence display and filtering
  - Details: Verify all 3 tiers extract appropriate intelligence types

### Phase 8: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [ ] **Task 8.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
- [ ] **Task 8.2:** Static Logic Review
  - Files: Modified business logic files
  - Details: Read code to verify logic syntax, edge case handling, fallback patterns
- [ ] **Task 8.3:** File Content Verification (if applicable)
  - Files: Configuration files, static data
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
  - Details: Clear instructions for user to verify enhanced processing workflow, semantic search, intelligence exploration
- [ ] **Task 10.3:** Wait for User Confirmation
  - Files: N/A
  - Details: Wait for user to complete browser testing and confirm results

...

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
### Phase 1: Enhanced Processing Actions Implementation
**Goal:** Create core OpenAI enhanced processing pipeline with chunking and embeddings

- [x] **Task 1.1:** Create `convex/enhancedProcessing.ts` file ✓ 2025-10-06
  - Files: `convex/enhancedProcessing.ts` (NEW) ✓
  - Details: Adapted reference implementation for enhanced processing with chunking and embeddings ✓
- [x] **Task 1.2:** Implement intelligent chunking integration ✓ 2025-10-06
  - Files: `convex/enhancedProcessing.ts` ✓
  - Details: Connected existing chunking strategies with OpenAI processing pipeline ✓
- [x] **Task 1.3:** Add vector embedding generation ✓ 2025-10-06
  - Files: `convex/enhancedProcessing.ts` ✓
  - Details: Implemented OpenAI embedding generation for semantic search capabilities ✓
```

---

## 13. File Structure & Organization

### New Files to Create
```
project-root/
├── convex/
│   ├── enhancedProcessing.ts           # NEW: OpenAI enhanced processing pipeline
│   ├── queries.ts                      # Modified: Enhanced with semantic search
│   └── [existing files...]             # No changes to other files
├── components/document/
│   └── EnhancedProcessingProgress.tsx  # NEW: Enhanced processing progress
├── components/search/
│   └── SemanticSearch.tsx              # NEW: Semantic search interface
├── components/intelligence/
│   └── TierIntelligenceView.tsx        # NEW: Tiered intelligence display
└── src/pages/
    ├── documents/[id]/                  # Modified: Add enhanced processing status
    ├── intelligence/                    # NEW: Intelligence exploration page
    └── search/                          # NEW: Semantic search page
```

**File Organization Rules:**
- **Components**: Always in `components/[feature]/` directories
- **Convex Actions:** In `convex/` directory for backend logic
- **Pages:** Existing pages in `src/pages/` with new pages for intelligence features
- **Queries:** Enhanced existing `convex/queries.ts` file
- **Types:** Co-located with components or in existing type definitions

#### **LIB FILE SERVER/CLIENT SEPARATION - CRITICAL ARCHITECTURE RULE**

**🚨 MANDATORY: Prevent Server/Client Boundary Violations**

When creating lib files, **NEVER mix server-only imports with client-safe utilities** in the same file.

**Server-Only Imports (Cannot be used by client components):**
- `convex/server` (Convex server operations)
- External API calls (OpenAI, Mistral)
- File system operations
- Server Actions or other server-side functions

**Decision Flowchart - "Should I split this lib file?"**
```
📁 What's in your convex/ file?
│
├─ 🔴 Server-only operations + Client-safe utilities?
│  └─ ✅ SPLIT: Create separate files for different concerns
│
├─ 🟢 Only server-side operations?
│  └─ ✅ KEEP: Single convex/ file (server-only)
│
└─ 🟢 Only client-safe utilities?
   └─ ✅ KEEP: Single file (client-safe)
```

**File Naming Pattern:**
- `convex/enhancedProcessing.ts` - Server-side enhanced processing operations
- `components/document/` - Client-side UI components
- Example: Separate concerns between server processing and client UI

### Files to Modify
- [ ] **`convex/queries.ts`** - Enhanced with semantic search and processing status queries
- [ ] **`convex/ocrActions.ts`** - Modified to trigger enhanced processing (from task 001)
- [ ] **`src/pages/documents/[id]/index.tsx`** - Add enhanced processing status and intelligence display

### Dependencies to Add
```json
{
  "dependencies": {
    "openai": "^4.20.0"  // For OpenAI API integration (embeddings and intelligence extraction)
  }
}
```

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1: OpenAI API timeout** - Large documents may exceed 10-minute Convex action timeout
  - **Code Review Focus:** `convex/enhancedProcessing.ts` timeout handling and chunked processing
  - **Potential Fix:** Implement progress-based chunking for large documents
- [ ] **Error Scenario 2: Embedding generation failures** - OpenAI embedding API may fail for certain content
  - **Code Review Focus:** Error handling in embedding generation pipeline
  - **Potential Fix:** Implement fallback embedding strategies and retry logic
- [ ] **Error Scenario 3: Intelligence extraction quality** - Extracted intelligence may be low quality or incomplete
  - **Code Review Focus:** Prompt engineering and validation logic for extraction
  - **Potential Fix:** Implement quality scoring and confidence validation for extracted intelligence

### Edge Cases to Consider
- [ ] **Edge Case 1: Documents with minimal text content** - OCR may produce limited text for processing
  - **Analysis Approach:** Check enhanced processing results for empty/insufficient content
  - **Recommendation:** Graceful handling with appropriate status updates and user notifications
- [ ] **Edge Case 2: Multi-language documents** - Financial documents may contain multiple languages
  - **Analysis Approach:** Verify OpenAI processing handles language detection and processing
  - **Recommendation:** Add language detection and appropriate model selection
- [ ] **Edge Case 3: Complex document structures** - Annual reports with varied content types
  - **Analysis Approach:** Check chunking strategy effectiveness with complex documents
  - **Recommendation:** Implement adaptive chunking based on document structure analysis

### Security & Access Control Review
- [ ] **API Key Security:** Are OpenAI API keys properly secured and not exposed to client?
  - **Check:** Environment variables usage in convex/enhancedProcessing.ts, no client-side exposure
- [ ] **Intelligence Access Control:** Can users only access their own extracted intelligence?
  - **Check:** Authentication checks in enhanced processing actions, user ID validation
- [ ] **Data Privacy:** Is extracted financial intelligence properly secured?
  - **Check:** Database access patterns, user-specific intelligence filtering
- [ ] **Content Validation:** Are processed documents validated for sensitive information handling?
  - **Check:** Content filtering and privacy protection in extraction pipeline

### AI Agent Analysis Approach
**Focus:** Review existing code to identify potential failure points and security gaps. When issues are found, provide specific recommendations with file paths and code examples. This is code analysis and gap identification - not writing tests or test procedures.

**Priority Order:**
1. **Critical:** Security and access control issues (API key exposure, unauthorized intelligence access)
2. **Important:** User-facing error scenarios and edge cases (processing failures, quality issues)
3. **Nice-to-have:** UX improvements and enhanced error messaging

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# Add these to .env
OPENAI_API_KEY=sk-your-openai-api-key-here
# Optional: OPENAI_BASE_URL for custom OpenAI endpoints
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
- [ ] Follow TypeScript best practices
- [ ] Add proper error handling
- [ ] **🚨 MANDATORY: Write Professional Comments - Never Historical Comments**
  - [ ] **❌ NEVER write change history**: "Fixed this", "Removed function", "Updated to use new API"
  - [ ] **❌ NEVER write migration artifacts**: "Moved from X", "Previously was Y"
  - [ ] **✅ ALWAYS explain business logic**: "Extract fund performance metrics using OpenAI with financial prompts", "Generate vector embeddings for semantic search across document collections"
  - [ ] **✅ Write for future developers** - explain what/why the code does what it does, not what you changed
  - [ ] **Remove unused code completely** - don't leave comments explaining what was removed
- [ ] **🚨 MANDATORY: Use early returns to keep code clean and readable**
  - [ ] **Prioritize early returns** over nested if-else statements
  - [ ] **Validate inputs early** and return immediately for invalid cases
  - [ ] **Handle error conditions first** before proceeding with main logic
  - [ ] **Exit early for edge cases** to reduce nesting and improve readability
  - [ ] **Example pattern**: `if (!document) throw new Error("Document not found"); // main logic here`
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
  - [ ] **Example**: `if (!intelligenceResult) throw new Error('Expected intelligence extraction from OpenAI API, got undefined');`
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
  - [ ] **Never leave placeholder comments** like "// No enhanced processing needed" or "// Removed legacy code"
  - [ ] **Delete empty functions/components** completely rather than leaving commented stubs
  - [ ] **Remove unused imports** and dependencies after deletions
  - [ ] **Clean up empty interfaces/types** that no longer serve a purpose
  - [ ] **Remove dead code paths** rather than commenting them out
  - [ ] **If removing code, remove it completely** - don't leave explanatory comments about what was removed

### Architecture Compliance
- [ ] **✅ VERIFY: Used correct data access pattern**
  - [ ] Mutations → Convex mutations (`convex/queries.ts`)
  - [ ] Actions → Convex actions (`convex/enhancedProcessing.ts`) for external API calls
  - [ ] Queries → Convex queries (`convex/queries.ts`) for data fetching
  - [ ] API routes → Not needed for this implementation
- [ ] **🚨 VERIFY: No server/client boundary violations in Convex files**
  - [ ] Files with server imports don't export client-safe utilities
  - [ ] Client components can import from components without pulling in server dependencies
  - [ ] Mixed server/client files are separated using proper file organization
- [ ] **🚨 VERIFY: Proper context usage patterns**
  - [ ] Components use Convex queries for real-time data instead of props
  - [ ] No duplicate data fetching when data is available via Convex queries
  - [ ] Real-time subscriptions used appropriately for processing progress
  - [ ] No prop drilling when Convex queries provide the same data
  - [ ] All data access patterns identified before designing component interfaces
- [ ] **❌ AVOID: Creating unnecessary API routes for internal operations**
- [ ] **❌ AVOID: Mixing server-only imports with client-safe utilities in same file**
- [ ] **❌ AVOID: Prop drilling when Convex queries already contain the needed data**
- [ ] **🔍 DOUBLE-CHECK: Does this really need an API route or should it be a Convex action/query?**
- [ ] **🔍 DOUBLE-CHECK: Can client components safely import from all components they need?**
- [ ] **🔍 DOUBLE-CHECK: Are components using Convex queries instead of receiving data as props?**

---

## 17. Notes & Additional Context

### Research Links
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [OpenAI Embeddings Documentation](https://platform.openai.com/docs/guides/embeddings)
- [Convex Actions Documentation](https://docs.convex.dev/functions/actions)
- [Reference Implementation](../refs/financial_data_extraction_system/convex/enhancedProcessingActions.ts)
- [Existing Chunking Strategies](../../convex/chunking.ts)

### **⚠️ Common Server/Client Boundary Pitfalls to Avoid**

**❌ NEVER DO:**
- Import OpenAI client in files that export client-safe utilities
- Mix external API calls with UI component logic in same file
- Expose API keys or sensitive data to client components
- Create utility files that both server and client components import without considering import chains

**✅ ALWAYS DO:**
- Separate server operations (enhanced processing) from client utilities
- Use Convex actions for all external API calls
- Keep API keys and sensitive operations on server side only
- Test that client components can import utilities without errors

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

Before implementing any changes, the AI must systematically analyze potential second-order consequences and alert the user to any significant impacts. This analysis should identify ripple effects that might not be immediately obvious but could cause problems later.

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** Will enhanced processing changes affect existing document workflows?
- [ ] **Database Dependencies:** Are there queries that depend on enhanced hybrid chunks structure?
- [ ] **Component Dependencies:** Which components will need updates to handle new intelligence data?
- [ ] **Authentication/Authorization:** Will enhanced intelligence access patterns affect existing permissions?

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** How will enhanced processing status changes affect downstream components?
- [ ] **UI/UX Cascading Effects:** Will semantic search and intelligence displays require layout changes?
- [ ] **State Management:** Will real-time enhanced processing updates conflict with existing state patterns?
- [ ] **Search Dependencies:** How will semantic search capabilities affect existing search functionality?

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** Will enhanced hybrid chunks queries affect existing document list performance?
- [ ] **Bundle Size:** Are new OpenAI client dependencies significantly increasing bundle size?
- [ ] **Server Load:** Will enhanced processing increase Convex action resource usage?
- [ ] **Caching Strategy:** Do enhanced processing results need special caching considerations?

#### 4. **Security Considerations**
- [ ] **Attack Surface:** Does OpenAI enhanced processing introduce new security vulnerabilities?
- [ ] **Data Exposure:** Are enhanced intelligence results properly secured and access-controlled?
- [ ] **API Key Security:** Are OpenAI API keys properly protected from client exposure?
- [ ] **Intelligence Privacy:** Is extracted financial intelligence properly protected?

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** Will enhanced processing delay change familiar document workflows?
- [ ] **Processing Time:** How will enhanced processing time affect user expectations?
- [ ] **Search Experience:** How will semantic search capabilities change user interaction patterns?
- [ **Intelligence Discovery:** How will tiered intelligence displays affect user workflows?

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Are we introducing complex AI processing patterns that will be hard to maintain?
- [ ] **Dependencies:** Are OpenAI dependencies reliable and well-maintained?
- [ ] **Testing Overhead:** Will enhanced processing require significant additional test coverage?
- [ ] **Documentation:** What new documentation will be required for maintainers?

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
These issues must be brought to the user's attention before implementation:
- [ ] **API Key Security:** OpenAI API key exposure risk if not properly secured
- [ ] **Processing Timeout Risk:** Enhanced processing may exceed Convex action timeout limits
- [ ] **Cost Implications:** OpenAI API costs could scale significantly with document volume
- [ ] **Intelligence Sensitivity:** Extracted financial intelligence requires careful access control

#### ⚠️ **YELLOW FLAGS - Discuss with User**
These issues should be discussed but may not block implementation:
- [ ] **Processing Delay:** Enhanced processing adds significant delay to document workflow
- [ ] **Complexity Increase:** AI processing pipeline introduces substantial complexity
- [ ] **UI Changes Required:** Semantic search and intelligence displays require interface changes
- [ ] **Quality Variability:** AI extraction quality may vary across document types

### Mitigation Strategies

#### API Integration Changes
- [ ] **API Key Security Strategy:** Ensure API keys stored in environment variables, never exposed to client
- [ ] **Timeout Management:** Implement chunked processing and progress tracking for long operations
- [ ] **Cost Monitoring Strategy:** Set up usage tracking and alerts for OpenAI API costs
- [ ] **Quality Assurance Strategy:** Implement confidence scoring and validation for extracted intelligence

#### Performance Changes
- [ ] **Progressive Enhancement:** Start with essential processing, enhance accuracy over time
- [ ] **Background Processing:** Use Convex scheduler for non-blocking enhanced processing
- [ ] **Caching Strategy:** Cache intelligence results to avoid reprocessing identical content
- [ ] **Resource Limits:** Implement document size and complexity validation

#### UI/UX Changes
- [ ] **Progressive Disclosure:** Show basic document view first, reveal intelligence as processing completes
- [ ] **Search Integration:** Gradually introduce semantic search alongside existing search
- [ ] **Intelligence Organization:** Clear visual hierarchy for 3-tier intelligence display
- [ ] **Performance Feedback:** Set realistic expectations about processing time

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
- Document processing workflow will include 5-10 minute enhanced processing delay
- Enhanced hybrid chunks structure will be populated, affecting existing queries
- New semantic search capabilities will change user interaction patterns

**Performance Implications:**
- Enhanced processing may take 5-10 minutes per document, affecting user experience
- OpenAI API costs could scale significantly with document volume and intelligence extraction depth
- Vector embeddings and enhanced chunks storage will increase database size
- Convex actions may hit timeout limits for complex documents

**Security Considerations:**
- OpenAI API key must be properly secured in environment variables
- Extracted financial intelligence contains sensitive data requiring proper access control
- Enhanced processing may reveal competitive intelligence in documents
- Vector embeddings could potentially be used to reconstruct sensitive information

**User Experience Impacts:**
- Document upload workflow will now include multi-stage processing with progress indicators
- Users will gain semantic search capabilities across their document collection
- Tiered intelligence display will provide new insights into portfolio data
- Real-time updates will improve visibility into processing pipeline

**Mitigation Recommendations:**
- Implement document size and complexity validation to prevent timeouts
- Add comprehensive cost monitoring and usage alerts for OpenAI API
- Set up proper access controls for extracted intelligence based on user roles
- Design progressive disclosure UI to manage user expectations during processing

**🚨 USER ATTENTION REQUIRED:**
The enhanced processing pipeline will add 5-10 minutes processing time and significant OpenAI API costs. Please confirm if this delay and cost structure is acceptable for your user experience and budget requirements.
```

---

*Template Version: 1.3*
*Last Updated: 8/26/2025*
*Created By: Brandon Hancock*