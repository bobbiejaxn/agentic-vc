# Task: Company Profile Pages Implementation

## 1. Strategic Analysis & Solution Options

### 1.1 Problem Definition

**Current State**: The application lacks dedicated company profile pages that provide comprehensive views of portfolio companies. Users need detailed insights into individual companies within their investment portfolio.

**Desired State**: Implement detailed company profile pages that showcase comprehensive company information, financial metrics, investment details, and performance analytics in a visually appealing and interactive format.

### 1.2 Solution Options Analysis

#### Option 1: Comprehensive Company Profile with Tabbed Navigation

**Approach**: Create a single, feature-rich company profile page with tabbed navigation for different information categories.

**Pros**:

- Centralized company information
- Consistent user experience
- Easy navigation between related information
- Single-page application benefits

**Cons**:

- Complex initial implementation
- Potential performance overhead with extensive data loading
- Higher initial development cost

**Technical Requirements**:

- React Router for nested routing
- Complex data aggregation from multiple Convex tables
- Tab component implementation
- Comprehensive data visualization

#### Option 2: Modular Company Profile with Separate Sections

**Approach**: Create separate pages/views for different aspects of company information with clear navigation between them.

**Pros**:

- Simpler individual components
- Better performance (load only needed data)
- Easier to maintain and extend
- Clear separation of concerns

**Cons**:

- More navigation required for users
- Potential disjointed experience
- More URL routes to manage

**Technical Requirements**:

- Multiple route definitions
- Individual page components
- Shared data context
- Navigation breadcrumbs

#### Option 3: Hybrid Approach with Expandable Sections (RECOMMENDED)

**Approach**: Create a main company profile page with expandable/collapsible sections and progressive data loading.

**Pros**:

- Balanced complexity and functionality
- Good performance with progressive loading
- Clean, intuitive user interface
- Mobile-friendly responsive design
- Easy to extend with new sections

**Cons**:

- More complex state management
- Careful UX design needed for expandable sections

**Technical Requirements**:

- Accordion/collapsible components
- Progressive data loading with Convex queries
- Smooth animations and transitions
- Mobile-first responsive design

### 1.3 Recommended Solution

**Selected Approach**: Option 3 - Hybrid Approach with Expandable Sections

**Rationale**:

- Best balance of functionality and performance
- Aligns with existing design system patterns
- Supports mobile and desktop usage
- Scalable for future enhancements
- Provides excellent user experience with progressive disclosure

**Implementation Strategy**:

- Use Radix UI Collapsible components for expandable sections
- Implement lazy loading for heavy data sections
- Create a responsive grid layout
- Integrate with existing Convex backend functions

## 2. Project Analysis & Current State

### 2.1 Current Application State

#### Existing Codebase Analysis

```typescript
// Current FundDashboard.tsx structure
export function FundDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fund Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic fund cards with minimal company information */}
      </div>
    </div>
  );
}

// Current portfolio company data structure (from schema.ts)
interface PortfolioCompany {
  _id: Id<"portfolioCompanies">;
  documentId: Id<"documents">;
  chunkId: Id<"enhancedHybridChunks">;
  companyName: string;
  // ... 35+ additional fields
}
```

#### Current Data Flow

1. Users can view basic company information in fund dashboard
2. Limited company details available in existing views
3. No dedicated company profile pages exist
4. Navigation between companies is basic and limited

#### Identified Gaps

- No dedicated company profile pages
- Limited company data visualization
- No investment history tracking
- Missing performance analytics for individual companies
- No document management for company-specific files

### 2.2 Technical Requirements Analysis

#### Required Backend Integration

```typescript
// Needed Convex queries
-api.queries.getPortfolioCompanyById -
  api.queries.getCompanyMetrics -
  api.queries.getCompanyInvestmentHistory -
  api.queries.getCompanyDocuments -
  api.queries.getCompanyRelatedCompanies;
```

#### Required UI Components

- Company header with logo and basic info
- Expandable sections for different data categories
- Financial metrics visualization
- Investment timeline
- Document management interface
- Related companies section

### 2.3 Dependencies and Prerequisites

#### Existing Dependencies (from package.json)

