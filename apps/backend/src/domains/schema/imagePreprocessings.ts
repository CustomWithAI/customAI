import { jsonb, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";

export const imagePreprocessings = pgTable("image_preprocessings", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  data: jsonb("data"),
  userId: text("userId").references(() => user.id),
});
