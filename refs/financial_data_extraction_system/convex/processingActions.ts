"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

function chunkText(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split("\n\n");
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += paragraph + "\n\n";
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export const processDocument = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    try {
      const document = await ctx.runQuery(internal.processing.getDocumentContent, {
        documentId: args.documentId,
      });

      if (!document) {
        throw new Error("Document not found");
      }

      const chunks = chunkText(document.content);

      for (let i = 0; i < chunks.length; i++) {
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: chunks[i],
        });

        const embedding = embeddingResponse.data[0].embedding;

        await ctx.runMutation(internal.processing.storeChunk, {
          documentId: args.documentId,
          content: chunks[i],
          chunkIndex: i,
          embedding,
        });
      }

      await ctx.runAction(internal.processingActions.extractMetrics, {
        documentId: args.documentId,
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

export const extractMetrics = internalAction({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const relevantChunks = await ctx.runQuery(
      internal.processing.searchRelevantChunks,
      {
        documentId: args.documentId,
        query: "Gross IRR Net IRR TVPI DPI RVPI Fund NAV financial metrics performance",
      }
    );

    const context = relevantChunks.map((c) => c.content).join("\n\n");

    const prompt = `Extract the following financial metrics from the provided text. If a metric is not found, return "N/A".

Metrics to extract:
- Gross IRR (fund gross internal rate of return)
- Net IRR (net IRR after fees)
- TVPI (total value to paid-in capital multiple)
- DPI (distributions to paid-in capital)
- RVPI (residual value to paid-in capital)
- Fund NAV (net asset value)

Text:
${context}

Return ONLY a JSON object with these exact keys: grossIRR, netIRR, tvpi, dpi, rvpi, fundNAV. Each value should be a string.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const metrics = JSON.parse(content);

    await ctx.runMutation(internal.processing.storeMetrics, {
      documentId: args.documentId,
      ...metrics,
    });
  },
});
