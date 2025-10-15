import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

export const getDocumentContent = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

export const storeChunk = internalMutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    chunkIndex: v.number(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chunks", {
      documentId: args.documentId,
      content: args.content,
      chunkIndex: args.chunkIndex,
      embedding: args.embedding,
    });
  },
});

export const searchRelevantChunks = internalQuery({
  args: {
    documentId: v.id("documents"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("chunks")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    return chunks.slice(0, 10);
  },
});

export const storeMetrics = internalMutation({
  args: {
    documentId: v.id("documents"),
    // Original 6 metrics
    grossIRR: v.optional(v.string()),
    netIRR: v.optional(v.string()),
    tvpi: v.optional(v.string()),
    dpi: v.optional(v.string()),
    rvpi: v.optional(v.string()),
    fundNAV: v.optional(v.string()),
    // New Tier 1 metrics (14 additional)
    cumulativeDistributions: v.optional(v.string()),
    cumulativeCalledCapital: v.optional(v.string()),
    unfundedCommitment: v.optional(v.string()),
    fundSize: v.optional(v.string()),
    vintageYear: v.optional(v.string()),
    investmentPeriodEnd: v.optional(v.string()),
    managementFeeRate: v.optional(v.string()),
    carriedInterestRate: v.optional(v.string()),
    hurdleRate: v.optional(v.string()),
    fundCurrency: v.optional(v.string()),
    reportingPeriod: v.optional(v.string()),
    fundAge: v.optional(v.string()),
    deploymentRate: v.optional(v.string()),
    portfolioCompanyCount: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { documentId, ...metrics } = args;
    await ctx.db.insert("metrics", {
      documentId,
      ...metrics,
    });
  },
});
