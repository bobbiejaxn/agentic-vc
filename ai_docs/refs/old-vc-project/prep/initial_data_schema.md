## Strategic Database Planning Document

### App Summary

**End Goal:** Help Business Angels and LPs managing complex investment portfolios achieve automated investment intelligence with personal return optimization using Europe's exclusive investment intelligence network
**Template Used:** Fresh Drizzle setup (no existing template)
**Core Features:** AI-powered comprehensive data extraction (200+ fields), personal returns optimization, co-investor intelligence network, portfolio risk management, market intelligence database

---

## 🗄️ Current Database State

### No Existing Database Schema

- **Fresh Project Start:** No existing Drizzle schema found in the project
- **Clean Slate:** Full flexibility to design optimal database architecture
- **Strategic Advantage:** Can build database-first approach aligned with VC portfolio management needs
- **No Technical Debt:** Starting with purpose-built schema for multi-vehicle VC workflows

### Assessment

**✅ 100% Aligned:** Fresh start allows perfect alignment with VC portfolio management requirements
**🔧 Ready to Build:** Complete database design needed for comprehensive VC intelligence platform
**🎯 Strategic Position:** Database architecture can be optimized for complex financial data processing

---

## ⚡ Feature-to-Schema Mapping

### Core Features (Database-First Design)

- **AI-Powered Fund Report Processing** → `fund_reports` + `processed_reports` + AI processing pipeline
- **Multi-Vehicle Portfolio Tracking** → `portfolios` + `investments` + `ownership_percentages` for angel + LP complexity
- **Real-Time Performance Analytics** → `portfolio_metrics` + `performance_snapshots` with calculated IRR/MOIC
- **Personal Return Calculations** → `personal_returns` + `distribution_tracking` for ownership-adjusted returns
- **Co-Investor Network Analysis** → `co_investors` + `network_connections` + quality scoring system
- **Portfolio Concentration Analysis** → `concentration_analysis` + `risk_metrics` with automated alerts
- **Comprehensive Data Extraction** → `extracted_data` + `intelligence_insights` with 95%+ accuracy across 200+ fields
- **Intelligence Network Database** → `network_insights` + `market_intelligence` for European investor network
- **Usage Tracking** → `usage_events` + `subscription_limits` for tiered intelligence access (€200-€3,000/month)

### User Management Features (Standard SaaS Foundation)

- **Multi-Role Authentication** → `users` + `user_roles` + `permissions` for Angels/LPs/Co-investors/Fund Managers/Admins
- **Subscription Management** → `subscriptions` + `billing_history` + `usage_limits`
- **Admin Analytics** → `admin_metrics` + `platform_insights` + `user_engagement_tracking`

---

## 📋 Recommended Database Architecture

**Bottom Line:** You need to create **6 core tables** to support your VC portfolio intelligence platform:

### Decision #1: Multi-Vehicle Portfolio Architecture

- **Problem:** VC professionals manage both angel investments AND LP commitments with different data structures
- **Action:** Design unified portfolio system that handles both investment types seamlessly
- **Impact:** Enables consolidated view of personal and professional investments with accurate return calculations

**Core Portfolio Tables:**

```typescript
// Unified portfolio management across angel + LP investments
portfolios: {
  id: uuid,
  user_id: uuid, // Owner of this portfolio
  name: text, // "Personal Angel Portfolio" or "LP Fund Investments"
  type: enum, // 'angel' | 'lp' | 'mixed'
  description: text, // Portfolio description/notes
  total_value: numeric, // Calculated field - sum of all positions
  created_at: timestamp,
  updated_at: timestamp
}

// Individual investment positions (works for both angel deals and LP commitments)
investments: {
  id: uuid,
  portfolio_id: uuid, // Which portfolio this belongs to
  name: text, // Company name for angel deals, Fund name for LP
  type: enum, // 'angel_investment' | 'lp_commitment'
  investment_date: date, // Date of initial investment
  total_invested: numeric, // Total amount invested (for angels) or committed (for LPs)
  current_value: numeric, // Current valuation (calculated from reports)
  ownership_percentage: numeric, // For LP commitments - percentage owned
  sector: text, // Industry/sector classification
  stage: enum, // seed/series_a/series_b/etc
  exit_status: enum, // active/exited/partial_exit
  created_at: timestamp,
  updated_at: timestamp
}

// Track distributions and returns for accurate personal performance
distributions: {
  id: uuid,
  investment_id: uuid, // Which investment this distribution is from
  distribution_date: date,
  amount: numeric, // Distribution amount received
  distribution_type: enum, // 'dividend' | 'partial_exit' | 'full_exit' | 'capital_return'
  notes: text, // Additional context about the distribution
  created_at: timestamp
}
```

