# VC Portfolio OS - Database Schema & Entity Relationship Diagram

**Version**: 1.0  
**Date**: January 15, 2025  
**Author**: AI Development Team  
**Status**: Ready for Implementation

---

## 📋 EXECUTIVE SUMMARY

This document defines the comprehensive database schema and Entity Relationship Diagram (ERD) for the VC Portfolio OS. The schema is designed to support the complete investment lifecycle from document processing to portfolio analytics, with proper relationships to enable complex queries and analytics.

### Key Design Principles

- **Normalized Structure**: Proper 3NF normalization to avoid data redundancy
- **Relationship Integrity**: Foreign key constraints ensure data consistency
- **Performance Optimization**: Strategic indexing for common query patterns
- **Scalability**: Designed to handle 10,000+ users and millions of documents
- **Flexibility**: JSONB fields for extensible data structures

---

## 🏗️ ENTITY RELATIONSHIP DIAGRAM

### Core Entity Relationships

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │     FUNDS       │    │PORTFOLIO_COMPANIES│
│                 │    │                 │    │                 │
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ email           │    │ name            │    │ name            │
│ name            │    │ fund_manager     │    │ industry_sector │
│ investor_type   │    │ vintage_year    │    │ geography       │
│ created_at      │    │ fund_size       │    │ company_status  │
│ updated_at      │    │ currency        │    │ created_at      │
└─────────────────┘    │ fund_status     │    │ updated_at      │
         │              │ created_at      │    └─────────────────┘
         │              │ updated_at      │             │
         │              └─────────────────┘             │
         │                       │                     │
         │                       │                     │
         ▼                       ▼                     ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ LP_COMMITMENTS  │    │ FUND_INVESTMENTS│    │ FUND_INVESTMENTS│
│                 │    │                 │    │                 │
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │◄───┤ fund_id (FK)    │    │ fund_id (FK)    │
│ fund_id (FK)    │    │ company_id (FK) │    │ company_id (FK) │
│ commitment_amt  │    │ investment_stage│    │ investment_stage│
│ ownership_pct   │    │ investment_date │    │ investment_date │
│ investment_date │    │ original_cost   │    │ original_cost   │
│ created_at      │    │ ownership_pct   │    │ ownership_pct   │
└─────────────────┘    │ board_seats     │    │ board_seats     │
         │              │ created_at      │    │ created_at      │
         │              └─────────────────┘    └─────────────────┘
         │                       │                     │
         │                       │                     │
         ▼                       ▼                     ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│LP_PERFORMANCE_  │    │FUND_PERFORMANCE│    │CO_INVESTOR_     │
