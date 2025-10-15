import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPortfolioCompany = mutation({
  args: {
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    fundId: v.optional(v.id("funds")),
    companyName: v.string(),
    sector: v.optional(v.string()),
    stage: v.optional(v.string()),
    investmentDate: v.optional(v.number()),
    investmentAmount: v.optional(v.number()),
    ownership: v.optional(v.number()),
    valuation: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    status: v.optional(v.string()),
    embedding: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("portfolioCompanies", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getPortfolioCompaniesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("portfolioCompanies")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getPortfolioCompaniesByFund = query({
  args: { fundId: v.id("funds") },
  handler: async (ctx, { fundId }) => {
    return await ctx.db
      .query("portfolioCompanies")
      .withIndex("by_fund", (q) => q.eq("fundId", fundId))
      .collect();
  },
});

export const getPortfolioCompaniesByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, { documentId }) => {
    return await ctx.db
      .query("portfolioCompanies")
      .filter((q) => q.eq(q.field("documentId"), documentId))
      .collect();
  },
});

export const searchPortfolioCompanies = query({
  args: {
    userId: v.id("users"),
    searchTerm: v.string(),
  },
  handler: async (ctx, { userId, searchTerm }) => {
    return await ctx.db
      .query("portfolioCompanies")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("companyName"), searchTerm))
      .collect();
  },
});

export const updatePortfolioCompany = mutation({
  args: {
    companyId: v.id("portfolioCompanies"),
    companyName: v.optional(v.string()),
    sector: v.optional(v.string()),
    stage: v.optional(v.string()),
    investmentDate: v.optional(v.number()),
    investmentAmount: v.optional(v.number()),
    ownership: v.optional(v.number()),
    valuation: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    status: v.optional(v.string()),
    embedding: v.optional(v.array(v.number())),
  },
  handler: async (ctx, { companyId, ...updates }) => {
    await ctx.db.patch(companyId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
