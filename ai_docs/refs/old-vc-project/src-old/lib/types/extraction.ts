/**
 * Enhanced Multimodal Document Extraction Types
 * Defines comprehensive type system for multimodal document processing
 * including text extraction, image recognition, and cross-validation.
 */

import type { ImageRecognitionResult } from "../llama-cloud";

// Base extraction result structure
export interface BaseExtractionResult {
  documentId: string;
  processingTime: number;
  confidence: number;
  errors: string[];
  metadata: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    processingDate: string;
    extractionVersion: string;
  };
}

// Text-based extraction results (from existing Llama Parse)
export interface TextExtractionResult {
  content: string;
  pages: {
    pageNumber: number;
    content: string;
    confidence: number;
  }[];
  metadata: {
    totalPages: number;
    language: string;
    encoding: string;
  };
}

// Image recognition results
export interface ImageExtractionResult {
  totalImages: number;
  processedImages: number;
  images: ImageRecognitionResult[];
  charts: ChartExtraction[];
  tables: TableExtraction[];
  textBlocks: TextBlockExtraction[];
}

// Chart data extraction
export interface ChartExtraction {
  id: string;
  type: "bar" | "line" | "pie" | "scatter" | "area";
  title: string;
  data: DataPoint[];
  labels: string[];
  axes: {
    x: { label: string; type: string };
    y: { label: string; type: string };
  };
  confidence: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DataPoint {
  x: string | number;
  y: number;
  label?: string;
  category?: string;
}

// Table data extraction
export interface TableExtraction {
  id: string;
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
  confidence: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata: {
    rowCount: number;
    columnCount: number;
    hasHeader: boolean;
    cellTypes: ("text" | "number" | "date" | "currency")[][];
  };
}

// Text block extraction from images
export interface TextBlockExtraction {
  id: string;
  content: string;
  confidence: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  formatting: {
    fontSize?: number;
    isBold: boolean;
    isItalic: boolean;
    alignment: "left" | "center" | "right";
  };
}

// Cross-validation results
export interface ValidationResult {
  field: string;
  textValue?: unknown;
  imageValue?: unknown;
  finalValue: unknown;
  confidence: "high" | "medium" | "low";
  validationMethod: "cross-reference" | "pattern-match" | "context-analysis";
  reasoning: string;
  conflicts: string[];
}

// Enhanced extraction result combining all sources
export interface EnhancedExtractionResult extends BaseExtractionResult {
  textExtraction: TextExtractionResult;
  imageExtraction: ImageExtractionResult;
  validation: ValidationResult[];
  finalData: VCPortfolioExtraction;
  qualityMetrics: QualityMetrics;
}

// VC Portfolio specific extraction result
export interface VCPortfolioExtraction {
  fundName?: string;
  vintage?: string;
  fundSize?: number;
  currency?: string;

  portfolioSummary?: {
    totalValue: number;
    totalInvestments: number;
    sectors: PortfolioSector[];
  };

  investments: VCInvestment[];
  topInvestments?: VCInvestment[];

  performance?: {
    irr: number;
    moic: number;
    tvpi: number;
    dpi: number;
    quarterlyReturn?: number;
    vsIndustryBenchmark?: number;
  };

  bestPerformer?: {
    name: string;
    sector: string;
    performance: number;
  };
}

export interface PortfolioSector {
  sector: string;
  count: number;
  totalValue: number;
  avgIRR: number;
  avgMOIC: number;
  companies: VCInvestment[];
}

export interface VCInvestment {
  name: string;
  stage?: string;
  sector: string;
  ownership?: number;
  valuation?: number;
  investmentDate?: string;
  investmentAmount?: number;
  lastRoundValuation?: number;
  documentId?: string;
}

// Quality and confidence metrics
export interface QualityMetrics {
  overallConfidence: number;
  dataCompleteness: number;
  extractionAccuracy: number;
  validationScore: number;
  processingReliability: number;

  fieldConfidence: {
    [fieldName: string]: {
      confidence: number;
      sources: string[];
      validation: string;
    };
  };

  issues: QualityIssue[];
}

export interface QualityIssue {
  type: "missing_data" | "low_confidence" | "validation_conflict" | "ocr_error";
  field: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  suggestedAction?: string;
}

// Processing options and configuration
export interface ExtractionOptions {
  enableImageRecognition: boolean;
  enableCrossValidation: boolean;
  confidenceThreshold: number;
  maxProcessingTime: number;
  fallbackToTextOnly: boolean;
  validateAgainstExistingData: boolean;
}

export interface ExtractionConfig {
  llamaCloud: {
    apiKey: string;
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  processing: {
    maxFileSize: number;
    supportedFormats: string[];
    enableCaching: boolean;
    cacheDuration: number;
  };
  validation: {
    enableCrossValidation: boolean;
    confidenceThreshold: number;
    strictMode: boolean;
  };
}

// Error types specific to enhanced extraction
export class ExtractionError extends Error {
  constructor(message: string, public code: string, public details?: Record<string, unknown>) {
    super(message);
    this.name = "ExtractionError";
  }
}

export class ImageProcessingError extends ExtractionError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "IMAGE_PROCESSING_ERROR", details);
    this.name = "ImageProcessingError";
  }
}

export class ValidationError extends ExtractionError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}
