/**
 * Enhanced Investment Types
 * Comprehensive type definitions for enhanced investment data with external integrations
 */

export interface EnhancedInvestment {
  // Core investment fields
  id: string;
  portfolioId: string;
  companyName: string;
  sector?: string;
  stage?: string;
  investmentDate?: Date;
  amountInvested: number;
  currentValue?: number;
  ownershipPercentage?: number;
  irr?: number;
  moic?: number;
  status: "active" | "exited" | "written_off" | "pending";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Enhanced company information
  companyWebsite?: string;
  companyLocation?: string;
  companyFounded?: number;
  companyDescription?: string;
  companyEmployees?: number;
  companyRevenue?: number;
  companyGrowth?: number;
  companyValuation?: number;

  // Funding information
  lastFundingDate?: Date;
  lastFundingAmount?: number;
  lastFundingRound?: string;
  leadInvestor?: string;
  coInvestors?: string[];

  // Board and governance
  boardSeats?: number;
  votingRights?: number;
  liquidationPreferences?: string;
  antiDilutionRights?: boolean;

  // Market and competitive data
  marketSize?: number;
  marketShare?: number;
  competitivePosition?: string;

  // Risk and performance metrics
  beta?: number;
  volatility?: number;
  sharpeRatio?: number;

  // Network and relationships
  dealSource?: string;
  referralSource?: string;
  networkStrength?: number;

  // External data integration
  crunchbaseId?: string;
  pitchbookId?: string;
  externalData?: any;
}

export interface CompanyUpdate {
  id: string;
  investmentId: string;
  updateDate: Date;
  updateType: string;
  title: string;
  description?: string;
  source?: string;
  url?: string;
  createdAt: Date;
}

export interface MarketIntelligence {
  id: string;
  sector: string;
  date: Date;
  marketSize?: number;
  growthRate?: number;
  keyTrends?: string[];
  competitiveLandscape?: any;
  regulatoryEnvironment?: string;
  economicIndicators?: any;
  createdAt: Date;
}

export interface PerformanceBenchmark {
  id: string;
  investmentId: string;
  benchmarkType: string;
  benchmarkName: string;
  benchmarkValue?: number;
  investmentValue?: number;
  outperformance?: number;
  date: Date;
  createdAt: Date;
}

// Data enrichment response types
export interface EnrichmentResult {
  success: boolean;
  data?: EnhancedInvestment;
  error?: string;
}

export interface BatchEnrichmentResult {
  success: boolean;
  data?: EnhancedInvestment[];
  errors?: string[];
  enrichedCount: number;
  totalCount: number;
}

// External API response types
export interface CrunchbaseCompany {
  name: string;
  website?: string;
  location?: string;
  founded?: number;
  employees?: number;
  description?: string;
  funding?: {
    total?: number;
    rounds?: number;
    lastRound?: {
      date?: string;
      amount?: number;
      round?: string;
    };
  };
}

export interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  marketCap: number;
}

// Analytics types
export interface RiskMetrics {
  beta: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown?: number;
  var?: number;
}

export interface PerformanceAttribution {
  sectorContribution: number;
  stageContribution: number;
  managerContribution: number;
  marketContribution: number;
  totalReturn: number;
}

export interface NetworkAnalysis {
  coInvestors: string[];
  networkStrength: number;
  dealFlow: string[];
  relationships: string[];
}

// Market data types
export interface MarketData {
  sector: string;
  marketSize: number;
  growthRate: number;
  trends: string[];
  competitors: string[];
}

export interface BenchmarkData {
  sectorBenchmark: number;
  stageBenchmark: number;
  marketBenchmark: number;
  peerBenchmark: number;
}

// Company news and sentiment
export interface CompanyNews {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
  sentiment?: "positive" | "negative" | "neutral";
  relevance: number;
}
