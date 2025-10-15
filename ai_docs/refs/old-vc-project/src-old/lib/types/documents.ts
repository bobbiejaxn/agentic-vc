// Centralized document types to ensure schema alignment across all functions

export type DocumentStatus = "uploaded" | "processing" | "completed" | "error";

export type DocumentType =
  | "fund_report"
  | "cap_table"
  | "financial_statement"
  | "other";

// Core document interface matching database schema
export interface Document {
  id: string;
  userId: string;
  portfolioId?: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  filePath?: string;
  fileSize?: string;
  mimeType?: string;
  extractedData?: ExtractedData;
  processingError?: string;
  uploadedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Extracted data structure from AI processing
export interface ExtractedData {
  // Fund Report specific fields
  totalValue?: number;
  irr?: number;
  moic?: number;
  tvpi?: number;
  dpi?: number;
  rvpi?: number;
  pic?: number;
  investmentDate?: string;
  vintageYear?: number;
  firstClosingDate?: string;
  finalClosingDate?: string;
  companyName?: string;
  unrealizedGains?: number;
  realizedGains?: number;
  activeInvestments?: number;
  exitedInvestments?: number;
  portfolioCompanies?: Record<string, unknown>[];
  capitalCalls?: Record<string, unknown>[];
  distributions?: Record<string, unknown>[];
  riskMetrics?: Record<string, unknown>;
  coInvestors?: Record<string, unknown>[];

  // Personal investor metrics (for fund reports)
  personalCommitment?: number;
  personalCalledCapital?: number;
  personalNAV?: number;
  personalDistributions?: number;
  personalOwnership?: number;
  personalUnfunded?: number;
  personalMOIC?: number;
  personalIRR?: number;

  // Cap Table specific fields
  ownershipPercentage?: number;
  totalShares?: number;
  sharesOwned?: number;

  // Financial Statement specific fields
  revenue?: number;
  expenses?: number;
  netIncome?: number;
  assets?: number;
  liabilities?: number;

  // General fields
  documentType?: string;
  confidence?: number;
  rawText?: string;
  pageCount?: number;
  tables?: Record<string, unknown>[];
  formFields?: Record<string, unknown>[];
  processingMethod?: string;
  markdownText?: string;
}

// Document processing result from AI services
export interface DocumentProcessingResult {
  success: boolean;
  extractedData?: ExtractedData;
  error?: string;
  processingTime?: number;
}

// Document upload request
export interface DocumentUploadRequest {
  file: File;
  documentType: DocumentType;
  portfolioId?: string;
  userId: string;
}

// Document creation data
export interface DocumentCreationData {
  name: string;
  type: DocumentType;
  portfolioId?: string;
  filePath?: string;
  fileSize?: string;
  mimeType?: string;
  ownershipPercentage?: number;
}

// Llama Parse result
export interface LlamaParseResult {
  success: boolean;
  markdownText?: string;
  processingTime?: number;
  error?: string;
  metadata?: {
    pageCount?: number;
    documentType?: string;
    confidence?: number;
  };
}

// Structured data extraction result
// Validation report interface
export interface ValidationReport {
  totalFields: number;
  validFields: number;
  invalidFields: number;
  averageConfidence: number;
  overallQualityScore: number;
  europeanComplianceScore: number;
  fieldResults: Record<string, FieldValidationResult>;
  complianceIssues: string[];
}

export interface FieldValidationResult {
  fieldName: string;
  isValid: boolean;
  value: unknown;
  errors: string[];
  warnings: string[];
  confidence: number;
  qualityScore: number;
  compliancePassed: boolean;
}

export interface StructuredDataResult {
  companyName?: string;
  totalValue?: number;
  irr?: number;
  moic?: number;
  tvpi?: number;
  dpi?: number;
  rvpi?: number;
  pic?: number;
  investmentDate?: string;
  vintageYear?: number;
  firstClosingDate?: string;
  finalClosingDate?: string;
  revenue?: number;
  expenses?: number;
  netIncome?: number;
  unrealizedGains?: number;
  realizedGains?: number;
  activeInvestments?: number;
  exitedInvestments?: number;
  portfolioCompanies?: Record<string, unknown>[];
  capitalCalls?: Record<string, unknown>[];
  distributions?: Record<string, unknown>[];
  riskMetrics?: Record<string, unknown>;
  coInvestors?: Record<string, unknown>[];
  tables?: Record<string, unknown>[];
  formFields?: Record<string, unknown>[];
  confidence?: number;
  processingMethod?: string;
  qualityScore?: number;
  validationReport?: ValidationReport;

  // Additional fields for enhanced extraction
  fundNAV?: number;
  cumulativeDistributions?: number;
  cumulativeCalledCapital?: number;
  unfundedCommitment?: number;
  fundSize?: number;
  investmentPeriodEnd?: string;
  managementFeeRate?: number;
  carriedInterestRate?: number;
  hurdleRate?: number;
  fundCurrency?: string;
  reportingPeriod?: string;
  fundAge?: number;
  deploymentRate?: number;
  portfolioCompanyCount?: number;
  personalCommitment?: number;
  personalCalledCapital?: number;
  personalNAV?: number;
  personalDistributions?: number;
  personalOwnershipPercentage?: number;
  personalMOIC?: number;
  personalIRR?: number;
  personalUnfunded?: number;
  capitalCallHistory?: Record<string, unknown>[];
  distributionHistory?: Record<string, unknown>[];
  carryAllocation?: number;
  managementFeePaid?: number;
  taxTreatment?: string;
  investmentVehicle?: string;
  initialInvestment?: number;
  followOnInvestments?: number;
  currentQuarterPerformance?: number;
  ytdPerformance?: number;
  sinceInceptionPerformance?: number;
  benchmarkComparison?: string;
  liquidityTimeline?: string;
  exitPipelineValue?: number;
  portfolioConcentration?: number;
  industrySector?: string;
  investmentStage?: string;
  geography?: string;
  foundingYear?: number;
  lastRoundValuation?: number;
  [key: string]: unknown; // Index signature to allow additional properties
}

// Document summary for API responses
export interface DocumentSummary {
  id: string;
  userId: string;
  portfolioId?: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  filePath?: string;
  fileSize?: string;
  mimeType?: string;
  extractedData?: ExtractedData;
  processingError?: string;
  uploadedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Individual database fields for direct access
  fundSize?: number;
  fundNav?: number;
  irr?: number;
  moic?: number;
  tvpi?: number;
  dpi?: number;
  rvpi?: number;
  grossIrr?: number;
  netIrr?: number;
  personalCommitment?: number;
  personalCalledCapital?: number;
  personalNav?: number;
  personalDistributions?: number;
  ownershipPercentage?: number;
  personalOwnership?: number;
  personalMoic?: number;
  personalIrr?: number;
  portfolioCompanies?: any[];
}

// Document update data
export interface DocumentUpdateData {
  status?: DocumentStatus;
  extractedData?: ExtractedData;
  processingError?: string;
  processedAt?: Date;
}

// API response types
export interface DocumentListResponse {
  success: boolean;
  data: DocumentSummary[];
}

export interface DocumentProcessResponse {
  success: boolean;
  data: {
    documentId: string;
    extractedData?: ExtractedData;
    processingTime?: number;
    status: DocumentStatus;
  };
  error?: string;
}

export interface DocumentDetailResponse {
  success: boolean;
  data: DocumentSummary;
  error?: string;
}
