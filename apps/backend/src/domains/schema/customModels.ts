import { jsonb, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";
import { v7 } from "uuid";

export const customModels = pgTable("custom_models", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  data: jsonb("data").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  hyperparameter: jsonb("hyperparameter").notNull(),
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
