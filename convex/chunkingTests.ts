"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import {
  createEnhancedChunker,
  DEFAULT_CHUNKING_CONFIG,
} from "./enhancedChunking";

/**
 * Test enhanced chunking performance and quality
 */
export const testEnhancedChunking = action({
  args: {
    documentId: v.optional(v.id("documents")),
  },
  returns: v.object({
    success: v.boolean(),
    testResults: v.any(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, { documentId }) => {
    try {
      // Test document with various content types
      const testDocument = `# Q4 2024 Fund Performance Report

## Executive Summary
The fund demonstrated exceptional performance in Q4 2024 with an IRR of 18.5% and MOIC of 2.3x. Our portfolio companies showed strong growth across all sectors, with particular strength in technology and healthcare investments.

## Portfolio Performance Metrics

| Metric | Q4 2024 | Q3 2024 | Change | Benchmark |
|--------|---------|---------|--------|-----------|
| IRR | 18.5% | 15.2% | +3.3% | 12.0% |
| MOIC | 2.3x | 2.1x | +0.2x | 1.8x |
| TVPI | 2.0x | 1.8x | +0.2x | 1.5x |
| DPI | 1.1x | 0.9x | +0.2x | 0.8x |
| RVPI | 1.2x | 1.2x | 0.0x | 0.7x |

## Portfolio Companies Analysis

### Technology Sector (45% allocation)
Our technology investments continue to drive strong returns with several portfolio companies showing exceptional growth.

**Key Holdings:**
- **TechCorp Inc.** - Series B investment, 15% ownership, 3.2x return
- **DataFlow Systems** - Series A investment, 20% ownership, 2.8x return
- **CloudTech Solutions** - Growth investment, 12% ownership, 1.5x return
- **AI Innovations** - Series A investment, 18% ownership, 2.1x return

### Healthcare Sector (30% allocation)
Healthcare investments showed resilience with strong performance in biotech and medical device companies.

**Key Holdings:**
- **MedDevice Co.** - Series A investment, 18% ownership, 2.5x return
- **BioPharma Ltd.** - Series B investment, 22% ownership, 3.1x return
- **HealthTech Solutions** - Growth investment, 15% ownership, 1.8x return

### Financial Services (15% allocation)
Fintech investments demonstrated strong performance with regulatory tailwinds supporting growth.

**Key Holdings:**
- **FinTech Innovations** - Series A investment, 25% ownership, 2.2x return
- **PayTech Solutions** - Growth investment, 15% ownership, 1.9x return

### Other Sectors (10% allocation)
Diversified investments across various sectors provide portfolio stability.

**Key Holdings:**
- **GreenEnergy Corp** - Series A investment, 20% ownership, 1.7x return
- **RetailTech Inc** - Growth investment, 18% ownership, 2.0x return

## Key Investment Highlights

### Successful Exits
1. **TechCorp Inc.** - Partial exit at 3.2x return, generating $15M in distributions
2. **DataFlow Systems** - Strategic acquisition at 2.8x return, generating $8M in distributions
3. **MedDevice Co.** - IPO at 2.5x return, generating $12M in distributions

### New Investments
1. **CloudTech Solutions** - $5M Series A investment, 12% ownership
2. **BioPharma Ltd.** - $8M Series B investment, 22% ownership
3. **AI Innovations** - $6M Series A investment, 18% ownership

## Risk Management
The fund maintains a diversified portfolio with comprehensive risk mitigation strategies across all sectors. Regular monitoring and due diligence processes ensure optimal performance while managing downside risk.

**Risk Metrics:**
- Portfolio concentration: <15% per company
- Sector diversification: 4+ sectors
- Geographic diversification: 3+ regions
- Stage diversification: Early to growth stage

## Market Outlook for 2025
Based on current market conditions and portfolio performance, we anticipate continued strong returns with focus on technology and healthcare sectors. Market tailwinds include:

- Continued digital transformation across industries
- Healthcare innovation and regulatory support
- Fintech adoption and regulatory clarity
- ESG investing and sustainable growth

## Conclusion
The fund's strong performance in Q4 2024 demonstrates the effectiveness of our investment strategy and portfolio management approach. We remain committed to delivering superior returns while managing risk appropriately.`;

      // Initialize enhanced chunker
      const chunker = createEnhancedChunker({
        ...DEFAULT_CHUNKING_CONFIG,
        maxTokens: 512,
        overlapTokens: 50,
        financialDataIntact: true,
      });

      // Process document
      const startTime = Date.now();
      const chunks = await chunker.chunkDocument(testDocument, {
        documentType: "fund_report",
        fundName: "Test Fund",
        quarter: "Q4",
        year: 2024,
      });
      const processingTime = Date.now() - startTime;

      // Analyze results
      const testResults = {
        processingTime: processingTime,
        totalChunks: chunks.length,
        chunkTypes: {} as Record<string, number>,
        tokenDistribution: [] as number[],
        semanticBoundaries: 0,
        overlappingChunks: 0,
        financialDataChunks: 0,
        avgTokenCount: 0,
        maxTokenCount: 0,
        minTokenCount: Infinity,
        contextPreservation: 0,
        structurePreservation: 0,
      };

      let totalTokens = 0;

      for (const chunk of chunks) {
        // Count chunk types
        testResults.chunkTypes[chunk.chunkType] =
          (testResults.chunkTypes[chunk.chunkType] || 0) + 1;

        // Token analysis
        testResults.tokenDistribution.push(chunk.tokenCount);
        totalTokens += chunk.tokenCount;
        testResults.maxTokenCount = Math.max(
          testResults.maxTokenCount,
          chunk.tokenCount
        );
        testResults.minTokenCount = Math.min(
          testResults.minTokenCount,
          chunk.tokenCount
        );

        // Quality metrics
        if (chunk.metadata.semanticBoundary) testResults.semanticBoundaries++;
        if (chunk.metadata.hasOverlap) testResults.overlappingChunks++;
        if (
          chunk.chunkType === "financial_metrics" ||
          chunk.chunkType === "table"
        )
          testResults.financialDataChunks++;
        if (chunk.context) testResults.contextPreservation++;
        if (chunk.metadata.parentSection) testResults.structurePreservation++;
      }

      testResults.avgTokenCount = Math.round(totalTokens / chunks.length);
      testResults.minTokenCount =
        testResults.minTokenCount === Infinity ? 0 : testResults.minTokenCount;

      // Quality assessment
      const qualityScore = {
        tokenEfficiency: testResults.avgTokenCount / 512, // Should be close to 1.0
        semanticBoundaryRate: testResults.semanticBoundaries / chunks.length,
        overlapRate: testResults.overlappingChunks / chunks.length,
        contextPreservationRate:
          testResults.contextPreservation / chunks.length,
        structurePreservationRate:
          testResults.structurePreservation / chunks.length,
        financialDataPreservation:
          testResults.financialDataChunks / chunks.length,
      };

      // Performance benchmarks
      const benchmarks = {
        processingTimeMs: processingTime,
        chunksPerSecond: chunks.length / (processingTime / 1000),
        avgTokensPerChunk: testResults.avgTokenCount,
        tokenUtilization: testResults.avgTokenCount / 512,
        qualityScore:
          Object.values(qualityScore).reduce((a, b) => a + b, 0) /
          Object.keys(qualityScore).length,
      };

      return {
        success: true,
        testResults: {
          ...testResults,
          qualityScore,
          benchmarks,
          chunks: chunks.map((chunk) => ({
            content: chunk.content.substring(0, 100) + "...",
            type: chunk.chunkType,
            tokens: chunk.tokenCount,
            hasContext: !!chunk.context,
            hasOverlap: chunk.metadata.hasOverlap,
            semanticBoundary: chunk.metadata.semanticBoundary,
          })),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        testResults: null,
      };
    }
  },
});

/**
 * Compare old vs new chunking performance
 */
export const compareChunkingStrategies = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    comparison: v.any(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx) => {
    try {
      const testDocument = `# Fund Performance Report

## Executive Summary
Strong performance with 15.2% IRR and 2.1x MOIC.

## Portfolio Metrics
| Metric | Value |
|--------|-------|
| IRR | 15.2% |
| MOIC | 2.1x |

## Portfolio Companies
- TechCorp Inc. - 15% ownership
- DataFlow Systems - 20% ownership
- MedDevice Co. - 18% ownership`;

      // Test old chunking (simple approach)
      const oldChunks = testDocument.split(/\n(?=## )/);
      const oldChunkCount = oldChunks.length;

      // Test new chunking
      const chunker = createEnhancedChunker(DEFAULT_CHUNKING_CONFIG);
      const newChunks = await chunker.chunkDocument(testDocument);

      const comparison = {
        oldChunking: {
          chunkCount: oldChunkCount,
          avgChunkSize: testDocument.length / oldChunkCount,
          hasTokenAwareness: false,
          hasSemanticBoundaries: false,
          hasOverlap: false,
          hasContext: false,
        },
        newChunking: {
          chunkCount: newChunks.length,
          avgChunkSize: testDocument.length / newChunks.length,
          avgTokenCount:
            newChunks.reduce((sum, chunk) => sum + chunk.tokenCount, 0) /
            newChunks.length,
          hasTokenAwareness: true,
          hasSemanticBoundaries: newChunks.some(
            (chunk) => chunk.metadata.semanticBoundary
          ),
          hasOverlap: newChunks.some((chunk) => chunk.metadata.hasOverlap),
          hasContext: newChunks.some((chunk) => chunk.context),
          chunkTypes: newChunks.reduce(
            (types, chunk) => {
              types[chunk.chunkType] = (types[chunk.chunkType] || 0) + 1;
              return types;
            },
            {} as Record<string, number>
          ),
        },
        improvements: {
          tokenAwareness: "Added",
          semanticBoundaries: "Added",
          overlap: "Added",
          context: "Added",
          chunkTypes: "Enhanced from 4 to 8 types",
          financialSpecialization: "Added",
        },
      };

      return {
        success: true,
        comparison,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        comparison: null,
      };
    }
  },
});
