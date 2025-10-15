"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";
import { parseMarkdownStructure } from "./markdownParser";
import { createSmartChunks } from "./smartChunking";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.CONVEX_OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_KEY
    ? undefined
    : process.env.CONVEX_OPENAI_BASE_URL,
});

export const processDocumentEnhanced = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    try {
      await ctx.runMutation(internal.enhancedProcessing.updateProgress, {
        documentId: args.documentId,
        stage: "initializing",
        progress: 0,
        message: "Starting document processing...",
      });

      const document = await ctx.runQuery(
        internal.enhancedProcessing.getDocumentForProcessing,
        { documentId: args.documentId }
      );

      if (!document) {
        throw new Error("Document not found");
      }

      // Step 1: Parse markdown structure
      await ctx.runMutation(internal.enhancedProcessing.updateProgress, {
        documentId: args.documentId,
        stage: "parsing",
        progress: 10,
        message: "Parsing markdown structure...",
      });

      const parsed = parseMarkdownStructure(document.content);

      // Step 2: Create smart chunks
      await ctx.runMutation(internal.enhancedProcessing.updateProgress, {
        documentId: args.documentId,
        stage: "chunking",
        progress: 20,
        message: "Creating smart chunks...",
      });
      const smartChunks = createSmartChunks(parsed, 300, 900);

      // Step 3: Process each chunk with summary and embedding
      await ctx.runMutation(internal.enhancedProcessing.updateProgress, {
        documentId: args.documentId,
        stage: "embedding",
        progress: 30,
        message: `Processing ${smartChunks.length} chunks...`,
      });
      for (let i = 0; i < smartChunks.length; i++) {
        const chunk = smartChunks[i];

        // Generate concise summary focusing on financial data
        const summaryPrompt = `Summarize this financial document section in one sentence. Focus on: metrics, numbers, percentages, dates, and key financial terms.

Content:
${chunk.context}${chunk.content}

One-sentence summary:`;

        const summaryResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: summaryPrompt }],
          temperature: 0.3,
          max_tokens: 100,
        });

        const summary =
          summaryResponse.choices[0].message.content || "Content section";

        // Create embedding with summary prepended
        const embeddingText = `${summary}\n\n${chunk.context}${chunk.content}`;
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: embeddingText,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Store enhanced chunk
        await ctx.runMutation(internal.enhancedProcessing.storeEnhancedChunk, {
          documentId: args.documentId,
          content: chunk.content,
          context: chunk.context,
          summary,
          chunkIndex: i,
          embedding,
          headingPath: chunk.headingPath,
          metadata: chunk.metadata,
        });
      }

      // Step 4: Extract metrics using enhanced method
      await ctx.runMutation(internal.enhancedProcessing.updateProgress, {
        documentId: args.documentId,
        stage: "extracting",
        progress: 80,
        message: "Extracting financial metrics...",
      });
      await ctx.runAction(
        internal.enhancedProcessingActions.extractMetricsEnhanced,
        {
          documentId: args.documentId,
        }
      );

      await ctx.runMutation(internal.enhancedProcessing.updateProgress, {
        documentId: args.documentId,
        stage: "completed",
        progress: 100,
        message: "Processing complete!",
      });
      await ctx.runMutation(internal.documents.updateDocumentStatus, {
        documentId: args.documentId,
        status: "completed",
      });
    } catch (error) {
      await ctx.runMutation(internal.documents.updateDocumentStatus, {
        documentId: args.documentId,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

export const extractMetricsEnhanced = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const metricsToExtract = [
      // Original 6 metrics
      {
        name: "grossIRR",
        desc: "Gross IRR",
        keywords: [
          "gross IRR",
          "gross internal rate",
          "IRR (gross)",
          "gross return",
        ],
      },
      {
        name: "netIRR",
        desc: "Net IRR",
        keywords: ["net IRR", "net internal rate", "IRR (net)", "net return"],
      },
      {
        name: "tvpi",
        desc: "TVPI/MOIC",
        keywords: ["TVPI", "total value", "MOIC", "multiple", "TV/PI"],
      },
      {
        name: "dpi",
        desc: "DPI",
        keywords: ["DPI", "distributions", "realized", "D/PI"],
      },
      {
        name: "rvpi",
        desc: "RVPI",
        keywords: ["RVPI", "residual value", "unrealized", "RV/PI"],
      },
      {
        name: "fundNAV",
        desc: "Fund NAV",
        keywords: ["NAV", "net asset value", "fund value"],
      },
      // New Tier 1 metrics
      {
        name: "cumulativeDistributions",
        desc: "Cumulative Distributions",
        keywords: [
          "cumulative distributions",
          "total distributions",
          "cash returned",
          "distributions to date",
        ],
      },
      {
        name: "cumulativeCalledCapital",
        desc: "Cumulative Called Capital",
        keywords: [
          "called capital",
          "capital called",
          "drawn capital",
          "paid-in capital",
        ],
      },
      {
        name: "unfundedCommitment",
        desc: "Unfunded Commitment",
        keywords: [
          "unfunded",
          "uncalled",
          "remaining commitment",
          "callable capital",
        ],
      },
      {
        name: "fundSize",
        desc: "Fund Size",
        keywords: [
          "fund size",
          "total commitment",
          "committed capital",
          "target size",
        ],
      },
      {
        name: "vintageYear",
        desc: "Vintage Year",
        keywords: [
          "vintage",
          "vintage year",
          "inception year",
          "formation year",
        ],
      },
      {
        name: "investmentPeriodEnd",
        desc: "Investment Period End",
        keywords: [
          "investment period",
          "investment period end",
          "commitment period",
        ],
      },
      {
        name: "managementFeeRate",
        desc: "Management Fee Rate",
        keywords: ["management fee", "annual fee", "fee rate"],
      },
      {
        name: "carriedInterestRate",
        desc: "Carried Interest Rate",
        keywords: ["carried interest", "carry", "performance fee", "promote"],
      },
      {
        name: "hurdleRate",
        desc: "Hurdle Rate",
        keywords: ["hurdle", "preferred return", "hurdle rate", "pref"],
      },
      {
        name: "fundCurrency",
        desc: "Fund Currency",
        keywords: ["currency", "base currency", "denomination"],
      },
      {
        name: "reportingPeriod",
        desc: "Reporting Period",
        keywords: ["reporting period", "as of", "quarter", "period ending"],
      },
      {
        name: "fundAge",
        desc: "Fund Age",
        keywords: ["fund age", "years since inception", "vintage"],
      },
      {
        name: "deploymentRate",
        desc: "Deployment Rate",
        keywords: [
          "deployment",
          "invested capital",
          "deployment rate",
          "capital deployed",
        ],
      },
      {
        name: "portfolioCompanyCount",
        desc: "Portfolio Company Count",
        keywords: [
          "portfolio companies",
          "number of investments",
          "investment count",
        ],
      },
    ];

    // Search for relevant chunks
    const relevantChunks = await ctx.runQuery(
      internal.enhancedProcessing.searchEnhancedChunks,
      {
        documentId: args.documentId,
        limit: 20,
      }
    );

    // Build context from relevant chunks with clear markers
    const context = relevantChunks
      .map((chunk, idx) => {
        const location =
          chunk.headingPath.length > 0
            ? `Location: ${chunk.headingPath.join(" > ")}`
            : "";
        return `=== CHUNK ${idx + 1} ===
${location}
Summary: ${chunk.summary}

${chunk.content}`;
      })
      .join("\n\n");

    // Extract metrics using LLM with improved structured output
    const extractionPrompt = `You are an expert at extracting financial metrics from private equity and venture capital documents.

TASK: Extract the following 20 metrics from the document chunks below. Be thorough and check ALL chunks.

INSTRUCTIONS:
1. Search for exact values, percentages, dates, and numbers
2. Look for tables, lists, and summary sections - they often contain metrics
3. Check for alternative names and abbreviations (e.g., "IRR" might be "Internal Rate of Return")
4. Preserve exact formatting (e.g., "15.2%", "$50M", "2.3x")
5. If a metric appears multiple times, use the most recent or most prominent value
6. Return "N/A" ONLY if you've thoroughly checked all chunks and cannot find the metric

METRICS TO EXTRACT:
${metricsToExtract.map((m, i) => `${i + 1}. ${m.desc} - Look for: ${m.keywords.join(", ")}`).join("\n")}

DOCUMENT CHUNKS:
${context}

OUTPUT FORMAT (valid JSON only):
{
  "grossIRR": { "value": "15.2%", "confidence": "high", "sourceChunk": 3 },
  "netIRR": { "value": "12.8%", "confidence": "high", "sourceChunk": 3 },
  ...
}

CONFIDENCE LEVELS:
- "high": Found exact value with clear label
- "medium": Found value but label is ambiguous or inferred
- "low": Uncertain match or calculated from other values
- "not_found": Thoroughly searched but metric not present

Return ONLY the JSON object, no other text.`;

    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: extractionPrompt }],
      temperature: 0,
      max_tokens: 2000,
    });

    const content = extractionResponse.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Remove markdown code fences if present
    const cleanedContent = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const extractedData = JSON.parse(cleanedContent);

    // Store extraction results
    const finalMetrics: Record<string, string> = {};

    for (const metric of metricsToExtract) {
      const result = extractedData[metric.name];

      if (result) {
        finalMetrics[metric.name] = result.value;

        await ctx.runMutation(
          internal.enhancedProcessing.storeExtractionResult,
          {
            documentId: args.documentId,
            metricName: metric.name,
            value: result.value,
            confidence: result.confidence,
            sourceChunkIndex: result.sourceChunk,
            extractionMethod: "llm_structured",
          }
        );

        // Log failures for learning
        if (result.confidence === "not_found" || result.confidence === "low") {
          await ctx.runMutation(
            internal.enhancedProcessing.logExtractionFailure,
            {
              documentId: args.documentId,
              metricName: metric.name,
              reason:
                result.confidence === "not_found"
                  ? "Metric not found in document"
                  : "Low confidence extraction",
              attemptedMethod: "llm_structured",
            }
          );
        }
      }
    }

    // Store final metrics in original format for compatibility
    await ctx.runMutation(internal.processing.storeMetrics, {
      documentId: args.documentId,
      ...finalMetrics,
    });
  },
});
