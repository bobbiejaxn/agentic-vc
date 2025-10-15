import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "angel",
  "lp",
  "co_investor",
  "fund_manager",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  role: userRoleEnum("role").notNull().default("angel"),
  investmentCapacity: varchar("investment_capacity", { length: 50 }),
  portfolioSize: varchar("portfolio_size", { length: 50 }),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).default(
    "starter"
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