│SNAPSHOTS        │    │SNAPSHOTS        │    │SYNDICATES       │
│                 │    │                 │    │                 │
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │    │ fund_id (FK)    │    │ investment_id   │
│ fund_id (FK)    │    │ reporting_period│    │ co_investor_name│
│ reporting_period│    │ gross_irr       │    │ co_investor_type│
│ personal_nav    │    │ net_irr         │    │ investment_amt  │
│ personal_dist   │    │ tvpi_moic       │    │ lead_investor   │
│ personal_called │    │ dpi             │    │ quality_score   │
│ personal_moic   │    │ rvpi            │    │ created_at      │
│ personal_irr    │    │ fund_nav        │    └─────────────────┘
│ personal_unfund │    │ cum_dist        │
│ mgmt_fees_paid  │    │ cum_called      │
│ carry_alloc     │    │ unfunded_commit │
│ curr_qtr_perf   │    │ deployment_rate │
│ ytd_perf        │    │ portfolio_count │
│ since_inception │    │ fund_age_years  │
│ benchmark_comp  │    │ created_at      │
│ risk_metrics    │    └─────────────────┘
│ created_at      │
└─────────────────┘
```

### Document Processing & Intelligence Tables

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DOCUMENTS     │    │EXTRACTION_RESULTS│   │ENHANCED_HYBRID  │
│                 │    │                 │    │CHUNKS          │
│ id (PK)         │    │ id (PK)         │    │                 │
│ user_id (FK)    │    │ document_id (FK)│    │ id (PK)         │
│ fund_id (FK)    │    │ extraction_type │    │ document_id (FK)│
│ file_name       │    │ extracted_data  │    │ content         │
│ file_type       │    │ confidence_score│    │ embedding       │
│ file_size       │    │ extraction_ts   │    │ metadata        │
│ storage_id      │    │ agent_used      │    │ vc_context      │
│ document_type   │    │ created_at      │    │ chunk_index     │
│ reporting_period│    └─────────────────┘    │ token_count     │
│ status          │             │             │ created_at      │
│ markdown_content│             │             └─────────────────┘
│ ocr_metadata    │             │
│ created_at      │             │
│ updated_at      │             │
└─────────────────┘             │
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ CAPITAL_CALLS   │    │ DISTRIBUTIONS   │
│                 │    │                 │
│ id (PK)         │    │ id (PK)         │
│ commitment_id   │    │ commitment_id   │
│ call_date       │    │ distribution_date│
│ call_amount     │    │ distribution_amt│
│ call_percentage │    │ distribution_type│
│ call_purpose    │    │ tax_treatment   │
│ created_at      │    │ source_company  │
└─────────────────┘    │ created_at      │
                       └─────────────────┘
```

---

## 🗄️ DETAILED SCHEMA DEFINITION

