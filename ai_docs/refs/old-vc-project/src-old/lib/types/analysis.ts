/**
 * Enhanced Analysis Types
 *
 * Comprehensive type definitions for enhanced analysis features including
 * detailed financial metrics, portfolio analysis, and data quality metrics.
 */

/**
 * Enhanced Analysis Result
 * Complete result from enhanced analysis processing
 */
export interface EnhancedAnalysisResult {
  documentId: string;
  analysisType: "basic" | "enhanced";
  tier1Data: {
    financialMetrics: DetailedFinancialMetrics;
    portfolioAnalysis: ComprehensivePortfolioAnalysis;
    dataQuality: DataQualityMetrics;
  };
  confidence: ConfidenceScore;
  processingTime: number;
  errors: string[];
}

/**
 * Detailed Financial Metrics
 * Comprehensive financial analysis including IRR, MOIC, and TVPI breakdowns
 */
export interface DetailedFinancialMetrics {
  irr: {
    gross: number;
    net: number;
    calculation: string;
  };
  moic: {
    gross: number;
    net: number;
    breakdown: MOICBreakdown;
  };
  tvpi: {
    total: number;
    dpi: number;
    rvpi: number;
    validation: boolean;
  };
}

/**
 * MOIC Breakdown
 * Detailed breakdown of Multiple on Invested Capital
 */
export interface MOICBreakdown {
  realizedGains?: number;
  unrealizedGains?: number;
  totalInvested?: number;
  currentValue?: number;
  distributions?: number;
}

/**
 * Comprehensive Portfolio Analysis
 * Detailed analysis of portfolio companies, sectors, and performance
 */
export interface ComprehensivePortfolioAnalysis {
  companies: EnhancedCompanyData[];
  sectors: SectorAnalysis[];
  stages: StageAnalysis[];
  performance: PerformanceMetrics;
}

/**
 * Enhanced Company Data
 * Detailed information about portfolio companies
 */
export interface EnhancedCompanyData {
  name: string;
  stage: InvestmentStage;
  sector: string;
  investmentDate: string;
  investmentAmount: number;
  currentValue: number;
  multiple: number;
  irr: number;
  status: CompanyStatus;
  performance: CompanyPerformance;
  externalData?: ExternalCompanyData;
}

/**
 * External Company Data
 * Data enriched from external APIs (Exa.ai, Firecrawl)
 */
export interface ExternalCompanyData {
  marketCap?: number;
  fundingRounds?: FundingRound[];
  recentNews?: NewsItem[];
  competitors?: string[];
  sectorTrends?: SectorTrend[];
}

/**
 * Funding Round
 * Information about company funding rounds
 */
export interface FundingRound {
  amount: number;
  date: string;
  source: string;
  round?: string;
  investors?: string[];
}

/**
 * News Item
 * Recent news about the company
 */
export interface NewsItem {
  title: string;
  content: string;
  date?: string;
  source?: string;
  url?: string;
}

/**
 * Sector Trend
 * Market trends for the company's sector
 */
export interface SectorTrend {
  description: string;
  source: string;
  date?: string;
  impact?: "positive" | "negative" | "neutral";
}

/**
 * Investment Stage
 * Stages of venture capital investments
 */
export type InvestmentStage =
  | "pre-seed"
  | "seed"
  | "series-a"
  | "series-b"
  | "series-c"
  | "series-d"
  | "growth"
  | "late-stage"
  | "exit";

/**
 * Company Status
 * Current status of portfolio companies
 */
export type CompanyStatus =
  | "active"
  | "exited"
  | "written-off"
  | "distressed"
  | "acquired"
  | "ipo";

/**
 * Company Performance
 * Performance metrics for individual companies
 */
export interface CompanyPerformance {
  revenue?: number;
  growthRate?: number;
  marketShare?: number;
  valuation?: number;
  lastFundingRound?: {
    date: string;
    amount: number;
    valuation: number;
  };
}

/**
 * Sector Analysis
 * Analysis of portfolio by sector
 */
export interface SectorAnalysis {
  sector: string;
  count: number;
  totalInvested: number;
  currentValue: number;
  averageReturn: number;
  topPerformers: string[];
  underperformers: string[];
  marketData?: SectorMarketData;
}

