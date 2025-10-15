# Task: Market Research Dashboard Implementation

## 1. Strategic Analysis & Solution Options

### 1.1 Problem Definition

**Current State**: The VC Portfolio OS has comprehensive internal data analysis capabilities but lacks external market research integration. Users cannot easily access market trends, competitive intelligence, industry benchmarks, or external data sources to complement their internal portfolio analysis.

**Desired State**: Implement a sophisticated Market Research Dashboard that integrates external market data, competitive intelligence, industry trends, and benchmarking capabilities to provide users with comprehensive market insights alongside their portfolio analysis.

### 1.2 Solution Options Analysis

#### Option 1: Basic Market Data Integration

**Approach**: Implement simple market data display using free APIs and public data sources with basic visualization capabilities.

**Pros**:

- Lower implementation cost
- Uses freely available data sources
- Faster time to market
- Simple maintenance
- Good starting point

**Cons**:

- Limited data depth and quality
- Basic visualization capabilities
- No competitive intelligence
- Limited customization
- Potential data reliability issues

**Technical Requirements**:

- Integration with free market APIs (Alpha Vantage, Yahoo Finance)
- Basic charting with Recharts
- Simple data caching in Convex
- Basic market data display components
- Limited real-time capabilities

#### Option 2: Premium Market Intelligence Platform

**Approach**: Integrate with premium market data providers (PitchBook, Crunchbase, Preqin) and build comprehensive market intelligence capabilities.

**Pros**:

- High-quality, reliable data
- Comprehensive market coverage
- Advanced analytics capabilities
- Professional-grade insights
- Competitive intelligence features

**Cons**:

- High subscription costs
- Complex integration requirements
- Longer implementation time
- Vendor dependency
- Complex data licensing

**Technical Requirements**:

- Premium API integrations
- Advanced data processing pipeline
- Complex data normalization and enrichment
- Sophisticated visualization components
- Real-time data streaming
- Compliance and licensing management

#### Option 3: Hybrid Market Research Ecosystem (RECOMMENDED)

**Approach**: Create a flexible market research platform that combines multiple data sources (free APIs, premium services, web scraping, and user-contributed data) with intelligent data aggregation and analysis capabilities.

**Pros**:

- Balanced cost and capability
- Multiple data source redundancy
- Flexible and scalable
- Custom competitive intelligence
- User-controlled data sources
- Extensible for future data providers

**Cons**:

- Complex data integration
- Multiple API management
- Data normalization challenges
- Higher initial development cost
- Ongoing maintenance complexity

**Technical Requirements**:

- Multi-source data aggregation pipeline
- Intelligent data normalization and deduplication
- Advanced market analytics engine
- Competitive intelligence gathering
- Custom visualization components
- Flexible data source management

### 1.3 Recommended Solution

**Selected Approach**: Option 3 - Hybrid Market Research Ecosystem

**Rationale**:

- Provides the best balance of cost, capability, and flexibility
- Allows users to choose data sources based on budget and needs
- Creates differentiated competitive intelligence capabilities
- Supports scalable growth and feature expansion
- Reduces vendor dependency through data source diversity

**Implementation Strategy**:

- Start with free data sources for core functionality
- Build flexible data integration framework
- Add premium data sources as optional modules
- Implement custom competitive intelligence gathering
- Create advanced analytics and visualization capabilities

## 2. Project Analysis & Current State

### 2.1 Current Application State

#### Existing Data Capabilities Analysis

```typescript
// Current portfolio and company data structure
interface PortfolioCompany {
  _id: Id<"portfolioCompanies">;
  companyName: string;
  industry: string;
  stage: string;
  investmentDate: number;
  investmentAmount: number;
  // ... existing portfolio data
}

interface Tier3Analytics {
  _id: Id<"tier3Analytics">;
  documentId: Id<"documents">;
  chunkId: Id<"enhancedHybridChunks">;
  marketIntelligence: string[];
  competitiveLandscape: string[];
  industryTrends: string[];
  // ... 100+ fields including some market data
}
```

#### Current Market Data Capabilities

- **Internal Analysis**: Portfolio performance and company analysis
- **Document Intelligence**: Some market insights extracted from uploaded documents
- **Basic Market Data**: Limited market information from document processing
- **No External APIs**: No integration with external market data providers
- **No Benchmarking**: No industry benchmarking capabilities
- **Limited Competitive Intelligence**: Basic competitor information from documents

#### Identified Gaps

- No real-time market data integration
- Missing industry benchmarking capabilities
- No competitive intelligence dashboard
- Limited market trend analysis
- No external data source integration
- Missing market research tools

### 2.2 Technical Requirements Analysis

#### Required Market Data Types

1. **Public Market Data**
   - Stock prices and market indices
   - Market sentiment and news
   - Economic indicators
   - Industry performance metrics
   - Market volatility and risk indicators

2. **Private Market Data**
   - Venture capital funding trends
   - M&A activity and valuations
   - Startup ecosystem metrics
   - Industry-specific private market data
   - Competitive funding landscapes

3. **Competitive Intelligence**
   - Competitor company tracking
   - Market share analysis
   - Product and service comparison
   - Partnership and acquisition activities
   - Talent and hiring patterns

4. **Industry Benchmarks**
   - Industry performance metrics
   - Growth rate benchmarks
   - Valuation multiples
   - Time to exit benchmarks
   - Success rate statistics

#### Required Technical Components

- **Data Integration Pipeline**: Multi-source data aggregation and normalization
- **Market Analytics Engine**: Advanced market data analysis and insight generation
- **Visualization Components**: Sophisticated market data visualization
- **Competitive Intelligence Tools**: Automated competitor tracking and analysis
- **Benchmarking System**: Industry benchmark comparison capabilities

### 2.3 Dependencies and Prerequisites

#### Existing Dependencies (from package.json)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "recharts": "^3.2.1",
    "convex": "^1.24.2",
    "lucide-react": "^0.544.0"
  }
}
```

#### Additional Dependencies Needed

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "react-window": "^1.8.8",
    "react-virtualized": "^9.22.5",
    "react-table": "^7.8.0",
    "react-select": "^5.7.7",
    "react-datepicker": "^4.21.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1"
  }
}
```

## 3. Technical Requirements & Specifications

### 3.1 Functional Requirements

#### Core Features

1. **Market Overview Dashboard**
   - Real-time market indices and performance
   - Sector and industry performance tracking
   - Market sentiment indicators
   - Economic calendar and events
   - Market news and analysis feed

2. **Competitive Intelligence**
   - Competitor company tracking and profiling
   - Market share analysis and visualization
   - Product and service comparison
   - Partnership and acquisition monitoring
   - Talent and competitive positioning analysis

3. **Industry Benchmarking**
   - Industry performance benchmarks
   - Growth rate comparisons
   - Valuation multiples analysis
   - Time to exit statistics
   - Success rate metrics by industry/stage

4. **Market Research Tools**
   - Advanced market search and filtering
   - Custom market report generation
   - Trend analysis and forecasting
   - Market opportunity assessment
   - Risk analysis and scenario planning

5. **Data Source Management**
   - Multiple data source integration
   - Data quality assessment and validation
   - Custom data source configuration
   - API usage monitoring and management
   - Data licensing and compliance tracking

#### Advanced Features

1. **AI-Powered Insights**
   - Automated market insight generation
   - Trend prediction and forecasting
   - Anomaly detection and alerts
   - Investment opportunity identification
   - Risk assessment and early warnings

2. **Collaborative Research**
   - Shared market research workspaces
   - Collaborative analysis and annotation
   - Insight sharing and discussion
   - Team research tracking
   - Knowledge base integration

3. **Custom Analytics**
   - Custom market metric creation
   - Personalized dashboard configuration
   - Advanced filtering and segmentation
   - Custom report templates
   - API access for custom integrations

### 3.2 Data Model Requirements

#### Market Data Schema Extensions

```typescript
// Market data sources configuration
interface MarketDataSources {
  _id: Id<"marketDataSources">;
  name: string;
  type: "api" | "scraper" | "upload" | "integration";
  provider: string;
  status: "active" | "inactive" | "error";
  configuration: Record<string, any>;
  apiKey?: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  lastSync: number;
  dataQuality: {
    accuracy: number;
    completeness: number;
    timeliness: number;
  };
  createdAt: number;
  updatedAt: number;
}

// Market data storage
interface MarketData {
  _id: Id<"marketData">;
  sourceId: Id<"marketDataSources">;
  dataType: "price" | "volume" | "sentiment" | "news" | "economic" | "funding";
  ticker?: string;
  company?: string;
  industry?: string;
  timestamp: number;
  data: Record<string, any>;
  confidence: number;
  processedAt: number;
}

// Competitive intelligence data
interface CompetitiveIntelligence {
  _id: Id<"competitiveIntelligence">;
  companyId: Id<"portfolioCompanies">;
  competitorId: string;
  competitorName: string;
  dataType: "funding" | "product" | "partnership" | "hiring" | "acquisition";
  data: Record<string, any>;
  source: string;
  confidence: number;
  impact: "low" | "medium" | "high";
  discoveredAt: number;
  verifiedAt?: number;
}

// Industry benchmarks
interface IndustryBenchmarks {
  _id: Id<"industryBenchmarks">;
  industry: string;
  stage?: string;
  region?: string;
  metric: string;
  value: number;
  unit: string;
  percentile: number;
  sampleSize: number;
  dataSource: string;
  period: string;
  createdAt: number;
}

// Market insights and analysis
interface MarketInsights {
  _id: Id<"marketInsights">;
  type: "trend" | "opportunity" | "risk" | "benchmark" | "competitive";
  title: string;
  description: string;
  data: Record<string, any>;
  confidence: number;
  priority: "low" | "medium" | "high";
  tags: string[];
  relevantCompanies: Id<"portfolioCompanies">[];
  industries: string[];
  validUntil: number;
  createdAt: number;
}

// Market research queries and alerts
interface MarketResearchQueries {
  _id: Id<"marketResearchQueries">;
  userId: Id<"users">;
  name: string;
  query: Record<string, any>;
  filters: Record<string, any>;
  schedule?: string;
  isActive: boolean;
  lastRun?: number;
  nextRun?: number;
  results?: any[];
  createdAt: number;
  updatedAt: number;
}
```

