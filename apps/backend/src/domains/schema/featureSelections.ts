import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const featureSelections = pgTable("feature_selections", {
  id: text("id").primaryKey(),
  name: text("name"),
  data: jsonb("data"),
  userId: text("userId"),
});
