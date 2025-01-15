import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const imagePreprocessings = pgTable("image_preprocessings", {
  id: text("id").primaryKey(),
  name: text("name"),
  data: jsonb("data"),
  userId: text("userId"),
});