#### Data Integration Patterns

```typescript
// Market data aggregator
export class MarketDataAggregator {
  async aggregateData(params: {
    dataTypes: string[];
    sources?: string[];
    dateRange: { start: number; end: number };
    filters?: Record<string, any>;
  }): Promise<AggregatedMarketData> {
    // Aggregate data from multiple sources
    // Normalize and deduplicate
    // Apply quality scoring
    // Return unified dataset
  }

  async enrichData(data: MarketData): Promise<EnrichedMarketData> {
    // Add derived metrics
    // Calculate benchmarks
    // Add sentiment analysis
    // Generate insights
  }
}

// Competitive intelligence engine
export class CompetitiveIntelligenceEngine {
  async trackCompetitors(params: {
    portfolioCompany: string;
    competitorList: string[];
    dataTypes: string[];
  }): Promise<CompetitiveUpdate[]> {
    // Monitor competitor activities
    // Analyze competitive moves
    // Generate intelligence reports
  }

  async analyzeMarketShare(params: {
    industry: string;
    companies: string[];
    timeframe: string;
  }): Promise<MarketShareAnalysis> {
    // Calculate market share
    // Analyze trends
    // Identify opportunities
  }
}
```

### 3.3 API Specifications

#### Required Convex Functions

```typescript
// Market data management
export const getMarketData = query({
  args: {
    dataTypes: v.optional(v.array(v.string())),
    tickers: v.optional(v.array(v.string())),
    industries: v.optional(v.array(v.string())),
    dateRange: v.optional(
      v.object({
        start: v.number(),
        end: v.number(),
      })
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Retrieve market data with filters
    // Apply data quality scoring
    // Return normalized market data
  },
});

export const getMarketOverview = query({
  args: {
    timeframe: v.optional(v.string()),
    industries: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Generate market overview summary
    // Include key indices, sectors, sentiment
    // Return dashboard-ready data
  },
});

export const getCompetitiveIntelligence = query({
  args: {
    companyId: v.optional(v.id("portfolioCompanies")),
    industry: v.optional(v.string()),
    dataTypes: v.optional(v.array(v.string())),
    dateRange: v.optional(
      v.object({
        start: v.number(),
        end: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Retrieve competitive intelligence data
    // Filter by company, industry, data types
    // Return competitive insights
  },
});

export const getIndustryBenchmarks = query({
  args: {
    industry: v.string(),
    metrics: v.array(v.string()),
    stage: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Retrieve industry benchmark data
    // Calculate comparative metrics
    // Return benchmark analysis
  },
});

// Market research and analysis
export const searchMarketData = query({
  args: {
    query: v.string(),
    dataTypes: v.optional(v.array(v.string())),
    filters: v.optional(v.record(v.string(), v.any())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Search across market data sources
    // Apply relevance scoring
    // Return ranked results
  },
});

export const generateMarketReport = mutation({
  args: {
    reportType: v.string(),
    parameters: v.record(v.string(), v.any()),
    format: v.optional(
      v.union(v.literal("pdf"), v.literal("json"), v.literal("csv"))
    ),
  },
  handler: async (ctx, args) => {
    // Generate custom market report
    // Aggregate data from multiple sources
    // Create report in requested format
  },
});

export const createMarketResearchQuery = mutation({
  args: {
    name: v.string(),
    query: v.record(v.string(), v.any()),
    filters: v.optional(v.record(v.string(), v.any())),
    schedule: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create saved market research query
    // Set up schedule if provided
    // Return query ID for management
  },
});

// Data source management
export const getMarketDataSources = query({
  args: {
    type: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Retrieve configured data sources
    // Include status and quality metrics
    // Return source management data
  },
});

export const addMarketDataSource = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    provider: v.string(),
    configuration: v.record(v.string(), v.any()),
    apiKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Add new market data source
    // Validate configuration
    // Test connection
    // Return source ID
  },
});

// Market insights and alerts
export const getMarketInsights = query({
  args: {
    types: v.optional(v.array(v.string())),
    industries: v.optional(v.array(v.string())),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Retrieve generated market insights
    // Filter by type, industry, priority
    // Return actionable insights
  },
});

export const generateMarketInsights = action({
  args: {
    dataTypes: v.array(v.string()),
    timeframe: v.string(),
    industries: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Analyze market data trends
    // Generate AI-powered insights
    // Identify opportunities and risks
    // Store insights for retrieval
  },
});
```

## 4. Implementation Plan

### 4.1 Phase 1: Core Market Data Infrastructure (Week 1-3)

#### 4.1.1 File Structure Setup

```
src/
├── components/
│   ├── market/
│   │   ├── MarketOverview.tsx
│   │   ├── MarketIndices.tsx
│   │   ├── SectorPerformance.tsx
│   │   ├── MarketNews.tsx
│   │   └── EconomicCalendar.tsx
│   ├── competitive/
│   │   ├── CompetitorTracking.tsx
│   │   ├── MarketShareAnalysis.tsx
│   │   ├── CompetitorProfiles.tsx
│   │   └── CompetitiveAlerts.tsx
│   ├── benchmarks/
│   │   ├── IndustryBenchmarks.tsx
│   │   ├── BenchmarkComparison.tsx
│   │   ├── ValuationMultiples.tsx
│   │   └── SuccessMetrics.tsx
│   └── research/
│       ├── MarketSearch.tsx
│       ├── CustomReports.tsx
│       ├── TrendAnalysis.tsx
│       └── OpportunityAssessment.tsx
├── pages/
│   ├── MarketResearchPage.tsx
│   ├── CompetitiveIntelligencePage.tsx
│   └── BenchmarksPage.tsx
├── services/
│   ├── marketDataService.ts
│   ├── competitiveIntelligenceService.ts
│   ├── benchmarkService.ts
│   └── marketInsightsService.ts
├── hooks/
│   ├── useMarketData.ts
│   ├── useCompetitiveIntelligence.ts
│   ├── useBenchmarks.ts
│   └── useMarketInsights.ts
├── utils/
│   ├── marketDataUtils.ts
│   ├── chartUtils.ts
│   └── reportGenerators.ts
└── types/
    ├── market.ts
    ├── competitive.ts
    └── benchmarks.ts
```

#### 4.1.2 Market Data Service Implementation

