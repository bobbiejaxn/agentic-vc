import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createFund = mutation({
  args: {
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    fundName: v.string(),
    fundType: v.optional(v.string()),
    vintage: v.optional(v.number()),
    fundSize: v.optional(v.number()),
    commitment: v.optional(v.number()),
    called: v.optional(v.number()),
    distributed: v.optional(v.number()),
    nav: v.optional(v.number()),
    irr: v.optional(v.number()),
    moic: v.optional(v.number()),
    tvpi: v.optional(v.number()),
    dpi: v.optional(v.number()),
    rvpi: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("funds", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getFundsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("funds")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getFundsByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db
      .query("funds")
      .withIndex("by_document", (q) => q.eq("documentId", documentId))
      .collect();
  },
});

export const getFund = query({
  args: { fundId: v.id("funds") },
  handler: async (ctx, { fundId }) => {
    return await ctx.db.get(fundId);
  },
});

export const updateFund = mutation({
  args: {
    fundId: v.id("funds"),
    fundName: v.optional(v.string()),
    fundType: v.optional(v.string()),
    vintage: v.optional(v.number()),
    fundSize: v.optional(v.number()),
    commitment: v.optional(v.number()),
    called: v.optional(v.number()),
    distributed: v.optional(v.number()),
    nav: v.optional(v.number()),
    irr: v.optional(v.number()),
    moic: v.optional(v.number()),
    tvpi: v.optional(v.number()),
    dpi: v.optional(v.number()),
    rvpi: v.optional(v.number()),
  },
  handler: async (ctx, { fundId, ...updates }) => {
    await ctx.db.patch(fundId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
