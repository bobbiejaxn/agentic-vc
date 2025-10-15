// Centralized Zod schemas for runtime validation
// Based on schema validation strategies: https://docs/guides/schema-validation-strategies.md

import { z } from "zod";

// Document Status Schema
export const DocumentStatusSchema = z.enum([
  "uploaded",
  "processing",
  "completed",
  "error",
]);

// Document Type Schema
export const DocumentTypeSchema = z.enum([
  "fund_report",
  "cap_table",
  "financial_statement",
  "other",
]);

// Extracted Data Schema - validates AI extraction results
export const ExtractedDataSchema = z.object({
  // Fund Report specific fields
  totalValue: z.number().positive().optional(),
  irr: z.number().min(0).max(1000).optional(), // IRR can be negative but not extreme
  moic: z.number().positive().optional(),
  investmentDate: z.string().optional(),
  companyName: z.string().min(1).max(255).optional(),

  // Cap Table specific fields
  ownershipPercentage: z.number().min(0).max(100).optional(),
  totalShares: z.number().positive().optional(),
  sharesOwned: z.number().min(0).optional(),

  // Financial Statement specific fields
  revenue: z.number().optional(),
  expenses: z.number().optional(),
  netIncome: z.number().optional(),
  assets: z.number().positive().optional(),
  liabilities: z.number().positive().optional(),

  // General fields
  documentType: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  rawText: z.string().optional(),
  pageCount: z.number().positive().optional(),
  tables: z.array(z.any()).optional(),
  formFields: z.array(z.any()).optional(),
  processingMethod: z.string().optional(),
  markdownText: z.string().optional(),
});

// Document Creation Schema
export const DocumentCreationSchema = z.object({
  name: z.string().min(1).max(255),
  type: DocumentTypeSchema,
  portfolioId: z.string().uuid().optional(),
  filePath: z.string().max(500).optional(),
  fileSize: z.string().max(20).optional(),
  mimeType: z.string().max(100).optional(),
});

// Document Upload Request Schema
export const DocumentUploadRequestSchema = z.object({
  documentType: DocumentTypeSchema,
  portfolioId: z.string().uuid().optional(),
  userId: z.string().uuid(),
});

// Document Processing Result Schema
export const DocumentProcessingResultSchema = z.object({
  success: z.boolean(),
  extractedData: ExtractedDataSchema.optional(),
  error: z.string().optional(),
  processingTime: z.number().positive().optional(),
});

// API Request Schemas
export const ProcessDocumentRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  documentType: DocumentTypeSchema,
  portfolioId: z.string().uuid().optional(),
});

// Llama Parse Result Schema
export const LlamaParseResultSchema = z.object({
  success: z.boolean(),
  markdownText: z.string().optional(),
  processingTime: z.number().positive().optional(),
  error: z.string().optional(),
  metadata: z
    .object({
      pageCount: z.number().positive().optional(),
      documentType: z.string().optional(),
      confidence: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

// Structured Data Result Schema
export const StructuredDataResultSchema = z.object({
  companyName: z.string().min(1).max(255).optional(),
  totalValue: z.number().positive().optional(),
  irr: z.number().optional(),
  moic: z.number().positive().optional(),
  investmentDate: z.string().optional(),
  revenue: z.number().optional(),
  expenses: z.number().optional(),
  netIncome: z.number().optional(),
  tables: z.array(z.any()).optional(),
  formFields: z.array(z.any()).optional(),
});

// Validation helper functions
export const validateExtractedData = (data: unknown) => {
  return ExtractedDataSchema.safeParse(data);
};

export const validateDocumentCreation = (data: unknown) => {
  return DocumentCreationSchema.safeParse(data);
};

export const validateProcessingResult = (data: unknown) => {
  return DocumentProcessingResultSchema.safeParse(data);
};

// Type exports for use in other files
export type ExtractedData = z.infer<typeof ExtractedDataSchema>;
export type DocumentCreation = z.infer<typeof DocumentCreationSchema>;
export type DocumentProcessingResult = z.infer<
  typeof DocumentProcessingResultSchema
>;
export type ProcessDocumentRequest = z.infer<
  typeof ProcessDocumentRequestSchema
>;
export type LlamaParseResult = z.infer<typeof LlamaParseResultSchema>;
export type StructuredDataResult = z.infer<typeof StructuredDataResultSchema>;
