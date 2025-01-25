import { jsonb, pgTable, varchar, uuid, text } from "drizzle-orm/pg-core";
import { user } from "@/domains/schema/auth";

export const augmentations = pgTable("augmentations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  data: jsonb("data"),
  userId: text("user_id").references(() => user.id),
});
