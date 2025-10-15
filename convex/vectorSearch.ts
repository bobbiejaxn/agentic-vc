import { query } from "./_generated/server";
import { v } from "convex/values";

// Search document chunks with vector similarity
export const searchDocumentChunks = query({
  args: {
    queryEmbedding: v.array(v.number()),
    matchThreshold: v.optional(v.number()),
    matchCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    const threshold = args.matchThreshold ?? 0.7;
    const limit = args.matchCount ?? 10;

    // Perform vector search
    const results = await ctx.db
      .query("enhancedHybridChunks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("textEmbedding"), undefined))
      .collect();

    // Calculate similarity scores (simplified cosine similarity)
    const scoredResults = results
      .map((chunk) => {
        if (!chunk.textEmbedding) return null;

        // Simple dot product similarity (in production, use proper cosine similarity)
        let similarity = 0;
        for (
          let i = 0;
          i < Math.min(args.queryEmbedding.length, chunk.textEmbedding.length);
          i++
        ) {
          similarity += args.queryEmbedding[i] * chunk.textEmbedding[i];
        }

        return {
          ...chunk,
          similarity,
        };
      })
      .filter((chunk) => chunk && chunk.similarity > threshold)
      .sort((a, b) => (b?.similarity ?? 0) - (a?.similarity ?? 0))
      .slice(0, limit);

    return scoredResults;
  },
});

// Search portfolio data with vector similarity
export const searchPortfolioData = query({
  args: {
    queryEmbedding: v.array(v.number()),
    matchThreshold: v.optional(v.number()),
    matchCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    const threshold = args.matchThreshold ?? 0.7;
    const limit = args.matchCount ?? 10;

    // Perform vector search on portfolio companies
    const results = await ctx.db
      .query("portfolioCompanies")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("embedding"), undefined))
      .collect();

    // Calculate similarity scores
    const scoredResults = results
      .map((company) => {
        if (!company.embedding) return null;

        // Simple dot product similarity
        let similarity = 0;
        for (
          let i = 0;
          i < Math.min(args.queryEmbedding.length, company.embedding.length);
          i++
        ) {
          similarity += args.queryEmbedding[i] * company.embedding[i];
        }

        return {
          ...company,
          similarity,
        };
      })
      .filter((company) => company && company.similarity > threshold)
      .sort((a, b) => (b?.similarity ?? 0) - (a?.similarity ?? 0))
      .slice(0, limit);

    return scoredResults;
  },
});