### Core Business Entities

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    investor_type ENUM('angel', 'family_office', 'institutional', 'fund_of_funds'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_investor_type ON users(investor_type);
```

#### Funds Table

```sql
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    fund_manager VARCHAR(255) NOT NULL,
    vintage_year INTEGER NOT NULL,
    fund_size DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    investment_period_end DATE,
    management_fee_rate DECIMAL(5,4), -- e.g., 0.0200 for 2%
    carried_interest_rate DECIMAL(5,4), -- e.g., 0.2000 for 20%
    hurdle_rate DECIMAL(5,4), -- e.g., 0.0800 for 8%
    fund_status ENUM('raising', 'investing', 'harvesting', 'closed'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_funds_vintage_year ON funds(vintage_year);
CREATE INDEX idx_funds_fund_manager ON funds(fund_manager);
CREATE INDEX idx_funds_fund_status ON funds(fund_status);
```

#### Portfolio Companies Table

```sql
CREATE TABLE portfolio_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    industry_sector VARCHAR(100) NOT NULL,
    geography VARCHAR(100) NOT NULL,
    founding_year INTEGER,
    business_model VARCHAR(100),
    market_size DECIMAL(15,2),
    company_status ENUM('active', 'exited', 'written_off', 'distressed'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for filtering and search
CREATE INDEX idx_portfolio_companies_sector ON portfolio_companies(industry_sector);
CREATE INDEX idx_portfolio_companies_geography ON portfolio_companies(geography);
CREATE INDEX idx_portfolio_companies_status ON portfolio_companies(company_status);
```

### Relationship Tables

#### LP Commitments (Many-to-Many: Users ↔ Funds)

```sql
CREATE TABLE lp_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
    commitment_amount DECIMAL(15,2) NOT NULL,
    ownership_percentage DECIMAL(5,4) NOT NULL, -- e.g., 0.0250 for 2.5%
    investment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Ensure unique user-fund combinations
    UNIQUE(user_id, fund_id)
);

-- Indexes for performance
CREATE INDEX idx_lp_commitments_user ON lp_commitments(user_id);
CREATE INDEX idx_lp_commitments_fund ON lp_commitments(fund_id);
CREATE INDEX idx_lp_commitments_user_fund ON lp_commitments(user_id, fund_id);
```

#### Fund Investments (Many-to-Many: Funds ↔ Portfolio Companies)

```sql
CREATE TABLE fund_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
    portfolio_company_id UUID NOT NULL REFERENCES portfolio_companies(id) ON DELETE CASCADE,
    investment_stage VARCHAR(50) NOT NULL, -- Seed, Series A, etc.
    investment_date DATE NOT NULL,
    original_cost DECIMAL(15,2) NOT NULL,
    ownership_percentage DECIMAL(5,4) NOT NULL,
    board_seats INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_fund_investments_fund ON fund_investments(fund_id);
CREATE INDEX idx_fund_investments_company ON fund_investments(portfolio_company_id);
CREATE INDEX idx_fund_investments_stage ON fund_investments(investment_stage);
```

### Time-Series Performance Tables

#### Fund Performance Snapshots

```sql
CREATE TABLE fund_performance_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
    reporting_period INTEGER NOT NULL, -- YYYYMM format
    gross_irr DECIMAL(8,4), -- e.g., 0.2500 for 25%
    net_irr DECIMAL(8,4),
    tvpi_moic DECIMAL(8,4), -- Total Value to Paid-In Capital
    dpi DECIMAL(8,4), -- Distributions to Paid-In Capital
    rvpi DECIMAL(8,4), -- Residual Value to Paid-In Capital
    fund_nav DECIMAL(15,2), -- Net Asset Value
    cumulative_distributions DECIMAL(15,2),
    cumulative_called_capital DECIMAL(15,2),
    unfunded_commitment DECIMAL(15,2),
    deployment_rate DECIMAL(5,4), -- e.g., 0.7500 for 75%
    portfolio_company_count INTEGER,
    fund_age_years DECIMAL(4,2),
    created_at TIMESTAMP DEFAULT NOW(),

    -- Ensure unique fund-period combinations
    UNIQUE(fund_id, reporting_period)
);

-- Indexes for time-series queries
CREATE INDEX idx_fund_performance_fund ON fund_performance_snapshots(fund_id);
CREATE INDEX idx_fund_performance_period ON fund_performance_snapshots(reporting_period);
CREATE INDEX idx_fund_performance_fund_period ON fund_performance_snapshots(fund_id, reporting_period);
```

#### LP Performance Snapshots

```sql
CREATE TABLE lp_performance_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
    reporting_period INTEGER NOT NULL,
    personal_nav DECIMAL(15,2),
    personal_distributions DECIMAL(15,2),
    personal_called_capital DECIMAL(15,2),
    personal_moic DECIMAL(8,4),
    personal_irr DECIMAL(8,4),
    personal_unfunded DECIMAL(15,2),
    management_fees_paid DECIMAL(15,2),
    carry_allocation DECIMAL(15,2),
    current_quarter_performance DECIMAL(8,4),
    ytd_performance DECIMAL(8,4),
    since_inception_performance DECIMAL(8,4),
    benchmark_comparison DECIMAL(8,4),
    risk_metrics JSONB, -- Flexible risk data storage
    created_at TIMESTAMP DEFAULT NOW(),

    -- Ensure unique user-fund-period combinations
    UNIQUE(user_id, fund_id, reporting_period)
);

-- Indexes for LP analytics
CREATE INDEX idx_lp_performance_user ON lp_performance_snapshots(user_id);
CREATE INDEX idx_lp_performance_fund ON lp_performance_snapshots(fund_id);
CREATE INDEX idx_lp_performance_user_fund ON lp_performance_snapshots(user_id, fund_id);
CREATE INDEX idx_lp_performance_period ON lp_performance_snapshots(reporting_period);
```

### Document Processing Tables

#### Documents Table

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fund_id UUID REFERENCES funds(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_id VARCHAR(255) NOT NULL,
    document_type ENUM('quarterly_report', 'annual_report', 'capital_call', 'distribution_notice'),
    reporting_period INTEGER,
    status ENUM('uploaded', 'processing', 'processed', 'failed'),
    markdown_content TEXT,
    ocr_metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for document queries
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_fund ON documents(fund_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_type ON documents(document_type);
```

#### Extraction Results Table

