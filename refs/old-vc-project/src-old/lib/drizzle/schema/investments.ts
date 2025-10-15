import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  decimal,
  integer,
  pgEnum,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { portfolios } from "./portfolios";

export const investmentStatusEnum = pgEnum("investment_status", [
  "active",
  "exited",
  "written_off",
  "pending",
]);

export const investments = pgTable("investments", {
  // Core investment fields
  id: uuid("id").primaryKey().defaultRandom(),
  portfolioId: uuid("portfolio_id")
    .notNull()
    .references(() => portfolios.id, { onDelete: "cascade" }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  sector: varchar("sector", { length: 100 }),
  stage: varchar("stage", { length: 50 }),
  investmentDate: timestamp("investment_date"),
  amountInvested: decimal("amount_invested", {
    precision: 15,
    scale: 2,
  }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }),
  ownershipPercentage: decimal("ownership_percentage", {
    precision: 8,
    scale: 4,
  }),
  irr: decimal("irr", { precision: 8, scale: 4 }),
  moic: decimal("moic", { precision: 8, scale: 4 }),
  status: investmentStatusEnum("status").notNull().default("active"),
  notes: text("notes"),

  // Enhanced company information
  companyWebsite: varchar("company_website", { length: 500 }),
  companyLocation: varchar("company_location", { length: 255 }),
  companyFounded: integer("company_founded"),
  companyDescription: text("company_description"),
  companyEmployees: integer("company_employees"),
  companyRevenue: decimal("company_revenue", { precision: 15, scale: 2 }),
  companyGrowth: decimal("company_growth", { precision: 8, scale: 4 }),
  companyValuation: decimal("company_valuation", { precision: 15, scale: 2 }),

  // Funding information
  lastFundingDate: timestamp("last_funding_date"),
  lastFundingAmount: decimal("last_funding_amount", {
    precision: 15,
    scale: 2,
  }),
  lastFundingRound: varchar("last_funding_round", { length: 50 }),
  leadInvestor: varchar("lead_investor", { length: 255 }),
  coInvestors: jsonb("co_investors"), // Array of co-investor names

  // Board and governance
  boardSeats: integer("board_seats").default(0),
  votingRights: decimal("voting_rights", { precision: 8, scale: 4 }),
  liquidationPreferences: text("liquidation_preferences"),
  antiDilutionRights: boolean("anti_dilution_rights").default(false),

  // Market and competitive data
  marketSize: decimal("market_size", { precision: 15, scale: 2 }),
  marketShare: decimal("market_share", { precision: 8, scale: 4 }),
  competitivePosition: varchar("competitive_position", { length: 100 }),

  // Risk and performance metrics
  beta: decimal("beta", { precision: 8, scale: 4 }),
  volatility: decimal("volatility", { precision: 8, scale: 4 }),
  sharpeRatio: decimal("sharpe_ratio", { precision: 8, scale: 4 }),

  // Network and relationships
  dealSource: varchar("deal_source", { length: 255 }),
  referralSource: varchar("referral_source", { length: 255 }),
  networkStrength: decimal("network_strength", { precision: 8, scale: 4 }),

  // External data integration
  crunchbaseId: varchar("crunchbase_id", { length: 100 }),
  pitchbookId: varchar("pitchbook_id", { length: 100 }),
  externalData: jsonb("external_data"), // Store additional external data

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Additional tables for enhanced data

// Company updates and news
export const companyUpdates = pgTable("company_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  investmentId: uuid("investment_id")
    .notNull()
    .references(() => investments.id, { onDelete: "cascade" }),
  updateDate: timestamp("update_date").notNull(),
  updateType: varchar("update_type", { length: 50 }).notNull(), // funding, product, partnership, etc.
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  source: varchar("source", { length: 255 }),
  url: varchar("url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Market intelligence data
export const marketIntelligence = pgTable("market_intelligence", {
  id: uuid("id").primaryKey().defaultRandom(),
  sector: varchar("sector", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  marketSize: decimal("market_size", { precision: 15, scale: 2 }),
  growthRate: decimal("growth_rate", { precision: 8, scale: 4 }),
  keyTrends: jsonb("key_trends"),
  competitiveLandscape: jsonb("competitive_landscape"),
  regulatoryEnvironment: text("regulatory_environment"),
  economicIndicators: jsonb("economic_indicators"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Performance benchmarks
export const performanceBenchmarks = pgTable("performance_benchmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  investmentId: uuid("investment_id")
    .notNull()
    .references(() => investments.id, { onDelete: "cascade" }),
  benchmarkType: varchar("benchmark_type", { length: 50 }).notNull(), // sector, stage, market
  benchmarkName: varchar("benchmark_name", { length: 255 }).notNull(),
  benchmarkValue: decimal("benchmark_value", { precision: 8, scale: 4 }),
  investmentValue: decimal("investment_value", { precision: 8, scale: 4 }),
  outperformance: decimal("outperformance", { precision: 8, scale: 4 }),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
