/**
 * Enhanced Multimodal Document Extraction Service
 *
 * This file maintains backward compatibility by re-exporting
 * all functionality from the modular extraction structure.
 *
 * The extraction logic has been refactored into focused modules:
 * - core.ts: Main extraction service and orchestration
 * - text-extraction.ts: Text-based extraction using Llama Parse
 * - image-extraction.ts: Image recognition using Llama Cloud
 * - validation.ts: Cross-validation between text and image data
 * - quality-metrics.ts: Quality assessment and scoring
 * - data-parsers.ts: VC portfolio data parsing and structuring
 * - index.ts: Barrel file for all exports
 */

// Re-export everything from the modular structure
export * from "./extraction";
