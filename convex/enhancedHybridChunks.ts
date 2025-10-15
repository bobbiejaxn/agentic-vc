import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChunk = mutation({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    chunkIndex: v.number(),
    textContent: v.string(),
    textEmbedding: v.optional(v.array(v.number())),
    chunkType: v.union(
      v.literal("text"),
      v.literal("table"),
      v.literal("image"),
      v.literal("metadata"),
      v.literal("financial_metrics"),
      v.literal("chart"),
      v.literal("summary"),
      v.literal("executive_summary")
    ),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("enhancedHybridChunks", {
      ...args,
      createdAt: now,
    });
  },
});

export const getChunksByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db
      .query("enhancedHybridChunks")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .collect();
  },
});

export const getChunksByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("enhancedHybridChunks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getChunksByType = query({
  args: {
    chunkType: v.union(
      v.literal("text"),
      v.literal("table"),
      v.literal("image"),
      v.literal("metadata"),
      v.literal("financial_metrics"),
      v.literal("chart"),
      v.literal("summary"),
      v.literal("executive_summary")
    ),
  },
  handler: async (ctx, { chunkType }) => {
    return await ctx.db
      .query("enhancedHybridChunks")
      .withIndex("by_type", (q) => q.eq("chunkType", chunkType))
      .collect();
  },
});

export const searchChunks = query({
  args: {
    userId: v.id("users"),
    searchText: v.string(),
  },
  handler: async (ctx, { userId, searchText }) => {
    return await ctx.db
      .query("enhancedHybridChunks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("textContent"), searchText))
      .collect();
  },
});
