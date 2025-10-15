/**
 * Enhanced Multimodal Document Extraction Module
 * Exports all extraction functionality for easy importing
 */

// Core extraction service
export { EnhancedExtractionService, enhancedExtraction } from "./core";

// Text extraction
export {
  processTextExtraction,
  extractRawText,
  extractTextByPage,
  validateTextExtraction,
} from "./text-extraction";

// Image extraction
export {
  processImageExtraction,
  extractCharts,
  extractTables,
  extractTextBlocks,
  validateImageExtraction,
  createEmptyImageResult,
  filterHighConfidenceImages,
} from "./image-extraction";

// Validation and cross-validation
export {
  crossValidateResults,
  type CrossValidationOptions,
} from "./validation";

// Quality metrics
export { calculateQualityMetrics } from "./quality-metrics";

// Data parsers
export { parseVCPortfolioData } from "./data-parsers";

// Types
export type {
  EnhancedExtractionResult,
  TextExtractionResult,
  ImageExtractionResult,
  ValidationResult,
  VCPortfolioExtraction,
  ExtractionOptions,
  QualityMetrics,
  ExtractionError,
  ImageProcessingError,
  ValidationError,
  ChartExtraction,
  TableExtraction,
  TextBlockExtraction,
  DataPoint,
  PortfolioSector,
  VCInvestment,
} from "./types/extraction";