```typescript
// src/services/marketDataService.ts
export class MarketDataService {
  private dataSources: Map<string, MarketDataSource> = new Map();
  private cache: Map<string, CachedData> = new Map();

  constructor() {
    this.initializeDataSources();
  }

  private async initializeDataSources() {
    // Initialize free data sources
    this.dataSources.set("alpha_vantage", new AlphaVantageDataSource());
    this.dataSources.set("yahoo_finance", new YahooFinanceDataSource());
    this.dataSources.set(
      "financial_modeling_prep",
      new FinancialModelingPrepDataSource()
    );

    // Initialize premium data sources if configured
    if (process.env.PITCHBOOK_API_KEY) {
      this.dataSources.set("pitchbook", new PitchbookDataSource());
    }
    if (process.env.CRUNCHBASE_API_KEY) {
      this.dataSources.set("crunchbase", new CrunchbaseDataSource());
    }
  }

  async getMarketData(params: MarketDataParams): Promise<MarketDataResponse> {
    const { dataTypes, tickers, dateRange, sources } = params;

    // Check cache first
    const cacheKey = this.generateCacheKey(params);
    const cached = this.cache.get(cacheKey);
    if (cached && !this.isCacheExpired(cached)) {
      return cached.data;
    }

    // Aggregate data from multiple sources
    const aggregatedData = await this.aggregateFromSources({
      dataTypes,
      tickers,
      dateRange,
      sources: sources || Array.from(this.dataSources.keys()),
    });

    // Normalize and validate data
    const normalizedData = this.normalizeData(aggregatedData);

    // Cache the result
    this.cache.set(cacheKey, {
      data: normalizedData,
      timestamp: Date.now(),
      ttl: this.getCacheTTL(dataTypes),
    });

    return normalizedData;
  }

  async getMarketOverview(
    params: MarketOverviewParams
  ): Promise<MarketOverview> {
    const { timeframe = "1M", industries } = params;

    // Get major market indices
    const indices = await this.getMarketIndices(timeframe);

    // Get sector performance
    const sectors = await this.getSectorPerformance(timeframe, industries);

    // Get market sentiment
    const sentiment = await this.getMarketSentiment(timeframe);

    // Get key economic indicators
    const economic = await this.getEconomicIndicators();

    // Get market news
    const news = await this.getMarketNews(timeframe);

    return {
      indices,
      sectors,
      sentiment,
      economic,
      news,
      lastUpdated: Date.now(),
    };
  }

  async searchMarketData(
    query: string,
    options: SearchOptions = {}
  ): Promise<MarketSearchResult[]> {
    const results: MarketSearchResult[] = [];

    // Search across different data types
    const searchPromises = [
      this.searchCompanies(query, options),
      this.searchMarketIndices(query, options),
      this.searchEconomicData(query, options),
      this.searchNews(query, options),
    ];

    const searchResults = await Promise.all(searchPromises);

    // Combine and rank results
    const allResults = searchResults.flat();
    const rankedResults = this.rankSearchResults(allResults, query);

    return rankedResults.slice(0, options.limit || 20);
  }

  private async aggregateFromSources(
    params: AggregationParams
  ): Promise<RawMarketData[]> {
    const { dataTypes, tickers, dateRange, sources } = params;
    const results: RawMarketData[] = [];

    for (const sourceName of sources) {
      const source = this.dataSources.get(sourceName);
      if (!source || !source.isAvailable()) continue;

      try {
        const sourceData = await source.fetchData({
          dataTypes,
          tickers,
          dateRange,
        });

        results.push(
          ...sourceData.map((data) => ({
            ...data,
            source: sourceName,
            quality: source.getDataQuality(),
          }))
        );
      } catch (error) {
        console.error(`Error fetching data from ${sourceName}:`, error);
        // Continue with other sources
      }
    }

    return results;
  }

  private normalizeData(rawData: RawMarketData[]): MarketDataResponse {
    // Group data by type and ticker
    const groupedData = this.groupDataByTypeAndTicker(rawData);

    // For each group, select the highest quality data
    const normalizedData: MarketDataResponse = {
      prices: {},
      volumes: {},
      sentiment: {},
      news: [],
      economic: {},
    };

    Object.entries(groupedData.prices).forEach(([ticker, dataPoints]) => {
      const bestData = this.selectBestQualityData(dataPoints);
      normalizedData.prices[ticker] = this.normalizePriceData(bestData);
    });

    // Similar normalization for other data types...

    return normalizedData;
  }

  private async getMarketIndices(timeframe: string): Promise<MarketIndex[]> {
    const indices = [
      { symbol: "SPY", name: "S&P 500" },
      { symbol: "QQQ", name: "NASDAQ" },
      { symbol: "DIA", name: "Dow Jones" },
      { symbol: "VTI", name: "Total Stock Market" },
    ];

    const indexData = await this.getMarketData({
      dataTypes: ["price"],
      tickers: indices.map((i) => i.symbol),
      dateRange: this.getDateRangeFromTimeframe(timeframe),
    });

    return indices.map((index) => ({
      ...index,
      data: indexData.prices[index.symbol],
      change: this.calculateChange(indexData.prices[index.symbol]),
      changePercent: this.calculateChangePercent(
        indexData.prices[index.symbol]
      ),
    }));
  }

  private async getSectorPerformance(
    timeframe: string,
    industries?: string[]
  ): Promise<SectorPerformance[]> {
    const sectors = [
      { name: "Technology", symbol: "XLK" },
      { name: "Healthcare", symbol: "XLV" },
      { name: "Financials", symbol: "XLF" },
      { name: "Consumer Discretionary", symbol: "XLY" },
      { name: "Energy", symbol: "XLE" },
    ];

    // Filter by user-specified industries if provided
    const filteredSectors = industries
      ? sectors.filter((s) =>
          industries.some((ind) =>
            s.name.toLowerCase().includes(ind.toLowerCase())
          )
        )
      : sectors;

    const sectorData = await this.getMarketData({
      dataTypes: ["price"],
      tickers: filteredSectors.map((s) => s.symbol),
      dateRange: this.getDateRangeFromTimeframe(timeframe),
    });

    return filteredSectors
      .map((sector) => ({
        ...sector,
        performance: this.calculatePerformance(
          sectorData.prices[sector.symbol]
        ),
        ranking: 0, // Will be calculated after all sectors are processed
      }))
      .sort((a, b) => b.performance - a.performance)
      .map((sector, index) => ({ ...sector, ranking: index + 1 }));
  }

  private selectBestQualityData(dataPoints: RawDataPoint[]): RawDataPoint {
    // Sort by quality score and return the best one
    return dataPoints.sort((a, b) => b.quality - a.quality)[0];
  }

  private calculateChange(priceData: PriceDataPoint[]): number {
    if (!priceData || priceData.length < 2) return 0;
    const latest = priceData[priceData.length - 1];
    const previous = priceData[priceData.length - 2];
    return latest.price - previous.price;
  }

  private calculateChangePercent(priceData: PriceDataPoint[]): number {
    if (!priceData || priceData.length < 2) return 0;
    const latest = priceData[priceData.length - 1];
    const previous = priceData[priceData.length - 2];
    return ((latest.price - previous.price) / previous.price) * 100;
  }

  private calculatePerformance(priceData: PriceDataPoint[]): number {
    if (!priceData || priceData.length < 2) return 0;
    const first = priceData[0];
    const last = priceData[priceData.length - 1];
    return ((last.price - first.price) / first.price) * 100;
  }
}

// Data source implementations
class AlphaVantageDataSource implements MarketDataSource {
  private apiKey: string;
  private baseUrl = "https://www.alphavantage.co/query";

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || "";
  }

  async fetchData(params: DataSourceParams): Promise<RawMarketData[]> {
    if (!this.apiKey) throw new Error("Alpha Vantage API key not configured");

    const results: RawMarketData[] = [];

    for (const ticker of params.tickers) {
      for (const dataType of params.dataTypes) {
        try {
          const data = await this.fetchTickerData(
            ticker,
            dataType,
            params.dateRange
          );
          results.push(...data);
        } catch (error) {
          console.error(`Error fetching ${dataType} for ${ticker}:`, error);
        }
      }
    }

    return results;
  }

  private async fetchTickerData(
    ticker: string,
    dataType: string,
    dateRange: { start: number; end: number }
  ): Promise<RawMarketData[]> {
    const functionMap = {
      price: "TIME_SERIES_DAILY",
      volume: "TIME_SERIES_DAILY",
      sentiment: "NEWS_SENTIMENT",
    };

    const functionType = functionMap[dataType as keyof typeof functionMap];
    if (!functionType) return [];

    const url = `${this.baseUrl}?function=${functionType}&symbol=${ticker}&apikey=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    return this.parseAlphaVantageResponse(data, dataType, ticker);
  }

  private parseAlphaVantageResponse(
    data: any,
    dataType: string,
    ticker: string
  ): RawMarketData[] {
    // Parse Alpha Vantage response format
    const results: RawMarketData[] = [];

    if (dataType === "price" && data["Time Series (Daily)"]) {
      const timeSeries = data["Time Series (Daily)"];
      Object.entries(timeSeries).forEach(([date, values]: [string, any]) => {
        results.push({
          ticker,
          dataType: "price",
          timestamp: new Date(date).getTime(),
          price: parseFloat(values["4. close"]),
          volume: parseFloat(values["5. volume"]),
          high: parseFloat(values["2. high"]),
          low: parseFloat(values["3. low"]),
          open: parseFloat(values["1. open"]),
        });
      });
    }

    return results;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getDataQuality(): number {
    return 0.8; // Alpha Vantage is generally reliable
  }
}
```

#### 4.1.3 Market Overview Component

```typescript
// src/components/market/MarketOverview.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, RefreshCw, Calendar } from "lucide-react";
import { MarketIndices } from "./MarketIndices";
import { SectorPerformance } from "./SectorPerformance";
import { MarketNews } from "./MarketNews";
import { useMarketData } from "@/hooks/useMarketData";

interface MarketOverviewProps {
  className?: string;
}