```json
{
  "dependencies": {
    "@radix-ui/react-collapsible": "^1.1.7",
    "@radix-ui/react-tabs": "^1.1.13",
    "recharts": "^3.2.1",
    "react-router-dom": "^7.9.3"
  }
}
```

#### Additional Requirements

- Company logo upload functionality
- Advanced financial charting
- Document preview capabilities
- Investment performance calculations

## 3. Technical Requirements & Specifications

### 3.1 Functional Requirements

#### Core Features

1. **Company Overview Section**
   - Company name, logo, and description
   - Basic company information (founded date, location, industry)
   - Key contact information
   - Current investment status

2. **Financial Metrics Dashboard**
   - Revenue, growth metrics, and financial KPIs
   - Interactive charts and graphs
   - Historical financial data
   - Benchmark comparisons

3. **Investment History Timeline**
   - Investment rounds and amounts
   - Valuation history
   - Investor information
   - Key milestones and events

4. **Document Management**
   - Company-specific document library
   - Document upload and categorization
   - Version control and tracking
   - Search and filter capabilities

5. **Performance Analytics**
   - Investment performance metrics
   - ROI and IRR calculations
   - Benchmark against portfolio averages
   - Performance attribution analysis

#### Non-Functional Requirements

- **Performance**: Load times under 2 seconds for main sections
- **Responsive**: Mobile-first design with desktop optimization
- **Accessibility**: WCAG 2.1 AA compliance
- **Real-time**: Live updates for critical metrics
- **Scalability**: Support for 1000+ companies

### 3.2 Data Model Requirements

#### Required Schema Extensions

```typescript
// Extensions to existing portfolioCompanies table
interface PortfolioCompany {
  // ... existing fields
  logoUrl?: string; // Company logo
  website?: string; // Company website
  socialLinks?: Record<string, string>; // Social media links
  tags?: string[]; // Company categorization tags
  customFields?: Record<string, any>; // Custom company attributes
}

// New table for company milestones
interface CompanyMilestone {
  _id: Id<"companyMilestones">;
  companyId: Id<"portfolioCompanies">;
  title: string;
  description: string;
  date: number; // Timestamp
  type: "funding" | "product" | "partnership" | "other";
  amount?: number; // For funding events
  valuation?: number; // For valuation events
}
```

#### Data Relationships

- Portfolio Company → Documents (one-to-many)
- Portfolio Company → Metrics (one-to-many)
- Portfolio Company → Investment History (one-to-many)
- Portfolio Company → Related Companies (many-to-many)

### 3.3 API Specifications

#### Required Convex Functions

```typescript
// Query functions
export const getCompanyProfile = query({
  args: { companyId: v.id("portfolioCompanies") },
  handler: async (ctx, args) => {
    // Aggregate all company data for profile page
  },
});

export const getCompanyFinancialMetrics = query({
  args: { companyId: v.id("portfolioCompanies"), timeRange: v.string() },
  handler: async (ctx, args) => {
    // Get financial metrics with time filtering
  },
});

export const getCompanyInvestmentHistory = query({
  args: { companyId: v.id("portfolioCompanies") },
  handler: async (ctx, args) => {
    // Get complete investment history
  },
});

// Mutation functions
export const updateCompanyProfile = mutation({
  args: {
    companyId: v.id("portfolioCompanies"),
    updates: v.object({
      logoUrl: v.optional(v.string()),
      website: v.optional(v.string()),
      // ... other updatable fields
    }),
  },
  handler: async (ctx, args) => {
    // Update company profile information
  },
});

export const uploadCompanyDocument = mutation({
  args: {
    companyId: v.id("portfolioCompanies"),
    file: v.any(),
    category: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Handle document upload and categorization
  },
});
```

## 4. Implementation Plan

### 4.1 Phase 1: Core Company Profile Structure (Week 1-2)

#### 4.1.1 File Structure Setup

```
src/
├── components/
│   ├── company/
│   │   ├── CompanyHeader.tsx
│   │   ├── CompanyOverview.tsx
│   │   ├── FinancialMetrics.tsx
│   │   ├── InvestmentTimeline.tsx
│   │   ├── DocumentManager.tsx
│   │   └── RelatedCompanies.tsx
│   └── ui/
│       ├── CollapsibleSection.tsx
│       └── Timeline.tsx
├── pages/
│   ├── CompanyProfilePage.tsx
│   └── CompanyListPage.tsx
└── lib/
    ├── companyUtils.ts
    └── chartUtils.ts
```

