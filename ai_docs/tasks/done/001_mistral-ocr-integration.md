# AI Task Template

> **Instructions:** This template helps you create comprehensive task documents for AI-driven development. Fill out each section thoroughly to ensure the AI agent has all necessary context and can execute the task systematically.

---

## 1. Task Overview

### Task Title
<!-- Provide a clear, specific title for this task -->
**Title:** Implement Mistral OCR Integration for Document Processing Pipeline

### Goal Statement
<!-- One paragraph describing the high-level objective -->
**Goal:** Implement complete Mistral OCR integration to extract text, images, and structural information from uploaded financial documents, enabling the full document processing pipeline as outlined in the VC Portfolio OS architecture.

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
The current VC Portfolio OS has the database schema and chunking infrastructure in place, but completely lacks the OCR processing component that converts uploaded documents into machine-readable text. This is a critical missing piece that prevents the entire document processing pipeline from functioning. The system needs to integrate with Mistral's OCR API to extract text, maintain document structure, and identify financial data elements from various document formats (PDFs, images, etc.).

### Solution Options Analysis

#### Option 1: Direct Mistral API Integration
**Approach:** Implement direct API calls to Mistral's OCR service from Convex actions, handling file upload, OCR processing, and result storage in a single pipeline.

**Pros:**
- ✅ **Simplicity** - Direct integration without additional infrastructure
- ✅ **Real-time processing** - Documents processed immediately upon upload
- ✅ **Full control** - Complete control over error handling and retry logic
- ✅ **Cost transparency** - Direct visibility into API usage and costs

**Cons:**
- ❌ **Convex action timeout limits** - Large documents might exceed 10-minute action timeout
- ❌ **Error handling complexity** - Need to implement robust retry and failure recovery
- ❌ **Memory constraints** - Large file processing within Convex memory limits

**Implementation Complexity:** **Medium** - Requires careful handling of file streams and API timeouts
**Risk Level:** **Medium** - API rate limits and timeout risks need mitigation

#### Option 2: Hybrid Processing with Queue System
**Approach:** Use Convex for document metadata and trigger OCR processing through external queue system (like AWS SQS + Lambda), then write results back to Convex.

**Pros:**
- ✅ **Scalability** - Can handle large documents and high volume processing
- ✅ **Reliability** - Queue system provides built-in retry and failure handling
- ✅ **Performance** - No blocking Convex actions during OCR processing
- ✅ **Monitoring** - Better observability into processing pipeline health

**Cons:**
- ❌ **Infrastructure complexity** - Additional AWS services and deployment complexity
- ❌ **Cost** - Additional costs for queue services and Lambda functions
- ❌ **Development overhead** - Need to maintain separate processing service
- ❌ **Latency** - Additional queue processing delay

**Implementation Complexity:** **High** - Requires infrastructure setup and deployment coordination
**Risk Level:** **High** - More moving parts increase deployment and operational complexity

#### Option 3: Streaming OCR with Progress Tracking
**Approach:** Implement streaming OCR that processes documents in chunks, with real-time progress updates stored in Convex, allowing for better user experience and timeout management.

**Pros:**
- ✅ **User Experience** - Real-time progress updates during processing
- ✅ **Timeout management** - Avoids Convex action timeout limits
- ✅ **Resume capability** - Can resume interrupted processing
- ✅ **Resource efficiency** - Better memory usage with chunked processing

**Cons:**
- ❌ **Implementation complexity** - Complex state management and chunk coordination
- ❌ **OCR accuracy** - May lose context between chunks affecting extraction quality
- ❌ **Error recovery** - Complex logic to handle partial failures and resume
- ❌ **Development time** - Significantly more complex than direct integration

**Implementation Complexity:** **High** - Requires sophisticated chunking and state management
**Risk Level:** **High** - Complex state synchronization increases risk of processing errors

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Direct Mistral API Integration

**Why this is the best choice:**
1. **Simplicity优先** - For a development-focused system, direct integration provides the fastest path to working functionality
2. **Adequate for current use case** - Financial documents are typically manageable in size and don't exceed Convex limits
3. **Lower operational burden** - No additional infrastructure to maintain and deploy
4. **Faster iteration** - Easier to debug, modify, and improve OCR processing logic
5. **Better error visibility** - Direct API responses make troubleshooting easier

