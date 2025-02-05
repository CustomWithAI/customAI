import { jsonb, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";
import { v7 } from "uuid";

export const customModels = pgTable("custom_models", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => v7()),
  data: jsonb("data"),
  name: varchar("name", { length: 255 }),
  hyperparameter: jsonb("hyperparameter"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});