```sql
CREATE TABLE extraction_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    extraction_type ENUM('fund_performance', 'portfolio_company', 'lp_performance'),
    extracted_data JSONB NOT NULL, -- Flexible data structure
    confidence_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    extraction_timestamp TIMESTAMP DEFAULT NOW(),
    agent_used VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for extraction analytics
CREATE INDEX idx_extraction_results_document ON extraction_results(document_id);
CREATE INDEX idx_extraction_results_type ON extraction_results(extraction_type);
CREATE INDEX idx_extraction_results_confidence ON extraction_results(confidence_score);
```

#### Enhanced Hybrid Chunks Table

```sql
CREATE TABLE enhanced_hybrid_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(384), -- Vector embedding for semantic search
    metadata JSONB,
    vc_context JSONB, -- VC-specific context data
    chunk_index INTEGER NOT NULL,
    token_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for vector search and chunking
CREATE INDEX idx_enhanced_chunks_document ON enhanced_hybrid_chunks(document_id);
CREATE INDEX idx_enhanced_chunks_index ON enhanced_hybrid_chunks(document_id, chunk_index);
-- Vector similarity search index (using pgvector)
CREATE INDEX idx_enhanced_chunks_embedding ON enhanced_hybrid_chunks
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### Network Intelligence Tables

#### Co-Investor Syndicates Table

```sql
CREATE TABLE co_investor_syndicates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_investment_id UUID NOT NULL REFERENCES fund_investments(id) ON DELETE CASCADE,
    co_investor_name VARCHAR(255) NOT NULL,
    co_investor_type ENUM('vc', 'pe', 'strategic', 'angel', 'family_office'),
    investment_amount DECIMAL(15,2),
    lead_investor BOOLEAN DEFAULT FALSE,
    quality_score DECIMAL(5,4), -- 0.0000 to 1.0000
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for network analysis
CREATE INDEX idx_co_investor_investment ON co_investor_syndicates(fund_investment_id);
CREATE INDEX idx_co_investor_name ON co_investor_syndicates(co_investor_name);
CREATE INDEX idx_co_investor_type ON co_investor_syndicates(co_investor_type);
CREATE INDEX idx_co_investor_quality ON co_investor_syndicates(quality_score);
```

### Transaction History Tables

#### Capital Calls Table

```sql
CREATE TABLE capital_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lp_commitment_id UUID NOT NULL REFERENCES lp_commitments(id) ON DELETE CASCADE,
    call_date DATE NOT NULL,
    call_amount DECIMAL(15,2) NOT NULL,
    call_percentage DECIMAL(5,4) NOT NULL, -- Percentage of commitment
    call_purpose VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for capital call analysis
CREATE INDEX idx_capital_calls_commitment ON capital_calls(lp_commitment_id);
CREATE INDEX idx_capital_calls_date ON capital_calls(call_date);
```

#### Distributions Table

```sql
CREATE TABLE distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lp_commitment_id UUID NOT NULL REFERENCES lp_commitments(id) ON DELETE CASCADE,
    distribution_date DATE NOT NULL,
    distribution_amount DECIMAL(15,2) NOT NULL,
    distribution_type ENUM('capital_return', 'carried_interest', 'dividend'),
    tax_treatment VARCHAR(100),
    source_company_id UUID REFERENCES portfolio_companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for distribution analysis
CREATE INDEX idx_distributions_commitment ON distributions(lp_commitment_id);
CREATE INDEX idx_distributions_date ON distributions(distribution_date);
CREATE INDEX idx_distributions_type ON distributions(distribution_type);
```

---

## 🔍 QUERY PATTERNS & OPTIMIZATION

### Common Query Patterns

#### 1. LP Portfolio Performance Across All Funds

```sql
-- Get LP's total performance across all funds
SELECT
    u.name as lp_name,
    f.name as fund_name,
    lps.personal_nav,
    lps.personal_irr,
    lps.personal_moic,
    lps.personal_distributions,
    lps.personal_called_capital,
    lps.reporting_period