**Key Decision Factors:**
- **Performance Impact:** Acceptable for typical financial document sizes (<50MB)
- **User Experience:** Good enough for development/testing phase, can be enhanced later
- **Maintainability:** High - Single codebase, clear responsibilities
- **Scalability:** Adequate for current user base (VC firms with moderate document volume)
- **Security:** High - All processing within Convex security model

**Alternative Consideration:**
If document processing volume grows significantly or timeout issues arise, Option 2 (Hybrid Processing) would be the natural evolution point. The direct integration can be migrated to queue-based processing without changing the API interface.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 1 - Direct Mistral API Integration), or would you prefer a different approach?

**Questions for you to consider:**
- Are you expecting to process very large financial documents (>50MB) that might hit timeout limits?
- Do you anticipate high-volume processing (100+ documents per day) that would benefit from queue-based scaling?
- Is simplicity and faster development time more important than enterprise-grade scalability at this stage?

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
- **Database & ORM:** Convex built-in database with defined schema
- **UI & Styling:** shadcn/ui components with Tailwind CSS v4
- **Authentication:** Convex auth system with `auth.config.ts`
- **Key Architectural Patterns:** Convex actions for external API calls, mutations for data changes, queries for data fetching
- **Relevant Existing Components:** Document upload UI exists, file storage in Convex storage, document metadata schema

### Current State
The system currently has:
- ✅ Complete document schema with OCR fields (legacy, ready for use)
- ✅ File upload infrastructure in Convex storage
- ✅ Document management UI components
- ✅ Chunking and processing utilities
- ❌ **Missing:** Actual OCR processing integration
- ❌ **Missing:** Mistral API integration
- ❌ **Missing:** Document text extraction pipeline
- ❌ **Missing:** OCR progress tracking

### Existing Context Providers Analysis
<!--
AI Agent: MANDATORY - Analyze existing context providers before planning new data flow
- Check app/(protected)/layout.tsx and other layouts for existing providers
- Check contexts/ directory for available context providers
- Identify what data is already available via context
- Determine what hooks are available (useUser, useUsage, etc.)
-->
- **UserContext (useUser):** User authentication data available in React components
- **Document Processing Context:** No existing context for document processing state
- **Real-time Subscriptions:** Convex provides real-time updates to document status
- **Context Hierarchy:** React components can access Convex queries directly
- **Available Context Hooks:** useQuery, useMutation for Convex operations

**🔍 Context Coverage Analysis:**
- Document processing status can be tracked via Convex real-time queries
- No existing context for OCR-specific state (will need to implement progress tracking)
- Document upload UI already exists and can be extended with OCR integration
- Real-time updates available through Convex subscriptions without additional context providers

## 4. Context & Problem Definition

### Problem Statement
The VC Portfolio OS lacks the critical OCR processing component that converts uploaded financial documents into machine-readable text. Without this integration, the entire document processing pipeline (chunking → embeddings → tiered extraction) cannot function. The system needs to:
1. Accept uploaded documents in various formats (PDF, images)
2. Send documents to Mistral OCR API for processing
3. Extract text, structure, and identify financial elements
4. Store OCR results in the database for downstream processing
5. Provide real-time progress updates to users

### Success Criteria
- [ ] Users can upload financial documents and see OCR processing status
- [ ] Mistral OCR API successfully extracts text and structure from documents
- [ ] OCR results are stored in Convex database with proper metadata
- [ ] Real-time progress updates work during OCR processing
- [ ] Error handling gracefully manages API failures and timeouts
- [ ] Processing pipeline integrates with existing chunking system
- [ ] OCR accuracy meets requirements for financial document analysis

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
- [Requirement 1: User can upload financial documents through existing upload interface]
- [Requirement 2: System automatically triggers Mistral OCR processing on upload]
- [Requirement 3: OCR processing extracts text, maintains document structure, and identifies financial elements]
- [Requirement 4: Users can see real-time progress updates during OCR processing]
- [Requirement 5: OCR results are stored and made available for chunking and extraction pipeline]
- [Requirement 6: System handles various document formats (PDF, PNG, JPG) and sizes]
- [Requirement 7: Error handling provides clear feedback when OCR processing fails]

### Non-Functional Requirements
- **Performance:** OCR processing should complete within 2-5 minutes for typical financial documents (<20MB)
- **Security:** API keys properly secured, document access controlled by user authentication
- **Usability:** Clear progress indicators and error messages for OCR processing
- **Responsive Design:** Progress indicators work on mobile, tablet, and desktop
- **Theme Support:** OCR processing UI supports both light and dark mode
- **Compatibility:** Works with modern browsers that support file upload and Convex real-time updates