#### 4.1.2 Core Component Implementation

```typescript
// src/components/company/CompanyHeader.tsx
export function CompanyHeader({ company }: { company: PortfolioCompany }) {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <CompanyLogo company={company} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
            <p className="text-gray-600">{company.industry}</p>
          </div>
        </div>
        <CompanyActions company={company} />
      </div>
    </div>
  );
}

// src/pages/CompanyProfilePage.tsx
export function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();
  const company = useQuery(api.queries.getCompanyProfile, { companyId });
  const metrics = useQuery(api.queries.getCompanyFinancialMetrics, {
    companyId,
    timeRange: '1y'
  });

  if (!company) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={company} />
      <div className="container mx-auto p-6 space-y-6">
        <CompanyOverview company={company} />
        <FinancialMetrics metrics={metrics} />
        <InvestmentTimeline companyId={companyId} />
        <DocumentManager companyId={companyId} />
        <RelatedCompanies companyId={companyId} />
      </div>
    </div>
  );
}
```

#### 4.1.3 Route Configuration

```typescript
// src/App.tsx (add to existing routes)
<Routes>
  {/* ... existing routes ... */}
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
</Routes>
```

### 4.2 Phase 2: Financial Metrics and Visualization (Week 3-4)

#### 4.2.1 Financial Charts Implementation

```typescript
// src/components/company/FinancialMetrics.tsx
export function FinancialMetrics({ metrics }: { metrics: CompanyMetrics[] }) {
  return (
    <CollapsibleSection title="Financial Metrics" defaultOpen={true}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics} />
        <GrowthMetrics data={metrics} />
        <ProfitabilityChart data={metrics} />
        <CashFlowChart data={metrics} />
      </div>
    </CollapsibleSection>
  );
}

// src/lib/chartUtils.ts
export function formatFinancialData(metrics: CompanyMetrics[]) {
  return metrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString(),
    revenue: metric.revenue,
    growth: metric.growthRate,
    profit: metric.profitMargin,
    cashFlow: metric.cashFlow
  }));
}
```

#### 4.2.2 Interactive Features

- Time range selectors (1M, 3M, 6M, 1Y, All)
- Metric comparison tools
- Export functionality for charts
- Benchmark comparisons

### 4.3 Phase 3: Investment History and Timeline (Week 5-6)

#### 4.3.1 Timeline Component

```typescript
// src/components/company/InvestmentTimeline.tsx
export function InvestmentTimeline({ companyId }: { companyId: string }) {
  const history = useQuery(api.queries.getCompanyInvestmentHistory, { companyId });

  return (
    <CollapsibleSection title="Investment History" defaultOpen={true}>
      <Timeline events={history} />
      <InvestmentSummary history={history} />
    </CollapsibleSection>
  );
}

// src/components/ui/Timeline.tsx
export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative">
      {events.map((event, index) => (
        <TimelineItem key={event.id} event={event} position={index} />
      ))}
    </div>
  );
}
```

### 4.4 Phase 4: Document Management (Week 7-8)

#### 4.4.1 Document Upload and Management

```typescript
// src/components/company/DocumentManager.tsx
export function DocumentManager({ companyId }: { companyId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const documents = useQuery(api.queries.getCompanyDocuments, { companyId });

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await callMutation(api.mutations.uploadCompanyDocument, {
        companyId,
        file,
        category: 'general'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CollapsibleSection title="Documents" defaultOpen={false}>
      <DocumentUpload onUpload={handleUpload} isLoading={isUploading} />
      <DocumentList documents={documents} />
    </CollapsibleSection>
  );
}
```

### 4.5 Phase 5: Performance Analytics and Optimization (Week 9-10)

#### 4.5.1 Performance Metrics

