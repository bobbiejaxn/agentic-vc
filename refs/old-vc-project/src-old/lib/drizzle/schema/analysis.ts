import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const analysis_results = pgTable("analysis_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  document_id: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  user_id: text("user_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  analysis_type: text("analysis_type").notNull().default("enhanced"), // enhanced, basic, custom

  // Financial Metrics
  irr: decimal("irr", { precision: 10, scale: 4 }),
  moic: decimal("moic", { precision: 10, scale: 4 }),
  tvpi: decimal("tvpi", { precision: 10, scale: 4 }),
  dpi: decimal("dpi", { precision: 10, scale: 4 }),
  rvpi: decimal("rvpi", { precision: 10, scale: 4 }),

  // Portfolio Analysis
  total_companies: integer("total_companies"),
  sectors: jsonb("sectors"), // Array of sector objects
  stages: jsonb("stages"), // Array of investment stages
  geographic_distribution: jsonb("geographic_distribution"),

  // External Data Enrichment
  external_data: jsonb("external_data"), // News, market data, funding rounds
  confidence_scores: jsonb("confidence_scores"), // Financial, portfolio, data quality, external

  // Validation Results
  validation_results: jsonb("validation_results"), // Array of validation issues
  data_quality_score: decimal("data_quality_score", { precision: 5, scale: 2 }),

  // Processing Metadata
  processing_time_ms: integer("processing_time_ms"),
  external_api_calls: integer("external_api_calls").default(0),
  enrichment_sources: jsonb("enrichment_sources"), // Array of sources used

  // Results Storage
  detailed_financial_metrics: jsonb("detailed_financial_metrics"),
  comprehensive_portfolio_analysis: jsonb("comprehensive_portfolio_analysis"),
  enriched_portfolio_analysis: jsonb("enriched_portfolio_analysis"),

  // Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  completed_at: timestamp("completed_at"),

  // Error Handling
  error_message: text("error_message"),
  retry_count: integer("retry_count").default(0),
});

export const analysis_resultsRelations = relations(
  analysis_results,
  ({ one }) => ({
    document: one(documents, {
      fields: [analysis_results.document_id],
      references: [documents.id],
    }),
  })
);

// Import documents table for the relation
import { documents } from "./documents";
