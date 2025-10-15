import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

export const updateProgress = internalMutation({
  args: {
    documentId: v.id("documents"),
    stage: v.string(),
    progress: v.number(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("processingProgress")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        stage: args.stage,
        progress: args.progress,
        message: args.message,
      });
    } else {
      await ctx.db.insert("processingProgress", {
        documentId: args.documentId,
        stage: args.stage,
        progress: args.progress,
        message: args.message,
      });
    }
  },
});

export const getDocumentForProcessing = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

export const storeEnhancedChunk = internalMutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    context: v.string(),
    summary: v.string(),
    chunkIndex: v.number(),
    embedding: v.array(v.float64()),
    headingPath: v.array(v.string()),
    metadata: v.object({
      hasTables: v.boolean(),
      hasCode: v.boolean(),
      hasLists: v.boolean(),
      estimatedTokens: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("enhancedChunks", {
      documentId: args.documentId,
      content: args.content,
      context: args.context,
      summary: args.summary,
      chunkIndex: args.chunkIndex,
      embedding: args.embedding,
      headingPath: args.headingPath,
      hasTables: args.metadata.hasTables,
      hasCode: args.metadata.hasCode,
      hasLists: args.metadata.hasLists,
      estimatedTokens: args.metadata.estimatedTokens,
    });
  },
});

export const searchEnhancedChunks = internalQuery({
  args: {
    documentId: v.id("documents"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("enhancedChunks")
      .withIndex("by_document", (q) => 
        q.eq("documentId", args.documentId)
      )
      .collect();
    
    return results.slice(0, args.limit || 10);
  },
});

export const storeExtractionResult = internalMutation({
  args: {
    documentId: v.id("documents"),
    metricName: v.string(),
    value: v.string(),
    confidence: v.string(),
    sourceChunkIndex: v.optional(v.number()),
    extractionMethod: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("extractionResults", {
      documentId: args.documentId,
      metricName: args.metricName,
      value: args.value,
      confidence: args.confidence,
      sourceChunkIndex: args.sourceChunkIndex,
      extractionMethod: args.extractionMethod,
    });
  },
});

export const getExtractionResults = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("extractionResults")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

export const logExtractionFailure = internalMutation({
  args: {
    documentId: v.id("documents"),
    metricName: v.string(),
    reason: v.string(),
    attemptedMethod: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("extractionFailures", {
      documentId: args.documentId,
      metricName: args.metricName,
      reason: args.reason,
      attemptedMethod: args.attemptedMethod,
    });
  },
});