### Decision #2: AI-Powered Document Processing Engine

- **Problem:** Need to process 10+ different fund report formats with 95%+ accuracy
- **Action:** Design document processing pipeline with AI intelligence tracking
- **Impact:** Automates the 20+ hour monthly manual tracking nightmare

**Document Processing Architecture:**

```typescript
// Store uploaded fund reports and investment documents
fund_reports: {
  id: uuid,
  user_id: uuid, // Owner of the report
  filename: text, // Original filename
  file_type: enum, // 'quarterly_report' | 'capital_call_notice' | 'distribution_notice' | 'k1_form' | 'portfolio_update'
  file_size: integer, // Size in bytes
  storage_path: text, // Path in Supabase Storage
  processed_status: enum, // 'pending' | 'processing' | 'completed' | 'failed'
  processing_started_at: timestamp,
  processing_completed_at: timestamp,
  created_at: timestamp
}

// Store AI processing results and extracted data
processed_reports: {
  id: uuid,
  fund_report_id: uuid, // Link to original uploaded file
  user_id: uuid, // Owner of the processed data
  processing_confidence: numeric, // AI confidence score (0-100%)
  extracted_data: jsonb, // Structured data extracted by AI
  validation_status: enum, // 'auto_validated' | 'needs_review' | 'manually_corrected'
  manual_corrections: jsonb, // Any manual corrections made by user
  created_at: timestamp
}

// Track AI processing performance and improvements
document_processing_jobs: {
  id: uuid,
  fund_report_id: uuid, // Which report was processed
  processing_engine: enum, // 'gpt4_vision' | 'claude3' | 'gemini_pro_vision'
  processing_time_ms: integer, // How long the AI took to process
  success_rate: numeric, // Percentage of fields successfully extracted
  error_details: jsonb, // Any processing errors or issues
  created_at: timestamp
}
```

### Decision #3: Portfolio Intelligence & Analytics Engine

- **Problem:** Need real-time portfolio performance tracking with IRR/MOIC calculations
- **Action:** Design analytics system that calculates complex VC metrics automatically
- **Impact:** Provides the "5-minute daily check-in" replacing 20+ hour monthly spreadsheets

**Analytics Architecture:**

```typescript
// Real-time portfolio performance metrics
portfolio_metrics: {
  id: uuid,
  portfolio_id: uuid, // Which portfolio this snapshot is for
  calculation_date: date, // Date of this metric calculation
  total_value: numeric, // Current total portfolio value
  total_invested: numeric, // Total amount invested across all positions
  unrealized_gains: numeric, // Current unrealized gains/losses
  realized_gains: numeric, // Total realized gains from exits/distributions
  gross_irr: numeric, // Gross Internal Rate of Return
  net_irr: numeric, // Net IRR (after fees/carried interest)
  gross_moic: numeric, // Gross Multiple on Invested Capital
  net_moic: numeric, // Net MOIC
  tvpi: numeric, // Total Value to Paid-In capital
  dpi: numeric, // Distributed to Paid-In capital
  rvpi: numeric, // Residual Value to Paid-In capital
  pic: numeric, // Paid-In Capital ratio
  created_at: timestamp, // When this snapshot was calculated
  updated_at: timestamp
}

// Store historical snapshots for trend analysis
performance_snapshots: {
  id: uuid,
  portfolio_id: uuid, // Which portfolio this snapshot is for
  snapshot_date: date, // Date of this performance snapshot
  metrics_data: jsonb, // Complete metrics snapshot for historical analysis
  created_at: timestamp
}

// Portfolio concentration and risk analysis
concentration_analysis: {
  id: uuid,
  portfolio_id: uuid, // Which portfolio this analysis is for
  analysis_date: date, // Date of this analysis
  sector_concentration: jsonb, // Sector allocation analysis
  stage_concentration: jsonb, // Stage allocation analysis
  geographic_concentration: jsonb, // Geographic allocation analysis
  vintage_year_concentration: jsonb, // Investment vintage analysis
  risk_metrics: jsonb, // Risk assessment scores
  alerts: jsonb, // Risk alerts and recommendations
  created_at: timestamp
}
```

