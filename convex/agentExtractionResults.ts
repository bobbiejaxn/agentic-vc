import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createExtractionResult = mutation({
  args: {
    userId: v.id("users"),
    documentId: v.id("documents"),
    extractionType: v.union(
      v.literal("fund_metrics"),
      v.literal("portfolio_companies"),
      v.literal("financial_data"),
      v.literal("strategic_intelligence")
    ),
    agentType: v.string(),
    extractedData: v.any(),
    confidence: v.optional(v.number()),
    processingTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("agentExtractionResults", {
      ...args,
      status: "completed",
      createdAt: now,
    });
  },
});

export const getExtractionResultsByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db
      .query("agentExtractionResults")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .collect();
  },
});

export const getExtractionResultsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("agentExtractionResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getExtractionResultsByType = query({
  args: {
    extractionType: v.union(
      v.literal("fund_metrics"),
      v.literal("portfolio_companies"),
      v.literal("financial_data"),
      v.literal("strategic_intelligence")
    ),
  },
  handler: async (ctx, { extractionType }) => {
    return await ctx.db
      .query("agentExtractionResults")
      .withIndex("by_type", (q) => q.eq("extractionType", extractionType))
      .collect();
  },
});

export const getExtractionResultsByStatus = query({
  args: {
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
  },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("agentExtractionResults")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
  },
});

export const updateExtractionResult = mutation({
  args: {
    resultId: v.id("agentExtractionResults"),
    status: v.optional(
      v.union(
        v.literal("processing"),
        v.literal("completed"),
        v.literal("error")
      )
    ),
    errorMessage: v.optional(v.string()),
    extractedData: v.optional(v.any()),
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, { resultId, ...updates }) => {
    await ctx.db.patch(resultId, updates);
  },
});
