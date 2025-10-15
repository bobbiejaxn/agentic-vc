import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }),
  totalInvested: decimal("total_invested", { precision: 15, scale: 2 }),
  irr: decimal("irr", { precision: 8, scale: 4 }),
  moic: decimal("moic", { precision: 8, scale: 4 }),
  activeInvestments: integer("active_investments").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