```typescript
// src/components/company/PerformanceAnalytics.tsx
export function PerformanceAnalytics({ companyId }: { companyId: string }) {
  const analytics = useQuery(api.queries.getCompanyPerformanceAnalytics, { companyId });

  return (
    <CollapsibleSection title="Performance Analytics" defaultOpen={false}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PerformanceCard
          title="ROI"
          value={analytics?.roi}
          trend={analytics?.roiTrend}
        />
        <PerformanceCard
          title="IRR"
          value={analytics?.irr}
          trend={analytics?.irrTrend}
        />
        <PerformanceCard
          title="Multiple"
          value={analytics?.multiple}
          trend={analytics?.multipleTrend}
        />
      </div>
    </CollapsibleSection>
  );
}
```

## 5. Code Change Overview

### 5.1 New Files to Create

#### Core Components

```typescript
// src/components/company/CompanyHeader.tsx
import { PortfolioCompany } from "@/types";
import { CompanyLogo } from "./CompanyLogo";
import { CompanyActions } from "./CompanyActions";

interface CompanyHeaderProps {
  company: PortfolioCompany;
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <CompanyLogo company={company} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
            <p className="text-gray-600">{company.industry}</p>
          </div>
        </div>
        <CompanyActions company={company} />
      </div>
    </div>
  );
}

// src/components/company/CompanyOverview.tsx
import { PortfolioCompany } from "@/types";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";

interface CompanyOverviewProps {
  company: PortfolioCompany;
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  return (
    <CollapsibleSection title="Company Overview" defaultOpen={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">Founded</dt>
              <dd className="font-medium">{company.foundedDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Location</dt>
              <dd className="font-medium">{company.headquarters}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Industry</dt>
              <dd className="font-medium">{company.industry}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Stage</dt>
              <dd className="font-medium">{company.stage}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Investment Details</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">Investment Date</dt>
              <dd className="font-medium">{company.investmentDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Investment Amount</dt>
              <dd className="font-medium">${company.investmentAmount?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Ownership</dt>
              <dd className="font-medium">{company.ownershipPercentage}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Valuation</dt>
              <dd className="font-medium">${company.valuation?.toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>
      {company.description && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          <p className="text-gray-700">{company.description}</p>
        </div>
      )}
    </CollapsibleSection>
  );
}

// src/pages/CompanyProfilePage.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { CompanyOverview } from "@/components/company/CompanyOverview";
import { FinancialMetrics } from "@/components/company/FinancialMetrics";
import { InvestmentTimeline } from "@/components/company/InvestmentTimeline";
import { DocumentManager } from "@/components/company/DocumentManager";
import { RelatedCompanies } from "@/components/company/RelatedCompanies";

export function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();
  const company = useQuery(api.queries.getCompanyProfile, { companyId });
  const metrics = useQuery(api.queries.getCompanyFinancialMetrics, {
    companyId,
    timeRange: '1y'
  });

  if (!company) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={company} />
      <div className="container mx-auto p-6 space-y-6">
        <CompanyOverview company={company} />
        <FinancialMetrics metrics={metrics} />
        <InvestmentTimeline companyId={companyId} />
        <DocumentManager companyId={companyId} />
        <RelatedCompanies companyId={companyId} />
      </div>
    </div>
  );
}

// src/pages/CompanyListPage.tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Link } from "react-router-dom";

export function CompanyListPage() {
  const companies = useQuery(api.queries.getAllPortfolioCompanies);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Portfolio Companies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies?.map((company) => (
          <Link
            key={company._id}
            to={`/company/${company._id}`}
            className="block bg-white  shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{company.companyName}</h3>
              <p className="text-gray-600 mb-4">{company.industry}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{company.stage}</span>
                <span className="text-lg font-bold text-green-600">
                  ${company.investmentAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

#### UI Components

```typescript
// src/components/ui/CollapsibleSection.tsx
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white  shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