FROM users u
JOIN lp_commitments lc ON u.id = lc.user_id
JOIN funds f ON lc.fund_id = f.id
JOIN lp_performance_snapshots lps ON u.id = lps.user_id AND f.id = lps.fund_id
WHERE u.id = ?
ORDER BY f.name, lps.reporting_period DESC;
```

#### 2. Fund Portfolio Analysis

```sql
-- Get fund's portfolio companies with latest valuations
SELECT
    f.name as fund_name,
    pc.name as company_name,
    pc.industry_sector,
    fi.investment_stage,
    fi.original_cost,
    fi.ownership_percentage,
    fps.fund_nav,
    fps.reporting_period
FROM funds f
JOIN fund_investments fi ON f.id = fi.fund_id
JOIN portfolio_companies pc ON fi.portfolio_company_id = pc.id
JOIN fund_performance_snapshots fps ON f.id = fps.fund_id
WHERE f.id = ?
  AND fps.reporting_period = (
    SELECT MAX(reporting_period)
    FROM fund_performance_snapshots
    WHERE fund_id = f.id
  )
ORDER BY fi.original_cost DESC;
```

#### 3. Co-Investor Network Analysis

```sql
-- Analyze co-investor relationships and quality
SELECT
    cis.co_investor_name,
    cis.co_investor_type,
    AVG(cis.quality_score) as avg_quality_score,
    COUNT(*) as investment_count,
    SUM(cis.investment_amount) as total_investment,
    COUNT(DISTINCT fi.fund_id) as fund_diversity
FROM co_investor_syndicates cis
JOIN fund_investments fi ON cis.fund_investment_id = fi.id
GROUP BY cis.co_investor_name, cis.co_investor_type
HAVING COUNT(*) >= 3  -- Minimum 3 investments for analysis
ORDER BY avg_quality_score DESC, investment_count DESC;
```

#### 4. Document Processing Analytics

```sql
-- Track document processing performance and accuracy
SELECT
    d.document_type,
    COUNT(*) as total_documents,
    AVG(er.confidence_score) as avg_confidence,
    COUNT(CASE WHEN er.confidence_score >= 0.95 THEN 1 END) as high_confidence_count,
    COUNT(CASE WHEN d.status = 'processed' THEN 1 END) as successful_processing,
    COUNT(CASE WHEN d.status = 'failed' THEN 1 END) as failed_processing
FROM documents d
LEFT JOIN extraction_results er ON d.id = er.document_id
WHERE d.created_at >= ? -- Date filter
GROUP BY d.document_type
ORDER BY avg_confidence DESC;
```

### Performance Optimization Strategies

#### 1. Strategic Indexing

```sql
-- Composite indexes for common query patterns
CREATE INDEX idx_lp_performance_user_fund_period
ON lp_performance_snapshots(user_id, fund_id, reporting_period);

CREATE INDEX idx_fund_performance_fund_period
ON fund_performance_snapshots(fund_id, reporting_period);

CREATE INDEX idx_documents_user_status_type
ON documents(user_id, status, document_type);
```

#### 2. Partitioning Strategy

```sql
-- Partition time-series tables by reporting period
CREATE TABLE lp_performance_snapshots_2024
PARTITION OF lp_performance_snapshots
FOR VALUES FROM (202401) TO (202501);

CREATE TABLE lp_performance_snapshots_2025
PARTITION OF lp_performance_snapshots
FOR VALUES FROM (202501) TO (202601);
```

#### 3. Materialized Views for Analytics

```sql
-- Pre-computed portfolio analytics
CREATE MATERIALIZED VIEW portfolio_analytics AS
SELECT
    u.id as user_id,
    u.name as user_name,
    COUNT(DISTINCT lc.fund_id) as fund_count,
    SUM(lc.commitment_amount) as total_commitment,
    AVG(lps.personal_irr) as avg_irr,
    AVG(lps.personal_moic) as avg_moic,
    MAX(lps.reporting_period) as latest_period
