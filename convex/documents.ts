import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createDocument = mutation({
  args: {
    userId: v.id("users"),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    filePath: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("documents", {
      ...args,
      status: "uploading",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getDocumentsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db.get(documentId);
  },
});

export const updateDocumentStatus = mutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    extractedData: v.optional(v.any()),
  },
  handler: async (ctx, { documentId, ...updates }) => {
    await ctx.db.patch(documentId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const getDocumentsWithStatus = query({
  args: {
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
  },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
  },
});