export function MarketOverview({ className }: MarketOverviewProps) {
  const [timeframe, setTimeframe] = useState('1M');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  const { data: marketData, loading, error, refetch } = useMarketData({
    timeframe,
    industries: selectedIndustries.length > 0 ? selectedIndustries : undefined
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  if (loading && !marketData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading market data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading market data</p>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Overview</h2>
          <p className="text-gray-600">
            Real-time market data and insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex gap-1">
            {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTimeframeChange(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Market Summary */}
      {marketData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market Sentiment</p>
                <p className="text-2xl font-bold">
                  {marketData.sentiment.overall > 0 ? 'Bullish' : 'Bearish'}
                </p>
              </div>
              <div className={`p-2 rounded-full ${
                marketData.sentiment.overall > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {marketData.sentiment.overall > 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-2">
              <Badge variant={marketData.sentiment.overall > 0 ? "default" : "destructive"}>
                {Math.abs(marketData.sentiment.overall).toFixed(1)}%
              </Badge>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sectors</p>
                <p className="text-2xl font-bold">
                  {marketData.sectors.filter(s => s.performance > 0).length}/{marketData.sectors.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Best: {marketData.sectors[0]?.name} (+{marketData.sectors[0]?.performance.toFixed(1)}%)
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market News</p>
                <p className="text-2xl font-bold">{marketData.news.length}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Last updated: {new Date(marketData.lastUpdated).toLocaleTimeString()}
            </div>
          </Card>
        </div>
      )}

      {/* Market Indices */}
      {marketData && (
        <MarketIndices
          indices={marketData.indices}
          timeframe={timeframe}
        />
      )}

      {/* Sector Performance */}
      {marketData && (
        <SectorPerformance
          sectors={marketData.sectors}
          onIndustrySelect={setSelectedIndustries}
          selectedIndustries={selectedIndustries}
        />
      )}

      {/* Market News */}
      {marketData && (
        <MarketNews
          news={marketData.news}
          maxItems={5}
        />
      )}
    </div>
  );
}

// src/components/market/MarketIndices.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketIndicesProps {
  indices: MarketIndex[];
  timeframe: string;
}

export function MarketIndices({ indices, timeframe }: MarketIndicesProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Market Indices</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <div key={index.symbol} className="p-4 border border-gray-200 ">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{index.name}</span>
              <Badge variant="outline">{index.symbol}</Badge>
            </div>

            <div className="text-2xl font-bold mb-1">
              ${index.data?.[index.data.length - 1]?.price.toFixed(2) || 'N/A'}
            </div>

            <div className={`flex items-center gap-1 ${
              index.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {index.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
              </span>
            </div>

            {/* Mini chart */}
            <div className="mt-3 h-12">
              <SimpleLineChart
                data={index.data || []}
                color={index.change >= 0 ? '#10b981' : '#ef4444'}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Simple line chart component for index mini-charts
function SimpleLineChart({ data, color }: { data: PriceDataPoint[], color: string }) {
  if (!data || data.length < 2) return null;

  const width = 100;
  const height = 48;
  const padding = 4;

  const minValue = Math.min(...data.map(d => d.price));
  const maxValue = Math.max(...data.map(d => d.price));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((point.price - minValue) / range) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}
```

### 4.2 Phase 2: Competitive Intelligence System (Week 4-6)

#### 4.2.1 Competitive Intelligence Service

```typescript
// src/services/competitiveIntelligenceService.ts
export class CompetitiveIntelligenceService {
  private dataSources: Map<string, CompetitiveDataSource> = new Map();

  constructor() {
    this.initializeDataSources();
  }

  private async initializeDataSources() {
    // Web scraping sources
    this.dataSources.set("crunchbase", new CrunchbaseDataSource());
    this.dataSources.set("techcrunch", new TechCrunchDataSource());
    this.dataSources.set("linkedin", new LinkedInDataSource());

    // API sources
    this.dataSources.set("pitchbook", new PitchbookDataSource());
    this.dataSources.set("cb_insights", new CBInsightsDataSource());
  }

  async trackCompetitors(
    params: CompetitorTrackingParams
  ): Promise<CompetitiveUpdate[]> {
    const { portfolioCompany, competitorList, dataTypes } = params;

    const updates: CompetitiveUpdate[] = [];

    for (const competitor of competitorList) {
      for (const dataType of dataTypes) {
        try {
          const competitorData = await this.gatherCompetitorData({
            competitor,
            dataType,
            portfolioCompany,
          });

          if (competitorData.length > 0) {
            updates.push(...competitorData);
          }
        } catch (error) {
          console.error(`Error tracking ${competitor} for ${dataType}:`, error);
        }
      }
    }

    // Analyze and rank updates by importance
    const rankedUpdates = this.rankCompetitiveUpdates(updates);

    return rankedUpdates;
  }

  async analyzeMarketShare(
    params: MarketShareAnalysisParams
  ): Promise<MarketShareAnalysis> {
    const { industry, companies, timeframe } = params;

    // Gather market size data
    const marketSize = await this.getMarketSize(industry, timeframe);

    // Gather company revenue/data
    const companyData = await this.getCompanyMetrics(companies, timeframe);

    // Calculate market shares
    const marketShares = this.calculateMarketShares(companyData, marketSize);

    // Analyze trends
    const trends = await this.analyzeMarketTrends(industry, timeframe);

    return {
      industry,
      timeframe,
      marketSize,
      marketShares,
      trends,
      insights: this.generateMarketShareInsights(marketShares, trends),
    };
  }

  async generateCompetitiveReport(
    params: CompetitiveReportParams
  ): Promise<CompetitiveReport> {
    const { portfolioCompany, competitors, reportType } = params;

    const reportData: CompetitiveReportData = {
      company: await this.getCompanyDetails(portfolioCompany),
      competitors: await Promise.all(
        competitors.map((comp) => this.getCompetitorDetails(comp))
      ),
      marketAnalysis: await this.analyzeMarketPosition(
        portfolioCompany,
        competitors
      ),
      recentDevelopments: await this.getRecentDevelopments(
        portfolioCompany,
        competitors
      ),
      strategicRecommendations: [],
    };

    // Generate strategic recommendations
    reportData.strategicRecommendations =
      this.generateStrategicRecommendations(reportData);

    return {
      id: `report-${Date.now()}`,
      type: reportType,
      generatedAt: Date.now(),
      data: reportData,
    };
  }

  private async gatherCompetitorData(
    params: CompetitorDataParams
  ): Promise<CompetitiveUpdate[]> {
    const { competitor, dataType, portfolioCompany } = params;

    const updates: CompetitiveUpdate[] = [];

    // Use multiple sources to gather data
    for (const [sourceName, source] of this.dataSources) {
      if (!source.isAvailable()) continue;

      try {
        const sourceData = await source.gatherCompetitorData({
          competitor,
          dataType,
          portfolioCompany,
        });

        updates.push(
          ...sourceData.map((data) => ({
            ...data,
            source: sourceName,
            discoveredAt: Date.now(),
          }))
        );
      } catch (error) {
        console.error(
          `Error gathering ${dataType} for ${competitor} from ${sourceName}:`,
          error
        );
      }
    }

    return this.deduplicateUpdates(updates);
  }

  private rankCompetitiveUpdates(
    updates: CompetitiveUpdate[]
  ): CompetitiveUpdate[] {
    return updates.sort((a, b) => {
      // Sort by impact, then by recency, then by confidence
      const impactScore = { high: 3, medium: 2, low: 1 };

      if (impactScore[b.impact] !== impactScore[a.impact]) {
        return impactScore[b.impact] - impactScore[a.impact];
      }

      if (b.discoveredAt !== a.discoveredAt) {
        return b.discoveredAt - a.discoveredAt;
      }

      return b.confidence - a.confidence;
    });
  }

  private generateStrategicRecommendations(
    data: CompetitiveReportData
  ): StrategicRecommendation[] {
    const recommendations: StrategicRecommendation[] = [];

    // Analyze competitive positioning
    const marketPosition = this.analyzeCompetitivePositioning(data);
    if (marketPosition.threats.length > 0) {
      recommendations.push({
        type: "threat_response",
        title: "Address Competitive Threats",
        description: `Key threats identified: ${marketPosition.threats.join(", ")}`,
        priority: "high",
        actionItems: [
          "Develop competitive response strategy",
          "Monitor competitor activities closely",
          "Consider strategic partnerships",
        ],
      });
    }

    // Analyze opportunities
    const opportunities = this.identifyOpportunities(data);
    if (opportunities.length > 0) {
      recommendations.push({
        type: "opportunity",
        title: "Exploit Market Opportunities",
        description: `Identified opportunities: ${opportunities.join(", ")}`,
        priority: "medium",
        actionItems: [
          "Evaluate resource requirements",
          "Assess market timing",
          "Develop go-to-market strategy",
        ],
      });
    }

    return recommendations;
  }
}

// Competitive data source implementations
class CrunchbaseDataSource implements CompetitiveDataSource {
  private apiKey: string;
  private baseUrl = "https://api.crunchbase.com/api/v4";

  constructor() {
    this.apiKey = process.env.CRUNCHBASE_API_KEY || "";
  }

  async gatherCompetitorData(
    params: CompetitorDataParams
  ): Promise<CompetitiveUpdate[]> {
    if (!this.apiKey) return [];

    const { competitor, dataType } = params;

    switch (dataType) {
      case "funding":
        return await this.getFundingData(competitor);
      case "acquisition":
        return await this.getAcquisitionData(competitor);
      case "hiring":
        return await this.getHiringData(competitor);
      default:
        return [];
    }
  }

  private async getFundingData(
    competitor: string
  ): Promise<CompetitiveUpdate[]> {
    // Implement Crunchbase funding data retrieval
    const updates: CompetitiveUpdate[] = [];

    try {
      // Search for company
      const searchResponse = await this.searchCompany(competitor);
      if (!searchResponse.entities.length) return updates;

      const company = searchResponse.entities[0];

      // Get funding rounds
      const fundingResponse = await this.getCompanyFunding(company.uuid);

      fundingResponse.items.forEach((round: any) => {
        updates.push({
          competitorId: company.uuid,
          competitorName: competitor,
          dataType: "funding",
          data: {
            roundType: round.money_raised_type,
            amount: round.money_raised,
            announcedOn: round.announced_on,
            investors: round.investors?.map((inv: any) => inv.name) || [],
          },
          source: "crunchbase",
          confidence: 0.9,
          impact: this.assessFundingImpact(round.money_raised),
        });
      });
    } catch (error) {
      console.error(`Error getting funding data for ${competitor}:`, error);
    }

    return updates;
  }

  private async searchCompany(name: string) {
    const url = `${this.baseUrl}/entities/organizations?query=${encodeURIComponent(name)}`;
    const response = await fetch(url, {
      headers: {
        "X-cb-user-key": this.apiKey,
      },
    });
    return await response.json();
  }

  private async getCompanyFunding(companyUuid: string) {
    const url = `${this.baseUrl}/entities/funding_rounds?organization_uuid=${companyUuid}`;
    const response = await fetch(url, {
      headers: {
        "X-cb-user-key": this.apiKey,
      },
    });
    return await response.json();
  }

  private assessFundingImpact(amount: number): "low" | "medium" | "high" {
    if (amount >= 100000000) return "high"; // $100M+
    if (amount >= 10000000) return "medium"; // $10M+
    return "low";
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}
```

#### 4.2.2 Competitive Intelligence Components

```typescript
// src/components/competitive/CompetitorTracking.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Users, DollarSign, Eye } from "lucide-react";
import { useCompetitiveIntelligence } from "@/hooks/useCompetitiveIntelligence";

interface CompetitorTrackingProps {
  portfolioCompanyId: string;
  className?: string;
}

export function CompetitorTracking({ portfolioCompanyId, className }: CompetitorTrackingProps) {
  const [selectedDataType, setSelectedDataType] = useState('all');
  const [timeframe, setTimeframe] = useState('1M');

  const { data: competitorData, loading, error, refetch } = useCompetitiveIntelligence({
    portfolioCompanyId,
    dataTypes: selectedDataType !== 'all' ? [selectedDataType] : undefined,
    timeframe
  });

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'funding': return <DollarSign className="w-4 h-4" />;
      case 'hiring': return <Users className="w-4 h-4" />;
      case 'acquisition': return <Target className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !competitorData) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Analyzing competitive landscape...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Competitive Intelligence</h3>

        <div className="flex items-center gap-3">
          {/* Data type filter */}
          <div className="flex gap-1">
            {['all', 'funding', 'hiring', 'acquisition', 'product'].map((type) => (
              <Button
                key={type}
                variant={selectedDataType === type ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDataType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Timeframe selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {competitorData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tracked Competitors</p>
                <p className="text-xl font-bold">{competitorData.competitors.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Recent Updates</p>
                <p className="text-xl font-bold">{competitorData.recentUpdates.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">High Impact</p>
                <p className="text-xl font-bold">
                  {competitorData.recentUpdates.filter(u => u.impact === 'high').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Coverage</p>
                <p className="text-xl font-bold">{competitorData.coveragePercentage}%</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Updates */}
      {competitorData && competitorData.recentUpdates.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Recent Competitive Activity</h4>

          <div className="space-y-4">
            {competitorData.recentUpdates.slice(0, 10).map((update, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 ">
                <div className="flex-shrink-0">
                  {getDataTypeIcon(update.dataType)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{update.competitorName}</span>
                    <Badge variant="outline" className="capitalize">
                      {update.dataType}
                    </Badge>
                    <Badge className={getImpactColor(update.impact)}>
                      {update.impact} impact
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">
                    {this.formatUpdateDescription(update)}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Source: {update.source}</span>
                    <span>Confidence: {Math.round(update.confidence * 100)}%</span>
                    <span>{new Date(update.discoveredAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {competitorData.recentUpdates.length > 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline">
                View All Updates ({competitorData.recentUpdates.length})
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Competitor List */}
      {competitorData && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Tracked Competitors</h4>

          <div className="space-y-3">
            {competitorData.competitors.map((competitor) => (
              <div key={competitor.id} className="flex items-center justify-between p-3 border border-gray-200 ">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {competitor.name.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-medium">{competitor.name}</h5>
                    <p className="text-sm text-gray-600">{competitor.industry}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">
                    {competitor.recentUpdates.length} updates
                  </div>
                  <div className="text-xs text-gray-500">
                    Last seen: {new Date(competitor.lastUpdate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  private formatUpdateDescription(update: CompetitiveUpdate): string {
    switch (update.dataType) {
      case 'funding':
        const funding = update.data as any;
        return `Raised ${this.formatCurrency(funding.amount)} in ${funding.roundType} funding`;

      case 'hiring':
        const hiring = update.data as any;
        return `Hiring {hiring.positions?.length || 0} positions in {hiring.department || 'multiple departments'}`;

      case 'acquisition':
        const acquisition = update.data as any;
        return `Acquired ${acquisition.targetCompany} for ${this.formatCurrency(acquisition.amount)}`;

      default:
        return 'Competitive activity detected';
    }
  }

  private formatCurrency(amount: number): string {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  }
}
```

### 4.3 Phase 3: Industry Benchmarking System (Week 7-9)

#### 4.3.1 Benchmark Service Implementation

```typescript
// src/services/benchmarkService.ts
export class BenchmarkService {
  private benchmarkData: Map<string, IndustryBenchmark[]> = new Map();

  constructor() {
    this.initializeBenchmarkData();
  }

  private async initializeBenchmarkData() {
    // Load benchmark data from various sources
    await this.loadVCBenchmarks();
    await this.loadIndustryReports();
    await this.loadPublicCompanyComparables();
    await this.loadExitData();
  }

  async getIndustryBenchmarks(
    params: BenchmarkParams
  ): Promise<BenchmarkResults> {
    const { industry, stage, region, metrics } = params;

    const relevantBenchmarks = this.findRelevantBenchmarks({
      industry,
      stage,
      region,
    });

    const results: BenchmarkResults = {
      industry,
      stage,
      region,
      benchmarks: {},
      comparisons: {},
      insights: [],
    };

    for (const metric of metrics) {
      const benchmarkData = this.calculateMetricBenchmark(
        metric,
        relevantBenchmarks
      );
      results.benchmarks[metric] = benchmarkData;

      // Generate comparisons if portfolio data is provided
      if (params.portfolioData) {
        const comparison = this.generateComparison(
          metric,
          benchmarkData,
          params.portfolioData
        );
        results.comparisons[metric] = comparison;
      }
    }

    // Generate insights
    results.insights = this.generateBenchmarkInsights(results);

    return results;
  }

  async getValuationMultiples(
    params: ValuationMultiplesParams
  ): Promise<ValuationMultiplesResult> {
    const { industry, stage, revenueRange, timeframe } = params;

    // Get comparable companies and transactions
    const comparables = await this.getValuationComparables({
      industry,
      stage,
      revenueRange,
      timeframe,
    });

    // Calculate valuation multiples
    const multiples = this.calculateValuationMultiples(comparables);

    // Generate valuation ranges
    const valuationRanges = this.generateValuationRanges(multiples);

    return {
      industry,
      stage,
      revenueRange,
      timeframe,
      multiples,
      valuationRanges,
      comparables: comparables.slice(0, 10), // Top 10 comparables
      insights: this.generateValuationInsights(multiples, valuationRanges),
    };
  }

  async getSuccessMetrics(
    params: SuccessMetricsParams
  ): Promise<SuccessMetricsResult> {
    const { industry, stage, timeframe } = params;

    // Get success data for the industry
    const successData = await this.getIndustrySuccessData(
      industry,
      stage,
      timeframe
    );

    // Calculate success metrics
    const metrics = {
      exitRate: this.calculateExitRate(successData),
      averageTimeToExit: this.calculateAverageTimeToExit(successData),
      averageMultiple: this.calculateAverageExitMultiple(successData),
      successByStage: this.calculateSuccessByStage(successData),
      topPerformers: this.getTopPerformers(successData),
    };

    return {
      industry,
      stage,
      timeframe,
      sampleSize: successData.length,
      metrics,
      insights: this.generateSuccessInsights(metrics),
    };
  }

  private findRelevantBenchmarks(
    criteria: BenchmarkCriteria
  ): IndustryBenchmark[] {
    const benchmarks: IndustryBenchmark[] = [];

    // Search across all benchmark data sources
    for (const [source, data] of this.benchmarkData) {
      const matching = data.filter((benchmark) => {
        if (criteria.industry && benchmark.industry !== criteria.industry)
          return false;
        if (criteria.stage && benchmark.stage !== criteria.stage) return false;
        if (criteria.region && benchmark.region !== criteria.region)
          return false;
        return true;
      });

      benchmarks.push(...matching);
    }

    // Sort by relevance and recency
    return benchmarks.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, criteria);
      const bScore = this.calculateRelevanceScore(b, criteria);
      return bScore - aScore;
    });
  }

  private calculateMetricBenchmark(
    metric: string,
    benchmarks: IndustryBenchmark[]
  ): MetricBenchmark {
    const metricData = benchmarks
      .filter((b) => b.metric === metric)
      .map((b) => b.value);

    if (metricData.length === 0) {
      return {
        metric,
        value: 0,
        percentile: 50,
        sampleSize: 0,
        reliability: 0,
      };
    }

    // Calculate statistics
    const sorted = metricData.sort((a, b) => a - b);
    const mean =
      metricData.reduce((sum, val) => sum + val, 0) / metricData.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const stdDev = Math.sqrt(
      metricData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        metricData.length
    );

    return {
      metric,
      value: median,
      percentile: 50, // This would be calculated based on portfolio data
      sampleSize: metricData.length,
      reliability: Math.min(metricData.length / 30, 1), // Reliability based on sample size
      distribution: {
        mean,
        median,
        stdDev,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p25: sorted[Math.floor(sorted.length * 0.25)],
        p75: sorted[Math.floor(sorted.length * 0.75)],
      },
    };
  }

  private generateComparison(
    metric: string,
    benchmark: MetricBenchmark,
    portfolioData: any
  ): BenchmarkComparison {
    const portfolioValue = this.extractPortfolioMetric(metric, portfolioData);

    if (!portfolioValue) {
      return {
        metric,
        portfolioValue: 0,
        benchmarkValue: benchmark.value,
        percentile: 50,
        performance: "neutral",
        insight: "Insufficient data for comparison",
      };
    }

    // Calculate percentile
    const percentile = this.calculatePercentile(
      portfolioValue,
      benchmark.distribution!
    );

    // Determine performance
    let performance: "outperforming" | "underperforming" | "neutral";
    if (percentile >= 75) performance = "outperforming";
    else if (percentile <= 25) performance = "underperforming";
    else performance = "neutral";

    // Generate insight
    const insight = this.generateComparisonInsight(
      metric,
      portfolioValue,
      benchmark,
      percentile
    );

    return {
      metric,
      portfolioValue,
      benchmarkValue: benchmark.value,
      percentile,
      performance,
      insight,
    };
  }

  private async loadVCBenchmarks() {
    // Load VC industry benchmarks from various sources
    // This would include data from:
    // - NVCA Yearbook
    // - PitchBook Benchmarks
    // - CB Insights
    // - Industry reports

    const vcBenchmarks: IndustryBenchmark[] = [
      {
        industry: "Technology",
        stage: "Series A",
        metric: "median_pre_money_valuation",
        value: 15000000,
        unit: "USD",
        percentile: 50,
        sampleSize: 245,
        dataSource: "PitchBook",
        period: "2023",
        region: "North America",
      },
      {
        industry: "Technology",
        stage: "Series A",
        metric: "median_post_money_valuation",
        value: 20000000,
        unit: "USD",
        percentile: 50,
        sampleSize: 245,
        dataSource: "PitchBook",
        period: "2023",
        region: "North America",
      },
      // Add more benchmark data...
    ];

    this.benchmarkData.set("vc_benchmarks", vcBenchmarks);
  }

  private calculatePercentile(
    value: number,
    distribution: MetricDistribution
  ): number {
    // Calculate percentile using normal distribution approximation
    const z = (value - distribution.mean) / distribution.stdDev;

    // Use error function to get percentile
    const percentile = 0.5 * (1 + this.erf(z / Math.sqrt(2)));

    return Math.round(percentile * 100);
  }

  private erf(x: number): number {
    // Error function approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y =
      1.0 -
      ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}

// Benchmark data types
interface IndustryBenchmark {
  industry: string;
  stage?: string;
  region?: string;
  metric: string;
  value: number;
  unit: string;
  percentile: number;
  sampleSize: number;
  dataSource: string;
  period: string;
}

interface MetricBenchmark {
  metric: string;
  value: number;
  percentile: number;
  sampleSize: number;
  reliability: number;
  distribution?: {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    p25: number;
    p75: number;
  };
}

interface BenchmarkComparison {
  metric: string;
  portfolioValue: number;
  benchmarkValue: number;
  percentile: number;
  performance: "outperforming" | "underperforming" | "neutral";
  insight: string;
}
```

### 4.4 Phase 4: Advanced Analytics and Reporting (Week 10-12)

#### 4.4.1 Market Research Dashboard

```typescript
// src/pages/MarketResearchPage.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketOverview } from "@/components/market/MarketOverview";
import { CompetitorTracking } from "@/components/competitive/CompetitorTracking";
import { IndustryBenchmarks } from "@/components/benchmarks/IndustryBenchmarks";
import { MarketSearch } from "@/components/research/MarketSearch";
import { CustomReports } from "@/components/research/CustomReports";

export function MarketResearchPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Market Research</h1>
        <p className="text-gray-600">
          Comprehensive market intelligence and competitive analysis
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Intel</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="research">Research Tools</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <MarketOverview />
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <CompetitorTracking portfolioCompanyId="example-company-id" />
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <IndustryBenchmarks />
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <MarketSearch />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <CustomReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## 5. Code Change Overview

### 5.1 New Files to Create

#### Market Components

```typescript
// src/components/market/MarketOverview.tsx
export function MarketOverview({ className }: MarketOverviewProps) {
  // Main market overview dashboard from Phase 1.1.3
}

// src/components/market/MarketIndices.tsx
export function MarketIndices({ indices, timeframe }: MarketIndicesProps) {
  // Market indices display component
}

// src/components/market/SectorPerformance.tsx
export function SectorPerformance({
  sectors,
  onIndustrySelect,
}: SectorPerformanceProps) {
  // Sector performance analysis component
}

// src/components/market/MarketNews.tsx
export function MarketNews({ news, maxItems }: MarketNewsProps) {
  // Market news feed component
}

// src/components/market/EconomicCalendar.tsx
export function EconomicCalendar({ events }: EconomicCalendarProps) {
  // Economic calendar and events component
}
```

#### Competitive Intelligence Components

```typescript
// src/components/competitive/CompetitorTracking.tsx
export function CompetitorTracking({
  portfolioCompanyId,
}: CompetitorTrackingProps) {
  // Main competitor tracking dashboard from Phase 2.2.2
}

// src/components/competitive/MarketShareAnalysis.tsx
export function MarketShareAnalysis({ analysis }: MarketShareAnalysisProps) {
  // Market share analysis visualization
}

// src/components/competitive/CompetitorProfiles.tsx
export function CompetitorProfiles({ competitors }: CompetitorProfilesProps) {
  // Detailed competitor profile components
}

// src/components/competitive/CompetitiveAlerts.tsx
export function CompetitiveAlerts({ alerts }: CompetitiveAlertsProps) {
  // Competitive alerts and notifications
}
```

#### Benchmark Components

```typescript
// src/components/benchmarks/IndustryBenchmarks.tsx
export function IndustryBenchmarks({ className }: IndustryBenchmarksProps) {
  // Industry benchmarks dashboard
}

// src/components/benchmarks/BenchmarkComparison.tsx
export function BenchmarkComparison({ comparison }: BenchmarkComparisonProps) {
  // Benchmark comparison visualization
}

// src/components/benchmarks/ValuationMultiples.tsx
export function ValuationMultiples({ multiples }: ValuationMultiplesProps) {
  // Valuation multiples analysis
}

// src/components/benchmarks/SuccessMetrics.tsx
export function SuccessMetrics({ metrics }: SuccessMetricsProps) {
  // Success metrics and analysis
}
```

#### Research Tools Components

```typescript
// src/components/research/MarketSearch.tsx
export function MarketSearch({ className }: MarketSearchProps) {
  // Advanced market search interface
}

// src/components/research/CustomReports.tsx
export function CustomReports({ className }: CustomReportsProps) {
  // Custom report generation interface
}

// src/components/research/TrendAnalysis.tsx
export function TrendAnalysis({ trends }: TrendAnalysisProps) {
  // Market trend analysis visualization
}

// src/components/research/OpportunityAssessment.tsx
export function OpportunityAssessment({
  opportunities,
}: OpportunityAssessmentProps) {
  // Market opportunity assessment tools
}
```

#### Services

```typescript
// src/services/marketDataService.ts
export class MarketDataService {
  // Main market data service from Phase 1.2.1
}

// src/services/competitiveIntelligenceService.ts
export class CompetitiveIntelligenceService {
  // Competitive intelligence service from Phase 2.2.1
}

// src/services/benchmarkService.ts
export class BenchmarkService {
  // Benchmark service from Phase 3.3.1
}

// src/services/marketInsightsService.ts
export class MarketInsightsService {
  // AI-powered market insights generation
}
```

#### Hooks

```typescript
// src/hooks/useMarketData.ts
export function useMarketData(params: MarketDataParams) {
  // Market data management hook
}

// src/hooks/useCompetitiveIntelligence.ts
export function useCompetitiveIntelligence(
  params: CompetitiveIntelligenceParams
) {
  // Competitive intelligence data hook
}

// src/hooks/useBenchmarks.ts
export function useBenchmarks(params: BenchmarkParams) {
  // Industry benchmarks data hook
}

// src/hooks/useMarketInsights.ts
export function useMarketInsights(params: MarketInsightsParams) {
  // Market insights management hook
}
```

#### Type Definitions

```typescript
// src/types/market.ts
export interface MarketDataResponse {
  prices: Record<string, PriceDataPoint[]>;
  volumes: Record<string, VolumeDataPoint[]>;
  sentiment: MarketSentiment;
  news: MarketNews[];
  economic: EconomicIndicator[];
}

// src/types/competitive.ts
export interface CompetitiveUpdate {
  competitorId: string;
  competitorName: string;
  dataType: string;
  data: any;
  source: string;
  confidence: number;
  impact: "low" | "medium" | "high";
  discoveredAt: number;
}

// src/types/benchmarks.ts
export interface BenchmarkResults {
  industry: string;
  stage?: string;
  region?: string;
  benchmarks: Record<string, MetricBenchmark>;
  comparisons: Record<string, BenchmarkComparison>;
  insights: BenchmarkInsight[];
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
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
  <Route path="/network" element={<NetworkIntelligencePage />} />
  <Route path="/chat" element={<ChatPage />} />
</Routes>

// AFTER:
<Routes>
  <Route path="/" element={<OverviewPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentManagement />} />
  <Route path="/fund/:fundId" element={<FundDashboard />} />
  <Route path="/company/:companyId" element={<CompanyProfilePage />} />
  <Route path="/companies" element={<CompanyListPage />} />
  <Route path="/network" element={<NetworkIntelligencePage />} />
  <Route path="/chat" element={<ChatPage />} />
  <Route path="/market-research" element={<MarketResearchPage />} />
  <Route path="/competitive-intel" element={<CompetitiveIntelligencePage />} />
  <Route path="/benchmarks" element={<BenchmarksPage />} />
</Routes>
```

#### Navigation Updates

```typescript
// src/components/Navigation.tsx (existing file)
// Add new navigation items:
const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Companies", href: "/companies" },
  { name: "Network", href: "/network" },
  { name: "Market Research", href: "/market-research" },
  { name: "AI Assistant", href: "/chat" },
  { name: "Documents", href: "/documents" },
  { name: "Analytics", href: "/analytics" },
];
```

#### Package Dependencies Update

```json
// package.json (add to dependencies)
{
  "dependencies": {
    // ... existing dependencies
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "react-window": "^1.8.8",
    "react-virtualized": "^9.22.5",
    "react-table": "^7.8.0",
    "react-select": "^5.7.7",
    "react-datepicker": "^4.21.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1"
  }
}
```

### 5.3 Backend Functions to Add

#### Convex Query Functions

```typescript
// convex/queries.ts (add to existing file)
export const getMarketData = query({
  args: {
    dataTypes: v.optional(v.array(v.string())),
    tickers: v.optional(v.array(v.string())),
    industries: v.optional(v.array(v.string())),
    dateRange: v.optional(
      v.object({
        start: v.number(),
        end: v.number(),
      })
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Retrieve market data with caching
    // Apply data quality scoring
    // Return normalized market data
  },
});

export const getMarketOverview = query({
  args: {
    timeframe: v.optional(v.string()),
    industries: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Generate comprehensive market overview
    // Include indices, sectors, sentiment, news
    // Return dashboard-ready data
  },
});

export const getCompetitiveIntelligence = query({
  args: {
    companyId: v.optional(v.id("portfolioCompanies")),
    industry: v.optional(v.string()),
    dataTypes: v.optional(v.array(v.string())),
    dateRange: v.optional(
      v.object({
        start: v.number(),
        end: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Retrieve competitive intelligence data
    // Filter by company, industry, data types
    // Return competitive insights and updates
  },
});

export const getIndustryBenchmarks = query({
  args: {
    industry: v.string(),
    metrics: v.array(v.string()),
    stage: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Retrieve industry benchmark data
    // Calculate comparative metrics
    // Return benchmark analysis with percentiles
  },
});

export const searchMarketData = query({
  args: {
    query: v.string(),
    dataTypes: v.optional(v.array(v.string())),
    filters: v.optional(v.record(v.string(), v.any())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Search across market data sources
    // Apply relevance scoring and ranking
    // Return comprehensive search results
  },
});
```

#### Convex Mutation Functions

```typescript
// convex/mutations.ts (add to existing file)
export const addMarketDataSource = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    provider: v.string(),
    configuration: v.record(v.string(), v.any()),
    apiKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Add new market data source configuration
    // Validate connection and API access
    // Return source ID for management
  },
});

export const updateMarketDataSource = mutation({
  args: {
    sourceId: v.id("marketDataSources"),
    updates: v.object({
      name: v.optional(v.string()),
      configuration: v.optional(v.record(v.string(), v.any())),
      status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    }),
  },
  handler: async (ctx, args) => {
    // Update market data source configuration
    // Test connection if reactivating
    // Return updated configuration
  },
});

export const createMarketResearchQuery = mutation({
  args: {
    name: v.string(),
    query: v.record(v.string(), v.any()),
    filters: v.optional(v.record(v.string(), v.any())),
    schedule: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create saved market research query
    // Set up automated execution schedule
    // Return query ID for management and tracking
  },
});

export const saveMarketInsight = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.string(),
    data: v.optional(v.any()),
    tags: v.optional(v.array(v.string())),
    relevantCompanies: v.optional(v.array(v.id("portfolioCompanies"))),
  },
  handler: async (ctx, args) => {
    // Save AI-generated market insight
    // Tag with relevant companies and industries
    // Return insight ID for reference
  },
});
```

#### Convex Actions

```typescript
// convex/actions.ts (add to existing file)
export const syncMarketData = action({
  args: {
    sources: v.optional(v.array(v.string())),
    dataTypes: v.array(v.string()),
    forceRefresh: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Sync market data from external sources
    // Update cache with fresh data
    // Handle API rate limits and errors
  },
});

export const generateMarketReport = action({
  args: {
    reportType: v.string(),
    parameters: v.record(v.string(), v.any()),
    format: v.optional(
      v.union(v.literal("pdf"), v.literal("json"), v.literal("csv"))
    ),
  },
  handler: async (ctx, args) => {
    // Generate comprehensive market report
    // Aggregate data from multiple sources
    // Create report in requested format
  },
});

export const analyzeMarketTrends = action({
  args: {
    industries: v.array(v.string()),
    timeframe: v.string(),
    metrics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Analyze market trends using AI
    // Identify patterns and anomalies
    // Generate trend insights and forecasts
  },
});
```

### 5.4 Schema Extensions

#### Market Data Tables

```typescript
// convex/schema.ts (add to existing schema)
// Market data sources configuration
marketDataSources: defineTable({
  name: v.string(),
  type: v.union(v.literal("api"), v.literal("scraper"), v.literal("upload"), v.literal("integration")),
  provider: v.string(),
  status: v.union(v.literal("active"), v.literal("inactive"), v.literal("error")),
  configuration: v.record(v.string(), v.any()),
  apiKey: v.optional(v.string()),
  rateLimits: v.object({
    requestsPerMinute: v.number(),
    requestsPerDay: v.number()
  }),
  lastSync: v.number(),
  dataQuality: v.object({
    accuracy: v.number(),
    completeness: v.number(),
    timeliness: v.number()
  }),
  createdAt: v.number(),
  updatedAt: v.number()
})
  .index("by_status", ["status"])
  .index("by_type", ["type"])
  .index("by_lastSync", ["lastSync"]),

// Market data storage
marketData: defineTable({
  sourceId: v.id("marketDataSources"),
  dataType: v.union(
    v.literal("price"),
    v.literal("volume"),
    v.literal("sentiment"),
    v.literal("news"),
    v.literal("economic"),
    v.literal("funding")
  ),
  ticker: v.optional(v.string()),
  company: v.optional(v.string()),
  industry: v.optional(v.string()),
  timestamp: v.number(),
  data: v.record(v.string(), v.any()),
  confidence: v.number(),
  processedAt: v.number()
})
  .index("by_source_type", ["sourceId", "dataType"])
  .index("by_ticker", ["ticker"])
  .index("by_timestamp", ["timestamp"])
  .index("by_industry", ["industry"]),

// Competitive intelligence data
competitiveIntelligence: defineTable({
  companyId: v.id("portfolioCompanies"),
  competitorId: v.string(),
  competitorName: v.string(),
  dataType: v.union(
    v.literal("funding"),
    v.literal("product"),
    v.literal("partnership"),
    v.literal("hiring"),
    v.literal("acquisition")
  ),
  data: v.record(v.string(), v.any()),
  source: v.string(),
  confidence: v.number(),
  impact: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  discoveredAt: v.number(),
  verifiedAt: v.optional(v.number())
})
  .index("by_company", ["companyId"])
  .index("by_competitor", ["competitorId"])
  .index("by_dataType", ["dataType"])
  .index("by_impact", ["impact"])
  .index("by_discoveredAt", ["discoveredAt"]),

// Industry benchmarks
industryBenchmarks: defineTable({
  industry: v.string(),
  stage: v.optional(v.string()),
  region: v.optional(v.string()),
  metric: v.string(),
  value: v.number(),
  unit: v.string(),
  percentile: v.number(),
  sampleSize: v.number(),
  dataSource: v.string(),
  period: v.string(),
  createdAt: v.number()
})
  .index("by_industry", ["industry"])
  .index("by_industry_stage", ["industry", "stage"])
  .index("by_metric", ["metric"])
  .index("by_period", ["period"]),

// Market insights and analysis
marketInsights: defineTable({
  type: v.union(
    v.literal("trend"),
    v.literal("opportunity"),
    v.literal("risk"),
    v.literal("benchmark"),
    v.literal("competitive")
  ),
  title: v.string(),
  description: v.string(),
  data: v.optional(v.record(v.string(), v.any())),
  confidence: v.number(),
  priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  tags: v.array(v.string()),
  relevantCompanies: v.array(v.id("portfolioCompanies")),
  industries: v.array(v.string()),
  validUntil: v.number(),
  createdAt: v.number()
})
  .index("by_type", ["type"])
  .index("by_priority", ["priority"])
  .index("by_industry", ["industries"])
  .index("by_validUntil", ["validUntil"])
  .index("by_relevantCompanies", ["relevantCompanies"]),
```

## 6. Task Completion Tracking

### 6.1 Implementation Timeline

| Phase   | Tasks                                          | Duration | Status     |
| ------- | ---------------------------------------------- | -------- | ---------- |
| Phase 1 | Market data infrastructure, overview dashboard | 3 weeks  | ⏳ Pending |
| Phase 2 | Competitive intelligence system                | 3 weeks  | ⏳ Pending |
| Phase 3 | Industry benchmarking system                   | 3 weeks  | ⏳ Pending |
| Phase 4 | Advanced analytics and reporting               | 3 weeks  | ⏳ Pending |

### 6.2 Mandatory Workflows

#### Testing Strategy

- **Unit Tests**: Market data service testing, API integration testing
- **Integration Tests**: Multi-source data aggregation testing
- **E2E Tests**: Complete market research workflow testing
- **Data Quality Testing**: Market data accuracy and reliability testing
- **Performance Testing**: Real-time data loading and visualization testing

#### Quality Assurance

- **Data Validation**: Verify market data accuracy and completeness
- **Source Reliability**: Test data source reliability and fallbacks
- **User Experience**: Test complete market research workflows
- **Visualization Accuracy**: Verify chart and graph accuracy
- **Cross-browser Testing**: Ensure compatibility across browsers

#### Documentation Requirements

- **API Documentation**: Market data source integration documentation
- **User Guide**: Market research features and usage guide
- **Data Source Guide**: Configuration and management guide
- **Developer Documentation**: Extension and customization guide

### 6.3 Success Metrics

#### Technical Metrics

- **Data Freshness**: Market data updated within 5 minutes
- **Source Reliability**: >95% uptime for data sources
- **API Response Time**: < 2 seconds for market data queries
- **Data Accuracy**: >98% data accuracy compared to source
- **Coverage**: Comprehensive coverage of requested data types

#### User Experience Metrics

- **Research Efficiency**: 40% reduction in time spent on market research
- **Data Discovery**: 60% increase in relevant market data discovery
- **User Satisfaction**: > 4.5/5 on market research features
- **Feature Adoption**: > 70% of users use advanced market research features
- **Task Completion**: > 90% success rate for market research tasks

#### Business Metrics

- **Decision Quality**: 35% improvement in investment decision quality
- **Competitive Advantage**: 50% better competitive intelligence compared to competitors
- **Market Insight Generation**: 25% increase in discovered market opportunities
- **Data Source ROI**: Positive ROI on premium data source investments
- **User Engagement**: 45% increase in platform engagement for research features

### 6.4 Risk Assessment and Mitigation

#### Technical Risks

- **API Dependencies**: Implement multiple data sources and fallback mechanisms
- **Data Quality Issues**: Implement data validation and quality scoring
- **Rate Limiting**: Implement intelligent rate limiting and caching
- **Performance**: Optimize data loading and visualization performance
- **Data Consistency**: Normalize data across different sources

#### Data Provider Risks

- **Service Disruptions**: Implement redundant data sources
- **Pricing Changes**: Monitor and manage data source costs
- **API Changes**: Implement abstraction layer for API flexibility
- **License Compliance**: Ensure compliance with data usage terms
- **Data Privacy**: Protect sensitive market and competitive data

#### Business Risks

- **Cost Management**: Monitor and optimize data source costs
- **Data Accuracy**: Ensure high-quality, reliable market data
- **User Adoption**: Provide comprehensive training and onboarding
- **Competitive Differentiation**: Focus on unique data integration capabilities
- **Regulatory Compliance**: Ensure compliance with financial regulations

### 6.5 Handover and Deployment

#### Deployment Checklist

- [ ] All market data sources configured and tested
- [ ] Data quality validation implemented
- [ ] Rate limiting and caching configured
- [ ] User interface tested across browsers
- [ ] Documentation completed
- [ ] Error handling and fallbacks tested
- [ ] Performance benchmarks met
- [ ] Security measures implemented
- [ ] User training materials prepared

#### Post-deployment Monitoring

- **Data Quality Monitoring**: Monitor market data accuracy and completeness
- **API Usage**: Track API usage and costs
- **Performance Monitoring**: Monitor dashboard loading and response times
- **User Analytics**: Track feature adoption and user behavior
- **Error Tracking**: Monitor data source errors and system issues
- **Business Impact**: Track impact on investment decisions and outcomes

#### Maintenance Plan

- **Regular Data Updates**: Schedule regular data source updates
- **Source Performance**: Monitor data source performance and reliability
- **Feature Enhancement**: Add new market research features and capabilities
- **User Support**: Provide ongoing support and training
- **Cost Optimization**: Continuously optimize data source usage and costs
- **Documentation Updates**: Keep documentation up to date

## 7. AI Agent Instructions

### 7.1 Mandatory AI Agent Workflows

#### Agent Coordinator Instructions

- **Coordinate Market Data Integration**: Ensure all data sources work together
- **Data Quality Assurance**: Validate market data accuracy and reliability
- **Performance Monitoring**: Monitor market research system performance
- **User Experience Testing**: Test complete market research workflows
- **Documentation**: Ensure comprehensive market research documentation

#### TypeScript Specialist Instructions

- **Type Safety**: Ensure strict TypeScript for market data services
- **API Integration Types**: Define proper types for all market data APIs
- **Data Validation**: Implement robust data validation
- **Error Handling**: Implement comprehensive error handling
- **Performance**: Optimize TypeScript for market data processing

#### UI/UX Architect Instructions

- **Data Visualization**: Design intuitive and informative market data visualizations
- **User Experience**: Focus on efficient market research workflows
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first dashboard design
- **Information Architecture**: Organize complex market data intuitively

#### Security Auditor Instructions

- **API Security**: Secure market data API integrations
- **Data Access**: Implement proper access controls for market data
- **Data Privacy**: Protect sensitive market and competitive information
- **Compliance**: Ensure compliance with financial data regulations
- **Rate Limiting**: Implement appropriate rate limiting controls

### 7.2 Code Quality Standards

#### Market Data Standards

- **Data Accuracy**: Ensure high-quality, reliable market data
- **Source Reliability**: Use reputable and reliable data sources
- **Real-time Updates**: Provide timely market data updates
- **Data Validation**: Implement comprehensive data validation
- **Error Handling**: Robust error handling for data source failures

#### Dashboard Standards

- **Performance**: Optimize for fast loading and smooth interactions
- **Visualization**: Clear and accurate data visualization
- **Interactivity**: Intuitive and responsive user interactions
- **Accessibility**: Screen reader compatible
- **Responsive**: Works on all device sizes

#### Integration Standards

- **API Management**: Clean and efficient API integration
- **Data Normalization**: Consistent data formatting across sources
- **Caching Strategy**: Intelligent caching for performance
- **Error Recovery**: Graceful handling of data source failures
- **Security**: Secure data transmission and storage

### 7.3 Testing Requirements

#### Market Data Testing

- **Unit Tests**: Test individual data source integrations
- **Integration Tests**: Test data aggregation and normalization
- **Quality Tests**: Test data accuracy and completeness
- **Performance Tests**: Test data loading and processing performance
- **Reliability Tests**: Test data source reliability and fallbacks

#### Dashboard Testing

- **Component Tests**: Test dashboard components
- **Integration Tests**: Test dashboard data integration
- **Usability Tests**: Test user interface usability
- **Performance Tests**: Test dashboard performance
- **Visualization Tests**: Test chart and graph accuracy

#### E2E Testing

- **Research Workflows**: Test complete market research workflows
- **Data Discovery**: Test market data search and discovery
- **Competitive Analysis**: Test competitive intelligence features
- **Benchmarking**: Test industry benchmarking functionality
- **Report Generation**: Test custom report generation

### 7.4 Documentation Requirements

#### Technical Documentation

- **API Documentation**: Document all market data API integrations
- **Data Source Guide**: Document data source configuration and management
- **Architecture Documentation**: Document market research system architecture
- **Integration Guide**: Document system integration patterns
- **Troubleshooting Guide**: Document common issues and solutions

#### User Documentation

- **User Guide**: Create comprehensive market research user guide
- **Feature Documentation**: Document market research features
- **Tutorial**: Create step-by-step tutorials
- **Best Practices**: Document market research best practices
- **FAQ**: Create frequently asked questions

#### Developer Documentation

- **Setup Guide**: Create market research development setup guide
- **Customization Guide**: Document system customization
- **API Reference**: Create API reference documentation
- **Extension Guide**: Document system extension patterns
- **Data Source Integration**: Document data source integration

## 8. Conclusion

### 8.1 Summary

This comprehensive task document outlines the implementation of a Market Research Dashboard for the VC Portfolio OS. The solution uses a hybrid market research ecosystem approach that combines multiple data sources, competitive intelligence gathering, industry benchmarking, and AI-powered insights to provide users with comprehensive market research capabilities.

### 8.2 Key Deliverables

- **Market Overview Dashboard**: Real-time market indices, sector performance, and news
- **Competitive Intelligence System**: Automated competitor tracking and analysis
- **Industry Benchmarking Platform**: Comprehensive industry benchmarks and comparisons
- **Market Research Tools**: Advanced search, analysis, and report generation
- **AI-Powered Insights**: Automated market insight generation and opportunity identification

### 8.3 Success Criteria

- **Technical**: Reliable data sources, fast performance, accurate visualizations
- **User Experience**: Efficient research workflows, high satisfaction, easy adoption
- **Business**: Better investment decisions, competitive advantages, market insight generation
- **Innovation**: Comprehensive market research ecosystem differentiating from competitors

### 8.4 Next Steps

1. **Review and Approval**: Review this task document and get approval
2. **Phase 1 Implementation**: Begin with core market data infrastructure
3. **Data Source Integration**: Integrate multiple market data sources
4. **Competitive Intelligence**: Develop competitive tracking and analysis
5. **User Testing**: Conduct comprehensive market research workflow testing
6. **Deployment and Monitoring**: Deploy to production and monitor data quality and performance

This implementation will provide a comprehensive market research platform that transforms how VCs conduct market analysis, competitive intelligence, and investment research, leading to better-informed investment decisions and competitive advantages.

---

**Task Document Status**: ✅ Complete
**Version**: 1.0
**Created**: 2025-10-07
**Last Updated**: 2025-10-07
**Next Review**: 2025-10-14
