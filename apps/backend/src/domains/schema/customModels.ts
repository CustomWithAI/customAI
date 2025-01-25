import { jsonb, pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";

export const customModels = pgTable("custom_models", {
  id: uuid("id").defaultRandom().primaryKey(),
  data: jsonb("data"),
  name: varchar("name", { length: 255 }),
  hyperparameter: jsonb("hyperparameter"),
  userId: text("user_id").references(() => user.id),
});