// src/components/ui/Timeline.tsx
interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'funding' | 'milestone' | 'partnership' | 'other';
  amount?: number;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex items-start mb-6">
          <div className="absolute left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
          <div className="ml-10">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.type === 'funding' ? 'bg-green-100 text-green-800' :
                event.type === 'milestone' ? 'bg-blue-100 text-blue-800' :
                event.type === 'partnership' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.type}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <p className="text-gray-600 text-sm">{event.description}</p>
            {event.amount && (
              <p className="text-green-600 font-medium mt-1">
                ${event.amount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### Utility Functions

```typescript
// src/lib/companyUtils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function calculateROI(investment: number, currentValue: number): number {
  return (currentValue - investment) / investment;
}

export function getCompanyStageColor(stage: string): string {
  const colors = {
    Seed: "bg-yellow-100 text-yellow-800",
    "Series A": "bg-blue-100 text-blue-800",
    "Series B": "bg-green-100 text-green-800",
    "Series C": "bg-purple-100 text-purple-800",
    Growth: "bg-orange-100 text-orange-800",
    Mature: "bg-gray-100 text-gray-800",
  };
  return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800";
}

// src/lib/chartUtils.ts
import { CompanyMetrics } from "@/types";

export function formatFinancialData(metrics: CompanyMetrics[]) {
  return metrics.map((metric) => ({
    date: new Date(metric.date).toLocaleDateString(),
    revenue: metric.revenue,
    growth: metric.growthRate,
    profit: metric.profitMargin,
    cashFlow: metric.cashFlow,
  }));
}

export function calculateGrowthTrend(
  metrics: CompanyMetrics[]
): "up" | "down" | "stable" {
  if (metrics.length < 2) return "stable";

  const recent = metrics[metrics.length - 1];
  const previous = metrics[metrics.length - 2];

  const change = recent.revenue - previous.revenue;
  const threshold = previous.revenue * 0.05; // 5% threshold

  if (change > threshold) return "up";
  if (change < -threshold) return "down";
  return "stable";
}
```

### 5.2 Existing Files to Modify

#### Route Configuration Updates

```typescript
// src/App.tsx (existing file)
// BEFORE:
<Routes>
  <Route path="/" element={<OverviewPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentManagement />} />
  <Route path="/fund/:fundId" element={<FundDashboard />} />
  {/* Add new routes */}
</Routes>

// AFTER:
<Routes>
  <Route path="/" element={<OverviewPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentManagement />} />
  <Route path="/fund/:fundId" element={<FundDashboard />} />
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
</Routes>
```

#### Navigation Updates

```typescript
// src/components/Navigation.tsx (existing file)
// Add new navigation items:
const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Companies", href: "/companies" },
  { name: "Documents", href: "/documents" },
  { name: "Analytics", href: "/analytics" },
];
```

### 5.3 Backend Functions to Add

#### Convex Query Functions

```typescript
// convex/queries.ts (add to existing file)
export const getCompanyProfile = query({
  args: { companyId: v.id("portfolioCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) return null;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const metrics = await ctx.db
      .query("metrics")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .take(12);

    return {
      ...company,
      documents,
      metrics,
    };
  },
});

export const getCompanyFinancialMetrics = query({
  args: {
    companyId: v.id("portfolioCompanies"),
    timeRange: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let startDate = now;

    switch (args.timeRange) {
      case "1M":
        startDate = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case "3M":
        startDate = now - 90 * 24 * 60 * 60 * 1000;
        break;
      case "6M":
        startDate = now - 180 * 24 * 60 * 60 * 1000;
        break;
      case "1Y":
        startDate = now - 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        startDate = 0;
    }

    return await ctx.db
      .query("metrics")
      .withIndex("by_company_date", (q) =>
        q.eq("companyId", args.companyId).gte("date", startDate)
      )
      .order("desc")
      .collect();
  },
});

export const getCompanyInvestmentHistory = query({
  args: { companyId: v.id("portfolioCompanies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("investmentHistory")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
  },
});

export const getCompanyDocuments = query({
  args: { companyId: v.id("portfolioCompanies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
  },
});

export const getCompanyRelatedCompanies = query({
  args: { companyId: v.id("portfolioCompanies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) return [];

    return await ctx.db
      .query("portfolioCompanies")
      .filter((q) =>
        q.and(
          q.neq(q.field("_id"), args.companyId),
          q.or(
            q.eq(q.field("industry"), company.industry),
            q.eq(q.field("stage"), company.stage)
          )
        )
      )
      .take(5);
  },
});

export const getAllPortfolioCompanies = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("portfolioCompanies").order("desc").collect();
  },
});
```

#### Convex Mutation Functions

```typescript
// convex/mutations.ts (add to existing file)
export const updateCompanyProfile = mutation({
  args: {
    companyId: v.id("portfolioCompanies"),
    updates: v.object({
      logoUrl: v.optional(v.string()),
      website: v.optional(v.string()),
      description: v.optional(v.string()),
      headquarters: v.optional(v.string()),
      socialLinks: v.optional(v.record(v.string(), v.string())),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const { companyId, updates } = args;
    await ctx.db.patch(companyId, updates);
    return { success: true };
  },
});

export const uploadCompanyDocument = mutation({
  args: {
    companyId: v.id("portfolioCompanies"),
    file: v.any(),
    category: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { companyId, file, category, description } = args;

    // Upload file to Convex storage
    const storageId = await ctx.storage.upload(file);

    // Create document record
    const documentId = await ctx.db.insert("documents", {
      companyId,
      storageId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      category,
      description,
      uploadDate: Date.now(),
      status: "processing",
    });

    // Trigger OCR processing
    await ctx.scheduler.runAfter(0, api.ocr.processDocument, {
      documentId,
      storageId,
    });

    return { documentId };
  },
});
```

### 5.4 Schema Extensions

#### Schema Updates

```typescript
// convex/schema.ts (add to existing schema)
// Extend portfolioCompanies table
portfolioCompanies: defineTable({
  // ... existing fields
  logoUrl: v.optional(v.string()),
  website: v.optional(v.string()),
  description: v.optional(v.string()),
  headquarters: v.optional(v.string()),
  socialLinks: v.optional(v.record(v.string(), v.string())),
  tags: v.optional(v.array(v.string())),
  customFields: v.optional(v.record(v.string(), v.any()))
})
  .index("by_name", ["companyName"])
  .index("by_industry", ["industry"])
  .index("by_stage", ["stage"]),

// Add companyMilestones table
companyMilestones: defineTable({
  companyId: v.id("portfolioCompanies"),
  title: v.string(),
  description: v.string(),
  date: v.number(),
  type: v.union(
    v.literal("funding"),
    v.literal("product"),
    v.literal("partnership"),
    v.literal("other")
  ),
  amount: v.optional(v.number()),
  valuation: v.optional(v.number()),
  createdAt: v.number()
})
  .index("by_company", ["companyId"])
  .index("by_company_date", ["companyId", "date"]),

// Add investmentHistory table
investmentHistory: defineTable({
  companyId: v.id("portfolioCompanies"),
  round: v.string(),
  amount: v.number(),
  valuation: v.number(),
  date: v.number(),
  investors: v.array(v.string()),
  description: v.optional(v.string()),
  createdAt: v.number()
})
  .index("by_company", ["companyId"])
  .index("by_company_date", ["companyId", "date"]),

// Add indexes for existing tables
documents: defineTable({
  // ... existing fields
  companyId: v.id("portfolioCompanies")
})
  .index("by_company", ["companyId"])
  .index("by_company_date", ["companyId", "uploadDate"]),

metrics: defineTable({
  // ... existing fields
  companyId: v.id("portfolioCompanies")
})
  .index("by_company", ["companyId"])
  .index("by_company_date", ["companyId", "date"]),
```

## 6. Task Completion Tracking

### 6.1 Implementation Timeline

| Phase   | Tasks                                  | Duration | Status     |
| ------- | -------------------------------------- | -------- | ---------- |
| Phase 1 | Core structure setup, basic components | 2 weeks  | ⏳ Pending |
| Phase 2 | Financial metrics visualization        | 2 weeks  | ⏳ Pending |
| Phase 3 | Investment timeline                    | 2 weeks  | ⏳ Pending |
| Phase 4 | Document management                    | 2 weeks  | ⏳ Pending |
| Phase 5 | Performance analytics                  | 2 weeks  | ⏳ Pending |

### 6.2 Mandatory Workflows

#### Testing Strategy

- **Unit Tests**: Individual component testing
- **Integration Tests**: Convex query/mutation testing
- **E2E Tests**: Complete user journey testing
- **Visual Regression**: UI consistency testing
- **Accessibility**: WCAG 2.1 AA compliance

#### Quality Assurance

- **Code Review**: All changes reviewed before merge
- **Performance Testing**: Load time and responsiveness testing
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iOS and Android devices
- **Security Testing**: Authentication and authorization testing

#### Documentation Requirements

- **Component Documentation**: Storybook-style documentation
- **API Documentation**: Convex function documentation
- **User Documentation**: End-user guide
- **Developer Documentation**: Integration guide
- **Deployment Documentation**: Setup and deployment guide

### 6.3 Success Metrics

#### Technical Metrics

- **Page Load Time**: < 2 seconds for main company profile
- **Time to Interactive**: < 3 seconds
- **API Response Time**: < 500ms for Convex queries
- **Error Rate**: < 0.1% for failed requests
- **Mobile Score**: > 90 on Lighthouse

#### User Experience Metrics

- **User Satisfaction**: > 4.5/5 on user surveys
- **Task Completion Rate**: > 95% for key tasks
- **Navigation Success**: > 90% successful navigation
- **Feature Adoption**: > 80% of users use advanced features
- **Support Tickets**: < 5% of users contact support

#### Business Metrics

- **User Engagement**: 20% increase in time spent
- **Feature Usage**: 30% increase in company profile views
- **Document Uploads**: 50% increase in document uploads
- **Data Completeness**: 80% of companies have complete profiles
- **User Retention**: 15% improvement in user retention

### 6.4 Risk Assessment and Mitigation

#### Technical Risks

- **Performance Issues**: Implement lazy loading and caching
- **Data Inconsistency**: Implement data validation and error handling
- **API Limitations**: Monitor API usage and implement rate limiting
- **Cross-browser Compatibility**: Use modern CSS with fallbacks
- **Mobile Responsiveness**: Test on various device sizes

#### User Experience Risks

- **Complex Navigation**: Implement breadcrumbs and clear navigation
- **Information Overload**: Use progressive disclosure
- **Poor Performance**: Optimize images and implement loading states
- **Accessibility Issues**: Follow WCAG guidelines and test with screen readers
- **User Confusion**: Provide clear instructions and tooltips

#### Business Risks

- **Timeline Delays**: Implement agile development and regular check-ins
- **Scope Creep**: Clearly define requirements and change management process
- **Resource Constraints**: Prioritize features and implement MVP first
- **User Adoption**: Implement user training and onboarding
- **Maintenance Overhead**: Design for maintainability and documentation

### 6.5 Handover and Deployment

#### Deployment Checklist

- [ ] All code reviewed and approved
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Migration scripts tested
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Error tracking set up
- [ ] User notification sent

#### Post-deployment Monitoring

- **Performance Monitoring**: Track page load times and API response times
- **Error Tracking**: Monitor errors and exceptions
- **User Analytics**: Track user behavior and feature usage
- **Business Metrics**: Monitor key business metrics
- **User Feedback**: Collect and analyze user feedback
- **System Health**: Monitor system health and uptime

#### Maintenance Plan

- **Regular Updates**: Schedule regular updates and maintenance
- **Bug Fixes**: Prioritize and fix reported bugs
- **Feature Enhancements**: Plan and implement new features
- **Performance Optimization**: Continuously optimize performance
- **Security Updates**: Apply security patches and updates
- **Documentation Updates**: Keep documentation up to date

## 7. AI Agent Instructions

### 7.1 Mandatory AI Agent Workflows

#### Agent Coordinator Instructions

- **Launch Specialized Agents**: Use specific agents for different aspects of the implementation
- **Coordinate Tasks**: Ensure agents work together effectively
- **Review Code**: Coordinate code reviews across agents
- **Test Integration**: Ensure proper integration testing
- **Documentation**: Ensure comprehensive documentation

#### TypeScript Specialist Instructions

- **Type Safety**: Ensure strict TypeScript compliance
- **Schema Alignment**: Align frontend types with Convex schema
- **Error Handling**: Implement proper error handling patterns
- **Performance**: Optimize for performance
- **Testing**: Write comprehensive TypeScript tests

#### UI/UX Architect Instructions

- **Design System**: Follow the established design system
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach
- **User Experience**: Focus on intuitive user experience
- **Visual Consistency**: Maintain visual consistency

#### Security Auditor Instructions

- **Security Review**: Conduct thorough security review
- **Authentication**: Ensure proper authentication
- **Authorization**: Implement proper authorization
- **Data Protection**: Protect sensitive data
- **Compliance**: Ensure compliance with regulations

### 7.2 Code Quality Standards

#### TypeScript Standards

- **Strict Mode**: Use TypeScript strict mode
- **Type Definitions**: Define proper type definitions
- **Error Handling**: Implement proper error handling
- **Performance**: Optimize for performance
- **Testing**: Write comprehensive tests

#### React Standards

- **Component Architecture**: Use proper component architecture
- **State Management**: Use appropriate state management
- **Hooks**: Use React hooks properly
- **Performance**: Optimize component performance
- **Testing**: Write component tests

#### Convex Standards

- **Query Design**: Design efficient queries
- **Mutation Design**: Design safe mutations
- **Schema Design**: Design proper schema
- **Error Handling**: Implement proper error handling
- **Testing**: Write backend tests

### 7.3 Testing Requirements

#### Unit Testing

- **Component Testing**: Test individual components
- **Function Testing**: Test utility functions
- **Hook Testing**: Test custom hooks
- **Query Testing**: Test Convex queries
- **Mutation Testing**: Test Convex mutations

#### Integration Testing

- **Component Integration**: Test component interactions
- **API Integration**: Test API integrations
- **Database Integration**: Test database interactions
- **Authentication**: Test authentication flows
- **User Flows**: Test complete user flows

#### E2E Testing

- **User Journeys**: Test complete user journeys
- **Critical Paths**: Test critical user paths
- **Edge Cases**: Test edge cases
- **Error Scenarios**: Test error scenarios
- **Performance**: Test performance under load

### 7.4 Documentation Requirements

#### Technical Documentation

- **API Documentation**: Document all APIs
- **Component Documentation**: Document all components
- **Database Schema**: Document database schema
- **Architecture**: Document system architecture
- **Deployment**: Document deployment process

#### User Documentation

- **User Guide**: Create user guide
- **Feature Documentation**: Document features
- **Tutorial**: Create tutorial
- **FAQ**: Create FAQ
- **Troubleshooting**: Create troubleshooting guide

#### Developer Documentation

- **Setup Guide**: Create setup guide
- **Development Guide**: Create development guide
- **Testing Guide**: Create testing guide
- **Deployment Guide**: Create deployment guide
- **Contribution Guide**: Create contribution guide

## 8. Conclusion

### 8.1 Summary

This comprehensive task document outlines the implementation of Company Profile Pages for the VC Portfolio OS. The implementation follows a hybrid approach with expandable sections, providing an optimal balance of functionality and performance. The solution includes comprehensive company information, financial metrics visualization, investment history tracking, document management, and performance analytics.

### 8.2 Key Deliverables

- **Company Profile Pages**: Complete company profile implementation
- **Financial Dashboard**: Interactive financial metrics visualization
- **Investment Timeline**: Comprehensive investment history tracking
- **Document Management**: Company-specific document management
- **Performance Analytics**: Advanced performance analytics

### 8.3 Success Criteria

- **Technical**: Performance benchmarks met, code quality standards followed
- **User Experience**: Intuitive user interface, positive user feedback
- **Business**: Increased user engagement, improved data quality
- **Maintenance**: Well-documented, maintainable codebase

### 8.4 Next Steps

1. **Review and Approval**: Review this task document and get approval
2. **Phase 1 Implementation**: Begin with core structure and basic components
3. **Continuous Integration**: Implement continuous integration and deployment
4. **Testing and QA**: Comprehensive testing and quality assurance
5. **Deployment and Monitoring**: Deploy to production and monitor performance

This implementation will provide a comprehensive company profile management system that enhances the VC Portfolio OS with detailed company insights and analytics capabilities.

---

**Task Document Status**: ✅ Complete
**Version**: 1.0
**Created**: 2025-10-07
**Last Updated**: 2025-10-07
**Next Review**: 2025-10-14