### Technical Constraints
- [Constraint 1: Must use Convex actions for external API calls (Mistral OCR)]
- [Constraint 2: Must respect Convex action timeout limits (10 minutes)]
- [Constraint 3: Must integrate with existing document schema and storage system]
- [Constraint 4: Must use existing authentication system for document access control]

---

## 7. Data & Database Changes

### Database Schema Changes
```sql
-- No new tables needed - existing schema already includes OCR fields
-- Will utilize existing OCR fields in documents table:
-- ocrMetadata, ocrModel, ocrProcessed, ocrProcessedAt, etc.
```

### Data Model Updates
```typescript
// Document processing progress tracking (utilizing existing schema)
interface ProcessingProgress {
  documentId: Id<"documents">;
  stage: "uploading" | "ocr_processing" | "chunking" | "completed" | "failed";
  progress: number; // 0-100
  message: string;
  startedAt?: number;
  completedAt?: number;
}

// OCR results storage (using existing content table)
interface OCRContent {
  documentId: Id<"documents">;
  content: string; // Extracted text from OCR
  metadata: {
    pageCount: number;
    confidence: number;
    model: string;
    processedAt: number;
  };
}
```

### Data Migration Plan
- [ ] No data migration required - existing schema supports OCR fields
- [ ] Verify existing documents table has all necessary OCR metadata fields
- [ ] Test OCR processing with new documents only (no retroactive processing needed)

### 🚨 MANDATORY: Down Migration Safety Protocol
**CRITICAL REQUIREMENT:** No database schema changes required, so no migration needed.

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Convex Mutations)** → `convex/documents.ts`
- [ ] **Document Upload Mutation** - Update existing upload to trigger OCR
- [ ] **Processing Status Updates** - Update document status during OCR processing
- [ ] **OCR Results Storage** - Store extracted text and metadata

#### **ACTIONS (Convex Actions)** → `convex/ocrActions.ts` (NEW FILE)
- [ ] **Mistral OCR Processing** - Call Mistral API for document analysis
- [ ] **File Handling** - Process uploaded files from Convex storage
- [ ] **Progress Tracking** - Update processing status during OCR

#### **QUERIES (Data Fetching)** → `convex/queries.ts`
- [ ] **Document Status Queries** - Fetch processing progress and status
- [ ] **OCR Results Queries** - Retrieve extracted text and metadata
- [ ] **Real-time Subscriptions** - Subscribe to processing updates

#### **API Routes** → Not needed - Using Convex actions instead

### Server Actions
- [ ] **`uploadDocument`** - Enhanced to trigger OCR processing after upload
- [ ] **`updateProcessingStatus`** - Update document processing progress
- [ ] **`storeOCRResults`** - Store OCR extracted text and metadata

### Database Queries
- [ ] **Direct in Server Components** - Simple document status queries
- [ ] **Query Functions in convex/queries.ts** - Complex OCR result retrieval

### External Integrations
- [Mistral OCR API] - Extract text, structure, and financial elements from documents
- **API Keys:** MISTRAL_API_KEY required in environment variables
- **Configuration:** OCR model selection, timeout settings, retry logic

**🚨 MANDATORY: Use Latest AI Models**
- Mistral OCR API for document text extraction
- OpenAI models for downstream processing (not part of this task)

---

## 9. Frontend Changes

### New Components
- [ ] **`components/document/OCRProgressIndicator.tsx`** - Real-time OCR processing progress
- [ ] **`components/document/OCRStatus.tsx`** - Display OCR processing status and results

**Component Organization Pattern:**
- Use `components/document/` directory for document-specific components
- Keep shared/reusable components in `components/ui/` (existing pattern)
- Import into pages from the global components directory

**Component Requirements:**
- **Responsive Design:** Use mobile-first approach with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** Use CSS variables for colors, support `dark:` classes for dark mode
- **Accessibility:** Follow WCAG AA guidelines, proper ARIA labels, keyboard navigation

### Page Updates
- [ ] **`/data-management`** - Add OCR progress indicator to document upload flow
- [ ] **`/documents/[id]`** - Display OCR processing status and results

### State Management
- **Real-time Updates:** Use Convex subscriptions for OCR processing progress
- **Error Handling:** Display clear error messages for OCR failures
- **Loading States:** Show appropriate loading indicators during OCR processing

