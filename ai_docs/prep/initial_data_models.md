# VC Portfolio OS - Initial Data Models

**Version**: 1.0  
**Date**: January 15, 2025  
**Author**: AI Development Team  
**Status**: Ready for Implementation

---

## 📊 **DATA MODEL OVERVIEW**

### Core Entities

- **Users**: Business angels, LPs, fund managers, family office directors
- **Funds**: Investment funds with performance metrics
- **Portfolio Companies**: Companies in fund portfolios
- **Documents**: Uploaded reports and processed files
- **Extractions**: AI-extracted data from documents
- **Performance**: Time-series performance data
- **Network**: Co-investor relationships and intelligence

### Data Relationships

- Users have commitments to multiple funds
- Funds have investments in multiple portfolio companies
- Documents are processed to extract performance data
- Performance data is linked to funds and users
- Network data connects investors and companies

---

## 👥 **USER DATA MODELS**

### User Entity

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  investorType: "angel" | "family_office" | "institutional" | "fund_manager";
  profile: {
    company?: string;
    title?: string;
    location?: string;
    bio?: string;
    avatar?: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    dashboard: {
      layout: "grid" | "list";
      widgets: string[];
    };
    privacy: {
      shareData: boolean;
      publicProfile: boolean;
    };
  };
  subscription: {
    tier: "starter" | "professional" | "institutional" | "enterprise";
    status: "active" | "inactive" | "cancelled";
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### User Authentication

```typescript
interface UserAuth {
  userId: string;
  provider: "email" | "google" | "microsoft" | "sso";
  credentials: {
    email: string;
    passwordHash?: string;
    providerId?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastLogin: Date;
    loginAttempts: number;
    lockedUntil?: Date;
  };
  permissions: {
    roles: string[];
    features: string[];
    dataAccess: string[];
  };
}
```

---

## 💰 **FUND DATA MODELS**

### Fund Entity

```typescript
interface Fund {
  id: string;
  name: string;
  fundManager: string;
  vintageYear: number;
  fundSize: number;
  currency: string;
  fundStatus: "raising" | "investing" | "harvesting" | "closed";
  terms: {
    managementFeeRate: number;
    carriedInterestRate: number;
    hurdleRate: number;
    investmentPeriodEnd: Date;
  };
  performance: {
    grossIrr: number;
    netIrr: number;
    tvpiMoic: number;
    dpi: number;
    rvpi: number;
    fundNav: number;
  };
  metadata: {
    description?: string;
    website?: string;
    logo?: string;
    documents: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### LP Commitment Entity

```typescript
interface LPCommitment {
  id: string;
  userId: string;
  fundId: string;
  commitmentAmount: number;
  ownershipPercentage: number;
  investmentDate: Date;
  status: "active" | "cancelled" | "completed";
  terms: {
    managementFeeRate: number;
    carriedInterestRate: number;
    hurdleRate: number;
  };
  performance: {
    personalNav: number;
    personalIrr: number;
    personalMoic: number;
    personalDistributions: number;
    personalCalledCapital: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🏢 **PORTFOLIO COMPANY DATA MODELS**

### Portfolio Company Entity

```typescript
interface PortfolioCompany {
  id: string;
  name: string;
  legalName?: string;
  industrySector: string;
  geography: string;
  foundingYear: number;
  businessModel: string;
  marketSize: number;
  companyStatus: "active" | "exited" | "written_off" | "distressed";
  description?: string;
  website?: string;
  logo?: string;
  metadata: {
    employees?: number;
    revenue?: number;
    fundingRounds: number;
    lastValuation?: number;
    lastValuationDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Fund Investment Entity

```typescript
interface FundInvestment {
  id: string;
  fundId: string;
  portfolioCompanyId: string;
  investmentStage: string;
  investmentDate: Date;
  originalCost: number;
  ownershipPercentage: number;
  boardSeats: number;
  status: "active" | "exited" | "written_off";
  exitDetails?: {
    exitDate: Date;
    exitValue: number;
    exitMultiple: number;
    exitType: "ipo" | "acquisition" | "merger" | "liquidation";
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📄 **DOCUMENT DATA MODELS**

### Document Entity

```typescript
interface Document {
  id: string;
  userId: string;
  fundId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageId: string;
  documentType:
    | "quarterly_report"
    | "annual_report"
    | "capital_call"
    | "distribution_notice";
  reportingPeriod?: number;
  status: "uploaded" | "processing" | "processed" | "failed";
  content: {
    markdownContent?: string;
    ocrMetadata?: any;
    extractedText?: string;
  };
  processing: {
    ocrCompleted: boolean;
    chunkingCompleted: boolean;
    embeddingCompleted: boolean;
    extractionCompleted: boolean;
    qualityScore?: number;
    errors?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Document Chunk Entity

```typescript
interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: {
    chunkIndex: number;
    tokenCount: number;
    section?: string;
    pageNumber?: number;
    confidence?: number;
  };
  vcContext: {
    fundId?: string;
    companyId?: string;
    metrics?: string[];
    entities?: string[];
  };
  createdAt: Date;
}
```

---

## 🤖 **EXTRACTION DATA MODELS**

### Extraction Result Entity

```typescript
interface ExtractionResult {
  id: string;
  documentId: string;
  extractionType:
    | "fund_performance"
    | "portfolio_company"
    | "lp_performance"
    | "co_investor";
  extractedData: {
    fundMetrics?: {
      grossIrr?: number;
      netIrr?: number;
      tvpiMoic?: number;
      dpi?: number;
      rvpi?: number;
      fundNav?: number;
    };
    portfolioCompanies?: {
      name: string;
      valuation: number;
      ownership: number;
      status: string;
    }[];
    coInvestors?: {
      name: string;
      type: string;
      investmentAmount: number;
      qualityScore: number;
    }[];
    personalMetrics?: {
      personalNav: number;
      personalIrr: number;
      personalMoic: number;
      personalDistributions: number;
      personalCalledCapital: number;
    };
  };
  confidenceScore: number;
  extractionTimestamp: Date;
  agentUsed: string;
  validation: {
    validated: boolean;
    validatedBy?: string;
    validationDate?: Date;
    corrections?: any;
  };
  createdAt: Date;
}
```

### AI Agent Entity

```typescript
interface AIAgent {
  id: string;
  name: string;
  type: "extraction" | "analysis" | "validation" | "intelligence";
  description: string;
  capabilities: string[];
  performance: {
    accuracy: number;
    processingTime: number;
    successRate: number;
    lastUpdated: Date;
  };
  configuration: {
    model: string;
    parameters: any;
    trainingData: string[];
  };
  status: "active" | "inactive" | "training" | "error";
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📊 **PERFORMANCE DATA MODELS**

### Fund Performance Snapshot Entity

```typescript
interface FundPerformanceSnapshot {
  id: string;
  fundId: string;
  reportingPeriod: number;
  grossIrr: number;
  netIrr: number;
  tvpiMoic: number;
  dpi: number;
  rvpi: number;
  fundNav: number;
  cumulativeDistributions: number;
  cumulativeCalledCapital: number;
  unfundedCommitment: number;
  deploymentRate: number;
  portfolioCompanyCount: number;
  fundAgeYears: number;
  benchmarkComparison: number;
  riskMetrics: {
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    var95: number;
  };
  createdAt: Date;
}
```

### LP Performance Snapshot Entity

```typescript
interface LPPerformanceSnapshot {
  id: string;
  userId: string;
  fundId: string;
  reportingPeriod: number;
  personalNav: number;
  personalDistributions: number;
  personalCalledCapital: number;
  personalMoic: number;
  personalIrr: number;
  personalUnfunded: number;
  managementFeesPaid: number;
  carryAllocation: number;
  currentQuarterPerformance: number;
  ytdPerformance: number;
  sinceInceptionPerformance: number;
  benchmarkComparison: number;
  riskMetrics: {
    personalVolatility: number;
    personalSharpeRatio: number;
    concentrationRisk: number;
  };
  createdAt: Date;
}
```

---

## 🌐 **NETWORK DATA MODELS**

### Co-Investor Syndicate Entity

```typescript
interface CoInvestorSyndicate {
  id: string;
  fundInvestmentId: string;
  coInvestorName: string;
  coInvestorType: "vc" | "pe" | "strategic" | "angel" | "family_office";
  investmentAmount: number;
  leadInvestor: boolean;
  qualityScore: number;
  trackRecord: {
    totalInvestments: number;
    successfulExits: number;
    averageIrr: number;
    averageMoic: number;
  };
  network: {
    connections: string[];
    introductions: number;
    referrals: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Network Intelligence Entity

```typescript
interface NetworkIntelligence {
  id: string;
  userId: string;
  networkType: "co_investor" | "portfolio_company" | "fund_manager";
  entityId: string;
  entityName: string;
  relationshipStrength: number;
  qualityScore: number;
  insights: {
    trackRecord: any;
    performance: any;
    reputation: any;
    network: any;
  };
  recommendations: {
    introductionOpportunities: string[];
    dealFlow: string[];
    strategicPartnerships: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 💳 **TRANSACTION DATA MODELS**

### Capital Call Entity

```typescript
interface CapitalCall {
  id: string;
  lpCommitmentId: string;
  callDate: Date;
  callAmount: number;
  callPercentage: number;
  callPurpose: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  payment: {
    dueDate: Date;
    paidDate?: Date;
    paymentMethod?: string;
    reference?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Distribution Entity

```typescript
interface Distribution {
  id: string;
  lpCommitmentId: string;
  distributionDate: Date;
  distributionAmount: number;
  distributionType: "capital_return" | "carried_interest" | "dividend";
  taxTreatment: string;
  sourceCompanyId?: string;
  status: "pending" | "paid" | "cancelled";
  payment: {
    dueDate: Date;
    paidDate?: Date;
    paymentMethod?: string;
    reference?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔧 **SYSTEM DATA MODELS**

### System Configuration Entity

```typescript
interface SystemConfiguration {
  id: string;
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  category: "ai" | "processing" | "security" | "performance" | "feature";
  environment: "development" | "staging" | "production";
  createdAt: Date;
  updatedAt: Date;
}
```

### Audit Log Entity

```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: "info" | "warning" | "error" | "critical";
}
```

---

## 📋 **DATA VALIDATION RULES**

### User Validation

```typescript
const userValidationRules = {
  email: {
    required: true,
    format: "email",
    unique: true,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  investorType: {
    required: true,
    enum: ["angel", "family_office", "institutional", "fund_manager"],
  },
};
```

### Fund Validation

```typescript
const fundValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  fundSize: {
    required: true,
    min: 0,
    type: "number",
  },
  vintageYear: {
    required: true,
    min: 1990,
    max: new Date().getFullYear(),
  },
};
```

### Performance Validation

```typescript
const performanceValidationRules = {
  irr: {
    min: -1,
    max: 10,
    type: "number",
  },
  moic: {
    min: 0,
    max: 100,
    type: "number",
  },
  nav: {
    min: 0,
    type: "number",
  },
};
```

---

## 🚀 **DATA MIGRATION STRATEGY**

### Migration Phases

1. **Phase 1**: Core entities (Users, Funds, Portfolio Companies)
2. **Phase 2**: Performance data and snapshots
3. **Phase 3**: Document processing and extractions
4. **Phase 4**: Network intelligence and analytics
5. **Phase 5**: Advanced features and optimizations

### Data Import Process

```typescript
interface DataImport {
  id: string;
  userId: string;
  importType: "csv" | "excel" | "api" | "manual";
  source: string;
  status: "pending" | "processing" | "completed" | "failed";
  records: {
    total: number;
    processed: number;
    successful: number;
    failed: number;
  };
  errors: string[];
  createdAt: Date;
  completedAt?: Date;
}
```

---

## 📊 **DATA ANALYTICS MODELS**

### Analytics Dashboard Entity

```typescript
interface AnalyticsDashboard {
  id: string;
  userId: string;
  name: string;
  widgets: {
    id: string;
    type: string;
    configuration: any;
    position: { x: number; y: number; w: number; h: number };
  }[];
  layout: "grid" | "list" | "custom";
  filters: {
    dateRange: { start: Date; end: Date };
    funds: string[];
    companies: string[];
    metrics: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Report Entity

```typescript
interface Report {
  id: string;
  userId: string;
  name: string;
  type: "portfolio" | "fund" | "company" | "performance" | "custom";
  configuration: {
    dataSource: string;
    filters: any;
    metrics: string[];
    format: "pdf" | "excel" | "csv" | "json";
  };
  status: "generating" | "completed" | "failed";
  fileUrl?: string;
  generatedAt?: Date;
  createdAt: Date;
}
```

---

## 📋 **DATA MODEL IMPLEMENTATION CHECKLIST**

### Core Requirements

- [ ] All entities defined with proper relationships
- [ ] Data validation rules implemented
- [ ] Indexes created for performance
- [ ] Constraints enforced for data integrity

### Performance Requirements

- [ ] Query optimization for common patterns
- [ ] Caching strategy for frequently accessed data
- [ ] Pagination for large datasets
- [ ] Archiving strategy for historical data

### Security Requirements

- [ ] Data encryption at rest and in transit
- [ ] Access control and permissions
- [ ] Audit logging for sensitive operations
- [ ] Data retention and deletion policies

---

**Document Status**: Complete  
**Next Review Date**: February 15, 2025  
**Approval Required**: Engineering Leadership, Database Architecture Team, Security Team