FROM users u
JOIN lp_commitments lc ON u.id = lc.user_id
LEFT JOIN lp_performance_snapshots lps ON u.id = lps.user_id AND lc.fund_id = lps.fund_id
GROUP BY u.id, u.name;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW portfolio_analytics;
```

---

## 🔧 CONVEX SCHEMA IMPLEMENTATION

### Convex Schema Definition

```typescript
// Core Tables
export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    investorType: v.union(
      v.literal("angel"),
      v.literal("family_office"),
      v.literal("institutional")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  funds: defineTable({
    name: v.string(),
    fundManager: v.string(),
    vintageYear: v.number(),
    fundSize: v.number(),
    currency: v.string(),
    fundStatus: v.union(
      v.literal("raising"),
      v.literal("investing"),
      v.literal("harvesting"),
      v.literal("closed")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_vintage", ["vintageYear"]),

  portfolioCompanies: defineTable({
    name: v.string(),
    legalName: v.optional(v.string()),
    industrySector: v.string(),
    geography: v.string(),
    foundingYear: v.number(),
    businessModel: v.string(),
    marketSize: v.number(),
    companyStatus: v.union(
      v.literal("active"),
      v.literal("exited"),
      v.literal("written_off"),
      v.literal("distressed")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Relationship Tables
  lpCommitments: defineTable({
    userId: v.id("users"),
    fundId: v.id("funds"),
    commitmentAmount: v.number(),
    ownershipPercentage: v.number(),
    investmentDate: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_fund", ["fundId"])
    .index("by_user_fund", ["userId", "fundId"]),

  fundInvestments: defineTable({
    fundId: v.id("funds"),
    portfolioCompanyId: v.id("portfolioCompanies"),
    investmentStage: v.string(),
    investmentDate: v.number(),
    originalCost: v.number(),
    ownershipPercentage: v.number(),
    boardSeats: v.number(),
    createdAt: v.number(),
  })
    .index("by_fund", ["fundId"])
    .index("by_company", ["portfolioCompanyId"]),

  // Time-Series Tables
  fundPerformanceSnapshots: defineTable({
    fundId: v.id("funds"),
    reportingPeriod: v.number(),
    grossIrr: v.number(),
    netIrr: v.number(),
    tvpiMoic: v.number(),
    dpi: v.number(),
    rvpi: v.number(),
    fundNav: v.number(),
    cumulativeDistributions: v.number(),
    cumulativeCalledCapital: v.number(),
    unfundedCommitment: v.number(),
    deploymentRate: v.number(),
    portfolioCompanyCount: v.number(),
    fundAgeYears: v.number(),
    createdAt: v.number(),
  }).index("by_fund_period", ["fundId", "reportingPeriod"]),

  lpPerformanceSnapshots: defineTable({
    userId: v.id("users"),
    fundId: v.id("funds"),
    reportingPeriod: v.number(),
    personalNav: v.number(),
    personalDistributions: v.number(),
    personalCalledCapital: v.number(),
    personalMoic: v.number(),
    personalIrr: v.number(),
    personalUnfunded: v.number(),
    managementFeesPaid: v.number(),
    carryAllocation: v.number(),
    currentQuarterPerformance: v.number(),
    ytdPerformance: v.number(),
    sinceInceptionPerformance: v.number(),
    benchmarkComparison: v.number(),
    riskMetrics: v.any(), // JSONB for complex risk data
    createdAt: v.number(),
  }).index("by_user_fund_period", ["userId", "fundId", "reportingPeriod"]),

  // Document Processing Tables
  documents: defineTable({
    userId: v.id("users"),
    fundId: v.optional(v.id("funds")),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.string(),
    documentType: v.union(
      v.literal("quarterly_report"),
      v.literal("annual_report"),
      v.literal("capital_call"),
      v.literal("distribution_notice")
    ),
    reportingPeriod: v.optional(v.number()),
    status: v.union(
      v.literal("uploaded"),
      v.literal("processing"),
      v.literal("processed"),
      v.literal("failed")
    ),
    markdownContent: v.optional(v.string()),
    ocrMetadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_fund", ["fundId"])
    .index("by_status", ["status"]),

  extractionResults: defineTable({
    documentId: v.id("documents"),
    extractionType: v.union(
      v.literal("fund_performance"),
      v.literal("portfolio_company"),
      v.literal("lp_performance")
    ),
    extractedData: v.any(), // JSONB for flexible data structure
    confidenceScore: v.number(),
    extractionTimestamp: v.number(),
    agentUsed: v.string(),
  })
    .index("by_document", ["documentId"])
    .index("by_type", ["extractionType"]),

  // Enhanced Chunking Tables
  enhancedHybridChunks: defineTable({
    documentId: v.id("documents"),
    content: v.string(),
    embedding: v.array(v.number()),
    metadata: v.any(),
    vcContext: v.any(),
    chunkIndex: v.number(),
    tokenCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_chunk_index", ["documentId", "chunkIndex"]),

  // Network Intelligence Tables
  coInvestorSyndicates: defineTable({
    fundInvestmentId: v.id("fundInvestments"),
    coInvestorName: v.string(),
    coInvestorType: v.union(
      v.literal("vc"),
      v.literal("pe"),
      v.literal("strategic"),
      v.literal("angel"),
      v.literal("family_office")
    ),
    investmentAmount: v.number(),
    leadInvestor: v.boolean(),
    qualityScore: v.number(),
    createdAt: v.number(),
  }).index("by_investment", ["fundInvestmentId"]),

  // Transaction History Tables
  capitalCalls: defineTable({
    lpCommitmentId: v.id("lpCommitments"),
    callDate: v.number(),
    callAmount: v.number(),
    callPercentage: v.number(),
    callPurpose: v.string(),
    createdAt: v.number(),
  }).index("by_commitment", ["lpCommitmentId"]),

  distributions: defineTable({
    lpCommitmentId: v.id("lpCommitments"),
    distributionDate: v.number(),
    distributionAmount: v.number(),
    distributionType: v.union(
      v.literal("capital_return"),
      v.literal("carried_interest"),
      v.literal("dividend")
    ),
    taxTreatment: v.string(),
    sourceCompanyId: v.optional(v.id("portfolioCompanies")),
    createdAt: v.number(),
  })
    .index("by_commitment", ["lpCommitmentId"])
    .index("by_date", ["distributionDate"]),
});
```

---

## 📊 DATA MIGRATION & SEEDING

### Initial Data Seeding

```typescript
// Seed script for initial data
export const seedInitialData = async (ctx: MutationCtx) => {
  // Create sample users
  const angelUser = await ctx.db.insert("users", {
    email: "mario@example.com",
    name: "Mario Angel",
    investorType: "angel",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Create sample funds
  const sampleFund = await ctx.db.insert("funds", {
    name: "TechVentures Fund I",
    fundManager: "TechVentures GmbH",
    vintageYear: 2020,
    fundSize: 50000000, // €50M
    currency: "EUR",
    fundStatus: "investing",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Create sample portfolio companies
  const sampleCompany = await ctx.db.insert("portfolioCompanies", {
    name: "AI Startup GmbH",
    industrySector: "Artificial Intelligence",
    geography: "Germany",
    foundingYear: 2019,
    businessModel: "SaaS",
    marketSize: 1000000000, // €1B
    companyStatus: "active",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Create LP commitment
  await ctx.db.insert("lpCommitments", {
    userId: angelUser,
    fundId: sampleFund,
    commitmentAmount: 100000, // €100k
    ownershipPercentage: 0.002, // 0.2%
    investmentDate: Date.now(),
    createdAt: Date.now(),
  });
};
```

### Data Validation Rules

```typescript
// Validation functions for data integrity
export const validateLPCommitment = (commitment: LPCommitment) => {
  if (commitment.commitmentAmount <= 0) {
    throw new Error("Commitment amount must be positive");
  }
  if (
    commitment.ownershipPercentage < 0 ||
    commitment.ownershipPercentage > 1
  ) {
    throw new Error("Ownership percentage must be between 0 and 1");
  }
  return true;
};

export const validatePerformanceSnapshot = (snapshot: PerformanceSnapshot) => {
  if (snapshot.grossIrr < 0 || snapshot.grossIrr > 10) {
    throw new Error("IRR must be between 0% and 1000%");
  }
  if (snapshot.tvpiMoic < 0) {
    throw new Error("TVPI/MOIC must be positive");
  }
  return true;
};
```

---

## 🔒 SECURITY & COMPLIANCE

### Data Security Measures

- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions with least privilege principle
- **Audit Logging**: Comprehensive logging of all data access and modifications
- **Data Retention**: Automated data retention policies for compliance

### GDPR Compliance

- **Data Minimization**: Only collect necessary data for business purposes
- **Right to Deletion**: Complete data removal upon user request
- **Data Portability**: Standardized export formats for user data
- **Consent Management**: Clear consent mechanisms for data processing

### Regulatory Compliance

- **AIFMD**: Alternative Investment Fund Managers Directive compliance
- **MiFID II**: Markets in Financial Instruments Directive compliance
- **Data Localization**: European data residency requirements
- **Audit Trails**: Comprehensive logging for regulatory reporting

---

## 📈 SCALABILITY CONSIDERATIONS

### Performance Optimization

- **Database Indexing**: Strategic indexes for common query patterns
- **Query Optimization**: Efficient queries with proper joins and filters
- **Caching Strategy**: Redis caching for frequently accessed data
- **Connection Pooling**: Optimized database connection management

### Horizontal Scaling

- **Database Sharding**: Partition data across multiple database instances
- **Load Balancing**: Distribute requests across multiple application servers
- **CDN Integration**: Global content delivery for static assets
- **Microservices**: Modular architecture for independent scaling

### Monitoring & Alerting

- **Performance Metrics**: Real-time monitoring of database performance
- **Error Tracking**: Comprehensive error logging and alerting
- **Capacity Planning**: Proactive scaling based on usage patterns
- **Health Checks**: Automated health monitoring for all services

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Core Schema (Week 1-2)

- [ ] Create Convex project and configure schema
- [ ] Implement core tables (users, funds, portfolio_companies)
- [ ] Set up relationship tables (lp_commitments, fund_investments)
- [ ] Create basic indexes for performance
- [ ] Implement data validation rules

### Phase 2: Time-Series Data (Week 3-4)

- [ ] Implement performance snapshot tables
- [ ] Create time-series indexes for analytics
- [ ] Set up data retention policies
- [ ] Implement snapshot aggregation functions

### Phase 3: Document Processing (Week 5-6)

- [ ] Create document processing tables
- [ ] Implement extraction results storage
- [ ] Set up enhanced chunking tables
- [ ] Create document analytics indexes

### Phase 4: Network Intelligence (Week 7-8)

- [ ] Implement co-investor syndicate tables
- [ ] Create network analysis indexes
- [ ] Set up relationship mapping functions
- [ ] Implement quality scoring algorithms

### Phase 5: Transaction History (Week 9-10)

- [ ] Create capital call and distribution tables
- [ ] Implement transaction analytics
- [ ] Set up cash flow tracking
- [ ] Create financial reporting functions

### Phase 6: Optimization & Testing (Week 11-12)

- [ ] Performance testing and optimization
- [ ] Security audit and compliance check
- [ ] Data migration scripts
- [ ] Backup and recovery procedures

---

**Document Status**: Complete  
**Next Review Date**: February 15, 2025  
**Approval Required**: Engineering Leadership, Database Architecture Team, Security Team
