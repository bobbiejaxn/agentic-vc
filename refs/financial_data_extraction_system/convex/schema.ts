import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  chunks: defineTable({
    documentId: v.id("documents"),
    content: v.string(),
    chunkIndex: v.number(),
    embedding: v.array(v.float64()),
  })
    .index("by_document", ["documentId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["documentId"],
    }),

  enhancedChunks: defineTable({
    documentId: v.id("documents"),
    content: v.string(),
    context: v.string(),
    summary: v.string(),
    chunkIndex: v.number(),
    embedding: v.array(v.float64()),
    headingPath: v.array(v.string()),
    hasTables: v.boolean(),
    hasCode: v.boolean(),
    hasLists: v.boolean(),
    estimatedTokens: v.number(),
  })
    .index("by_document", ["documentId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["documentId"],
    }),

  extractionResults: defineTable({
    documentId: v.id("documents"),
    metricName: v.string(),
    value: v.string(),
    confidence: v.string(),
    sourceChunkIndex: v.optional(v.number()),
    extractionMethod: v.string(),
  }).index("by_document", ["documentId"]),

  extractionFailures: defineTable({
    documentId: v.id("documents"),
    metricName: v.string(),
    reason: v.string(),
    attemptedMethod: v.string(),
  }).index("by_document", ["documentId"]),

  metrics: defineTable({
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
  }).index("by_document", ["documentId"]),

  processingProgress: defineTable({
    documentId: v.id("documents"),
    stage: v.string(),
    progress: v.number(),
    message: v.string(),
  }).index("by_document", ["documentId"]),

  chatMessages: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_document", ["documentId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
