import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";
import { v7 } from "uuid";

export const featureSelections = pgTable("feature_selections", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  name: varchar("name", { length: 255 }).notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