### 🚨 CRITICAL: Context Usage Strategy

**MANDATORY: Before creating any component props or planning data fetching, verify existing context availability**

#### Context-First Design Pattern
- [ ] **✅ Check Available Contexts:** Convex queries provide real-time data access
- [ ] **✅ Use Convex Queries Over Props:** Document status available via useQuery
- [ ] **✅ Avoid Prop Drilling:** Use direct Convex queries in components
- [ ] **✅ Minimize Data Fetching:** Leverage real-time subscriptions efficiently
- [ ] **✅ Context Provider Analysis:** Use Convex's built-in real-time capabilities

#### Decision Flowchart - "Should this be a prop or use Convex query?"
```
📊 Do I need document/OCR data in my component?
│
├─ 🔍 Is the data available via Convex queries?
│  ├─ ✅ YES: Use useQuery hook - NO PROPS NEEDED
│  └─ ❌ NO: Check if parent component can fetch data or if prop is necessary
│
├─ 🔄 Is this real-time data (processing status, progress)?
│  ├─ ✅ YES: Use Convex real-time subscriptions
│  └─ ❌ NO: Static data fetch is appropriate
│
└─ 📝 Is this component-specific UI state only?
   ├─ ✅ YES: Local state management is appropriate
   └─ ❌ NO: Consider using Convex query or parent component state
```

#### Universal Context Examples (Apply to All Applications)
- **Convex Queries:** Real-time access to document status, OCR results, processing progress
- **Real-time Subscriptions:** Automatic updates during OCR processing
- **Authentication:** User access control through Convex auth system

#### Context Analysis Checklist
- [ ] **Verify Convex query availability** for all document and OCR data
- [ ] **Use useQuery hooks** for accessing document status and results
- [ ] **Leverage real-time subscriptions** for processing progress updates
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
// convex/queries.ts - Existing document upload (simplified)
export const createDocument = internalMutation({
  args: {
    userId: v.id("users"),
    fileName: v.string(),
    storageId: v.id("_storage"),
    // ... other args
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      userId: args.userId,
      storageId: args.storageId,
      fileName: args.fileName,
      status: "uploaded",
      // ... other fields
    });
    return documentId;
  },
});

// No OCR processing - documents remain in "uploaded" status
```

#### 📂 **After Refactor**
```typescript
// convex/queries.ts - Enhanced document upload with OCR trigger
export const createDocument = internalMutation({
  args: {
    userId: v.id("users"),
    fileName: v.string(),
    storageId: v.id("_storage"),
    // ... other args
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      userId: args.userId,
      storageId: args.storageId,
      fileName: args.fileName,
      status: "processing", // Start in processing status
      // ... other fields
    });

    // Trigger OCR processing
    await ctx.scheduler.runAfter(0, internal.ocrActions.processDocumentOCR, {
      documentId,
      storageId: args.storageId,
    });

    return documentId;
  },
});

