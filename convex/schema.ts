import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table for authentication and profiles
  users: defineTable({
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    investorType: v.optional(
      v.union(
        v.literal("angel"),
        v.literal("family_office"),
        v.literal("institutional")
      )
    ),
    role: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_created_at", ["createdAt"]),

  // Documents table for fund reports and file uploads
  documents: defineTable({
    userId: v.id("users"),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    filePath: v.string(),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    extractedData: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // Document chunks for RAG and vector search
  enhancedHybridChunks: defineTable({
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
    similarity: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_user", ["userId"])
    .index("by_type", ["chunkType"])
    .vectorIndex("by_embedding", {
      vectorField: "textEmbedding",
      dimensions: 1536,
    }),

  // Funds table for fund information and performance data
  funds: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_document", ["documentId"])
    .index("by_fund_name", ["fundName"])
    .index("by_vintage", ["vintage"]),

  // Portfolio companies table
  portfolioCompanies: defineTable({
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
    similarity: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_fund", ["fundId"])
    .index("by_company_name", ["companyName"])
    .index("by_sector", ["sector"])
    .index("by_investment_date", ["investmentDate"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
    }),

  // Agent extraction results table
  agentExtractionResults: defineTable({
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
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_document", ["documentId"])
    .index("by_type", ["extractionType"])
    .index("by_status", ["status"]),

  // Market intelligence synthesis table for cross-document analysis
  marketIntelligenceSynthesis: defineTable({
    userId: v.id("users"),
    analysisType: v.union(
      v.literal("portfolio_performance"),
      v.literal("market_trends"),
      v.literal("co_investor_analysis"),
      v.literal("sector_analysis")
    ),
    documentIds: v.array(v.id("documents")),
    synthesisData: v.any(),
    insights: v.array(v.string()),
    confidence: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["analysisType"])
    .index("by_created_at", ["createdAt"]),

  // Conversations table for chat history
  conversations: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  // Messages table for individual chat messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    model: v.optional(v.string()),
    tokenCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),
});