/**
 * Sector Market Data
 * External market data for the sector
 */
export interface SectorMarketData {
  marketSize?: number;
  growthRate?: number;
  keyTrends?: MarketTrend[];
  recentNews?: NewsItem[];
  marketLeaders?: string[];
}

/**
 * Market Trend
 * Key trends affecting the sector
 */
export interface MarketTrend {
  description: string;
  source: string;
  date?: string;
  impact?: "positive" | "negative" | "neutral";
  confidence?: number;
}

/**
 * Stage Analysis
 * Analysis of portfolio by investment stage
 */
export interface StageAnalysis {
  stage: InvestmentStage;
  count: number;
  totalInvested: number;
  currentValue: number;
  averageReturn: number;
  successRate: number;
  averageHoldingPeriod: number;
}

/**
 * Performance Metrics
 * Overall portfolio performance metrics
 */
export interface PerformanceMetrics {
  totalInvested: number;
  currentValue: number;
  totalReturn: number;
  irr: number;
  moic: number;
  tvpi: number;
  dpi: number;
  rvpi: number;
  topPerformers: string[];
  underperformers: string[];
  sectorDiversification: Record<string, number>;
  stageDiversification: Record<InvestmentStage, number>;
}

/**
 * Data Quality Metrics
 * Metrics for assessing data quality and completeness
 */
export interface DataQualityMetrics {
  completeness: number; // 0-1 score for data completeness
  accuracy: number; // 0-1 score for data accuracy
  consistency: number; // 0-1 score for data consistency
  validation: ValidationResult[];
}

/**
 * Validation Result
 * Individual validation check result
 */
export interface ValidationResult {
  type: "calculation" | "range" | "consistency" | "completeness";
  field: string;
  message: string;
  severity: "info" | "warning" | "error";
  suggestedFix?: string;
}

/**
 * Confidence Score
 * Overall confidence in analysis results
 */
export interface ConfidenceScore {
  overall: number; // 0-1 overall confidence score
  financial: number; // 0-1 confidence in financial metrics
  portfolio: number; // 0-1 confidence in portfolio analysis
  dataQuality: number; // 0-1 confidence in data quality
  externalData?: number; // 0-1 confidence in external data enrichment
}

/**
 * Analysis Progress
 * Progress tracking for enhanced analysis
 */
export interface AnalysisProgress {
  documentId: string;
  status: "pending" | "processing" | "completed" | "failed";
  currentStep: string;
  progress: number; // 0-100
  estimatedTimeRemaining?: number;
  errors?: string[];
}

/**
 * Analysis Request
 * Request for enhanced analysis processing
 */
export interface AnalysisRequest {
  documentId: string;
  userId: string;
  options?: {
    includeFinancialMetrics?: boolean;
    includePortfolioAnalysis?: boolean;
    includeDataQuality?: boolean;
    timeoutSeconds?: number;
  };
}

/**
 * Analysis Response
 * Response from enhanced analysis processing
 */
export interface AnalysisResponse {
  success: boolean;
  result?: EnhancedAnalysisResult;
  error?: string;
  processingTime: number;
}

/**
 * Enhanced Analysis Status
 * Status of enhanced analysis for a document
 */
export interface EnhancedAnalysisStatus {
  documentId: string;
  hasEnhancedAnalysis: boolean;
  lastAnalysisDate?: string;
  confidenceScore?: number;
  processingTime?: number;
  errorCount?: number;
}

/**
 * Analysis Comparison
 * Comparison between basic and enhanced analysis
 */
export interface AnalysisComparison {
  documentId: string;
  basicAnalysis: {
    dataPoints: number;
    confidence: number;
    processingTime: number;
  };
  enhancedAnalysis: {
    dataPoints: number;
    confidence: number;
    processingTime: number;
    improvements: string[];
  };
  recommendation: "use_basic" | "use_enhanced" | "both";
}

/**
 * Analysis Export Format
 * Format for exporting analysis results
 */
export interface AnalysisExport {
  documentId: string;
  analysisType: "basic" | "enhanced";
  exportDate: string;
  data: EnhancedAnalysisResult;
  metadata: {
    version: string;
    exportFormat: "json" | "csv" | "pdf";
    generatedBy: string;
  };
}