// NEW FILE: convex/ocrActions.ts
export const processDocumentOCR = internalAction({
  args: { documentId: v.id("documents"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    // 1. Update status to "ocr_processing"
    // 2. Fetch file from Convex storage
    // 3. Call Mistral OCR API
    // 4. Store extracted text and metadata
    // 5. Update status to "processed"
    // 6. Trigger chunking pipeline
  },
});
```

#### 🎯 **Key Changes Summary**
- [ ] **Enhanced Document Upload:** Modified createDocument to trigger OCR processing and set initial status to "processing"
- [ ] **New OCR Actions File:** Created convex/ocrActions.ts with Mistral API integration
- [ ] **Progress Tracking:** Added status updates during OCR processing pipeline
- [ ] **Real-time Updates:** Frontend components can subscribe to document status changes
- [ ] **Error Handling:** Added comprehensive error handling for API failures
- [ ] **Files Modified:** convex/queries.ts (enhanced upload), NEW convex/ocrActions.ts
- [ ] **Impact:** Enables complete document processing pipeline from upload to OCR to extraction

**Note:** This represents the core integration point. Additional components for progress indication and status display will be added to support the OCR workflow.

---

## 11. Implementation Plan

### Phase 1: OCR Actions Implementation
**Goal:** Create core Mistral OCR integration with Convex actions

- [ ] **Task 1.1:** Create `convex/ocrActions.ts` file
  - Files: `convex/ocrActions.ts` (NEW)
  - Details: Implement Mistral OCR API integration with file fetching, processing, and result storage
- [ ] **Task 1.2:** Implement OCR processing action
  - Files: `convex/ocrActions.ts`
  - Details: Create processDocumentOCR action with proper error handling and timeout management
- [ ] **Task 1.3:** Add progress tracking utilities
  - Files: `convex/ocrActions.ts`
  - Details: Implement status update functions for real-time progress tracking

### Phase 2: Document Upload Enhancement
**Goal:** Modify existing document upload to trigger OCR processing pipeline

- [ ] **Task 2.1:** Update document creation mutation
  - Files: `convex/queries.ts`
  - Details: Modify createDocument to set processing status and schedule OCR processing
- [ ] **Task 2.2:** Add OCR status queries
  - Files: `convex/queries.ts`
  - Details: Add queries for fetching OCR processing status and results
- [ ] **Task 2.3:** Implement OCR result storage
  - Files: `convex/queries.ts`
  - Details: Add mutation to store OCR extracted text and metadata

### Phase 3: Frontend Progress Indicators
**Goal:** Add UI components for OCR processing progress and status

- [ ] **Task 3.1:** Create OCR progress indicator component
  - Files: `components/document/OCRProgressIndicator.tsx` (NEW)
  - Details: Real-time progress bar with status messages and error handling
- [ ] **Task 3.2:** Create OCR status display component
  - Files: `components/document/OCRStatus.tsx` (NEW)
  - Details: Display OCR processing results with extracted text preview
- [ ] **Task 3.3:** Integrate progress components into existing pages
  - Files: `src/pages/DataManagementPage.tsx`, `src/pages/DocumentView.tsx`
  - Details: Add OCR progress indicators to document upload flow and detail views

### Phase 4: Error Handling and Validation
**Goal:** Implement comprehensive error handling and validation

- [ ] **Task 4.1:** Add OCR error handling
  - Files: `convex/ocrActions.ts`
  - Details: Handle API failures, timeouts, and invalid document formats
- [ ] **Task 4.2:** Implement retry logic
  - Files: `convex/ocrActions.ts`
  - Details: Add exponential backoff retry for transient failures
- [ ] **Task 4.3:** Add frontend error states
  - Files: `components/document/OCRProgressIndicator.tsx`
  - Details: Display error messages and retry options in UI

### Phase 5: Integration Testing
**Goal:** Verify end-to-end OCR processing pipeline functionality

- [ ] **Task 5.1:** Test document upload with OCR trigger
  - Files: Test complete pipeline from upload to OCR completion
  - Details: Verify OCR processing starts automatically after upload
- [ ] **Task 5.2:** Test real-time progress updates
  - Files: Test progress indicator components
  - Details: Verify status updates work correctly during processing
- [ ] **Task 5.3:** Test error scenarios
  - Files: Test error handling and recovery
  - Details: Verify graceful handling of API failures and timeouts

### Phase 6: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [ ] **Task 6.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
- [ ] **Task 6.2:** Static Logic Review
  - Files: Modified business logic files
  - Details: Read code to verify logic syntax, edge case handling, fallback patterns
- [ ] **Task 6.3:** File Content Verification (if applicable)
  - Files: Configuration files, static data
  - Details: Read files to verify data structure, configuration correctness (NO live database/API calls)

🛑 **CRITICAL WORKFLOW CHECKPOINT**
After completing Phase 6, you MUST:
1. Present "Implementation Complete!" message (exact text from section 16)
2. Wait for user approval of code review
3. Execute comprehensive code review process
4. NEVER proceed to user testing without completing code review first

### Phase 7: Comprehensive Code Review (Mandatory)
**Goal:** Present implementation completion and request thorough code review

- [ ] **Task 7.1:** Present "Implementation Complete!" Message (MANDATORY)
  - Template: Use exact message from section 16, step 7
  - Details: STOP here and wait for user code review approval
- [ ] **Task 7.2:** Execute Comprehensive Code Review (If Approved)
  - Process: Follow step 8 comprehensive review checklist from section 16
  - Details: Read all files, verify requirements, integration testing, provide detailed summary

### Phase 8: User Browser Testing (Only After Code Review)
**Goal:** Request human testing for UI/UX functionality that requires browser interaction

- [ ] **Task 8.1:** Present AI Testing Results
  - Files: Summary of automated test results
  - Details: Provide comprehensive results of all AI-verifiable testing
- [ ] **Task 8.2:** Request User UI Testing
  - Files: Specific browser testing checklist for user
  - Details: Clear instructions for user to verify OCR processing workflow, progress indicators, error handling
- [ ] **Task 8.3:** Wait for User Confirmation
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
### Phase 1: OCR Actions Implementation
**Goal:** Create core Mistral OCR integration with Convex actions

- [x] **Task 1.1:** Create `convex/ocrActions.ts` file ✓ 2025-10-06
  - Files: `convex/ocrActions.ts` (NEW) ✓
  - Details: Implemented Mistral OCR API integration with file fetching, processing, and result storage ✓
- [x] **Task 1.2:** Implement OCR processing action ✓ 2025-10-06
  - Files: `convex/ocrActions.ts` ✓
  - Details: Created processDocumentOCR action with proper error handling and timeout management ✓
- [x] **Task 1.3:** Add progress tracking utilities ✓ 2025-10-06
  - Files: `convex/ocrActions.ts` ✓
  - Details: Implemented status update functions for real-time progress tracking ✓
```

---

## 13. File Structure & Organization

### New Files to Create
```
project-root/
├── convex/
│   ├── ocrActions.ts                   # NEW: Mistral OCR integration
│   ├── queries.ts                      # Modified: Enhanced document upload
│   └── [existing files...]             # No changes to other files
├── components/document/
│   ├── OCRProgressIndicator.tsx        # NEW: Real-time OCR progress
│   └── OCRStatus.tsx                   # NEW: OCR status display
└── src/pages/
    ├── DataManagementPage.tsx          # Modified: Add OCR progress
    └── DocumentView.tsx                # Modified: Add OCR status
```

**File Organization Rules:**
- **Components**: Always in `components/[feature]/` directories
- **Convex Actions**: In `convex/` directory for backend logic
- **Pages**: Existing pages in `src/pages/`
- **Queries**: Enhanced existing `convex/queries.ts` file
- **Types**: Co-located with components or in existing type definitions

#### **LIB FILE SERVER/CLIENT SEPARATION - CRITICAL ARCHITECTURE RULE**

**🚨 MANDATORY: Prevent Server/Client Boundary Violations**

When creating lib files, **NEVER mix server-only imports with client-safe utilities** in the same file.

**Server-Only Imports (Cannot be used by client components):**
- `convex/server` (Convex server operations)
- External API calls (Mistral, OpenAI)
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
- `convex/ocrActions.ts` - Server-side OCR operations
- `components/document/` - Client-side UI components
- Example: Separate concerns between server processing and client UI

### Files to Modify
- [ ] **`convex/queries.ts`** - Enhanced document upload to trigger OCR processing
- [ ] **`src/pages/DataManagementPage.tsx`** - Add OCR progress indicators
- [ ] **`src/pages/DocumentView.tsx`** - Display OCR processing status and results

### Dependencies to Add
```json
{
  "dependencies": {
    "@mistralai/mistralai": "^0.1.0"  // For Mistral OCR API integration
  }
}
```

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1: Mistral API timeout** - Large documents may exceed 10-minute Convex action timeout
  - **Code Review Focus:** `convex/ocrActions.ts` timeout handling and progress updates
  - **Potential Fix:** Implement document size validation and chunked processing for large files
- [ ] **Error Scenario 2: API rate limiting** - Mistral API may rate limit high-volume processing
  - **Code Review Focus:** Retry logic and exponential backoff in OCR actions
  - **Potential Fix:** Implement queue-based processing with delays between requests
- [ ] **Error Scenario 3: Invalid document format** - Uploaded files may not be supported by OCR
  - **Code Review Focus:** File validation before OCR processing
  - **Potential Fix:** Add file format validation and user feedback for unsupported formats

### Edge Cases to Consider
- [ ] **Edge Case 1: Empty or corrupted documents** - Files may contain no readable content
  - **Analysis Approach:** Check OCR results for empty/invalid responses
  - **Recommendation:** Graceful handling with user notification and retry options
- [ ] **Edge Case 2: Network interruptions during OCR** - API calls may fail mid-processing
  - **Analysis Approach:** Check for partial processing states and recovery logic
  - **Recommendation:** Implement checkpoint system to resume interrupted processing
- [ ] **Edge Case 3: Concurrent document processing** - Multiple users uploading simultaneously
  - **Analysis Approach:** Verify Convex action isolation and user-specific data access
  - **Recommendation:** Ensure proper user authentication and data isolation

### Security & Access Control Review
- [ ] **API Key Security:** Are Mistral API keys properly secured and not exposed to client?
  - **Check:** Environment variables usage in convex/ocrActions.ts, no client-side exposure
- [ ] **Document Access Control:** Can users only access their own documents and OCR results?
  - **Check:** Authentication checks in OCR actions, user ID validation
- [ ] **File Upload Validation:** Are uploaded files validated for size, format, and malicious content?
  - **Check:** File validation in upload process, size limits, format restrictions
- [ ] **OCR Data Privacy:** Is extracted document content properly secured and access-controlled?
  - **Check:** Database access patterns, user-specific OCR result filtering

### AI Agent Analysis Approach
**Focus:** Review existing code to identify potential failure points and security gaps. When issues are found, provide specific recommendations with file paths and code examples. This is code analysis and gap identification - not writing tests or test procedures.

**Priority Order:**
1. **Critical:** Security and access control issues (API key exposure, unauthorized data access)
2. **Important:** User-facing error scenarios and edge cases (timeouts, invalid files)
3. **Nice-to-have:** UX improvements and enhanced error messaging

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# Add these to .env
MISTRAL_API_KEY=your_mistral_api_key_here
# Optional: MISTRAL_API_BASE_URL=https://api.mistral.ai
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
   f. **🚨 CRITICAL:** After final implementation phase, you MUST proceed to Phase 7 (Comprehensive Code Review) before any user testing

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
     - [ ] **Phase 6 Complete** → Present "Implementation Complete!" message (section 16, step 7)
     - [ ] **Wait for user approval** → Execute comprehensive code review (section 16, step 8)
     - [ ] **Code review complete** → ONLY THEN request user browser testing
     - [ ] **NEVER skip comprehensive code review** - Phase 6 basic validation ≠ comprehensive review
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
  - [ ] **✅ ALWAYS explain business logic**: "Extract text from document using Mistral OCR API", "Store OCR results with metadata for processing pipeline"
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
  - [ ] **Example**: `if (!ocrResult) throw new Error('Expected OCR result from Mistral API, got undefined');`
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
  - [ ] **Never leave placeholder comments** like "// No OCR needed" or "// Removed legacy code"
  - [ ] **Delete empty functions/components** completely rather than leaving commented stubs
  - [ ] **Remove unused imports** and dependencies after deletions
  - [ ] **Clean up empty interfaces/types** that no longer serve a purpose
  - [ ] **Remove dead code paths** rather than commenting them out
  - [ ] **If removing code, remove it completely** - don't leave explanatory comments about what was removed

### Architecture Compliance
- [ ] **✅ VERIFY: Used correct data access pattern**
  - [ ] Mutations → Convex mutations (`convex/queries.ts`)
  - [ ] Actions → Convex actions (`convex/ocrActions.ts`) for external API calls
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
- [Mistral OCR API Documentation](https://docs.mistral.ai/capabilities/ocr/)
- [Convex Actions Documentation](https://docs.convex.dev/functions/actions)
- [Convex File Storage Documentation](https://docs.convex.dev/file-storage)
- [Reference Implementation](../refs/financial_data_extraction_system/convex/enhancedProcessingActions.ts)

### **⚠️ Common Server/Client Boundary Pitfalls to Avoid**

**❌ NEVER DO:**
- Import Mistral API client in files that export client-safe utilities
- Mix external API calls with UI component logic in same file
- Expose API keys or sensitive data to client components
- Create utility files that both server and client components import without considering import chains

**✅ ALWAYS DO:**
- Separate server operations (OCR processing) from client utilities
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
- [ ] **Existing API Contracts:** Will this change break existing document upload functionality?
- [ ] **Database Dependencies:** Are there other tables/queries that depend on document status fields?
- [ ] **Component Dependencies:** Which components consume document status and might need updates?
- [ ] **Authentication/Authorization:** Will this change affect existing user document access patterns?

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** How will OCR status changes affect downstream components?
- [ ] **UI/UX Cascading Effects:** Will progress indicators require updates to parent layouts?
- [ ] **State Management:** Will real-time OCR updates conflict with existing state patterns?
- [ ] **Processing Dependencies:** How will OCR failures affect chunking and extraction pipeline?

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** Will OCR status queries affect existing document list performance?
- [ ] **Bundle Size:** Are new Mistral client dependencies significantly increasing bundle size?
- [ ] **Server Load:** Will OCR processing increase Convex action resource usage?
- [ **Caching Strategy:** Do OCR results need special caching considerations?

#### 4. **Security Considerations**
- [ ] **Attack Surface:** Does Mistral OCR integration introduce new security vulnerabilities?
- [ ] **Data Exposure:** Are OCR results properly secured and access-controlled?
- [ ] **API Key Security:** Are Mistral API keys properly protected from client exposure?
- [ ] **Input Validation:** Are uploaded documents properly validated before OCR processing?

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** Will OCR processing delay change familiar upload workflows?
- [ ] **Processing Time:** How will OCR processing time affect user expectations?
- [ ] **Error Communication:** How will OCR failures be communicated to users?
- [ ] **Progress Feedback:** Are progress indicators clear and helpful during processing?

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Are we introducing patterns that will be harder to maintain?
- [ ] **Dependencies:** Are Mistral API dependencies reliable and well-maintained?
- [ ] **Testing Overhead:** Will OCR integration require significant additional test coverage?
- [ ] **Documentation:** What new documentation will be required for maintainers?

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
These issues must be brought to the user's attention before implementation:
- [ ] **API Key Security:** Mistral API key exposure risk if not properly secured
- [ ] **Timeout Risk:** Large documents may exceed Convex action timeout limits
- [ ] **Cost Implications:** OCR processing costs could scale with document volume
- [ ] **Performance Impact:** OCR processing could affect overall system responsiveness

#### ⚠️ **YELLOW FLAGS - Discuss with User**
These issues should be discussed but may not block implementation:
- [ ] **Processing Delay:** OCR processing adds delay to document upload workflow
- [ ] **Error Complexity:** OCR failures introduce new error scenarios to handle
- [ ] **UI Changes:** Progress indicators require changes to existing document management interface
- [ ] **Dependency Management:** Adding Mistral client dependency increases bundle size

### Mitigation Strategies

#### API Integration Changes
- [ ] **API Key Security Strategy:** Ensure API keys stored in environment variables, never exposed to client
- [ ] **Timeout Management:** Implement document size validation and progress tracking for long-running operations
- [ ] **Error Recovery Strategy:** Implement retry logic and graceful degradation for OCR failures
- [ ] **Cost Monitoring:** Set up usage tracking and alerts for OCR API costs

#### Performance Changes
- [ ] **Progressive Enhancement:** Start with basic OCR, enhance accuracy over time
- [ ] **Background Processing:** Use Convex scheduler for non-blocking OCR processing
- [ ] **Caching Strategy:** Cache OCR results to avoid reprocessing identical documents
- [ ] **Resource Limits:** Implement document size and format validation

#### UI/UX Changes
- [ ] **Progressive Disclosure:** Show basic upload first, reveal progress as processing starts
- [ ] **Error Communication:** Clear error messages with actionable next steps
- [ ] **Performance Feedback:** Set realistic expectations about processing time
- [ ] **Fallback Behavior:** Graceful handling when OCR processing fails

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
- Document upload flow will include processing delay, potentially breaking existing user expectations
- Document status values will expand to include OCR processing states

**Performance Implications:**
- OCR processing may take 1-5 minutes per document, affecting user experience
- Convex actions may hit timeout limits for large documents (>50MB)
- Additional Mistral client dependency increases bundle size by ~200KB

**Security Considerations:**
- Mistral API key must be properly secured in environment variables
- OCR results contain sensitive financial data requiring proper access control
- Document upload validation needed to prevent malicious file processing

**User Experience Impacts:**
- Upload workflow will now include progress indicators and processing time
- Users will need feedback about OCR processing status and potential failures
- Real-time updates will improve visibility into processing pipeline

**Mitigation Recommendations:**
- Implement document size validation (max 50MB) to prevent timeouts
- Add comprehensive error handling with retry logic for API failures
- Set realistic user expectations about processing time in UI
- Monitor OCR API usage and costs through logging

**🚨 USER ATTENTION REQUIRED:**
The OCR integration will add 1-5 minutes processing time to document uploads. Please confirm if this delay is acceptable for your user experience goals.
```

---

*Template Version: 1.3*
*Last Updated: 8/26/2025*
*Created By: Brandon Hancock*