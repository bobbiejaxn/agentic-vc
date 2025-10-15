"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import {
  createEnhancedChunker,
  DEFAULT_CHUNKING_CONFIG,
} from "./enhancedChunking";

/**
 * Enhanced document processing with improved chunking strategy
 * Uses token-aware chunking with semantic boundaries and context preservation
 */
export const processDocumentEnhanced = action({
  args: {
    documentId: v.id("documents"),
  },
  returns: v.object({
    success: v.boolean(),
    extractedText: v.optional(v.string()),
    chunksCreated: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, { documentId }) => {
    try {
      // Get document info
      const document = await ctx.runQuery(api.documents.getDocument, {
        documentId,
      });

      if (!document) {
        return { success: false, error: "Document not found" };
      }

      // Update status to processing
      await ctx.runMutation(api.documents.updateDocumentStatus, {
        documentId,
        status: "processing",
      });

      // Simulate enhanced OCR processing with realistic financial document
      const mockOCRResult = {
        markdown: `# Q4 2024 Fund Performance Report

## Executive Summary
The fund demonstrated strong performance in Q4 2024 with an IRR of 15.2% and MOIC of 2.1x. The portfolio continues to show resilience across all sectors with particular strength in technology investments.

## Portfolio Performance Metrics

| Metric | Q4 2024 | Q3 2024 | Change |
|--------|---------|---------|--------|
| IRR | 15.2% | 12.8% | +2.4% |
| MOIC | 2.1x | 1.9x | +0.2x |
| TVPI | 1.8x | 1.6x | +0.2x |
| DPI | 0.9x | 0.7x | +0.2x |

## Portfolio Companies Analysis

### Technology Sector (40% allocation)
- **TechCorp Inc.** - Series B investment, 15% ownership
- **DataFlow Systems** - Series A investment, 20% ownership
- **CloudTech Solutions** - Growth investment, 12% ownership

### Healthcare Sector (30% allocation)
- **MedDevice Co.** - Series A investment, 18% ownership
- **BioPharma Ltd.** - Series B investment, 22% ownership

### Financial Services (20% allocation)
- **FinTech Innovations** - Series A investment, 25% ownership
- **PayTech Solutions** - Growth investment, 15% ownership

### Other Sectors (10% allocation)
- **GreenEnergy Corp** - Series A investment, 20% ownership
- **RetailTech Inc** - Growth investment, 18% ownership

## Key Investment Highlights

### Successful Exits
1. **TechCorp Inc.** - Partial exit at 3.2x return
2. **DataFlow Systems** - Strategic acquisition at 2.8x return

### New Investments
1. **CloudTech Solutions** - $5M Series A investment
2. **BioPharma Ltd.** - $8M Series B investment

## Risk Management
The fund maintains a diversified portfolio with risk mitigation strategies across all sectors. Regular monitoring and due diligence processes ensure optimal performance.

## Outlook for 2025
Based on current market conditions and portfolio performance, we anticipate continued strong returns with focus on technology and healthcare sectors.`,

        metadata: {
          documentType: "fund_report",
          fundName: "Venture Capital Fund IV",
          quarter: "Q4",
          year: 2024,
          processingDate: new Date().toISOString(),
          confidence: 0.95,
        },
      };

      // Use enhanced chunking strategy
      const chunker = createEnhancedChunker({
        ...DEFAULT_CHUNKING_CONFIG,
        maxTokens: 512,
        overlapTokens: 50,
        financialDataIntact: true,
      });

      const enhancedChunks = await chunker.chunkDocument(
        mockOCRResult.markdown,
        mockOCRResult.metadata
      );
      let chunksCreated = 0;

      // Create chunks with enhanced metadata
      for (let i = 0; i < enhancedChunks.length; i++) {
        const chunk = enhancedChunks[i];

        await ctx.runMutation(api.enhancedHybridChunks.createChunk, {
          documentId,
          userId: document.userId,
          chunkIndex: i,
          textContent: chunk.content,
          chunkType: chunk.chunkType,
          metadata: {
            ...mockOCRResult.metadata,
            section: chunk.section,
            tokenCount: chunk.tokenCount,
            hasTable: chunk.hasTable,
            hasChart: chunk.hasChart,
            financialMetrics: chunk.financialMetrics,
            // Enhanced metadata
            context: chunk.context,
            chunkMetadata: chunk.metadata,
            processingMethod: "enhanced_chunking_v2",
            semanticBoundary: chunk.metadata.semanticBoundary,
            hasOverlap: chunk.metadata.hasOverlap,
            parentSection: chunk.metadata.parentSection,
            totalChunks: enhancedChunks.length,
            chunkIndex: chunk.metadata.chunkIndex,
            overlapText: chunk.metadata.overlapText,
          },
        });

        chunksCreated++;
      }

      // Update document status to completed
      await ctx.runMutation(api.documents.updateDocumentStatus, {
        documentId,
        status: "completed",
      });

      return {
        success: true,
        extractedText: mockOCRResult.markdown,
        chunksCreated,
      };
    } catch (error) {
      // Update document status to error
      await ctx.runMutation(api.documents.updateDocumentStatus, {
        documentId,
        status: "error",
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Get enhanced chunking statistics for a document
 */
export const getChunkingStats = action({
  args: {
    documentId: v.id("documents"),
  },
  returns: v.object({
    totalChunks: v.number(),
    chunkTypes: v.record(v.string(), v.number()),
    avgTokenCount: v.number(),
    semanticBoundaries: v.number(),
    overlappingChunks: v.number(),
    financialDataChunks: v.number(),
  }),
  handler: async (
    ctx,
    { documentId }
  ): Promise<{
    totalChunks: number;
    chunkTypes: Record<string, number>;
    avgTokenCount: number;
    semanticBoundaries: number;
    overlappingChunks: number;
    financialDataChunks: number;
  }> => {
    const chunks = await ctx.runQuery(
      api.enhancedHybridChunks.getChunksByDocument,
      {
        documentId,
      }
    );

    const stats: {
      totalChunks: number;
      chunkTypes: Record<string, number>;
      avgTokenCount: number;
      semanticBoundaries: number;
      overlappingChunks: number;
      financialDataChunks: number;
    } = {
      totalChunks: chunks.length,
      chunkTypes: {} as Record<string, number>,
      avgTokenCount: 0,
      semanticBoundaries: 0,
      overlappingChunks: 0,
      financialDataChunks: 0,
    };

    let totalTokens = 0;

    for (const chunk of chunks) {
      // Count chunk types
      const type = chunk.chunkType;
      stats.chunkTypes[type] = (stats.chunkTypes[type] || 0) + 1;

      // Count tokens
      const tokenCount = chunk.metadata?.tokenCount || 0;
      totalTokens += tokenCount;

      // Count semantic boundaries
      if (chunk.metadata?.semanticBoundary) {
        stats.semanticBoundaries++;
      }

      // Count overlapping chunks
      if (chunk.metadata?.hasOverlap) {
        stats.overlappingChunks++;
      }

      // Count financial data chunks
      if (
        chunk.chunkType === "financial_metrics" ||
        chunk.chunkType === "table"
      ) {
        stats.financialDataChunks++;
      }
    }

    stats.avgTokenCount =
      chunks.length > 0 ? Math.round(totalTokens / chunks.length) : 0;

    return stats;
  },
});