### Decision #4: Co-Investor Network Intelligence

- **Problem:** Need to track and analyze co-investor relationships and quality
- **Action:** Design network analysis system for VC relationship intelligence
- **Impact:** Enables data-driven co-investor assessment and syndicate formation

**Network Intelligence Architecture:**

```typescript
// Co-investor profiles and track records
co_investors: {
  id: uuid,
  name: text, // Co-investor name
  email: text, // Contact email (optional)
  company: text, // Company/firm name
  role: enum, // 'angel' | 'vc' | 'family_office' | 'institutional'
  investment_focus: text[], // Sectors of focus
  typical_ticket_size: text, // Typical investment size range
  portfolio_size: text, // Approximate number of investments
  exit_history: jsonb, // Historical exits and performance
  network_reputation_score: numeric, // Calculated reputation score
  last_updated: timestamp,
  created_at: timestamp
}

// Track co-investment relationships and history
co_investment_relationships: {
  id: uuid,
  investor_a_id: uuid, // First investor in the relationship
  investor_b_id: uuid, // Second investor in the relationship
  relationship_type: enum, // 'co_investor' | 'syndicate_partner' | 'former_colleague'
  deal_count: integer, // Number of deals done together
  first_deal_date: date, // Date of first co-investment
  last_deal_date: date, // Date of most recent co-investment
  relationship_strength_score: numeric, // Calculated relationship strength
  notes: text, // Relationship notes/context
  created_at: timestamp,
  updated_at: timestamp
}

// Network analysis and insights
network_insights: {
  id: uuid,
  user_id: uuid, // Who this insight is for
  insight_type: enum, // 'co_investor_recommendation' | 'syndicate_opportunity' | 'network_gap'
  insight_data: jsonb, // Specific insight data and recommendations
  confidence_score: numeric, // AI confidence in the insight
  action_required: boolean, // Whether user action is recommended
  created_at: timestamp
}
```

### Decision #5: Subscription & Usage Management

- **Problem:** Need tiered billing (€199-€999/month) based on portfolio size and usage
- **Action:** Design flexible subscription system with granular usage tracking
- **Impact:** Supports business model with accurate billing enforcement

**Subscription Architecture:**

```typescript
// User subscription management
subscriptions: {
  id: uuid,
  user_id: uuid, // User this subscription belongs to
  stripe_subscription_id: text, // Stripe subscription reference
  tier: enum, // 'starter' | 'professional' | 'institutional' (€200/€800/€3,000)
  status: enum, // 'active' | 'canceled' | 'past_due' | 'trialing'
  max_portfolios: integer, // Portfolio limit for this tier
  max_investments: integer, // Investment limit for this tier
  max_storage_gb: integer, // Document storage limit
  features_enabled: jsonb, // Enabled features for this tier
  current_period_start: timestamp,
  current_period_end: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}

// Granular usage tracking for billing
usage_events: {
  id: uuid,
  user_id: uuid, // User who performed the action
  subscription_id: uuid, // Which subscription this usage belongs to
  event_type: enum, // 'document_processed' | 'report_generated' | 'api_call' | 'export_generated'
  event_data: jsonb, // Event-specific data (document size, report type, etc.)
  usage_amount: integer, // Quantity consumed (1 for document, bytes for storage, etc.)
  cost_per_unit: numeric, // Cost per unit for billing calculations
  created_at: timestamp
}

// Subscription limits and alerts
subscription_limits: {
  id: uuid,
  subscription_id: uuid, // Which subscription this limit applies to
  limit_type: enum, // 'monthly_document_processing' | 'total_storage' | 'api_calls' | 'exports'
  limit_value: integer, // The actual limit (e.g., 100 for documents)
  current_usage: integer, // Current usage for this period
  reset_date: timestamp, // When this limit resets
  alert_threshold: integer, // Usage level to trigger warnings (e.g., 80% of limit)
  created_at: timestamp,
  updated_at: timestamp
}
```

