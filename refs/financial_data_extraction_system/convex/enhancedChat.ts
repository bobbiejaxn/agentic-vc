import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getEnhancedChunks = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }

    const chunks = await ctx.db
      .query("enhancedChunks")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    return chunks;
  },
});

export const getExtractionDetails = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }

    const results = await ctx.db
      .query("extractionResults")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    return results;
  },
});

export const getProcessingProgress = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }

    const progress = await ctx.db
      .query("processingProgress")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .first();

    return progress;
  },
});