### Decision #6: Document Storage & Processing Pipeline

- **Problem:** Need secure storage for fund reports with AI processing pipeline
- **Action:** Design comprehensive document handling system with processing tracking
- **Impact:** Enables 95%+ accuracy in fund report processing with full audit trails

**Document Processing Architecture:**

```typescript
// Document storage and access control
documents: {
  id: uuid,
  user_id: uuid, // Owner of the document
  document_type: enum, // 'fund_report' | 'capital_call' | 'distribution_notice' | 'k1_form' | 'portfolio_company_update'
  filename: text, // Original filename
  mime_type: text, // MIME type for proper handling
  file_size: integer, // Size in bytes
  storage_bucket: text, // Which Supabase bucket (fund-reports, company-updates, etc.)
  storage_path: text, // Path within bucket
  checksum: text, // File integrity verification
  processing_status: enum, // 'uploaded' | 'processing' | 'processed' | 'failed'
  access_level: enum, // 'private' | 'shared' | 'public' - for compliance
  expires_at: timestamp, // Optional expiration for sensitive documents
  created_at: timestamp
}

// AI processing pipeline tracking
ai_processing_jobs: {
  id: uuid,
  document_id: uuid, // Which document is being processed
  user_id: uuid, // Who initiated the processing
  processing_type: enum, // 'fund_report_analysis' | 'data_extraction' | 'insight_generation'
  ai_model_used: text, // Which AI model processed it (gpt4-vision, claude3, etc.)
  processing_status: enum, // 'queued' | 'in_progress' | 'completed' | 'failed'
  confidence_score: numeric, // AI confidence in results (0-100%)
  processing_time_ms: integer, // Total processing time
  input_tokens: integer, // AI input token count
  output_tokens: integer, // AI output token count
  cost_estimate: numeric, // Estimated processing cost
  error_details: jsonb, // Any processing errors
  created_at: timestamp,
  completed_at: timestamp
}

// Extracted insights and data
document_insights: {
  id: uuid,
  ai_processing_job_id: uuid, // Link to the processing job
  user_id: uuid, // Who owns these insights
  insight_type: enum, // 'performance_summary' | 'risk_assessment' | 'trend_analysis' | 'recommendation'
  insight_data: jsonb, // Structured insight data
  confidence_score: numeric, // Confidence in this specific insight
  is_validated: boolean, // Whether user has validated this insight
  user_feedback: text, // User notes or corrections
  created_at: timestamp
}
```

### Implementation Priority

1. **Phase 1 (MVP - 4 weeks):** Core portfolio tables + basic document processing + user management + subscription system
2. **Phase 2 (Core Features - 6 weeks):** Advanced analytics + co-investor network + real-time metrics + audit trails
3. **Phase 3 (Intelligence Layer - 8 weeks):** AI processing pipeline + document intelligence + risk analysis + compliance features
4. **Phase 4 (Platform Features - 4 weeks):** Advanced networking + integrations + enterprise features + performance optimization

---

## 🎯 Strategic Advantage

Your fresh database approach provides **significant advantages** for VC portfolio management:

- **Purpose-Built Architecture** ✅ Designed specifically for multi-vehicle VC complexity, not generic chat applications
- **Real-Time Performance** ✅ Built-in analytics engine for IRR/MOIC calculations with historical snapshots
- **AI-Native Design** ✅ Document processing pipeline optimized for 95%+ accuracy with audit trails
- **Compliance-Ready** ✅ Row-level security, audit trails, and document access controls for financial data
- **Scalable Intelligence** ✅ Network analysis and risk assessment built into the core architecture
- **Multi-Vehicle Complexity** ✅ Unified system handling both angel investments and LP commitments seamlessly
- **Professional Positioning** ✅ Database architecture supports Sage archetype with wisdom, clarity, and precision

**Next Steps:** Start with Phase 1 implementation - the core portfolio and user management tables provide immediate value while the architecture scales to support all advanced features.

> **Development Approach:** Build the database schema first as your foundation, then layer on the AI processing pipeline, then add the analytics engine, then implement the user interface. This approach ensures data integrity and performance as you scale to handle complex VC workflows and large document volumes.
